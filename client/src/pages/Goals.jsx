// WeeklyReflection.jsx
import { useState, useEffect } from 'react';
import { 
  Star, BookOpen, ChevronRight, X, Check, Lightbulb, ArrowUp, Target, 
  Calendar, BarChart2, ChevronLeft, ChevronDown, Sparkles, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WeeklyReflection = () => {
  const [showPrompt, setShowPrompt] = useState(true);
  const [showReflection, setShowReflection] = useState(false);
  const [rating, setRating] = useState(0);
  const [highlights, setHighlights] = useState('');
  const [improvement, setImprovement] = useState('');
  const [goal, setGoal] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [pastReflections, setPastReflections] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = () => {
    const newReflection = {
      date: new Date(),
      rating,
      highlights,
      improvement,
      goal
    };
    setPastReflections([...pastReflections, newReflection]);
    setSubmitted(true);
    setTimeout(() => {
      setShowReflection(false);
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Dashboard Card Prompt */}
      {!showReflection && showPrompt && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 shadow-lg mb-6 border border-indigo-100"
        >
          <div className="flex items-start">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <BookOpen className="text-indigo-600 w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Time for your Weekly Reflection</h3>
              <p className="text-gray-600 mb-4">Take a moment to reflect on your week and set intentions for the next.</p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowReflection(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  Start Reflection <ChevronRight className="ml-2 w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowPrompt(false)}
                  className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  Maybe Later <X className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reflection Modal */}
      <AnimatePresence>
        {showReflection && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <BookOpen className="text-indigo-600 mr-3 w-6 h-6" />
                    Weekly Reflection
                  </h2>
                  <button 
                    onClick={() => setShowReflection(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {!submitted ? (
                  <div className="space-y-8">
                    {/* Rating Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Star className="text-yellow-500 mr-2 w-5 h-5" />
                        How was your week overall?
                      </h3>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <motion.button
                            key={num}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setRating(num)}
                            className={`w-12 h-12 mx-1 rounded-full flex items-center justify-center transition-colors ${
                              rating === num 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            }`}
                          >
                            {num}
                          </motion.button>
                        ))}
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 px-2">
                        <span>Challenging</span>
                        <span>Great!</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Lightbulb className="text-green-500 mr-2 w-5 h-5" />
                        What went well this week?
                      </h3>
                      <textarea
                        value={highlights}
                        onChange={(e) => setHighlights(e.target.value)}
                        placeholder="Write 2-3 things that went well..."
                        className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    {/* Improvement */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <ArrowUp className="text-blue-500 mr-2 w-5 h-5" />
                        What would you like to improve?
                      </h3>
                      <textarea
                        value={improvement}
                        onChange={(e) => setImprovement(e.target.value)}
                        placeholder="List 1 thing you want to improve..."
                        className="w-full h-20 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    {/* Goal */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Target className="text-purple-500 mr-2 w-5 h-5" />
                        Set one small goal for next week
                      </h3>
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="Your goal..."
                        className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleSubmit}
                        disabled={!rating || !highlights || !improvement || !goal}
                        className={`w-full py-3 px-6 rounded-lg flex items-center justify-center transition-all ${
                          rating && highlights && improvement && goal
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Submit Reflection <ChevronRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 0.8 }}
                    >
                      <Check className="w-16 h-16 text-green-500 bg-green-100 p-3 rounded-full" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mt-6 mb-2 text-gray-800">Reflection Submitted!</h3>
                    <p className="text-gray-600 mb-6">Thank you for taking time to reflect on your week.</p>
                    <Sparkles className="text-yellow-400 w-8 h-8 animate-pulse" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Growth Tracking Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <BarChart2 className="text-indigo-600 mr-3 w-6 h-6" />
            Your Growth Journey
          </h2>
          {isMobile && (
            <button className="text-indigo-600 flex items-center text-sm">
              View All <ChevronDown className="ml-1 w-4 h-4" />
            </button>
          )}
        </div>

        {/* Graph Placeholder */}
        <div className="bg-gray-50 rounded-lg p-4 h-64 mb-8 flex items-center justify-center">
          <div className="text-center">
            <BarChart2 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-400">Weekly ratings graph will appear here</p>
          </div>
        </div>

        {/* Recent Reflections */}
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
          <Calendar className="text-indigo-500 mr-2 w-5 h-5" />
          Recent Reflections
        </h3>
        {pastReflections.length > 0 ? (
          <div className="space-y-4">
            {pastReflections.slice(0, isMobile ? 2 : 3).map((reflection, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      reflection.rating >= 7 ? 'bg-green-100 text-green-600' :
                      reflection.rating >= 4 ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {reflection.rating}
                    </div>
                    <div>
                      <h4 className="font-medium">{reflection.date.toLocaleDateString()}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{reflection.goal}</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 text-sm flex items-center">
                    View <ChevronRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <BookOpen className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">Complete your first reflection to see your growth journey</p>
          </div>
        )}
      </div>

      {/* Nudge Notification */}
      {!showPrompt && !showReflection && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center border border-indigo-100 z-10 max-w-xs"
        >
          <Bell className="text-indigo-600 w-5 h-5 mr-3 animate-pulse" />
          <div>
            <p className="text-sm font-medium">Don't forget your weekly reflection!</p>
            <button 
              onClick={() => setShowReflection(true)}
              className="text-indigo-600 text-xs mt-1 flex items-center"
            >
              Complete now <ChevronRight className="ml-1 w-3 h-3" />
            </button>
          </div>
          <button 
            onClick={() => setShowPrompt(false)}
            className="text-gray-400 ml-3"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default WeeklyReflection;