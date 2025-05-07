import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Home, School, GraduationCap, Lock, CreditCard, 
  FileText, Bell, Clock, Edit, Save, Camera, ChevronRight, Check, 
  Loader2, ArrowUp, Shield, Users, FileDown, BookOpen, Hash, Eye, EyeOff, Key,
  ChevronDown, ChevronUp, Settings, HelpCircle, LogOut, Plus, MoreVertical
} from 'lucide-react';
import axios from "axios"
import { jwtDecode } from 'jwt-decode';
import {  toast } from "react-toastify"
import { useNavigate } from "react-router-dom";
// Mock data
const loginHistory = [
  { id: 1, date: '2024-05-15', time: '14:30', device: 'iPhone 13', location: 'Boston, MA' },
  { id: 2, date: '2024-05-14', time: '09:15', device: 'MacBook Pro', location: 'Boston, MA' }
];

const paymentMethods = [
  { id: 1, type: 'visa', last4: '4242', expiry: '12/25' }
];

const academicPrograms = [
  { id: 1, name: 'Summer Intensive 2023', status: 'completed', reportAvailable: true },
  { id: 2, name: 'Winter Accelerator 2024', status: 'completed', reportAvailable: true },
  { id: 3, name: 'Year-Round Excellence 2024', status: 'current', reportAvailable: false }
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
    membership: 'ultimate-premium'
  };
};

const fetchSecurityQuestion = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    question: "What was the name of your first pet?",
    answer: "Fluffy",
    fallbackQuestions: [
      "What city were you born in?",
      "What's your mother's maiden name?",
      "What was your first car's model?"
    ]
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

