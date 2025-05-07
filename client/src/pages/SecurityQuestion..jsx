import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Check, X, Loader2, ShieldQuestion, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SecurityQuestionDisplay = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Mock security question data - in a real app this would come from your backend
  const [securityData, setSecurityData] = useState({
    question: "What was the name of your first pet?",
    answer: "Fluffy",
    lastUpdated: "2024-05-20"
  });

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 4) {
      setPin(value);
      setError('');
    }
  };

  const verifyPin = (e) => {
    e.preventDefault();
    
    // Validate PIN
    if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    setLoading(true);
    setError('');
    
    // Simulate API call to verify PIN
    setTimeout(() => {
      setLoading(false);
      // In a real app, this would verify against the stored PIN
      if (pin === '1234') { // Mock correct PIN
        setSuccess(true);
        setShowDetails(true);
      } else {
        setError("Incorrect PIN. Please try again.");
      }
    }, 1000);
  };

  const resetView = () => {
    setShowDetails(false);
    setPin('');
    setSuccess(false);
    setError('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <ShieldQuestion className="w-5 h-5 text-indigo-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">Security Question</h2>
      </div>
      
      {!showDetails ? (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Security Question</div>
                <div className="text-gray-800 font-mono tracking-wider">***************</div>
              </div>
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <button 
            onClick={() => setShowDetails(true)}
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Key className="w-4 h-4 mr-2" />
            View Security Question and Answer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {!success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-sm font-medium text-blue-800 mb-2">
                  Enter your 4-digit PIN to view security details
                </div>
                
                <form onSubmit={verifyPin} className="space-y-3">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Security PIN</label>
                    <input
                      type={showPin ? "text" : "password"}
                      value={pin}
                      onChange={handlePinChange}
                      inputMode="numeric"
                      maxLength={4}
                      className={`w-full px-4 py-2 pl-11 rounded-lg border-2 ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-2 focus:ring-blue-100 outline-none`}
                      placeholder="••••"
                    />
                    <Lock className="absolute left-3 bottom-2.5 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPin ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  {error && (
                    <div className="flex items-center text-red-500 text-sm">
                      <X className="w-4 h-4 mr-1" /> {error}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Verify PIN
                      </>
                    )}
                  </button>
                </form>
              </div>
              
              <button
                onClick={resetView}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to security overview
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center text-green-600 mb-2">
                  <Check className="w-5 h-5 mr-2" />
                  <span className="font-medium">PIN Verified Successfully</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Security Question</div>
                    <div className="text-gray-800 mt-1">{securityData.question}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500">Your Answer</div>
                    <div className="text-gray-800 mt-1 font-mono">{securityData.answer}</div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Last updated: {new Date(securityData.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <button
                onClick={resetView}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Lock className="w-4 h-4 mr-2" />
                Hide Security Details
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecurityQuestionDisplay;