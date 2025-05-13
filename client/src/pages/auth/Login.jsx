import { useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Lock, X, Mail, Eye, EyeOff, User, HelpCircle, 
  Rocket, Shield, BookOpen, ChevronRight, Sparkles, Smartphone
} from 'lucide-react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../../assets/icons8-graduation-cap-30.png";
import ForgotPasswordFlow from './ForgotPasswordModal';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState(null);
  const formRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      const response = await axios.post("http://192.168.100.2:3500/api/login", formData);
  
      if (response.status === 200) {
        const token = response.data.token;
        const user = response.data.user;
        const regNumber = user.regNumber;
      
        localStorage.setItem("token", token);
        setUser(response.data.user);
        console.log("Login successful:", user);
        
        toast.success('Login successful! Redirecting...');
      
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError("Unexpected response from server.");
      }
  
    } catch (error) {
      console.error("Login failed:", error.response?.data?.error || error.message);
      const errorMsg = error.response?.data?.error || "Invalid username or password.";
      setError(errorMsg);
      
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Floating shapes variants
  const floatingShapes = [
    { shape: 'circle', size: 'w-6 h-6', color: 'from-purple-400/30 to-blue-400/30' },
    { shape: 'triangle', size: 'w-8 h-8', color: 'from-blue-400/30 to-indigo-400/30' },
    { shape: 'square', size: 'w-5 h-5', color: 'from-indigo-400/30 to-purple-400/30' },
    { shape: 'hexagon', size: 'w-7 h-7', color: 'from-blue-500/20 to-purple-500/20' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 font-sans antialiased overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(20)].map((_, i) => {
          const shape = floatingShapes[Math.floor(Math.random() * floatingShapes.length)];
          return (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 - 50, 
                y: Math.random() * 100 - 50,
                rotate: Math.random() * 360,
                opacity: 0.1 + Math.random() * 0.3,
                scale: 0.8 + Math.random() * 0.7
              }}
              animate={{ 
                x: [0, Math.random() * 80 - 40], 
                y: [0, Math.random() * 80 - 40],
                rotate: [0, Math.random() * 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 15 + Math.random() * 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className={`absolute bg-gradient-to-br ${shape.color} rounded-${shape.shape} ${shape.size}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: 'blur(8px)'
              }}
            />
          );
        })}
      </div>

      {/* Floating Sparkles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            initial={{ 
              x: Math.random() * 100, 
              y: Math.random() * 100,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              x: [null, Math.random() * 20 - 10],
              y: [null, Math.random() * 20 - 10],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              repeatDelay: Math.random() * 5,
              ease: "easeInOut"
            }}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Sparkles className="w-3 h-3 text-yellow-300/70" />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <img src={Logo} alt="logo" className="w-8 h-8" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Peak Performance
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/landingpage"
                className="text-sm font-medium text-gray-600 hover:text-purple-600 transition flex items-center group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">Back to Home</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          {/* Form Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100/50 backdrop-blur-sm"
          >
            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <motion.div 
                  initial={{ scale: 0.9, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="bg-gradient-to-r from-blue-100 to-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner"
                >
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut"
                    }}
                  >
                    <Lock className="w-8 h-8 text-purple-600" />
                  </motion.div>
                </motion.div>
                <motion.h1 
                  className="text-3xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome Back!
                </motion.h1>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Sign in to access your learning dashboard
                </motion.p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-50 text-red-700 rounded-lg p-4 mb-6 flex items-start gap-3 border border-red-200"
                  >
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 0.6 }}
                      className="bg-red-100 p-1 rounded-full flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </motion.div>
                    <div className="text-sm">{error}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form 
                ref={formRef} 
                onSubmit={handleSubmit} 
                className="space-y-6"
                autoComplete="off"
              >
                {/* Username */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-gray-700 font-medium mb-3">Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('username')}
                      onBlur={() => setActiveField(null)}
                      className={`w-full px-5 py-3.5 rounded-xl border ${activeField === 'username' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-300'} focus:outline-none transition text-lg bg-white/50 pl-12`}
                      placeholder="your_username"
                      required
                      autoComplete="new-username" // Prevent autofill
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <User className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-gray-700 font-medium mb-3">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('password')}
                      onBlur={() => setActiveField(null)}
                      className={`w-full px-5 py-3.5 rounded-xl border ${activeField === 'password' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-300'} focus:outline-none transition text-lg bg-white/50 pl-12 pr-12`}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password" // Prevent autofill
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-5 h-5 text-blue-500" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link to="/account-recovery/security-details">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center gap-1 transition-colors duration-200 mx-auto cursor-pointer"
                      >
                        <HelpCircle className="h-4 w-4" /> Forgot Password?
                      </button>
                    </Link>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading || !formData.username || !formData.password}
                    className={`w-full px-6 py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${isLoading || !formData.username || !formData.password ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 shadow-lg hover:shadow-xl'}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Registration Link */}
              <motion.div 
                className="mt-8 pt-6 border-t border-gray-200/50 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <Link to="/auth/students-signup" className="text-blue-600 hover:underline font-medium">
                    Register now
                  </Link>
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-sm flex items-center">
                    <Shield className="w-4 h-4 mr-1.5" /> Privacy
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-sm flex items-center">
                    <BookOpen className="w-4 h-4 mr-1.5" /> Terms
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Floating Help Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center relative overflow-hidden"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-white/10 rounded-full"
          />
          <HelpCircle className="w-6 h-6 relative z-10" />
          <span className="sr-only">Help</span>
        </motion.button>
      </motion.div>

      {/* Floating Rocket Animation */}
      <motion.div
        initial={{ x: -100, y: 100, rotate: -45 }}
        animate={{ 
          x: ["-10%", "110%"],
          y: ["80%", "0%", "80%"],
          rotate: [-45, 0, 45]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="fixed bottom-0 left-0 z-0 opacity-20"
      >
        <Rocket className="w-16 h-16 text-purple-500" />
      </motion.div>

      {showForgotPassword && (
        <ForgotPasswordFlow onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default LoginPage;