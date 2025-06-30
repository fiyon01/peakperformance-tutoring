import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useState, useEffect } from 'react';
import { Bell, LogOut, HelpCircle, Settings, User, Menu, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = ({ studentName = '', profilePic, notificationCount = 0, onHamburgerClick }) => {
  const { user, logout } = useContext(UserContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setShowMobileSearch(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const getInitial = () => user.username?.charAt(0)?.toUpperCase() || '?';

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    toast.success('Logged out successfully!', {
      position: 'top-center',
      duration: 2000,
    });
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 ">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {isMobile && showMobileSearch && (
        <div className="absolute inset-0 bg-white z-20 flex items-center px-4 py-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <button 
              onClick={() => setShowMobileSearch(false)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Regular Navbar Content */}
      <div className={`flex items-center justify-between px-4 py-3 md:px-6 ${showMobileSearch && isMobile ? 'opacity-0' : ''}`}>
        {/* Left Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onHamburgerClick}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Middle Section - Search (Desktop) */}
        {!isMobile && (
          <div className="flex-1 mx-4">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm transition-all duration-200"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}

        {/* Right Section - Icons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Mobile Search Toggle */}
          {isMobile && !showMobileSearch && (
            <button
              onClick={() => setShowMobileSearch(true)}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {/* Notification Icon */}
          <button 
            className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full"
              aria-label="User profile"
            >
              {user?.profile_image ? (
                <img
                  src={`http://localhost:3500${user.profile_image}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-indigo-300"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full border-2 border-gray-200 hover:border-indigo-300">
                  {getInitial()}
                </div>
              )}
              {!isMobile && (
                <span className="text-sm font-medium text-gray-700">{user.username}</span>
              )}
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 divide-y divide-gray-100">
                <div className="py-1">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                    <User className="w-4 h-4 mr-3 text-gray-400" /> 
                    Profile
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                    <Settings className="w-4 h-4 mr-3 text-gray-400" /> 
                    Settings
                  </a>
                </div>
                <div className="py-1">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                    <HelpCircle className="w-4 h-4 mr-3 text-gray-400" /> 
                    Support
                  </a>
                </div>
                <div className="py-1">
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3 text-red-400" /> 
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;