import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Lock,X, Mail, Eye, EyeOff, User, HelpCircle, 
  Rocket, Shield, BookOpen, ChevronRight, Sparkles
} from 'lucide-react';
import axios from "axios"
import {useNavigate,Link} from "react-router-dom"
import Logo from "../../assets/icons8-graduation-cap-30.png";
import ForgotPasswordFlow from './ForgotPasswordModal';

const LoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
        const regNumber = user.regNumber; // or response.data.user.registration_number if it's named that way
      
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("Login successful:", user);
      
        navigate("/", { state: { justLoggedIn: true } });

      }
       else {
        setError("Unexpected response from server.");
      }
  
    } catch (error) {
      console.error("Login failed:", error.response?.data?.error || error.message);
      setError("Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-sans antialiased">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: Math.random() * 100 - 50, y: Math.random() * 100 - 50, rotate: 0 }}
            animate={{ 
              x: [0, Math.random() * 40 - 20], 
              y: [0, Math.random() * 40 - 20],
              rotate: [0, Math.random() * 360]
            }}
            transition={{ 
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            className="absolute opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Sparkles className="w-8 h-8 text-blue-400" />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="logo" className="w-6 h-6" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Peak Performance
              </span>
            </div>
            <Link
              to="/landingpage"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition flex items-center">
              Back to Home
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-20 px-6">
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
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-100 to-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner"
                >
                  <Lock className="w-6 h-6 text-indigo-600" />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-600">
                  Sign in to access your personalized learning dashboard
                </p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-50 text-red-700 rounded-lg p-4 mb-6 flex items-start gap-3"
                  >
                    <div className="bg-red-100 p-1 rounded-full">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="text-sm">{error}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" /> Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onFocus={() => setActiveField('username')}
                    onBlur={() => setActiveField(null)}
                    className={`w-full px-5 py-3.5 rounded-xl border ${activeField === 'username' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-300'} focus:outline-none transition text-lg bg-white/50`}
                    placeholder="your@username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-500" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('password')}
                      onBlur={() => setActiveField(null)}
                      className={`w-full px-5 py-3.5 rounded-xl border ${activeField === 'password' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-300'} focus:outline-none transition text-lg bg-white/50 pr-12`}
                      placeholder="Enter your password"
                      required
                    />
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
                  <button
              onClick={() => setShowForgotPassword(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center gap-1 transition-colors duration-200 mx-auto cursor-pointer"
            >
              <HelpCircle className="h-4 w-4" /> Forgot Password?
            </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading || !formData.username || !formData.password}
                  className={`w-full px-6 py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${isLoading || !formData.username || !formData.password ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-lg'}`}
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

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.153-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.496 10-10 0-0.671-0.068-1.325-0.182-1.961h-9.818z"/>
                    </svg>
                    Google
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                    Facebook
                  </motion.button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-gray-50/70 px-8 py-6 border-t border-gray-200/50 text-center">
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
            </div>
          </motion.div>
        </div>
      </main>

      {/* Floating Help Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 right-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center"
        >
          <HelpCircle className="w-6 h-6" />
          <span className="sr-only">Help</span>
        </motion.button>
      </motion.div>

      {showForgotPassword && (
        <ForgotPasswordFlow onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default LoginPage;