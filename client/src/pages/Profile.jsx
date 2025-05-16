import { useState, useEffect, useRef } from 'react';
import { useUserContext } from '../context/UserContext';
import { 
  User, Mail, Phone, Home, School, GraduationCap, Lock, 
  Edit, Save, Camera, Check, Loader2, Shield, Eye, EyeOff, Key,
  Settings, LogOut, Award, Calendar, ClipboardCheck, FileSearch,
  FileDown, BookOpen, Hash, FileSignature, Star, ChevronDown, ChevronRight
} from 'lucide-react';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Mock data
const loginHistory = [
  { id: 1, date: '2024-05-15', time: '14:30', device: 'iPhone 13', location: 'Boston, MA', ip: '192.168.1.1', os: 'iOS 16' },
  { id: 2, date: '2024-05-14', time: '09:15', device: 'MacBook Pro', location: 'Boston, MA', ip: '192.168.1.2', os: 'macOS Ventura' }
];

const academicPrograms = [
  { id: 1, name: 'Summer Intensive 2023', status: 'completed', reportAvailable: true, completionDate: '2023-08-20', grade: 'A+' },
  { id: 2, name: 'Winter Accelerator 2024', status: 'completed', reportAvailable: true, completionDate: '2024-02-15', grade: 'A' },
  { id: 3, name: 'Year-Round Excellence 2024', status: 'current', reportAvailable: false, startDate: '2024-01-10', progress: 65 }
];

const testimonials = [
  { id: 1, content: "This platform helped me improve my grades significantly!", rating: 5, status: 'published' },
  { id: 2, content: "The teachers are very supportive and knowledgeable.", rating: 4, status: 'published' }
];

// Mock API functions
const fetchUserProfile = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    name: 'Alexandra Chen',
    username: 'alexchen2024',
    regNumber: 'STU2024001',
    school: 'Peak Performance Academy',
    grade: 'Grade 12',
    email: 'alex.chen@peak.edu',
    phone: '+1 (617) 555-0192',
    address: '450 Education Way, Boston, MA 02108',
    profileImage: null,
    joinDate: '2023-09-01',
    achievements: ['Honor Roll', 'Science Fair Winner', 'Math Olympiad Finalist']
  };
};

const fetchSecurityQuestion = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    question: "What was the name of your first pet?",
    answer: "Fluffy"
  };
};

const verifyPin = async (pin) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return pin === "1234";
};

const updateSecurityQuestion = async (question, answer, pin) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  if (pin !== "1234") throw new Error("Invalid PIN");
  return { success: true };
};

const submitTestimonial = async (content, rating) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: Math.floor(Math.random() * 1000),
    content,
    rating,
    status: 'pending'
  };
};

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  const fileInputRef = useRef(null);

  // State management
  const [userData, setUserData] = useState(null);
  const [securityData, setSecurityData] = useState(null);
  const [editMode, setEditMode] = useState({
    profile: false,
    contact: false,
    securityQuestion: false
  });
  const [tempData, setTempData] = useState({});
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [securityAccess, setSecurityAccess] = useState(false);
  const [isLoading, setIsLoading] = useState({
    profile: true,
    security: true,
    action: false
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState('');
  const [testimonialRating, setTestimonialRating] = useState(5);
  const [submittingTestimonial, setSubmittingTestimonial] = useState(false);
  const [expandedLogin, setExpandedLogin] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [profile, security] = await Promise.all([
          fetchUserProfile(),
          fetchSecurityQuestion()
        ]);
        
        setUserData(profile);
        setTempData(profile);
        setSecurityData(security);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(prev => ({ ...prev, profile: false, security: false }));
      }
    };

    loadData();
  }, []);

  // Handlers
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setUploadingImage(true);
  
    const formData = new FormData();
    formData.append("file", file);
  
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error('No authentication token found');
      setUploadingImage(false);
      navigate("/auth/students-login");
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem("token");
        setUploadingImage(false);
        navigate("/auth/students-login");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:3500/api/uploadProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        toast.success('Profile image uploaded successfully!');
        const updatedUser = { ...user, profile_image: response.data.imageUrl };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));     
      } else {
        toast.error('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error('An error occurred during upload.');
    } finally {
      setUploadingImage(false);
    }
  };

  const toggleEditMode = (section) => {
    setEditMode(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPinInput(value);
    if (value.length === 4) setPinError('');
  };

  const verifyPinForAction = async () => {
    if (pinInput.length !== 4) {
      setPinError('Please enter a 4-digit PIN');
      return;
    }

    try {
      setIsLoading(prev => ({ ...prev, action: true }));
      const isValid = await verifyPin(pinInput);
      
      if (isValid) {
        setSecurityAccess(true);
        toast.success("PIN verified successfully!");
        setPinInput('');
        setPinError('');
        setShowPin(false);
      } else {
        throw new Error("Invalid PIN");
      }
    } catch (error) {
      setPinError('Verification failed. Please try again.');
      toast.error("Invalid PIN. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, action: false }));
    }
  };

  const saveSecurityQuestion = async () => {
    if (!securityData.question || !securityData.answer) {
      setPinError('Question and answer are required');
      return;
    }

    try {
      setIsLoading(prev => ({ ...prev, action: true }));
      await updateSecurityQuestion(
        securityData.question,
        securityData.answer,
        pinInput
      );
      
      setSecurityAccess(false);
      setEditMode(prev => ({ ...prev, securityQuestion: false }));
      setPinInput('');
      toast.success("Security question updated successfully!");
    } catch (error) {
      setPinError(error.message || 'Failed to update. Please try again.');
      toast.error("Failed to update security question");
    } finally {
      setIsLoading(prev => ({ ...prev, action: false }));
    }
  };

  const saveProfileChanges = (section) => {
    setUserData({ ...tempData });
    setEditMode(prev => ({ ...prev, [section]: false }));
    toast.success("Profile updated successfully!");
  };

  const handleTestimonialSubmit = async () => {
    if (!newTestimonial.trim()) {
      toast.error("Please write your testimonial before submitting");
      return;
    }

    setSubmittingTestimonial(true);
    try {
      const result = await submitTestimonial(newTestimonial, testimonialRating);
      testimonials.unshift(result);
      setNewTestimonial('');
      setTestimonialRating(5);
      toast.success("Thank you for your testimonial! It's pending review.");
    } catch (error) {
      toast.error("Failed to submit testimonial. Please try again.");
    } finally {
      setSubmittingTestimonial(false);
    }
  };

  // UI Components
  const ProfileHeader = () => (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
    >
      <div className="flex items-center">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 mr-4">
          <User className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500">Welcome back, {userData?.name.split(' ')[0]}!</p>
        </div>
      </div>
      <button 
        className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
        onClick={() => setActiveTab('security')}
      >
        <Settings className="w-5 h-5 text-gray-600" />
      </button>
    </motion.div>
  );

  const NavigationTabs = () => {
    const tabs = [
      { id: 'profile', label: 'Profile', icon: <User size={18} /> },
      { id: 'security', label: 'Security', icon: <Shield size={18} /> },
      { id: 'academics', label: 'Academics', icon: <BookOpen size={18} /> },
      { id: 'testimonials', label: 'Feedback', icon: <FileSignature size={18} /> }
    ];

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex overflow-x-auto pb-2 mb-8 scrollbar-hide"
      >
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-3 text-sm font-medium flex items-center transition-all duration-200 rounded-lg ${
                activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  const ProfileSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Profile Card */}
      <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <User className="w-5 h-5 text-indigo-600 mr-2" />
              Profile
            </h2>
            {!editMode.profile ? (
              <button 
                onClick={() => toggleEditMode('profile')}
                className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center text-sm bg-indigo-50 px-3 py-1 rounded-lg"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={() => saveProfileChanges('profile')}
                  className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
                <button 
                  onClick={() => toggleEditMode('profile')}
                  className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <div className="relative mb-6 group cursor-pointer" onClick={handleImageClick}>
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden shadow-md">
                {user?.profile_image ? (
                  <img
                    src={`http://localhost:3500/${user.profile_image}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-5xl font-bold text-indigo-600">
                    {user.studentname?.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              {uploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              <motion.label 
                whileHover={{ scale: 1.1 }}
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
              >
                <Camera className="w-5 h-5" />
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                />
              </motion.label>
            </div>

            {editMode.profile ? (
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={tempData.name || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={tempData.username || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                  <input
                    type="text"
                    name="school"
                    value={tempData.school || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            ) : (
              <div className="w-full space-y-3 text-center">
                <h3 className="text-xl font-bold text-gray-800">{userData?.name}</h3>
                <div className="text-gray-600">@{userData?.username}</div>
                <div className="flex items-center justify-center text-gray-600">
                  <School className="w-4 h-4 text-indigo-600 mr-2" />
                  {userData?.school}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Member since {new Date(userData?.joinDate).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Mail className="w-5 h-5 text-indigo-600 mr-2" />
              Contact Information
            </h2>
            {!editMode.contact ? (
              <button 
                onClick={() => toggleEditMode('contact')}
                className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center text-sm bg-indigo-50 px-3 py-1 rounded-lg"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={() => saveProfileChanges('contact')}
                  className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
                <button 
                  onClick={() => toggleEditMode('contact')}
                  className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {editMode.contact ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={tempData.email || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={tempData.phone || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={tempData.address || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start">
                  <div className="bg-indigo-50 p-3 rounded-lg mr-4">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Email Address</div>
                    <div className="text-gray-800">{userData?.email}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-50 p-3 rounded-lg mr-4">
                    <Phone className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Phone Number</div>
                    <div className="text-gray-800">{userData?.phone}</div>
                  </div>
                </div>
                <div className="flex items-start md:col-span-2">
                  <div className="bg-indigo-50 p-3 rounded-lg mr-4">
                    <Home className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Address</div>
                    <div className="text-gray-800">{userData?.address}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 text-indigo-600 mr-2" />
            Academic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-indigo-50 p-3 rounded-lg mr-4">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Class/Grade</div>
                <div className="text-gray-800">{userData?.grade}</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-indigo-50 p-3 rounded-lg mr-4">
                <Hash className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Registration Number</div>
                <div className="text-gray-800">{userData?.regNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {userData?.achievements?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Award className="w-5 h-5 text-indigo-600 mr-2" />
              Achievements
            </h2>
            <div className="flex flex-wrap gap-2">
              {userData.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-100 text-indigo-700 text-sm font-medium"
                >
                  {achievement}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const SecuritySection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      {/* Security Vault */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
              <Lock className="w-5 h-5" />
            </div>
            Security Vault
          </h2>
          {securityAccess && !editMode.securityQuestion ? (
            <button 
              onClick={() => setEditMode(prev => ({ ...prev, securityQuestion: true }))}
              className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center text-sm bg-indigo-50 px-3 py-1 rounded-lg"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          ) : editMode.securityQuestion ? (
            <div className="flex space-x-2">
              <button 
                onClick={saveSecurityQuestion}
                disabled={isLoading.action}
                className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition-colors"
              >
                {isLoading.action ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                Save
              </button>
              <button 
                onClick={() => {
                  setEditMode(prev => ({ ...prev, securityQuestion: false }));
                }}
                className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : null}
        </div>

        {!securityAccess ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Security Question Locked</h3>
              <p className="text-sm text-gray-500 mb-4">Enter your PIN to view and edit your security question</p>
              
              <div className="max-w-xs mx-auto space-y-4">
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    value={pinInput}
                    onChange={handlePinChange}
                    placeholder="Enter 4-digit PIN"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-center tracking-widest font-mono"
                    maxLength={4}
                    autoFocus
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {pinError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {pinError}
                  </motion.div>
                )}
                <button
                  onClick={verifyPinForAction}
                  disabled={isLoading.action || pinInput.length !== 4}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    !isLoading.action && pinInput.length === 4 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading.action ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Key className="w-5 h-5 mr-2" />
                  )}
                  Unlock Security Vault
                </button>
              </div>
            </div>
          </motion.div>
        ) : editMode.securityQuestion ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Security Question</label>
                  <input
                    type="text"
                    name="question"
                    value={securityData?.question || ''}
                    onChange={handleSecurityChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                  <input
                    type="text"
                    name="answer"
                    value={securityData?.answer || ''}
                    onChange={handleSecurityChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm your PIN</label>
                  <div className="relative">
                    <input
                      type={showPin ? "text" : "password"}
                      value={pinInput}
                      onChange={handlePinChange}
                      placeholder="Enter 4-digit PIN"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-center tracking-widest font-mono"
                      maxLength={4}
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPin(!showPin)}
                    >
                      {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Security Question</h3>
                <div className="flex items-center text-sm text-indigo-600">
                  <Lock className="w-4 h-4 mr-1" />
                  Secured
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-1">Question</div>
                  <div className="text-lg font-medium text-gray-800">{securityData?.question}</div>
                </div>
                
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm relative">
                  <div className="text-sm font-medium text-gray-500 mb-1">Answer</div>
                  <div className="text-lg font-medium text-gray-800 tracking-wider">
                    {securityData?.answer.split('').map((char, i) => (
                      <span key={i} className="inline-block w-4 text-center">•</span>
                    ))}
                  </div>
                  <div className="absolute right-4 top-4 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setSecurityAccess(false)}
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center mx-auto"
              >
                <Lock className="w-4 h-4 mr-1" />
                Lock Security Vault
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Password & Security */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
            <Key className="w-5 h-5" />
          </div>
          Account Security
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-2 rounded-lg mr-4 text-indigo-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">Password</div>
                <div className="text-xs text-gray-500">Last changed 3 months ago</div>
              </div>
            </div>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center">
              Change <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-2 rounded-lg mr-4 text-indigo-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">Two-Factor Authentication</div>
                <div className="text-xs text-gray-500">Add an extra layer of security</div>
              </div>
            </div>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center">
              Enable <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Login Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
            <Calendar className="w-5 h-5" />
          </div>
          Recent Login Activity
        </h2>
        <div className="space-y-3">
          {loginHistory.map((login) => (
            <motion.div 
              key={login.id}
              whileHover={{ scale: 1.01 }}
              className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                expandedLogin === login.id 
                  ? 'bg-indigo-50 border-indigo-200' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => setExpandedLogin(expandedLogin === login.id ? null : login.id)}
            >
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  login.device.includes('iPhone') || login.device.includes('iPad') 
                    ? 'bg-blue-500' 
                    : login.device.includes('Mac') 
                      ? 'bg-purple-500' 
                      : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{login.device}</div>
                  <div className="text-xs text-gray-500">{login.date} at {login.time} • {login.location}</div>
                </div>
                {expandedLogin === login.id ? (
                  <ChevronDown className="w-5 h-5 text-gray-400 transform rotate-180" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <AnimatePresence>
                {expandedLogin === login.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-gray-500">IP Address</div>
                        <div className="text-gray-800 font-medium">{login.ip}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Operating System</div>
                        <div className="text-gray-800 font-medium">{login.os}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button className="text-xs text-red-500 hover:text-red-700">
                        Report suspicious activity
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const AcademicsSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      {/* Current Program */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 text-indigo-600 mr-2" />
          Current Academic Program
        </h2>
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-bold text-gray-800 mb-1">Year-Round Excellence 2024</div>
              <div className="flex items-center">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full mr-2">
                  In Progress
                </span>
                <span className="text-xs text-gray-500">Started {academicPrograms[2].startDate}</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{academicPrograms[2].progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full" 
                    style={{ width: `${academicPrograms[2].progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center mt-1">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Academic Reports */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileSearch className="w-5 h-5 text-indigo-600 mr-2" />
          Academic Reports
        </h2>
        <div className="space-y-3">
          {academicPrograms.filter(p => p.reportAvailable).map((program) => (
            <motion.div 
              key={program.id}
              whileHover={{ y: -2 }}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-gray-800 mb-1">{program.name}</div>
                <div className="text-xs text-gray-500">
                  Completed on {program.completionDate} • Grade: {program.grade}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  <FileSearch className="w-4 h-4 mr-1" /> Preview
                </button>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  <FileDown className="w-4 h-4 mr-1" /> Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming Assessments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
          Upcoming Assessments
        </h2>
        <div className="space-y-3">
          <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-800">Mathematics Midterm</div>
                <div className="text-xs text-gray-500">Due: May 25, 2024</div>
              </div>
              <button className="text-sm text-yellow-700 hover:text-yellow-900 flex items-center">
                <ClipboardCheck className="w-4 h-4 mr-1" /> Prepare
              </button>
            </div>
          </div>
          <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-800">Science Project</div>
                <div className="text-xs text-gray-500">Due: June 5, 2024</div>
              </div>
              <button className="text-sm text-blue-700 hover:text-blue-900 flex items-center">
                <ClipboardCheck className="w-4 h-4 mr-1" /> Prepare
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const TestimonialsSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      {/* Existing Testimonials */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileSignature className="w-5 h-5 text-indigo-600 mr-2" />
          Your Feedback
        </h2>
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.id}
              whileHover={{ y: -2 }}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4 text-indigo-600">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-sm font-medium text-gray-800">
                      {testimonial.status === 'published' ? 'Published' : 'Pending Review'}
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          fill={i < testimonial.rating ? "currentColor" : "none"}
                          className="w-4 h-4 text-yellow-400" 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">{testimonial.content}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Submit New Testimonial */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileSignature className="w-5 h-5 text-indigo-600 mr-2" />
          Share Your Experience
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setTestimonialRating(star)}
                  className={`p-1 rounded-md ${
                    star <= testimonialRating 
                      ? 'text-yellow-400 bg-yellow-50' 
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <Star fill={star <= testimonialRating ? "currentColor" : "none"} className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Testimonial</label>
            <textarea
              value={newTestimonial}
              onChange={(e) => setNewTestimonial(e.target.value)}
              placeholder="Share your experience with our platform..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              autoFocus
            />
          </div>
          <button
            onClick={handleTestimonialSubmit}
            disabled={submittingTestimonial || !newTestimonial.trim()}
            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              !submittingTestimonial && newTestimonial.trim()
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {submittingTestimonial ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <FileSignature className="w-5 h-5 mr-2" />
            )}
            Submit Testimonial
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading.profile || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <ProfileHeader />
        <NavigationTabs />
        
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && <ProfileSection key="profile" />}
          {activeTab === 'security' && <SecuritySection key="security" />}
          {activeTab === 'academics' && <AcademicsSection key="academics" />}
          {activeTab === 'testimonials' && <TestimonialsSection key="testimonials" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileDashboard;