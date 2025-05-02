import { useState } from 'react';
import {
  Bell,
  LogOut,
  HelpCircle,
  Settings,
  User,
  Search
} from 'lucide-react';

const Navbar = ({ studentName = '', profilePic, notificationCount = 0 }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getInitial = () => {
    return studentName && studentName.length > 0
      ? studentName.charAt(0).toUpperCase()
      : '?';
  };

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
            <span className="text-white font-bold text-xl">PP</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center w-full max-w-md mx-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-sm"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1 -translate-y-1">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-indigo-100 hover:border-indigo-300 transition-all"
                />
              ) : (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                  {getInitial()}
                </div>
              )}
              {studentName && (
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  {studentName}
                </span>
              )}
            </button>

            {/* Dropdown menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help & Support
                </a>
                <div className="border-t border-gray-100 my-1"></div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
