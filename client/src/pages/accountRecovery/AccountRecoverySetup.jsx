import { useState, useEffect } from 'react';
import { Shield, Lock, HelpCircle, Check, ChevronDown, ArrowRight, Sparkles, Key, User, Star, Hexagon, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios"
import { useNavigate,useLocation} from 'react-router-dom';
import { toast } from 'react-toastify';
const AccountRecoverySetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [pin, setPin] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [pinError, setPinError] = useState('');

  const securityQuestions = [
    "What's your favorite cartoon character?",
    "What was the name of your first pet?",
    "What city were you born in?",
    "What's your favorite book or movie?",
    "What's the name of your best friend?",
    "What was your first teacher's name?",
    "What's your favorite food?",
    "What was the make of your first car?",
    "What's your mother's maiden name?",
    "What was your childhood nickname?",
    "What's the name of your favorite sports team?",
    "What was your first school's name?",
    "What's your favorite vacation spot?",
    "What was your first concert?",
    "What's your favorite color?"
  ];

  // Common weak PINs to block
  const weakPins = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321', '1122', '1212'];

  useEffect(() => {
    // Check if all fields are valid
    let valid = securityQuestion && answer.trim() && pin.length === 4;
    
    // Check for weak PINs
    if (pin.length === 4 && weakPins.includes(pin)) {
      setPinError('Please choose a stronger PIN');
      valid = false;
    } else if (pin.length > 0 && pin.length < 4) {
      setPinError('PIN must be 4 digits');
      valid = false;
    } else {
      setPinError('');
    }
    
    setIsValid(valid);
  }, [securityQuestion, answer, pin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isValid) return;
  
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
  
    if (!token || token.length !== 32) {
      toast.error("Invalid or missing token.");
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:3500/api/accountRecovery-setup?token=${token}`,
        {
          securityQuestion,
          answer,
          pin
        }
      );
  
      if (response.status === 200) {
        setIsSubmitted(true);
        toast.success('Account recovery details set successfully! Redirecting...');
  
        setTimeout(() => {
          navigate("/auth/students-login");
        }, 3000);
      } else {
        toast.error(response?.data?.error || "Unexpected response from server");
      }
    } catch (error) {
      const message =
        error.response?.data?.error || "Something went wrong. Please try again.";
      toast.error(message);
      console.error("Recovery setup error:", error);
    } finally {
      setIsSubmitted(false);
    }
  };
  

  const handlePinChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 4 digits
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
    }
  };

  const startSetup = () => {
    setShowWelcome(false);
  };

  // Floating shapes component
  const FloatingShapes = () => {
    const shapes = [
      { icon: Star, size: 24, color: 'text-blue-200', initial: { x: -50, y: 50 }, animate: { x: 0, y: -20 } },
      { icon: Hexagon, size: 32, color: 'text-purple-200', initial: { x: 100, y: -30 }, animate: { x: -20, y: 40 } },
      { icon: Circle, size: 28, color: 'text-indigo-200', initial: { x: -80, y: -10 }, animate: { x: 30, y: 30 } },
      { icon: Star, size: 20, color: 'text-blue-100', initial: { x: 50, y: 80 }, animate: { x: -30, y: -40 } },
    ];

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shapes.map((shape, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, ...shape.initial }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              ...shape.animate,
              transition: { 
                duration: 8 + index * 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }
            }}
            className={`absolute ${shape.color}`}
            style={{
              top: `${20 + index * 15}%`,
              left: `${10 + index * 20}%`,
            }}
          >
            <shape.icon size={shape.size} />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2 }}
          className="absolute top-20 left-10 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute top-1/3 right-1/4 w-56 h-56 bg-indigo-100 rounded-full filter blur-3xl"
        />
      </div>

      {/* Floating animated shapes */}
      <FloatingShapes />

      <AnimatePresence>
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-white/20">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                className="flex justify-center mb-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full relative"
                >
                  <Key className="w-10 h-10 text-blue-600 absolute inset-0 m-auto" />
                  <Sparkles className="w-5 h-5 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </motion.div>
              </motion.div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-3 font-[Poppins] bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to Your Account Security!
              </h1>
              
              <p className="text-gray-600 mb-6">
                Let's set up some recovery options to keep your account safe in case you forget your password.
              </p>
              
              <div className="space-y-4 mb-8">
                <motion.div 
                  className="flex items-start bg-blue-50/50 p-3 rounded-lg border border-blue-100"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-shrink-0 mt-1 mr-3 text-blue-500">
                    <Shield className="w-5 h-5" />
                  </div>
                  <p className="text-left text-gray-700">
                    Choose a security question only you know the answer to
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex items-start bg-purple-50/50 p-3 rounded-lg border border-purple-100"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-shrink-0 mt-1 mr-3 text-purple-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <p className="text-left text-gray-700">
                    Create a secret 4-digit PIN for extra security
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex items-start bg-indigo-50/50 p-3 rounded-lg border border-indigo-100"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-shrink-0 mt-1 mr-3 text-indigo-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="text-left text-gray-700">
                    It only takes a minute and keeps your account protected
                  </p>
                </motion.div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={startSetup}
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg flex items-center justify-center gap-2 relative overflow-hidden"
              >
                <span className="relative z-10">Let's Get Started</span>
                <ArrowRight className="w-5 h-5 relative z-10" />
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md"
          >
            {!isSubmitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 0.2 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full relative">
                      <Shield className="w-8 h-8 text-blue-600" />
                      <motion.div 
                        className="absolute -inset-1 border-2 border-blue-300 rounded-full opacity-0"
                        animate={{ 
                          opacity: [0, 0.5, 0],
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      />
                    </div>
                  </motion.div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2 font-[Poppins] bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Let's Keep Your Account Safe!
                  </h1>
                  <p className="text-gray-600">Just a few quick steps to secure your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Security Question Dropdown */}
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label htmlFor="security-question" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <HelpCircle className="w-4 h-4 mr-1 text-blue-500" />
                      Security Question
                    </label>
                    <div className="relative">
                      <motion.select
                        id="security-question"
                        value={securityQuestion}
                        onChange={(e) => setSecurityQuestion(e.target.value)}
                        className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white hover:border-blue-400"
                        whileHover={{ scale: 1.01 }}
                        whileFocus={{ scale: 1.02 }}
                        required
                      >
                        <option value="">Select a question</option>
                        {securityQuestions.map((question, index) => (
                          <option key={index} value={question}>
                            {question}
                          </option>
                        ))}
                      </motion.select>
                      <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </motion.div>

                  {/* Answer Field */}
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Answer
                    </label>
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      whileFocus={{ scale: 1.02 }}
                      className="relative"
                    >
                      <input
                        type="text"
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-blue-400"
                        placeholder="Enter your answer"
                        required
                      />
                      {answer && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-3.5 text-blue-500"
                        >
                          <Check className="w-5 h-5" />
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* PIN Input */}
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Lock className="w-4 h-4 mr-1 text-blue-500" />
                      4-Digit PIN
                    </label>
                    <div className="relative">
                      <motion.div 
                        whileHover={{ scale: 1.01 }}
                        whileFocus={{ scale: 1.02 }}
                      >
                        <input
                          type="text"
                          id="pin"
                          value={pin}
                          onChange={handlePinChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-blue-400"
                          placeholder="Enter 4 digits"
                          maxLength={4}
                          inputMode="numeric"
                          pattern="\d{4}"
                          required
                        />
                      </motion.div>
                      {pin.length === 4 && !pinError && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-3.5 text-green-500"
                        >
                          <Check className="w-5 h-5" />
                        </motion.div>
                      )}
                    </div>
                    {pinError && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-500"
                      >
                        {pinError}
                      </motion.p>
                    )}
                    {pin.length === 4 && !pinError && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-sm text-green-600"
                      >
                        Strong PIN selected!
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={!isValid}
                      whileHover={isValid ? { 
                        scale: 1.02,
                        boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.3)"
                      } : {}}
                      whileTap={isValid ? { scale: 0.98 } : {}}
                      className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all relative overflow-hidden ${
                        isValid
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:shadow-lg'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span className="relative z-10">Secure My Account</span>
                      {isValid && (
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0"
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  </motion.div>

                  {/* Helper Note */}
                  <motion.p 
                    className="mt-4 text-sm text-gray-500 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    These details help you recover your account if you forget your password.
                  </motion.p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-white/20"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 relative"
                >
                  <Check className="h-8 w-8 text-green-600" />
                  <motion.div 
                    className="absolute inset-0 border-2 border-green-200 rounded-full"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 0, 0.7]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">All Set!</h2>
                <p className="text-gray-600 mb-6">Your account is now secure.</p>
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6"
                />
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex items-center justify-center gap-2 text-gray-500"
                >
                  <User className="w-4 h-4" />
                  <span>Account protected</span>
                  <Lock className="w-4 h-4 ml-2" />
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-6 text-xs text-gray-400"
                >
                  You can update these settings anytime in your account preferences
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountRecoverySetup;