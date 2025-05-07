import { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, Check, Eye, EyeOff, HelpCircle, 
  Key, Loader2, Lock, ShieldAlert, ShieldCheck, User, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPasswordFlow = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    registrationNumber: '',
    securityAnswer: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [accountNotFound, setAccountNotFound] = useState(false);

  // Simulate fetching security question
  useEffect(() => {
    if (step === 1 && formData.username && formData.registrationNumber && !accountNotFound) {
      const timer = setTimeout(() => {
        // In a real app, this would be an API call
        const questions = [
          "What was the name of your first pet?",
          "In what city were you born?",
          "What is your mother's maiden name?",
          "What was your childhood nickname?"
        ];
        setSecurityQuestion(questions[Math.floor(Math.random() * questions.length)]);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [formData.username, formData.registrationNumber, step, accountNotFound]);

  // Calculate password strength
  useEffect(() => {
    if (!formData.newPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formData.newPassword.length >= 8) strength += 1;
    if (formData.newPassword.match(/[A-Z]/)) strength += 1;
    if (formData.newPassword.match(/[0-9]/)) strength += 1;
    if (formData.newPassword.match(/[^A-Za-z0-9]/)) strength += 1;

    setPasswordStrength(strength);
  }, [formData.newPassword]);

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
    
    if (name === 'username' || name === 'registrationNumber') {
      setAccountNotFound(false);
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = "Registration number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.securityAnswer.trim()) newErrors.securityAnswer = "Security answer is required";
    if (!formData.newPassword.trim()) newErrors.newPassword = "Password is required";
    if (formData.newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    
    setLoading(true);
    // Simulate API call to verify account
    setTimeout(() => {
      setLoading(false);
      // Randomly simulate account not found 20% of the time
      if (Math.random() < 0.2) {
        setAccountNotFound(true);
      } else {
        setStep(2);
      }
    }, 1500);
  };

  const handleSubmitStep2 = (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setLoading(true);
    // Simulate API call to reset password
    setTimeout(() => {
      setLoading(false);
      setStep(3); // Success step
    }, 1500);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength === 2) return 'Moderate';
    if (passwordStrength === 3) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 ">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8 relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-center mb-6 overflow-y-auto">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl shadow-lg">
                    <User className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Account</h2>
                  <p className="text-gray-600">Step 1 of 2</p>
                  <p className="text-gray-600 mt-2">Please provide your username and registration number</p>
                </div>
                
                <form onSubmit={handleSubmitStep1} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" /> Username or Student ID
                    </label>
                    <div className="relative">
                      <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pl-11 rounded-lg border-2 ${errors.username ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                        placeholder="e.g., johndoe123"
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
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Key className="h-4 w-4 text-blue-600" /> Registration Number
                    </label>
                    <div className="relative">
                      <input
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pl-11 rounded-lg border-2 ${errors.registrationNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                        placeholder="e.g., REG20230001"
                      />
                      <Key className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
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
                  
                  {accountNotFound && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border-2 border-red-100 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 text-red-600">
                        <ShieldAlert className="h-5 w-5" />
                        <p className="font-medium">We couldn't find your account</p>
                      </div>
                      <p className="text-red-600 text-sm mt-1">
                        Please check your details and try again or contact support.
                      </p>
                    </motion.div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg disabled:opacity-80"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Finding Account...
                      </>
                    ) : (
                      <>
                        Continue <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
                
                <div className="text-center">
                  <button
                    onClick={onClose}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-200 mx-auto group"
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" /> 
                    Back to Login
                  </button>
                </div>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl shadow-lg">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
                  <p className="text-gray-600">Step 2 of 2</p>
                </div>
                
                <form onSubmit={handleSubmitStep2} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-blue-600" /> Security Question
                    </label>
                    <div className="bg-blue-50 border-2 border-blue-100 rounded-lg p-3">
                      <p className="text-sm text-gray-800 font-medium">{securityQuestion}</p>
                      <div className="relative mt-3">
                        <input
                          name="securityAnswer"
                          value={formData.securityAnswer}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 pl-11 rounded-lg border-2 ${errors.securityAnswer ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                          placeholder="Your answer"
                        />
                        <HelpCircle className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        {errors.securityAnswer && (
                          <div className="absolute right-3 top-3.5 flex items-center">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.securityAnswer && (
                        <p className="text-red-500 text-xs flex items-center gap-1.5 mt-1">
                          <X className="h-3.5 w-3.5" /> {errors.securityAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-600" /> New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pl-11 pr-11 rounded-lg border-2 ${errors.newPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                        placeholder="••••••••"
                      />
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mr-2">
                        <motion.div 
                          className={`h-full ${getPasswordStrengthColor()}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-500 text-xs flex items-center gap-1.5">
                        <X className="h-3.5 w-3.5" /> {errors.newPassword}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-600" /> Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pl-11 pr-11 rounded-lg border-2 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'} focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none`}
                        placeholder="••••••••"
                      />
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                      {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
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
                  
                  <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-100">
                    <h4 className="text-sm font-medium text-blue-800 flex items-center gap-2 mb-1">
                      <HelpCircle className="h-4 w-4" /> Password Requirements
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className={`flex items-center gap-1.5 ${formData.newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                        {formData.newPassword.length >= 8 ? <Check className="h-3 w-3" /> : <span className="w-3 h-3 rounded-full border border-gray-400 inline-block"></span>}
                        Minimum 8 characters
                      </li>
                      <li className={`flex items-center gap-1.5 ${formData.newPassword.match(/[A-Z]/) ? 'text-green-600' : ''}`}>
                        {formData.newPassword.match(/[A-Z]/) ? <Check className="h-3 w-3" /> : <span className="w-3 h-3 rounded-full border border-gray-400 inline-block"></span>}
                        At least one uppercase letter
                      </li>
                      <li className={`flex items-center gap-1.5 ${formData.newPassword.match(/[0-9]/) ? 'text-green-600' : ''}`}>
                        {formData.newPassword.match(/[0-9]/) ? <Check className="h-3 w-3" /> : <span className="w-3 h-3 rounded-full border border-gray-400 inline-block"></span>}
                        At least one number
                      </li>
                      <li className={`flex items-center gap-1.5 ${formData.newPassword.match(/[^A-Za-z0-9]/) ? 'text-green-600' : ''}`}>
                        {formData.newPassword.match(/[^A-Za-z0-9]/) ? <Check className="h-3 w-3" /> : <span className="w-3 h-3 rounded-full border border-gray-400 inline-block"></span>}
                        At least one special character
                      </li>
                    </ul>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg disabled:opacity-80"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Resetting Password...
                      </>
                    ) : (
                      <>
                        Reset Password <Check className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setStep(1)}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-2 transition-colors duration-200 group"
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" /> 
                    Back
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-2 transition-colors duration-200"
                  >
                    Back to Login
                  </button>
                </div>
              </motion.div>
            )}
            
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-center"
              >
                <div className="flex justify-center mb-6">
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
                    <ShieldCheck className="h-8 w-8 text-white" />
                  </motion.div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Successfully Reset!</h2>
                <p className="text-gray-600">You can now log in with your new password</p>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border-2 border-blue-100">
                  <p className="text-blue-800 font-medium flex items-center justify-center gap-2">
                    <Check className="h-5 w-5 text-green-600" /> Your account is now secure
                  </p>
                </div>
                
                <button
                  onClick={onClose}
                  className="w-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
                >
                  Go to Login <ArrowRight className="h-5 w-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordFlow;