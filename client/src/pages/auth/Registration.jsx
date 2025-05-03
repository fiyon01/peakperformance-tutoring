import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Eye, EyeOff, School, ChevronDown, 
  Check, X, Loader2, Rocket, Shield, HelpCircle, BookOpen,
  Home, Phone, Users, Plus, Minus,ChevronRight
} from 'lucide-react';
import axios from "axios"
import Logo from "../../assets/icons8-graduation-cap-30.png";

import {useNavigate,Link} from "react-router-dom"
const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    gradeLevel: '',
    schoolName: '',
    address: '',
    parents: [
      { type: 'mother', name: '', phone: '', email: '', relationship: 'Mother' },
      { type: 'father', name: '', phone: '', email: '', relationship: 'Father' }
    ]
  });
 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeField, setActiveField] = useState(null);
  const formRef = useRef(null);
  const navigate = useNavigate()
  const gradeLevels = [
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
    "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12",
    "Form 1", "Form 2", "Form 3", "Form 4"
  ];

  const relationshipOptions = [
    { value: 'mother', label: 'Mother' },
    { value: 'father', label: 'Father' },
    { value: 'guardian', label: 'Guardian' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleParentChange = (index, field, value) => {
    const updatedParents = [...formData.parents];
    updatedParents[index][field] = value;
    setFormData(prev => ({
      ...prev,
      parents: updatedParents
    }));
  };

  const handleRelationshipChange = (index, value) => {
    const updatedParents = [...formData.parents];
    updatedParents[index].type = value;
    updatedParents[index].relationship = relationshipOptions.find(opt => opt.value === value)?.label || '';
    setFormData(prev => ({
      ...prev,
      parents: updatedParents
    }));
  };

  const addParent = () => {
    if (formData.parents.length < 3) {
      setFormData(prev => ({
        ...prev,
        parents: [...prev.parents, { type: 'guardian', name: '', phone: '', email: '', relationship: 'Guardian' }]
      }));
    }
  };

  const removeParent = (index) => {
    if (formData.parents.length > 1) {
      const updatedParents = [...formData.parents];
      updatedParents.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        parents: updatedParents
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.gradeLevel) newErrors.gradeLevel = 'Grade level is required';
    if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    // Validate parents
    formData.parents.forEach((parent, index) => {
      if (!parent.name.trim()) newErrors[`parentName${index}`] = 'Parent/guardian name is required';
      if (!parent.phone.trim()) newErrors[`parentPhone${index}`] = 'Phone number is required';
      if (parent.email && !/^\S+@\S+\.\S+$/.test(parent.email)) newErrors[`parentEmail${index}`] = 'Invalid email format';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
      return;
    }
    
    setIsSubmitting(true);
    try{
      const response = await axios.post("http://localhost:3500/api/signup", formData);
      console.log("Signup response:", response);

      if(response.status === 201){
        setIsSubmitting(false);
        setFormSubmitted(true);
        navigate("/auth/students-login")
      }else{
        console.log(response.error)
      }
    }catch(err){
       throw new Error(err)
    }finally{
      setIsSubmitting(false)
    }
   
    
    
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        gradeLevel: '',
        schoolName: '',
        address: '',
        parents: [
          { type: 'mother', name: '', phone: '', email: '', relationship: 'Mother' },
          { type: 'father', name: '', phone: '', email: '', relationship: 'Father' }
        ]
      });
      setFormSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans antialiased">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 - 50, 
              y: Math.random() * 100 - 50,
              rotate: Math.random() * 360,
              opacity: 0.1 + Math.random() * 0.2
            }}
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
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <div className="w-4 h-4 rounded-full bg-blue-300/30" />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="logo" className="w-6 h-6 " />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Peak Performance
              </span>
            </div>
            <Link
              to="/landingpage"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition flex items-center"
            >
              Back to Home
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          {formSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6 mb-10 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Registration Successful!</h3>
                  <p>
                    Welcome to Peak Performance! Your account has been created successfully.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100/50 backdrop-blur-sm"
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-100 to-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner"
                >
                  <img src={Logo} alt="logo" className="w-8 h-8 " />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Student Registration
                </h1>
                <p className="text-gray-600">
                  Join our learning platform and start your educational journey
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                {/* Student Information Section */}
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" /> Student Information
                  </h2>

                  {/* Full Name */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('fullName')}
                      onBlur={() => setActiveField(null)}
                      className={`w-full px-5 py-3 rounded-xl border ${errors.fullName ? 'border-red-500' : activeField === 'fullName' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-300'} focus:outline-none transition text-lg bg-white/50`}
                      placeholder="Your full name"
                    />
                    {errors.fullName && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> {errors.fullName}
                      </motion.p>
                    )}
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('email')}
                      onBlur={() => setActiveField(null)}
                      className={`w-full px-5 py-3 rounded-xl border ${errors.email ? 'border-red-500' : activeField === 'email' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-300'} focus:outline-none transition text-lg bg-white/50`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> {errors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('username')}
                      onBlur={() => setActiveField(null)}
                      className={`w-full px-5 py-3 rounded-xl border ${errors.username ? 'border-red-500' : activeField === 'username' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-300'} focus:outline-none transition text-lg bg-white/50`}
                      placeholder="Choose a username"
                    />
                    {errors.username && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> {errors.username}
                      </motion.p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => setActiveField('password')}
                        onBlur={() => setActiveField(null)}
                        className={`w-full px-5 py-3 rounded-xl border ${errors.password ? 'border-red-500' : activeField === 'password' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-300'} focus:outline-none transition text-lg bg-white/50 pr-12`}
                        placeholder="Create a password"
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
                    {errors.password ? (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> {errors.password}
                      </motion.p>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Shield className="w-4 h-4" /> Must be at least 8 characters
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onFocus={() => setActiveField('confirmPassword')}
                        onBlur={() => setActiveField(null)}
                        className={`w-full px-5 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : activeField === 'confirmPassword' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-300'} focus:outline-none transition text-lg bg-white/50 pr-12`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> {errors.confirmPassword}
                      </motion.p>
                    )}
                  </div>

                  {/* Grade Level */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Grade/Form Level</label>
                    <div className="relative">
                      <select
                        name="gradeLevel"
                        value={formData.gradeLevel}
                        onChange={handleInputChange}
                        onFocus={() => setActiveField('gradeLevel')}
                        onBlur={() => setActiveField(null)}
                        className={`w-full px-5 py-3 rounded-xl border ${errors.gradeLevel ? 'border-red-500' : activeField === 'gradeLevel' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-300'} focus:outline-none transition text-lg appearance-none bg-white/50`}
                      >
                        <option value="">Select your grade/form</option>
                        {gradeLevels.map((grade) => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                    {errors.gradeLevel && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> {errors.gradeLevel}
                      </motion.p>
                    )}
                  </div>

                  {/* School Name */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">School Name</label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('schoolName')}
                      onBlur={() => setActiveField(null)}
                      className={`w-full px-5 py-3 rounded-xl border ${errors.schoolName ? 'border-red-500' : activeField === 'schoolName' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-300'} focus:outline-none transition text-lg bg-white/50`}
                      placeholder="Your school name"
                    />
                    {errors.schoolName && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> {errors.schoolName}
                      </motion.p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <Home className="w-5 h-5 text-blue-500" /> Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      onFocus={() => setActiveField('address')}
                      onBlur={() => setActiveField(null)}
                      className={`w-full px-5 py-3 rounded-xl border ${errors.address ? 'border-red-500' : activeField === 'address' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-300'} focus:outline-none transition text-lg bg-white/50`}
                      placeholder="Your full address"
                    />
                    {errors.address && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> {errors.address}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Parent/Guardian Information */}
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" /> Parent/Guardian Information
                    </h2>
                    {formData.parents.length < 3 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addParent}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Add Guardian
                      </motion.button>
                    )}
                  </div>

                  {formData.parents.map((parent, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-5 space-y-4 relative">
                      {formData.parents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParent(index)}
                          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                      )}

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Relationship</label>
                        <div className="relative">
                          <select
                            value={parent.type}
                            onChange={(e) => handleRelationshipChange(index, e.target.value)}
                            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg bg-white appearance-none"
                          >
                            {relationshipOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">{parent.relationship} Name</label>
                        <input
                          type="text"
                          value={parent.name}
                          onChange={(e) => handleParentChange(index, 'name', e.target.value)}
                          className={`w-full px-5 py-3 rounded-xl border ${errors[`parentName${index}`] ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg bg-white`}
                          placeholder={`${parent.relationship}'s full name`}
                        />
                        {errors[`parentName${index}`] && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                          >
                            <X className="w-4 h-4" /> {errors[`parentName${index}`]}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={parent.phone}
                          onChange={(e) => handleParentChange(index, 'phone', e.target.value)}
                          className={`w-full px-5 py-3 rounded-xl border ${errors[`parentPhone${index}`] ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg bg-white`}
                          placeholder={`${parent.relationship}'s phone number`}
                        />
                        {errors[`parentPhone${index}`] && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                          >
                            <X className="w-4 h-4" /> {errors[`parentPhone${index}`]}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Email (Optional)</label>
                        <input
                          type="email"
                          value={parent.email}
                          onChange={(e) => handleParentChange(index, 'email', e.target.value)}
                          className={`w-full px-5 py-3 rounded-xl border ${errors[`parentEmail${index}`] ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg bg-white`}
                          placeholder={`${parent.relationship}'s email`}
                        />
                        {errors[`parentEmail${index}`] && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center gap-1"
                          >
                            <X className="w-4 h-4" /> {errors[`parentEmail${index}`]}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all mt-6 ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-lg'}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Register Now
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer Links */}
              <div className="mt-8 pt-6 border-t border-gray-200/50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link to="/auth/students-login" className="text-blue-600 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
                  <div className="flex items-center gap-4">
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm flex items-center">
                      <Shield className="w-4 h-4 mr-1.5" /> Privacy
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm flex items-center">
                      <BookOpen className="w-4 h-4 mr-1.5" /> Terms
                    </a>
                  </div>
                </div>
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
    </div>
  );
};

export default RegistrationPage;