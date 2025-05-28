import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Calendar, Target, Clock, BookOpen, BarChart2, Mail, MapPin,
  HelpCircle, User, ChevronLeft, ChevronRight, X, Bell, Rocket, 
  ClipboardCheck, TrendingUp, CreditCard
} from 'lucide-react';

const Sidebar = ({ isEnrolled, hasVenue, mobileOpen, setMobileOpen, isOpen, toggleSidebar, currentPage, setCurrentPage }) => {
  const [expanded, setExpanded] = useState(isOpen);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeItem, setActiveItem] = useState('Dashboard Home');
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setExpanded(false);
      } else {
        setExpanded(isOpen);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const isMobile = windowWidth < 768;

  const navItems = [
    { name: 'Dashboard Home', icon: <Home className="w-5 h-5" />, alwaysVisible: true },
    { name: 'Assignments Hub', icon: <ClipboardCheck className="w-5 h-5" />, visibleWhen: isEnrolled },
    { name: 'My Timetable', icon: <Calendar className="w-5 h-5" />, alwaysVisible: true },
    { name: 'Focused Sessions', icon: <Clock className="w-5 h-5" />, alwaysVisible: true },
    { name: 'Learning Resources', icon: <BookOpen className="w-5 h-5" />, visibleWhen: isEnrolled },
    { name: 'Attendance', icon: <BarChart2 className="w-5 h-5" />, visibleWhen: isEnrolled },
    { name: 'Notifications', icon: <Bell className="w-5 h-5" />, alwaysVisible: true },
    { name: 'Programme Communication', icon: <Mail className="w-5 h-5" />, highlightWhen: !isEnrolled },
    { name: 'Upcoming Programmes', icon: <Rocket className="w-5 h-5" />, alwaysVisible: true },
    { name: 'Goals', icon: <Target className="w-5 h-5" />, alwaysVisible: true },
    { name: 'Personal Timetable', icon: <Clock className="w-5 h-5" />, alwaysVisible: true },
    { name: 'Venue & Logistics', icon: <MapPin className="w-5 h-5" />, visibleWhen: hasVenue },
    { name: 'Support', icon: <HelpCircle className="w-5 h-5" />, alwaysVisible: true },
    { name: 'My Account', icon: <User className="w-5 h-5" />, alwaysVisible: true },
  ];

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    setCurrentPage(itemName.toLowerCase().replace(/\s+/g, '-'));
    if (isMobile) setMobileOpen(false);
    navigate(`/dashboard/${itemName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const renderLogo = () => (
    <div className={`flex items-center ${expanded ? 'justify-start px-4' : 'justify-center'} py-4 border-b border-gray-200`}>
      <div className="flex items-center space-x-2">
        <TrendingUp className="w-8 h-8 text-indigo-600" />
        {expanded && (
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Peak Performance
          </span>
        )}
      </div>
    </div>
  );

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {renderLogo()}
      <div className="flex-1 overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => {
            if (!item.alwaysVisible && !item.visibleWhen) return null;
            return (
              <button
                key={item.name}
                onClick={() => handleItemClick(item.name)}
                className={`group flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200
                  ${activeItem === item.name ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-500' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                  ${item.highlightWhen ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : ''}
                  ${expanded ? 'justify-start' : 'justify-center'}`}
              >
                <span className={`${activeItem === item.name ? 'text-indigo-600' : 'text-gray-500'} ${item.highlightWhen ? 'text-yellow-600' : ''}`}>
                  {item.icon}
                </span>
                {expanded && (
                  <span className={`ml-3 text-sm font-medium ${item.highlightWhen ? 'font-semibold' : ''}`}>
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="px-2 py-4 border-t border-gray-200">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          {expanded ? (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
              onClick={() => setMobileOpen(false)}
            ></div>
            <div className="fixed inset-y-0 left-0 flex max-w-xs w-full">
              <div className="relative flex-1 flex flex-col w-64 bg-white shadow-xl">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>
                <div className="flex-1 h-0 overflow-y-auto">
                  {renderSidebarContent()}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`hidden md:flex md:flex-shrink-0 transition-all duration-300 ease-in-out fixed inset-y-0 z-30 bg-white ${expanded ? 'w-64' : 'w-20'} border-r border-gray-200`}>
      {renderSidebarContent()}
    </div>
  );
};

export default Sidebar;