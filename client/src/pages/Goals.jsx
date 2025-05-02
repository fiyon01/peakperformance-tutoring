import { useState, useEffect } from 'react';
import { 
  Trophy, Target, Flag, Calendar, BookOpen, Clock, AlertCircle, 
  CheckCircle, Plus, Edit, Trash, ChevronRight, BarChart2, 
  Lightbulb, ListChecks, Clock3, Bookmark, TrendingUp, 
  LayoutDashboard, ClipboardList, Book, Zap, Star, Award
} from 'lucide-react';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const GoalsVisionBoard = () => {
  // State management
  const [goals, setGoals] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [activeTab, setActiveTab] = useState('goals');
  const [newGoal, setNewGoal] = useState({
    name: '',
    subject: '',
    target: '',
    date: '',
    priority: 'medium',
    progress: 0
  });
  const [newWeakness, setNewWeakness] = useState({
    category: '',
    description: '',
    subject: ''
  });
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showWeaknessModal, setShowWeaknessModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [strategies, setStrategies] = useState([]);
  const [loadingStrategies, setLoadingStrategies] = useState(false);
  const [error, setError] = useState(null);

  // Fetch strategies when goals or weaknesses change
  useEffect(() => {
    const fetchStrategies = async () => {
      if (goals.length > 0 || weaknesses.length > 0) {
        setLoadingStrategies(true);
        setError(null);
        try {
          const generatedStrategies = await generateStrategies(goals, weaknesses);
          setStrategies(generatedStrategies || []);
        } catch (err) {
          console.error('Error generating strategies:', err);
          setError('Failed to generate strategies. Please try again.');
          setStrategies([]);
        } finally {
          setLoadingStrategies(false);
        }
      } else {
        setStrategies([]);
      }
    };
    
    fetchStrategies();
  }, [goals, weaknesses]);

  // Generate strategies from goals and weaknesses
  const generateStrategies = async (goals, weaknesses) => {
    const strategyList = [];
  
    // Generate strategies for each goal
    for (const goal of goals) {
      try {
        const response = await axios.post('http://localhost:3500/api/openai/generate-strategy', {
          prompt: `Create a detailed study strategy for a Kenyan student to achieve: "${goal.name}" in ${goal.subject}, targeting ${goal.target}. Only provide actionable steps with clear instructions, specific resources like KCSE past papers, and weekly milestones. Ensure that the strategy aligns with the Kenyan KCSE syllabus and is suitable for students in Form 1-12. Do not include introductory content or any background information. Focus solely on practical steps to achieve the goal.`,
          temperature: 0.7,
          max_tokens: 500
        });
  
        const generatedText = response?.data?.response || ''; // Accessing the correct property
        if (!generatedText) {
          console.warn('No strategy generated for goal:', goal.name);
          continue;
        }
  
        // Add the generated strategy for the goal, ensuring only actionable steps
        strategyList.push({
          id: `goal-${goal.id}`,
          type: 'goal',
          title: `Action Plan: ${goal.name}`,
          steps: generatedText.split('\n')
            .filter(line => line.trim() !== '') // Remove empty lines
            .map(step => step.replace(/^\d+\.\s*/, '')) // Remove numbering
            .slice(0, 10), // Limit to a reasonable number of steps, e.g., 10
          icon: <ListChecks className="text-blue-500" />,
          subject: goal.subject
        });
      } catch (err) {
        console.error(`Error generating strategy for goal ${goal.id}:`, err);
      }
    }
  
    // Generate strategies for each weakness
    for (const weakness of weaknesses) {
      try {
        const response = await axios.post('http://localhost:3500/api/openai/generate-strategy', {
          prompt: `Generate a detailed action plan for a Kenyan student (Form 1-12) to improve in the area of ${weakness.description} in ${weakness.subject}. Provide only actionable steps with specific actions, resources like KCSE past papers, and weekly milestones. Tailor the steps to align with the Kenyan KCSE syllabus, and ensure that the student can follow them effectively. Do not include introductory content, challenges, or any action plan text. Only return the list of actionable steps, and focus on practical solutions to improve the weakness.`,
          temperature: 0.7,
          max_tokens: 500
        });
  
        const generatedText = response?.data?.response || ''; // Accessing the correct property
        if (!generatedText) {
          console.warn('No improvement plan generated for weakness:', weakness.description);
          continue;
        }
  
        // Add the generated strategy for the weakness, ensuring only actionable steps
        strategyList.push({
          id: `weakness-${weakness.id}`,
          type: 'suggestion',
          title: `Improve ${weakness.description}`,
          description: `Focus on improving ${weakness.description} in ${weakness.subject || 'this area'}`,
          steps: generatedText.split('\n')
            .filter(line => line.trim() !== '') // Remove empty lines
            .map(step => step.replace(/^\d+\.\s*/, '')) // Remove numbering
            .slice(0, 10), // Limit to a reasonable number of steps, e.g., 10
          icon: <Flag className="text-red-500" />,
          subject: weakness.subject
        });
      } catch (err) {
        console.error(`Error generating strategy for weakness ${weakness.id}:`, err);
      }
    }
  
    return strategyList; // Return combined strategies for goals and weaknesses
  };
  
  
  
  

  // Goal management functions
  const addGoal = () => {
    if (!newGoal.name.trim()) return;
    
    const goal = {
      id: Date.now(),
      ...newGoal,
      createdAt: new Date().toISOString()
    };
    
    if (editingId) {
      setGoals(goals.map(g => g.id === editingId ? goal : g));
    } else {
      setGoals([...goals, goal]);
    }
    
    resetForms();
  };

  const updateGoalProgress = (id, progress) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, progress } : goal
    ));
  };

  const completeGoal = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, progress: 100, completed: true } : goal
    ));
  };

  // Weakness management functions
  const addWeakness = () => {
    if (!newWeakness.description.trim()) return;
    
    const weakness = {
      id: Date.now(),
      ...newWeakness,
      createdAt: new Date().toISOString()
    };
    
    if (editingId) {
      setWeaknesses(weaknesses.map(w => w.id === editingId ? weakness : w));
    } else {
      setWeaknesses([...weaknesses, weakness]);
    }
    
    resetForms();
  };

  // Helper functions
  const deleteItem = (type, id) => {
    if (type === 'goal') {
      setGoals(goals.filter(goal => goal.id !== id));
    } else {
      setWeaknesses(weaknesses.filter(weakness => weakness.id !== id));
    }
  };

  const resetForms = () => {
    setNewGoal({
      name: '',
      subject: '',
      target: '',
      date: '',
      priority: 'medium',
      progress: 0
    });
    setNewWeakness({
      category: '',
      description: '',
      subject: ''
    });
    setEditingId(null);
    setShowGoalModal(false);
    setShowWeaknessModal(false);
  };

  const startEditing = (type, item) => {
    setEditingId(item.id);
    if (type === 'goal') {
      setNewGoal(item);
      setShowGoalModal(true);
    } else {
      setNewWeakness(item);
      setShowWeaknessModal(true);
    }
  };

  // Calculate completion statistics
  const completedGoals = goals.filter(g => g.progress === 100).length;
  const totalGoals = goals.length;
  const avgProgress = totalGoals > 0 
  ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals) 
  : 0;


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="w-10 h-10 text-yellow-500" strokeWidth={1.5} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Academic Triumphs</h1>
            <p className="text-gray-600">Visualize your goals, conquer weaknesses, and track progress</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'goals' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Target className="w-5 h-5" />
          Goals
        </button>
        <button
          onClick={() => setActiveTab('weaknesses')}
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'weaknesses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <AlertCircle className="w-5 h-5" />
          Weaknesses
        </button>
        <button
          onClick={() => setActiveTab('strategies')}
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'strategies' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Lightbulb className="w-5 h-5" />
          Strategies
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-500" />
                  My Academic Goals
                </h2>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add Goal
                </button>
              </div>

              {goals.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <Flag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No goals set yet</h3>
                  <p className="text-gray-500 mb-4">Start by adding your first academic goal</p>
                  <button
                    onClick={() => setShowGoalModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    Set a Goal
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goals.map(goal => (
                    <div key={goal.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-500" />
                          <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => startEditing('goal', goal)}
                            className="text-gray-400 hover:text-blue-500"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteItem('goal', goal.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Target by: {goal.date || 'No deadline'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BarChart2 className="w-4 h-4" />
                          <span>Target: {goal.target}</span>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between pt-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={goal.progress}
                            onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                            className="w-full mr-4"
                          />
                          <button
                            onClick={() => completeGoal(goal.id)}
                            disabled={goal.progress === 100}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${goal.progress === 100 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                          >
                            {goal.progress === 100 ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Completed
                              </>
                            ) : (
                              <>
                                <Flag className="w-4 h-4" />
                                Complete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Weaknesses Tab */}
          {activeTab === 'weaknesses' && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-purple-500" />
                  My Weaknesses
                </h2>
                <button
                  onClick={() => setShowWeaknessModal(true)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add Weakness
                </button>
              </div>

              {weaknesses.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No weaknesses identified</h3>
                  <p className="text-gray-500 mb-4">Acknowledging weaknesses is the first step to improvement</p>
                  <button
                    onClick={() => setShowWeaknessModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                  >
                    Identify Weakness
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {weaknesses.map(weakness => (
                    <div key={weakness.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="w-5 h-5 text-purple-500" />
                          <h3 className="font-semibold text-gray-800">{weakness.category}: {weakness.description}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => startEditing('weakness', weakness)}
                            className="text-gray-400 hover:text-purple-500"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteItem('weakness', weakness.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {weakness.subject && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                          <BookOpen className="w-4 h-4" />
                          <span>Subject: {weakness.subject}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Strategies Tab */}
          {activeTab === 'strategies' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                My Study Strategies
              </h2>

              {loadingStrategies ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <div className="animate-pulse flex flex-col items-center">
                    <Lightbulb className="w-12 h-12 text-gray-300 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <AlertCircle className="w-12 h-12 mx-auto text-red-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">Error loading strategies</h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    Try Again
                  </button>
                </div>
              ) : strategies.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <Lightbulb className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">
                    {goals.length === 0 && weaknesses.length === 0 
                      ? "Set goals or identify weaknesses" 
                      : "Generating personalized strategies..."}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {goals.length === 0 && weaknesses.length === 0 
                      ? "Start by adding goals or weaknesses to get strategies" 
                      : "This may take a moment..."}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setActiveTab('goals')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                      Set Goals
                    </button>
                    <button
                      onClick={() => setActiveTab('weaknesses')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                    >
                      Identify Weaknesses
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {strategies.map((strategy, index) => (
                    <div key={strategy.id || index} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-blue-50">
                          {strategy.icon || <Lightbulb className="text-blue-500" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{strategy.title}</h3>
                          {strategy.subject && (
                            <p className="text-sm text-gray-500 mt-1">
                              Subject: {strategy.subject}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Action Steps:</h4>
                        <ul className="space-y-2">
                          {strategy.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-2">
                              <FaCheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Progress Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Progress Summary
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Goals Completed</span>
                  <span className="font-medium">
                    {completedGoals} / {totalGoals}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: `${totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Average Progress</span>
                  <span className="font-medium">
                    {avgProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${avgProgress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Weaknesses Identified</span>
                  <span className="font-medium">{weaknesses.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500" />
              Study Tips
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <p className="text-gray-700 text-sm">
                  Study in 25-30 minute blocks with 5 minute breaks for better focus
                </p>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                <p className="text-gray-700 text-sm">
                  Review material within 24 hours to improve retention by up to 70%
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ClipboardList className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                <p className="text-gray-700 text-sm">
                  Practice with past papers to familiarize with exam format
                </p>
              </div>
            </div>
          </div>

          {/* Suggested Goals */}
          {weaknesses.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Flag className="w-5 h-5 text-red-500" />
                Suggested Goals
              </h2>
              
              <div className="space-y-3">
                {weaknesses.slice(0, 3).map(weakness => (
                  <div key={`suggestion-${weakness.id}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 text-sm font-medium">
                        Improve {weakness.description} in {weakness.subject || 'this area'}
                      </p>
                      <button 
                        onClick={() => {
                          setNewGoal({
                            name: `Improve ${weakness.description}`,
                            subject: weakness.subject || '',
                            target: 'Demonstrate consistent improvement',
                            date: '',
                            priority: 'medium',
                            progress: 0
                          });
                          setShowGoalModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
                      >
                        Set as Goal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-white rounded-xl p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-500" />
              {editingId ? 'Edit Goal' : 'Add New Goal'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Master Quadratic Equations"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newGoal.subject}
                  onChange={(e) => setNewGoal({...newGoal, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Mathematics"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                <input
                  type="text"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Score 85% in next test"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={newGoal.date}
                  onChange={(e) => setNewGoal({...newGoal, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <div className="flex gap-4">
                  {['high', 'medium', 'low'].map(level => (
                    <label key={level} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value={level}
                        checked={newGoal.priority === level}
                        onChange={() => setNewGoal({...newGoal, priority: level})}
                        className={`text-${level === 'high' ? 'red' : level === 'medium' ? 'yellow' : 'green'}-500`}
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={resetForms}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addGoal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  {editingId ? 'Update Goal' : 'Add Goal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weakness Modal */}
      {showWeaknessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-white rounded-xl p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-purple-500" />
              {editingId ? 'Edit Weakness' : 'Identify Weakness'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newWeakness.category}
                  onChange={(e) => setNewWeakness({...newWeakness, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select category</option>
                  <option value="Topic">Specific Topic</option>
                  <option value="Skill">Academic Skill</option>
                  <option value="Habit">Study Habit</option>
                  <option value="Attitude">Attitude/Mindset</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newWeakness.description}
                  onChange={(e) => setNewWeakness({...newWeakness, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Algebra, Time Management"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject (Optional)</label>
                <input
                  type="text"
                  value={newWeakness.subject}
                  onChange={(e) => setNewWeakness({...newWeakness, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Mathematics"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={resetForms}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addWeakness}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                  {editingId ? 'Update Weakness' : 'Add Weakness'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsVisionBoard;