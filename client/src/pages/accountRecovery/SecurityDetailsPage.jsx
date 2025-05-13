import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  ArrowLeft, Check, ChevronDown, Eye, EyeOff, HelpCircle,
  Info, Key, Lock, ShieldCheck, ShieldQuestion, X, Loader2,
  ArrowRight, User, BookOpen, Fingerprint, Sparkles, Rocket,
  Shield, Mail, CreditCard, Gift, Heart, Award, Bell, LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SecurityDetailsPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Verify user, 2: Answer question, 3: Reset password, 4: Success
  const [formData, setFormData] = useState({
    username: '',
    registrationNumber: '',
    securityQuestion: '',
    securityAnswer: '',
    enteredAnswer: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [animatedElements, setAnimatedElements] = useState([]);

  // Premium animated background elements
  useEffect(() => {
    const elements = [
      { icon: Key, color: 'from-blue-400 to-purple-400', size: 40, zIndex: 0 },
      { icon: Lock, color: 'from-purple-400 to-blue-400', size: 50, zIndex: 0 },
      { icon: ShieldCheck, color: 'from-blue-500 to-purple-500', size: 60, zIndex: 0 },
      { icon: Fingerprint, color: 'from-purple-500 to-blue-500', size: 45, zIndex: 0 },
      { icon: Sparkles, color: 'from-blue-300 to-purple-300', size: 55, zIndex: 0 },
      { icon: Rocket, color: 'from-indigo-400 to-pink-400', size: 35, zIndex: 0 },
      { icon: Gift, color: 'from-green-400 to-blue-400', size: 45, zIndex: 0 },
      { icon: Heart, color: 'from-pink-400 to-red-400', size: 40, zIndex: 0 },
      { icon: Award, color: 'from-yellow-400 to-orange-400', size: 50, zIndex: 0 },
      { icon: Bell, color: 'from-purple-300 to-indigo-300', size: 30, zIndex: 0 }
    ];
    setAnimatedElements(elements);

    // Simulate fetching security questions
    const demoQuestions = [
      "What was the name of your first pet?",
      "In what city were you born?",
      "What is your mother's maiden name?",
      "What was the name of your elementary school?",
      "What was your childhood nickname?"
    ];
    setSecurityQuestions(demoQuestions);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.enteredAnswer.trim()) {
      newErrors.enteredAnswer = "Answer is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one number";
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyUser = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    
    setLoading(true);
    setError('');
    toast.info('Verifying your account...', { autoClose: false, toastId: 'verification' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const randomQuestion = securityQuestions[Math.floor(Math.random() * securityQuestions.length)];
      
      setFormData(prev => ({
        ...prev,
        securityQuestion: randomQuestion,
        securityAnswer: "correctanswer"
      }));
      
      setStep(2);
      toast.dismiss('verification');
      toast.success('Account verified! Please answer your security question');
    } catch (err) {
      toast.dismiss('verification');
      toast.error('Verification failed. Please check your details');
      setError("User verification failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setLoading(true);
    setError('');
    toast.info('Verifying your answer...', { autoClose: false, toastId: 'answer-verification' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (formData.enteredAnswer.toLowerCase() === formData.securityAnswer.toLowerCase()) {
        const mockToken = "mock-token-" + Math.random().toString(36).substr(2);
        localStorage.setItem('resetToken', mockToken);
        
        setStep(3);
        toast.dismiss('answer-verification');
        toast.success('Verification successful! Please set a new password');
      } else {
        toast.dismiss('answer-verification');
        toast.error('Incorrect answer. Please try again.');
      }
    } catch (err) {
      toast.dismiss('answer-verification');
      toast.error('Failed to verify answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;
    
    setLoading(true);
    setError('');
    toast.info('Updating your password...', { autoClose: false, toastId: 'password-reset' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep(4);
      toast.dismiss('password-reset');
      toast.success('Password updated successfully!');
    } catch (err) {
      toast.dismiss('password-reset');
      toast.error('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetProcess = () => {
    setStep(1);
    setSuccess(false);
    setError('');
    setFormData({
      username: '',
      registrationNumber: '',
      securityQuestion: '',
      securityAnswer: '',
      enteredAnswer: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Premium animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {animatedElements.map((element, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-gradient-to-br ${element.color} opacity-20`}
            style={{
              width: element.size,
              height: element.size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              zIndex: element.zIndex
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <element.icon className="w-full h-full p-2" />
          </motion.div>
        ))}
        
        {/* Floating sparkles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute rounded-full bg-yellow-300 opacity-20"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              zIndex: 0
            }}
            animate={{
              y: [0, Math.random() * 40 - 20],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Back to login button (always visible) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={goToLogin}
        className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-md px-4 py-2 rounded-lg shadow-md flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors border border-gray-200"
      >
        <LogIn className="w-4 h-4" />
        Back to Login
      </motion.button>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex justify-center mb-4"
          >
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-xl shadow-lg">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            {step === 1 ? 'Account Recovery' : 
             step === 2 ? 'Security Question' : 
             step === 3 ? 'Reset Password' :
             'Password Updated!'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            {step === 1 ? 'Verify your identity to begin recovery' : 
             step === 2 ? 'Answer your security question' : 
             step === 3 ? 'Create a strong new password' :
             'Your password has been successfully updated'}
          </motion.p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${step >= stepNumber ? 
                    'bg-gradient-to-br from-blue-600 to-purple-600 text-white' : 
                    'bg-gray-200 text-gray-500'}`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-12 h-1 mx-1 ${step > stepNumber ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200 rounded-xl p-5 mb-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-purple-100/10"></div>
            <div className="relative flex items-start gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
                <Info className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Account Recovery Process</h3>
                <p className="text-sm text-gray-600">
                  Enter your username and registration number to verify your identity.
                  After verification, you'll need to answer your security question.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200 rounded-xl p-5 mb-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-purple-100/10"></div>
            <div className="relative flex items-start gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
                <Key className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Security Verification</h3>
                <p className="text-sm text-gray-600">
                  Please provide the answer to your security question. This helps us ensure
                  that only you can reset your password.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200 rounded-xl p-5 mb-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-purple-100/10"></div>
            <div className="relative flex items-start gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Create a Strong Password</h3>
                <p className="text-sm text-gray-600">
                  Your new password must be at least 8 characters long and contain
                  at least one uppercase letter and one number.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center gap-2 text-red-600">
                <X className="h-5 w-5" />
                <p className="font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: Verify User */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 opacity-30"></div>
            <div className="relative">
              <form onSubmit={handleVerifyUser} className="space-y-6">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" /> Username
                  </label>
                  <div className="relative">
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-11 rounded-lg border-2 ${errors.username ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                      placeholder="Enter your username"
                    />
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    {errors.username && (
                      <div className="absolute right-3 top-3.5 flex items-center">
                        <X className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-xs flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5" /> {errors.username}
                    </p>
                  )}
                </div>

                {/* Registration Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" /> Registration Number
                  </label>
                  <div className="relative">
                    <input
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-11 rounded-lg border-2 ${errors.registrationNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                      placeholder="Enter your registration number"
                    />
                    <BookOpen className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    {errors.registrationNumber && (
                      <div className="absolute right-3 top-3.5 flex items-center">
                        <X className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.registrationNumber && (
                    <p className="text-red-500 text-xs flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5" /> {errors.registrationNumber}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  {loading ? (
                    <div className="w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="flex items-center justify-center"
                      >
                        <Loader2 className="h-5 w-5" />
                      </motion.div>
                      Verifying your account...
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
                    >
                      Verify Account <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Step 2: Answer Security Question */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-purple-50 opacity-30"></div>
            <div className="relative">
              <form onSubmit={handleSubmitAnswer} className="space-y-6">
                {/* Security Question */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ShieldQuestion className="h-4 w-4 text-blue-600" /> Your Security Question
                  </label>
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 font-medium">{formData.securityQuestion}</p>
                  </div>
                </div>

                {/* Security Answer */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Key className="h-4 w-4 text-blue-600" /> Your Answer
                  </label>
                  <div className="relative">
                    <input
                      type={showAnswer ? "text" : "password"}
                      name="enteredAnswer"
                      value={formData.enteredAnswer}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-11 pr-11 rounded-lg border-2 ${errors.enteredAnswer ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                      placeholder="Enter your answer..."
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
                  {errors.enteredAnswer && (
                    <p className="text-red-500 text-xs flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5" /> {errors.enteredAnswer}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={resetProcess}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <ArrowLeft className="h-5 w-5" /> Back
                  </motion.button>
                  {loading ? (
                    <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-600 text-white py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="flex items-center justify-center"
                      >
                        <Loader2 className="h-5 w-5" />
                      </motion.div>
                      Verifying...
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
                    >
                      Verify Answer <ShieldCheck className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 opacity-30"></div>
            <div className="relative">
              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-600" /> New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-11 pr-11 rounded-lg border-2 ${errors.newPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                      placeholder="Enter new password"
                    />
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </motion.button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5" /> {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" /> Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-11 pr-11 rounded-lg border-2 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                      placeholder="Confirm new password"
                    />
                    <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </motion.button>
                    {formData.confirmPassword && !errors.confirmPassword && formData.newPassword === formData.confirmPassword && (
                      <div className="absolute right-3 top-3.5 flex items-center">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5" /> {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500">Password Strength</span>
                      <span className={`text-xs font-medium ${
                        formData.newPassword.length < 8 ? 'text-red-500' :
                        !/[A-Z]/.test(formData.newPassword) || !/[0-9]/.test(formData.newPassword) ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {formData.newPassword.length < 8 ? 'Weak' :
                         !/[A-Z]/.test(formData.newPassword) || !/[0-9]/.test(formData.newPassword) ? 'Medium' :
                         'Strong'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          formData.newPassword.length < 8 ? 'bg-red-500 w-1/4' :
                          !/[A-Z]/.test(formData.newPassword) || !/[0-9]/.test(formData.newPassword) ? 'bg-yellow-500 w-2/4' :
                          'bg-green-500 w-full'
                        }`}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <ArrowLeft className="h-5 w-5" /> Back
                  </motion.button>
                  {loading ? (
                    <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-600 text-white py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="flex items-center justify-center"
                      >
                        <Loader2 className="h-5 w-5" />
                      </motion.div>
                      Updating...
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
                    >
                      Reset Password <Key className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden border border-gray-100"
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2 relative">Password Updated!</h2>
            <p className="text-gray-600 mb-6 relative">
              Your password has been successfully updated. You can now log in with your new password.
            </p>
            
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToLogin}
                className="w-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
              >
                Go to Login <LogIn className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetProcess}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200"
              >
                Start Over <ArrowLeft className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SecurityDetailsPage;