import { useState, useEffect, useRef } from 'react';
import { Trophy, Target, Plus, Edit, Trash2, Calendar, Clock, Check, Pause, ChevronRight, Flag, Star, Award, ChevronDown, X, Zap, ChevronUp, Gauge, BarChart2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';
import useSound from 'use-sound';
import { motion, AnimatePresence } from 'framer-motion';

// Sound effects (placeholder paths - replace with actual sound files)
import completionSound from '/sounds/mixkit-forest-walk-607.mp3';
import progressSound from '/sounds/school-bell-310293.mp3';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: '',
    dueDate: '',
    progress: 0,
    status: 'active',
    priority: 'medium'
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [filter, setFilter] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [playCompletion, { stop: stopCompletion }] = useSound(completionSound, { volume: 0.5 });
  const [playProgress, { stop: stopProgress }] = useSound(progressSound, { volume: 0.3 });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [expandedGoalId, setExpandedGoalId] = useState(null);
  const [showCompletedGoals, setShowCompletedGoals] = useState(false);
  const formRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowGoalForm(false);
        setEditingGoal(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem('goals')) || [];
    const savedCompleted = JSON.parse(localStorage.getItem('completedGoals')) || [];
    setGoals(savedGoals.filter(goal => goal.status !== 'completed'));
    setCompletedGoals(savedCompleted);
    
    // Load sound preference
    const soundPref = localStorage.getItem('soundEnabled');
    if (soundPref !== null) setSoundEnabled(soundPref === 'true');
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify([...goals, ...completedGoals]));
    localStorage.setItem('completedGoals', JSON.stringify(completedGoals));
    localStorage.setItem('soundEnabled', soundEnabled);
  }, [goals, completedGoals, soundEnabled]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  const resetForm = () => {
    setNewGoal({
      title: '',
      description: '',
      target: '',
      dueDate: '',
      progress: 0,
      status: 'active',
      priority: 'medium'
    });
    setEditingGoal(null);
  };

  const addGoal = () => {
    if (!newGoal.title) {
      toast.error('Please enter a goal title');
      return;
    }

    const goal = {
      ...newGoal,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      progress: simpleMode ? 0 : parseInt(newGoal.progress) || 0,
      status: 'active'
    };

    setGoals([...goals, goal]);
    resetForm();
    setShowGoalForm(false);
    toast.success('Goal added successfully!');
  };

  const editGoal = () => {
    if (!newGoal.title) {
      toast.error('Please enter a goal title');
      return;
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === editingGoal.id) {
        return {
          ...goal,
          ...newGoal,
          progress: parseInt(newGoal.progress) || 0
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
    resetForm();
    setShowGoalForm(false);
    toast.success('Goal updated successfully!');
  };

  const startEditing = (goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description || '',
      target: goal.target || '',
      dueDate: goal.dueDate || '',
      progress: goal.progress,
      status: goal.status,
      priority: goal.priority || 'medium'
    });
    setShowGoalForm(true);
  };

  const updateProgress = (id, amount) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        const newProgress = Math.min(goal.progress + amount, 100);
        if (newProgress === 100) {
          handleCompleteGoal(goal);
          return goal;
        }
        if (soundEnabled) {
          stopProgress();
          playProgress();
        }
        return { ...goal, progress: newProgress };
      }
      return goal;
    });
    setGoals(updatedGoals);
  };

  const handleCompleteGoal = (goal) => {
    const completedGoal = { 
      ...goal, 
      progress: 100, 
      status: 'completed', 
      completedAt: new Date().toISOString() 
    };
    
    setGoals(goals.filter(g => g.id !== goal.id));
    setCompletedGoals([...completedGoals, completedGoal]);
    
    setShowConfetti(true);
    if (soundEnabled) {
      stopCompletion();
      playCompletion();
    }
    
    toast.success('Goal completed! Amazing work!', {
      icon: '🎉',
      duration: 4000,
    });
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const suspendGoal = (id, days) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        return { 
          ...goal, 
          status: 'suspended',
          suspendedUntil: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
        };
      }
      return goal;
    });
    setGoals(updatedGoals);
    toast('Goal suspended. You can resume it anytime.', { icon: '⏸️' });
  };

  const resumeGoal = (id) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        return { ...goal, status: 'active', suspendedUntil: null };
      }
      return goal;
    });
    setGoals(updatedGoals);
    toast('Goal resumed! Keep going!', { icon: '▶️' });
  };

  const extendDeadline = (id, newDate) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        return { ...goal, dueDate: newDate };
      }
      return goal;
    });
    setGoals(updatedGoals);
    toast('Deadline extended. You got this!', { icon: '📅' });
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast('Goal removed.', { icon: '🗑️' });
  };

  const toggleGoalExpand = (id) => {
    setExpandedGoalId(expandedGoalId === id ? null : id);
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    if (filter === 'active') return goal.status === 'active';
    if (filter === 'suspended') return goal.status === 'suspended';
    if (filter === 'overdue') {
      return goal.dueDate && new Date(goal.dueDate) < new Date() && goal.status !== 'completed';
    }
    if (filter === 'high') return goal.priority === 'high';
    if (filter === 'medium') return goal.priority === 'medium';
    if (filter === 'low') return goal.priority === 'low';
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <Zap className="w-3 h-3" />;
      case 'medium': return <Gauge className="w-3 h-3" />;
      case 'low': return <ChevronDown className="w-3 h-3" />;
      default: return <BarChart2 className="w-3 h-3" />;
    }
  };

  const GoalCard = ({ goal, onComplete, onSuspend, onResume, onExtend, onDelete, onProgressUpdate, simpleMode, onEdit }) => {
    const [showSuspendMenu, setShowSuspendMenu] = useState(false);
    const [showExtendMenu, setShowExtendMenu] = useState(false);
    const [newDate, setNewDate] = useState(goal.dueDate || '');
    const [showProgressInput, setShowProgressInput] = useState(false);
    const [manualProgress, setManualProgress] = useState(goal.progress);
    
    const isOverdue = goal.dueDate && new Date(goal.dueDate) < new Date() && goal.status !== 'completed';
    
    const handleProgressChange = (e) => {
      const value = parseInt(e.target.value) || 0;
      setManualProgress(Math.min(Math.max(value, 0), 100));
    };
    
    const saveManualProgress = () => {
      onProgressUpdate(goal.id, manualProgress - goal.progress);
      setShowProgressInput(false);
    };
    
    const quickProgress = (amount) => {
      onProgressUpdate(goal.id, amount);
    };
    
    const handleExtend = () => {
      if (newDate) {
        onExtend(goal.id, newDate);
        setShowExtendMenu(false);
      }
    };
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${
          goal.status === 'suspended' ? 'opacity-80' : ''
        } ${isOverdue ? 'border-l-4 border-red-500' : ''}`}
      >
        {/* Status indicator */}
        <div className={`absolute top-0 left-0 h-1 w-full ${
          goal.status === 'completed' ? 'bg-green-500' :
          goal.status === 'suspended' ? 'bg-yellow-500' :
          isOverdue ? 'bg-red-500' : 'bg-indigo-500'
        }`}></div>
        
        <div className="p-5">
          {/* Goal header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                {goal.title}
                {goal.priority && (
                  <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                    {getPriorityIcon(goal.priority)} <span className="ml-1">{goal.priority}</span>
                  </span>
                )}
              </h3>
              {goal.target && <p className="text-sm text-gray-500 mt-1">{goal.target}</p>}
            </div>
            <div className="flex flex-col items-end space-y-1">
              {isOverdue && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Overdue
                </span>
              )}
              {goal.status === 'suspended' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Suspended
                </span>
              )}
            </div>
          </div>
          
          {/* Due date */}
          {goal.dueDate && (
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
              {isOverdue && (
  <span className="ml-2 text-xs text-red-500">
    ({Math.ceil((new Date(goal.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days overdue)
  </span>
)}

            </div>
          )}
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-indigo-600">{goal.progress}%</span>
            </div>
            <div 
              className="w-full bg-gray-200 rounded-full h-2.5 cursor-pointer group"
              onClick={() => setShowProgressInput(!showProgressInput)}
            >
              <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  goal.progress === 100 ? 'bg-green-500' : 'bg-indigo-600'
                } group-hover:bg-indigo-700`} 
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
            
            {/* Milestone markers */}
            <div className="flex justify-between mt-1">
              {[25, 50, 75, 100].map(milestone => (
                <div 
                  key={milestone}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    goal.progress >= milestone ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                  title={`${milestone}% milestone`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Progress input */}
          {showProgressInput && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {simpleMode ? (
                  <div className="flex flex-wrap justify-between gap-2">
                    <button 
                      onClick={() => quickProgress(-25)}
                      className="px-3 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors text-sm"
                    >
                      -25%
                    </button>
                    <button 
                      onClick={() => quickProgress(-10)}
                      className="px-3 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors text-sm"
                    >
                      -10%
                    </button>
                    <button 
                      onClick={() => quickProgress(10)}
                      className="px-3 py-1 bg-indigo-100 rounded-md text-indigo-700 hover:bg-indigo-200 transition-colors text-sm"
                    >
                      +10%
                    </button>
                    <button 
                      onClick={() => quickProgress(25)}
                      className="px-3 py-1 bg-indigo-100 rounded-md text-indigo-700 hover:bg-indigo-200 transition-colors text-sm"
                    >
                      +25%
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center mb-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={manualProgress}
                        onChange={handleProgressChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={manualProgress}
                        onChange={handleProgressChange}
                        className="ml-3 w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={saveManualProgress}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Update
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Quick progress buttons for simple mode */}
          {simpleMode && !showProgressInput && (
            <div className="flex justify-center space-x-2 mb-4">
              <button 
                onClick={() => quickProgress(25)}
                className="px-3 py-1 bg-indigo-100 rounded-md text-indigo-700 hover:bg-indigo-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                +25%
              </button>
              <button 
                onClick={() => quickProgress(50)}
                className="px-3 py-1 bg-indigo-200 rounded-md text-indigo-800 hover:bg-indigo-300 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                +50%
              </button>
            </div>
          )}
          
          {/* Description (collapsible) */}
          {goal.description && (
            <div className="mb-4">
              <button 
                onClick={() => toggleGoalExpand(goal.id)}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none"
              >
                <span>{expandedGoalId === goal.id ? 'Hide details' : 'Show details'}</span>
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${
                  expandedGoalId === goal.id ? 'rotate-180' : ''
                }`}/>
              </button>
              
              <AnimatePresence>
                {expandedGoalId === goal.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {goal.description}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onEdit(goal)}
              className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            
            {goal.status === 'suspended' ? (
              <button
                onClick={() => onResume(goal.id)}
                className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Resume
              </button>
            ) : (
              <>
                <button
                  onClick={() => onComplete(goal)}
                  className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Complete
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowSuspendMenu(!showSuspendMenu)}
                    className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm hover:bg-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Suspend
                  </button>
                  
                  {showSuspendMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200"
                    >
                      <button
                        onClick={() => {
                          onSuspend(goal.id, 1);
                          setShowSuspendMenu(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors focus:outline-none"
                      >
                        For 1 day
                      </button>
                      <button
                        onClick={() => {
                          onSuspend(goal.id, 3);
                          setShowSuspendMenu(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors focus:outline-none"
                      >
                        For 3 days
                      </button>
                      <button
                        onClick={() => {
                          onSuspend(goal.id, 7);
                          setShowSuspendMenu(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors focus:outline-none"
                      >
                        For 1 week
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            )}
            
            <div className="relative">
              <button
                onClick={() => setShowExtendMenu(!showExtendMenu)}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Extend
              </button>
              
              {showExtendMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 mt-1 w-56 bg-white rounded-md shadow-lg py-2 px-3 border border-gray-200"
                >
                  <div className="mb-2">
                    <label className="block text-xs text-gray-500 mb-1">New due date:</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="block w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={handleExtend}
                    className="w-full bg-blue-500 text-white text-sm py-1.5 rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update Deadline
                  </button>
                </motion.div>
              )}
            </div>
            
            <button
              onClick={() => onDelete(goal.id)}
              className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
        
        {/* Character reaction */}
        <CharacterReaction progress={goal.progress} status={goal.status} />
      </motion.div>
    );
  };

  const CompletedGoalCard = ({ goal, onDelete }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100 hover:shadow-md transition-shadow group"
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-md font-medium text-gray-800 line-clamp-2">{goal.title}</h3>
              {goal.target && (
                <p className="text-sm text-gray-500 line-clamp-1">{goal.target}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <span className="inline-flex items-center p-1 rounded-full bg-green-100 text-green-600">
                <Check className="h-4 w-4" />
              </span>
              <button 
                onClick={() => onDelete(goal.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center text-xs text-gray-400 mt-3">
            <Clock className="w-3 h-3 mr-1" />
            <span>Completed on {new Date(goal.completedAt).toLocaleDateString()}</span>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: '100%' }}
              ></div>
            </div>
            <span className="ml-2 text-xs font-medium text-green-600">100%</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const CharacterReaction = ({ progress, status }) => {
    let character = null;
    
    if (status === 'completed') {
      character = (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-8 -right-4"
        >
          <div className="relative">
            <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-800">🎉</span>
            </div>
          </div>
        </motion.div>
      );
    } else if (status === 'suspended') {
      character = (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-8 -right-4"
        >
          <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
          </svg>
        </motion.div>
      );
    } else if (progress >= 75) {
      character = (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-8 -right-4"
        >
          <svg className="w-12 h-12 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      );
    } else if (progress >= 50) {
      character = (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-8 -right-4"
        >
          <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      );
    } else if (progress > 0) {
      character = (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-8 -right-4"
        >
          <svg className="w-12 h-12 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
          </svg>
        </motion.div>
      );
    } else {
      character = (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-8 -right-4"
        >
          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
          </svg>
        </motion.div>
      );
    }
    
    return character;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center">
          <Trophy className="text-yellow-500 w-8 h-8 mr-3" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Goals Journey</h1>
            <p className="text-sm text-gray-500">
              {goals.length} active {goals.length === 1 ? 'goal' : 'goals'} • {completedGoals.length} completed
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              setShowGoalForm(true);
              resetForm();
            }}
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg shadow-md transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="mr-2" />
            <span>Add New Goal</span>
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center justify-center px-4 py-3 rounded-lg shadow-md transition-colors ${
              soundEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              soundEnabled ? 'focus:ring-green-500' : 'focus:ring-gray-500'
            }`}
          >
            {soundEnabled ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
                <span>Sound On</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Sound Off</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toggle for simple mode */}
      <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-lg shadow-sm">
        <div>
          <h3 className="font-medium text-gray-800">Goal Tracking Mode</h3>
          <p className="text-sm text-gray-500">
            {simpleMode ? 'Simple progress updates' : 'Detailed progress tracking'}
          </p>
        </div>
        <label className="inline-flex items-center cursor-pointer">
          <span className="mr-3 text-sm font-medium text-gray-700">Simple</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={simpleMode}
              onChange={() => setSimpleMode(!simpleMode)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </div>
        </label>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            filter === 'all' ? 'focus:ring-indigo-500' : 'focus:ring-gray-200'
          }`}
        >
          All Goals
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'active' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            filter === 'active' ? 'focus:ring-green-500' : 'focus:ring-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('suspended')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'suspended' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            filter === 'suspended' ? 'focus:ring-yellow-500' : 'focus:ring-gray-200'
          }`}
        >
          Suspended
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'overdue' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            filter === 'overdue' ? 'focus:ring-red-500' : 'focus:ring-gray-200'
          }`}
        >
          Overdue
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'high' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            filter === 'high' ? 'focus:ring-red-500' : 'focus:ring-gray-200'
          }`}
        >
          High Priority
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'medium' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            filter === 'medium' ? 'focus:ring-yellow-500' : 'focus:ring-gray-200'
          }`}
        >
          Medium
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'low' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            filter === 'low' ? 'focus:ring-green-500' : 'focus:ring-gray-200'
          }`}
        >
          Low
        </button>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 && goals.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl p-8 text-center shadow-sm"
        >
          <Target className="mx-auto w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No goals match your filter</h3>
          <p className="text-gray-500 mt-2">Try changing your filter settings</p>
        </motion.div>
      ) : filteredGoals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl p-8 text-center shadow-sm"
        >
          <Flag className="mx-auto w-12 h-12 text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No goals yet</h3>
          <p className="text-gray-500 mt-2">Start by adding your first goal</p>
          <button
            onClick={() => {
              setShowGoalForm(true);
              resetForm();
            }}
            className="mt-4 flex items-center justify-center mx-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="mr-2" />
            <span>Add Your First Goal</span>
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onComplete={handleCompleteGoal}
              onSuspend={suspendGoal}
              onResume={resumeGoal}
              onExtend={extendDeadline}
              onDelete={deleteGoal}
              onEdit={startEditing}
              onProgressUpdate={updateProgress}
              simpleMode={simpleMode}
            />
          ))}
        </div>
      )}

      {/* Completed Goals Section */}
      {completedGoals.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center mb-6 cursor-pointer" onClick={() => setShowCompletedGoals(!showCompletedGoals)}>
            <Check className="text-green-500 w-6 h-6 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Completed Goals</h2>
            <span className="ml-2 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {completedGoals.length}
            </span>
            <ChevronDown className={`ml-2 w-5 h-5 text-gray-500 transition-transform ${
              showCompletedGoals ? 'rotate-180' : ''
            }`} />
          </div>
          
          <AnimatePresence>
            {showCompletedGoals && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedGoals.map(goal => (
                    <CompletedGoalCard key={goal.id} goal={goal} onDelete={deleteGoal} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Goal Form Modal */}
      {showGoalForm && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            ref={formRef}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingGoal ? 'Edit Goal' : simpleMode ? 'Add Simple Goal' : 'Add New Goal'}
                </h3>
                <button 
                  onClick={() => {
                    setShowGoalForm(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Edit className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="title"
                      value={newGoal.title}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border py-2 px-3"
                      placeholder="What do you want to achieve?"
                      required
                    />
                  </div>
                </div>
                
                {!simpleMode && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                      <textarea
                        name="description"
                        value={newGoal.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border py-2 px-3"
                        placeholder="More details about your goal..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target/Metric</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Target className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="target"
                          value={newGoal.target}
                          onChange={handleInputChange}
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border py-2 px-3"
                          placeholder="How will you measure success?"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dueDate"
                      value={newGoal.dueDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border py-2 px-3"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewGoal({...newGoal, priority: 'high'})}
                      className={`py-2 px-3 rounded-md border transition-colors ${
                        newGoal.priority === 'high' ? 'bg-red-100 border-red-300 text-red-800' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        newGoal.priority === 'high' ? 'focus:ring-red-500' : 'focus:ring-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <Zap className="w-4 h-4 mr-1" />
                        <span>High</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewGoal({...newGoal, priority: 'medium'})}
                      className={`py-2 px-3 rounded-md border transition-colors ${
                        newGoal.priority === 'medium' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        newGoal.priority === 'medium' ? 'focus:ring-yellow-500' : 'focus:ring-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <Gauge className="w-4 h-4 mr-1" />
                        <span>Medium</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewGoal({...newGoal, priority: 'low'})}
                      className={`py-2 px-3 rounded-md border transition-colors ${
                        newGoal.priority === 'low' ? 'bg-green-100 border-green-300 text-green-800' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        newGoal.priority === 'low' ? 'focus:ring-green-500' : 'focus:ring-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <ChevronDown className="w-4 h-4 mr-1" />
                        <span>Low</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                {!simpleMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Starting Progress (%)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">%</span>
                      </div>
                      <input
                        type="number"
                        name="progress"
                        value={newGoal.progress}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border py-2 px-3"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowGoalForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={editingGoal ? editGoal : addGoal}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editingGoal ? 'Update Goal' : 'Save Goal'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GoalsPage;