const ProfileDashboard = () => {
  const navigate = useNavigate();
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
  const [securityAccess, setSecurityAccess] = useState({
    view: false,
    edit: false
  });
  const [isLoading, setIsLoading] = useState({
    profile: true,
    security: true,
    action: false
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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
        setSecurityData({
          ...security,
          tempQuestion: security.question,
          tempAnswer: security.answer
        });
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, profile: false, security: false }));
      }
    };

    loadData();
  }, []);

  // Handlers
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
      navigate("/auth/students-login"); // Redirect to login
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUploadingImage(false);
        navigate("/auth/students-login"); // Redirect on token expiry
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
        setProfileImage(response.data.imageUrl);
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

  const verifyPinForAction = async (action) => {
    if (pinInput.length !== 4) {
      setPinError('Please enter a 4-digit PIN');
      return;
    }

    try {
      setIsLoading(prev => ({ ...prev, action: true }));
      const isValid = await verifyPin(pinInput);
      
      if (isValid) {
        if (action === 'view') {
          setSecurityAccess({ view: true, edit: false });
        } else if (action === 'edit') {
          setSecurityAccess({ view: true, edit: true });
          toggleEditMode('securityQuestion');
        }
        setPinError('');
      } else {
        setPinError('Incorrect PIN. Please try again.');
      }
    } catch (error) {
      setPinError('Verification failed. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, action: false }));
    }
  };

  const saveSecurityQuestion = async () => {
    if (!securityData.tempQuestion || !securityData.tempAnswer) {
      setPinError('Question and answer are required');
      return;
    }

    try {
      setIsLoading(prev => ({ ...prev, action: true }));
      await updateSecurityQuestion(
        securityData.tempQuestion,
        securityData.tempAnswer,
        pinInput
      );
      
      setSecurityData(prev => ({
        ...prev,
        question: prev.tempQuestion,
        answer: prev.tempAnswer
      }));
      setSecurityAccess({ view: false, edit: false });
      setEditMode(prev => ({ ...prev, securityQuestion: false }));
      setPinInput('');
    } catch (error) {
      setPinError(error.message || 'Failed to update. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, action: false }));
    }
  };

  const saveProfileChanges = (section) => {
    setUserData({ ...tempData });
    setEditMode(prev => ({ ...prev, [section]: false }));
  };

  // UI Components
  const ProfileHeader = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-center">
        <User className="w-8 h-8 text-indigo-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          userData?.membership === 'ultimate-premium' 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {userData?.membership === 'ultimate-premium' ? 'Ultimate Premium' : 'Standard'}
        </span>
        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );

  const NavigationTabs = () => (
    <div className="flex border-b border-gray-200 mb-8">
      {['profile', 'security', 'academics', 'billing'].map((tab) => (
        <button
          key={tab}
          className={`px-4 py-3 text-sm font-medium relative ${
            activeTab === tab
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
          {activeTab === tab && (
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600" />
          )}
        </button>
      ))}
    </div>
  );

  const ProfileSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Card */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
            {!editMode.profile ? (
              <button 
                onClick={() => toggleEditMode('profile')}
                className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center text-sm"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={() => saveProfileChanges('profile')}
                  className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
                <button 
                  onClick={() => toggleEditMode('profile')}
                  className="text-sm border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <div className="relative mb-6 group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={`http://localhost:3500${profileImage}`}  alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-5xl font-bold text-indigo-600">
                    {userData?.name?.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              {uploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-all duration-200 transform group-hover:scale-110">
                <Camera className="w-5 h-5" />
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={tempData.username || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                  <input
                    type="text"
                    name="school"
                    value={tempData.school || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
            {!editMode.contact ? (
              <button 
                onClick={() => toggleEditMode('contact')}
                className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center text-sm"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={() => saveProfileChanges('contact')}
                  className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
                <button 
                  onClick={() => toggleEditMode('contact')}
                  className="text-sm border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={tempData.phone || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={tempData.address || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-indigo-50 p-3 rounded-lg mr-4">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
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
      </div>
    </div>
  );

  const SecuritySection = () => (
    <div className="space-y-6">
      {/* Security Question */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Security Question</h2>
          {securityAccess.view && !editMode.securityQuestion ? (
            <button 
              onClick={() => verifyPinForAction('edit')}
              className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center text-sm"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          ) : editMode.securityQuestion ? (
            <div className="flex space-x-2">
              <button 
                onClick={saveSecurityQuestion}
                disabled={isLoading.action}
                className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 disabled:opacity-70"
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
                  setSecurityAccess({ view: true, edit: false });
                }}
                className="text-sm border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          ) : null}
        </div>

        {!securityAccess.view ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Security Question</div>
              <div className="text-lg font-medium text-gray-800 tracking-wider">
                {securityData?.question.split('').map(() => '•').join('')}
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Enter your PIN to view</label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  value={pinInput}
                  onChange={handlePinChange}
                  placeholder="Enter 4-digit PIN"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              {pinError && (
                <div className="text-sm text-red-500">{pinError}</div>
              )}
              <button
                onClick={() => verifyPinForAction('view')}
                disabled={isLoading.action || pinInput.length !== 4}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium ${
                  !isLoading.action && pinInput.length === 4 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading.action ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Key className="w-5 h-5 mr-2" />
                )}
                Verify PIN to View
              </button>
            </div>
          </div>
        ) : editMode.securityQuestion ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Security Question</label>
              <select
                name="tempQuestion"
                value={securityData?.tempQuestion || ''}
                onChange={handleSecurityChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={securityData?.tempQuestion}>{securityData?.tempQuestion}</option>
                {securityData?.fallbackQuestions.map((q, i) => (
                  <option key={i} value={q}>{q}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Answer</label>
              <input
                type="text"
                name="tempAnswer"
                value={securityData?.tempAnswer || ''}
                onChange={handleSecurityChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Confirm your PIN to save changes</label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  value={pinInput}
                  onChange={handlePinChange}
                  placeholder="Enter 4-digit PIN"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Security Question</div>
              <div className="text-lg font-medium text-gray-800">{securityData?.question}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Answer</div>
              <div className="text-lg font-medium text-gray-800 tracking-wider">
                {securityData?.answer.split('').map(() => '•').join('')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password & Security */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Password & Security</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-indigo-600 mr-4" />
              <div>
                <div className="text-sm font-medium text-gray-800">Password</div>
                <div className="text-xs text-gray-500">Last changed 3 months ago</div>
              </div>
            </div>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
              Change
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-indigo-600 mr-4" />
              <div>
                <div className="text-sm font-medium text-gray-800">Email Notifications</div>
                <div className="text-xs text-gray-500">Manage your notification preferences</div>
              </div>
            </div>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Login Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Login Activity</h2>
        <div className="space-y-3">
          {loginHistory.map((login) => (
            <div key={login.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{login.device}</div>
                <div className="text-xs text-gray-500">{login.date} at {login.time} • {login.location}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AcademicsSection = () => (
    <div className="space-y-6">
      {/* Current Program */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Academic Program</h2>
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-bold text-gray-800 mb-1">Year-Round Excellence 2024</div>
              <div className="flex items-center">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full mr-2">
                  In Progress
                </span>
                <span className="text-xs text-gray-500">Started Jan 15, 2024</span>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
              View Details <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Academic Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Academic Reports</h2>
        <div className="space-y-3">
          {academicPrograms.filter(p => p.reportAvailable).map((program) => (
            <div key={program.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <div className="text-sm font-medium text-gray-800 mb-1">{program.name}</div>
                <div className="text-xs text-gray-500">Completed on {program.status === 'completed' ? 'Dec 15, 2023' : 'Mar 20, 2024'}</div>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                Download Report <FileDown className="w-4 h-4 ml-2" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const BillingSection = () => (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Payment Methods</h2>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
            Add Payment Method <Plus className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center mr-4">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">•••• •••• •••• {method.last4}</div>
                <div className="text-xs text-gray-500">Expires {method.expiry}</div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Billing History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mar 15, 2024</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Year-Round Excellence 2024</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1,200.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">View</a>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dec 10, 2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Winter Accelerator 2024</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$850.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">View</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
        
        {activeTab === 'profile' && <ProfileSection />}
        {activeTab === 'security' && <SecuritySection />}
        {activeTab === 'academics' && <AcademicsSection />}
        {activeTab === 'billing' && <BillingSection />}
      </div>
    </div>
  );
};

export default ProfileDashboard;