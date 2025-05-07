import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Check, ChevronDown, Eye, EyeOff, HelpCircle,
  Info, Key, Lock, ShieldCheck, ShieldQuestion, X, Loader2,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SecurityDetailsPage = () => {
  const [formData, setFormData] = useState({
    securityQuestionType: 'select', // 'select' or 'custom'
    selectedQuestion: '',
    customQuestion: '',
    securityAnswer: '',
    securityPin: '',
    confirmPin: ''
  });
  const [errors, setErrors] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [showQuestionDropdown, setShowQuestionDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const securityQuestions = [
    "What was the name of your first pet?",
    "In what city were you born?",
    "What is your mother's maiden name?",
    "What was the name of your elementary school?",
    "What was your childhood nickname?"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate security question
    if (formData.securityQuestionType === 'select' && !formData.selectedQuestion) {
      newErrors.selectedQuestion = "Please select a security question";
    } else if (formData.securityQuestionType === 'custom' && !formData.customQuestion.trim()) {
      newErrors.customQuestion = "Please enter a security question";
    }
    
    // Validate security answer
    if (!formData.securityAnswer.trim()) {
      newErrors.securityAnswer = "Security answer is required";
    } else if (formData.securityAnswer.trim().length < 3) {
      newErrors.securityAnswer = "Answer is too short";
    }
    
    // Validate PIN
    if (!formData.securityPin) {
      newErrors.securityPin = "Security PIN is required";
    } else if (!/^\d{4}$/.test(formData.securityPin)) {
      newErrors.securityPin = "PIN must be exactly 4 digits";
    } else if (['0000', '1111', '1234', '4321'].includes(formData.securityPin)) {
      newErrors.securityPin = "Avoid simple PIN patterns";
    }
    
    // Validate confirm PIN
    if (formData.confirmPin && formData.confirmPin !== formData.securityPin) {
      newErrors.confirmPin = "PINs do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Randomly simulate error 20% of the time
      if (Math.random() < 0.2) {
        setError("Failed to save security details. Please try again.");
      } else {
        setSuccess(true);
      }
    }, 1500);
  };

  const toggleQuestionType = () => {
    setFormData(prev => ({
      ...prev,
      securityQuestionType: prev.securityQuestionType === 'select' ? 'custom' : 'select',
      selectedQuestion: prev.securityQuestionType === 'select' ? '' : prev.selectedQuestion,
      customQuestion: prev.securityQuestionType === 'custom' ? '' : prev.customQuestion
    }));
    setErrors(prev => ({
      ...prev,
      selectedQuestion: null,
      customQuestion: null
    }));
  };

  const selectQuestion = (question) => {
    setFormData(prev => ({
      ...prev,
      selectedQuestion: question
    }));
    setShowQuestionDropdown(false);
    if (errors.selectedQuestion) {
      setErrors(prev => ({
        ...prev,
        selectedQuestion: null
      }));
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError('');
    setFormData({
      securityQuestionType: 'select',
      selectedQuestion: '',
      customQuestion: '',
      securityAnswer: '',
      securityPin: '',
      confirmPin: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-100 opacity-10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex justify-center mb-4"
          >
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl shadow-lg">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            Set Security Details
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Protect your account with recovery options
          </motion.p>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border-2 border-blue-100 rounded-xl p-5 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-blue-200/10"></div>
          <div className="relative flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-1">Why set security details?</h3>
              <p className="text-sm text-gray-600">
                These details help us verify your identity if you ever need to recover your account. 
                Choose a question and answer you'll remember, and set a 4-digit PIN that's easy for 
                you to recall but hard for others to guess.
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-30"></div>
              <div className="relative flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 15
                  }}
                  className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg"
                >
                  <Check className="h-8 w-8 text-white" />
                </motion.div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 relative">Security Details Saved!</h2>
              <p className="text-gray-600 mb-6 relative">Your account recovery options are now set up.</p>
              <Link to="/auth/students-login">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetForm}
                    className="relative w-full max-w-xs mx-auto bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
                >
                    Proceed To Login <ArrowRight className="h-5 w-5" />
                </motion.button>
                </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 opacity-30"></div>
              <div className="relative">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-100 rounded-lg p-4 mb-6"
                  >
                    <div className="flex items-center gap-2 text-red-600">
                      <X className="h-5 w-5" />
                      <p className="font-medium">{error}</p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Security Question Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                      <ShieldQuestion className="h-5 w-5 text-blue-600" />
                      Security Question
                    </h3>

                    <div className="flex items-center gap-3 mb-4">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={toggleQuestionType}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${formData.securityQuestionType === 'select' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Select Question
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={toggleQuestionType}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${formData.securityQuestionType === 'custom' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Custom Question
                      </motion.button>
                    </div>

                    {formData.securityQuestionType === 'select' ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-blue-600" /> Select a Security Question
                        </label>
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            type="button"
                            onClick={() => setShowQuestionDropdown(!showQuestionDropdown)}
                            className={`w-full px-4 py-3 pl-11 pr-11 rounded-lg border-2 ${errors.selectedQuestion ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'} focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none text-left flex items-center justify-between`}
                          >
                            {formData.selectedQuestion || "Select a question..."}
                            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showQuestionDropdown ? 'rotate-180' : ''}`} />
                          </motion.button>
                          <HelpCircle className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                          {errors.selectedQuestion && (
                            <div className="absolute right-3 top-3.5 flex items-center">
                              <X className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.selectedQuestion && (
                          <p className="text-red-500 text-xs flex items-center gap-1.5">
                            <X className="h-3.5 w-3.5" /> {errors.selectedQuestion}
                          </p>
                        )}

                        <AnimatePresence>
                          {showQuestionDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="bg-white border-2 border-gray-200 rounded-lg shadow-lg mt-1 overflow-hidden z-10"
                            >
                              <ul className="max-h-60 overflow-y-auto">
                                {securityQuestions.map((question, index) => (
                                  <motion.li 
                                    key={index}
                                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => selectQuestion(question)}
                                      className={`w-full px-4 py-3 text-left transition-colors duration-150 ${formData.selectedQuestion === question ? 'bg-blue-100' : ''}`}
                                    >
                                      {question}
                                    </button>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-blue-600" /> Your Custom Security Question
                        </label>
                        <div className="relative">
                          <input
                            name="customQuestion"
                            value={formData.customQuestion}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 pl-11 rounded-lg border-2 ${errors.customQuestion ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                            placeholder="Enter your security question..."
                          />
                          <HelpCircle className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                          {errors.customQuestion && (
                            <div className="absolute right-3 top-3.5 flex items-center">
                              <X className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.customQuestion && (
                          <p className="text-red-500 text-xs flex items-center gap-1.5">
                            <X className="h-3.5 w-3.5" /> {errors.customQuestion}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Security Answer */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Key className="h-4 w-4 text-blue-600" /> Answer to Security Question
                    </label>
                    <div className="relative">
                      <input
                        type={showAnswer ? "text" : "password"}
                        name="securityAnswer"
                        value={formData.securityAnswer}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pl-11 pr-11 rounded-lg border-2 ${errors.securityAnswer ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                        placeholder="Your answer..."
                      />
                      <Key className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowAnswer(!showAnswer)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showAnswer ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </motion.button>
                    </div>
                    {errors.securityAnswer && (
                      <p className="text-red-500 text-xs flex items-center gap-1.5">
                        <X className="h-3.5 w-3.5" /> {errors.securityAnswer}
                      </p>
                    )}
                    {formData.securityAnswer && formData.securityAnswer.length < 6 && !errors.securityAnswer && (
                      <p className="text-yellow-600 text-xs flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5" /> Consider a longer answer for better security
                      </p>
                    )}
                  </div>

                  {/* Security PIN */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-600" /> Set 4-Digit Security PIN
                    </label>
                    <div className="relative">
                      <input
                        type={showPin ? "text" : "password"}
                        name="securityPin"
                        value={formData.securityPin}
                        onChange={handleChange}
                        maxLength={4}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className={`w-full px-4 py-3 pl-11 pr-11 rounded-lg border-2 ${errors.securityPin ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                        placeholder="••••"
                      />
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPin ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </motion.button>
                    </div>
                    {errors.securityPin && (
                      <p className="text-red-500 text-xs flex items-center gap-1.5">
                        <X className="h-3.5 w-3.5" /> {errors.securityPin}
                      </p>
                    )}
                    {formData.securityPin && !errors.securityPin && (
                      <p className="text-blue-600 text-xs">
                        Remember this PIN - you'll need it for account recovery
                      </p>
                    )}
                  </div>

                  {/* Confirm PIN (Optional) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-600" /> Confirm 4-Digit Security PIN
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPin ? "text" : "password"}
                        name="confirmPin"
                        value={formData.confirmPin}
                        onChange={handleChange}
                        maxLength={4}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className={`w-full px-4 py-3 pl-11 pr-11 rounded-lg border-2 ${errors.confirmPin ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                        placeholder="••••"
                      />
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showConfirmPin ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </motion.button>
                      {formData.confirmPin && formData.securityPin === formData.confirmPin && (
                        <div className="absolute right-3 top-3.5 flex items-center">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.confirmPin && (
                      <p className="text-red-500 text-xs flex items-center gap-1.5">
                        <X className="h-3.5 w-3.5" /> {errors.confirmPin}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    {loading ? (
                      <div className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="flex items-center justify-center"
                        >
                          <Loader2 className="h-5 w-5" />
                        </motion.div>
                        Saving your security details...
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
                      >
                        Save Security Details <ShieldCheck className="h-5 w-5" />
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SecurityDetailsPage;