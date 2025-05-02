import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Home, School, GraduationCap, Lock, CreditCard, 
  FileText, Bell, Clock, Edit, Save, Camera, ChevronRight, Check, 
  Loader2, ArrowUp, Shield, Users, FileDown, BookOpen, Hash
} from 'lucide-react';

const ProfilePage = () => {
  const [editMode, setEditMode] = useState({
    core: false,
    contact: false,
    security: false
  });
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    regNumber: '',
    school: 'Peak Performance Academy',
    grade: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [tempData, setTempData] = useState({...userData});

  // Function to retrieve user details from localStorage
  const getUserDetails = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      return {
        username: storedUser.username || '',
        regNumber: storedUser.regNumber || '',
        name: storedUser.studentname || '',
        email: storedUser.email || '',
        phone: storedUser.phone || '',
        address: storedUser.address || '',
        grade: storedUser.grade || ""
      };
    }
    return {};
  };

  useEffect(() => {
    const userDetails = getUserDetails();
    const updatedData = {
      ...userData,
      ...userDetails
    };
  
    setUserData(updatedData);
    setTempData(updatedData);
  }, []);

  const academicPrograms = [
    { id: 1, name: 'Summer Intensive 2023', status: 'completed', reportAvailable: true },
    { id: 2, name: 'Winter Accelerator 2024', status: 'completed', reportAvailable: true },
    { id: 3, name: 'Year-Round Excellence 2024', status: 'current', reportAvailable: false }
  ];

  const paymentMethods = [
    { id: 1, type: 'visa', last4: '4242', expiry: '12/25' }
  ];

  const loginHistory = [
    { id: 1, date: '2024-05-15', time: '14:30', device: 'iPhone 13', location: 'Boston, MA' },
    { id: 2, date: '2024-05-14', time: '09:15', device: 'MacBook Pro', location: 'Boston, MA' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      // Simulate upload
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfileImage(event.target.result);
          setUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  };

  const toggleEditMode = (section) => {
    setEditMode(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    if (section === 'core' || section === 'contact') {
      setTempData({...userData});
    }
  };

  const handleSave = (section) => {
    setEditMode(prev => ({...prev, [section]: false}));
    if (section === 'core' || section === 'contact') {
      setUserData({...tempData});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-8 gap-2 sm:gap-0">
          <div className="flex items-center">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 mr-2 sm:mr-3" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Account</h1>
          </div>
          <span className="sm:ml-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full flex items-center">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Ultimate Premium
          </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Profile & Core Info */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center mb-3 sm:mb-4">
                <User className="w-5 h-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
              </div>
              
              <div className="flex flex-col items-center mb-4 sm:mb-6">
                <div className="relative mb-3 sm:mb-4 group">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-3xl sm:text-4xl font-bold text-indigo-600">
                        {(userData.name || 'N A').split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                      <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 sm:p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-all duration-200 transform group-hover:scale-110">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
                
                {editMode.core ? (
                  <div className="w-full space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={tempData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={tempData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">School</label>
                      <input
                        type="text"
                        name="school"
                        value={tempData.school}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Registration Number</label>
                      <input
                        type="text"
                        name="regNumber"
                        value={tempData.regNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Class/Grade</label>
                      <input
                        type="text"
                        name="grade"
                        value={tempData.grade}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button 
                        onClick={() => handleSave('core')}
                        className="flex items-center justify-center px-3 sm:px-4 py-1 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                      >
                        <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Save
                      </button>
                      <button 
                        onClick={() => toggleEditMode('core')}
                        className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-3 text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">{userData.name || 'Not provided'}</h3>
                    <div className="flex items-center justify-center text-gray-600 text-sm sm:text-base">
                      <span className="text-indigo-600 mr-1">@</span>
                      {userData.username || 'Not provided'}
                    </div>
                    <div className="flex items-center justify-center text-gray-600 text-sm sm:text-base">
                      <School className="w-4 h-4 text-indigo-600 mr-1" />
                      {userData.school || 'Not provided'}
                    </div>
                    <div className="flex items-center justify-center text-gray-600 text-sm sm:text-base">
                      <GraduationCap className="w-4 h-4 text-indigo-600 mr-1" />
                      {userData.grade || 'Not provided'}
                    </div>
                    <div className="flex items-center justify-center text-gray-600 text-sm sm:text-base">
                      <Hash className="w-4 h-4 text-indigo-600 mr-1" />
                      {userData.regNumber || 'Not provided'}
                    </div>
                    <button 
                      onClick={() => toggleEditMode('core')}
                      className="mt-3 sm:mt-4 flex items-center justify-center px-3 sm:px-4 py-1 sm:py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors text-sm sm:text-base"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center mb-3 sm:mb-4">
                <CreditCard className="w-5 h-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Payment Information</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {paymentMethods.map(method => (
                  <div key={method.id} className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-5 sm:w-10 sm:h-6 bg-blue-500 rounded flex items-center justify-center mr-2 sm:mr-3">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs sm:text-sm font-medium text-gray-700">•••• •••• •••• {method.last4}</div>
                      <div className="text-2xs sm:text-xs text-gray-500">Expires {method.expiry}</div>
                    </div>
                  </div>
                ))}
                
                <button className="w-full flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors text-xs sm:text-sm">
                  <span className="font-medium text-indigo-600">Payment History</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Other Sections */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-indigo-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                </div>
                {editMode.contact ? (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleSave('contact')}
                      className="flex items-center justify-center px-2 sm:px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs sm:text-sm"
                    >
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Save
                    </button>
                    <button 
                      onClick={() => toggleEditMode('contact')}
                      className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => toggleEditMode('contact')}
                    className="flex items-center justify-center px-2 sm:px-3 py-1 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors text-xs sm:text-sm"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Edit
                  </button>
                )}
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-indigo-600 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Email Address</div>
                    {editMode.contact ? (
                      <input
                        type="email"
                        name="email"
                        value={tempData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                    ) : (
                      <div className="text-gray-800 text-sm sm:text-base">{userData.email || 'Not provided'}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-indigo-600 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Phone Number</div>
                    {editMode.contact ? (
                      <input
                        type="tel"
                        name="phone"
                        value={tempData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                    ) : (
                      <div className="text-gray-800 text-sm sm:text-base">{userData.phone || 'Not provided'}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Home className="w-5 h-5 text-indigo-600 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Address</div>
                    {editMode.contact ? (
                      <textarea
                        name="address"
                        value={tempData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                    ) : (
                      <div className="text-gray-800 text-sm sm:text-base">{userData.address || 'Not provided'}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Academic Reports */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center mb-3 sm:mb-4">
                <BookOpen className="w-5 h-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Academic Reports</h2>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                {academicPrograms.map(program => (
                  <div key={program.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="mb-1 sm:mb-0">
                      <div className="font-medium text-gray-800 text-sm sm:text-base">{program.name}</div>
                      <div className="flex items-center mt-1">
                        <span className={`text-2xs sm:text-xs px-2 py-1 rounded-full ${program.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {program.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                    {program.reportAvailable ? (
                      <button className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors text-xs sm:text-sm">
                        <span className="font-medium mr-1 sm:mr-2">View Report</span>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    ) : (
                      <span className="text-xs sm:text-sm text-gray-500">Report coming soon</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Account Security */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-indigo-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Account Security</h2>
                </div>
                {editMode.security && (
                  <button 
                    onClick={() => toggleEditMode('security')}
                    className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {editMode.security ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-600">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-600">New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-600">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="pt-1 sm:pt-2">
                      <button 
                        onClick={() => {
                          toggleEditMode('security');
                        }}
                        className="flex items-center justify-center px-3 sm:px-4 py-1 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                      >
                        <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Update Password
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Lock className="w-5 h-5 text-indigo-600 mr-2 sm:mr-3" />
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-700">Password</div>
                          <div className="text-2xs sm:text-xs text-gray-500">Last changed 3 months ago</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleEditMode('security')}
                        className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Change
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Bell className="w-5 h-5 text-indigo-600 mr-2 sm:mr-3" />
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-700">Email Notifications</div>
                          <div className="text-2xs sm:text-xs text-gray-500">Manage your notification preferences</div>
                        </div>
                      </div>
                      <button className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                        Manage
                      </button>
                    </div>
                    
                    <div className="p-2 sm:p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center mb-1 sm:mb-2">
                        <Clock className="w-5 h-5 text-indigo-600 mr-2 sm:mr-3" />
                        <div className="text-xs sm:text-sm font-medium text-gray-700">Recent Login Activity</div>
                      </div>
                      <div className="space-y-2 sm:space-y-3 mt-1 sm:mt-2">
                        {loginHistory.map(login => (
                          <div key={login.id} className="flex items-center text-xs sm:text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                            <div className="flex-1">
                              <div className="text-gray-800">{login.device}</div>
                              <div className="text-gray-500 text-2xs sm:text-xs">{login.date} at {login.time} • {login.location}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Additional Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Guardians/Parents */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center mb-3 sm:mb-4">
                  <Users className="w-5 h-5 text-indigo-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Parents/Guardians</h2>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="font-medium text-gray-800 text-sm sm:text-base">Michael Chen</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">Father</div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      michael.chen@example.com
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      +1 (555) 987-6543
                    </div>
                  </div>
                  
                  <button className="w-full flex items-center justify-center text-indigo-600 hover:text-indigo-800 transition-colors text-xs sm:text-sm font-medium">
                    <span>Add Guardian</span>
                  </button>
                </div>
              </div>
              
              {/* Documents */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center mb-3 sm:mb-4">
                  <FileDown className="w-5 h-5 text-indigo-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-indigo-600 mr-2 sm:mr-3" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-700">Summer Intensive 2023 Certificate</div>
                        <div className="text-2xs sm:text-xs text-gray-500">PDF • 2.4 MB</div>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 transform rotate-90" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-indigo-600 mr-2 sm:mr-3" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-700">Winter Accelerator 2024 Invoice</div>
                        <div className="text-2xs sm:text-xs text-gray-500">PDF • 1.1 MB</div>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 transform rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;