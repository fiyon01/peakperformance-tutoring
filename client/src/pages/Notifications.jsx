import { useState, useEffect } from 'react';
import { 
  Bell,ChevronRight, BellOff, Check, X, Clock, Calendar, Shield, Megaphone, 
  FileText, ListChecks, Wallet, ChevronDown, ChevronUp, 
  Filter, Archive, Loader2, Inbox, MailOpen
} from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [markingAllRead, setMarkingAllRead] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'program',
          title: 'Summer Intensive 2024 Registration Confirmed',
          preview: 'Your registration for the Summer Intensive 2024 programme has been successfully processed.',
          body: 'We are excited to have you join us for the Summer Intensive 2024 programme starting on June 15. Your class schedule and materials will be available one week before the start date. Please check your dashboard for updates.',
          timestamp: '2024-05-20T09:30:00',
          read: false,
          action: {
            type: 'link',
            label: 'View Programme Details',
            url: '/programs/summer-intensive-2024'
          }
        },
        {
          id: 2,
          type: 'security',
          title: 'New Login Detected',
          preview: 'A login was detected from a new device in Boston, MA.',
          body: 'A successful login occurred on May 19 at 14:30 from an iPhone 13 in Boston, MA. If this was not you, please secure your account immediately.',
          timestamp: '2024-05-19T14:30:00',
          read: false,
          action: {
            type: 'button',
            label: 'Review Account Activity',
            onClick: () => console.log('Review activity')
          }
        },
        {
          id: 3,
          type: 'academic',
          title: 'Winter Accelerator Report Available',
          preview: 'Your academic performance report is now available for review.',
          body: 'Your detailed academic performance report for the Winter Accelerator 2024 programme is now available. This includes your assessment scores, tutor feedback, and recommendations for future programmes.',
          timestamp: '2024-05-18T11:15:00',
          read: true,
          action: {
            type: 'link',
            label: 'View Full Report',
            url: '/reports/winter-accelerator-2024'
          }
        },
        {
          id: 4,
          type: 'announcement',
          title: 'System Maintenance Scheduled',
          preview: 'Planned maintenance this weekend may cause temporary service interruptions.',
          body: 'To improve performance, we will be performing system maintenance from Saturday, May 25 at 10:00 PM to Sunday, May 26 at 2:00 AM EST. During this time, you may experience temporary interruptions in service. We apologize for any inconvenience.',
          timestamp: '2024-05-17T16:45:00',
          read: true,
          action: null
        },
        {
          id: 5,
          type: 'attendance',
          title: 'Attendance Recorded for Today',
          preview: 'Your attendance has been recorded for the May 16 session.',
          body: 'Your attendance for the May 16 session of the Year-Round Excellence programme has been recorded. You can view your attendance history at any time in your dashboard.',
          timestamp: '2024-05-16T18:20:00',
          read: true,
          action: {
            type: 'link',
            label: 'View Attendance History',
            url: '/attendance'
          }
        },
        {
          id: 6,
          type: 'payment',
          title: 'Payment Due Reminder',
          preview: 'Payment for Summer Intensive 2024 is due in 3 days.',
          body: 'A payment of $1,250 for the Summer Intensive 2024 programme is due by May 23. Please ensure your payment method is up to date to avoid any registration issues.',
          timestamp: '2024-05-15T08:00:00',
          read: false,
          action: {
            type: 'link',
            label: 'Make Payment',
            url: '/payments'
          }
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  const markAllAsRead = () => {
    setMarkingAllRead(true);
    setTimeout(() => {
      setNotifications(prev => prev.map(n => ({...n, read: true})));
      setMarkingAllRead(false);
    }, 800);
  };

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      markAsRead(id);
    }
  };

  const archiveNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'program': return <Calendar className="w-5 h-5 text-indigo-600" />;
      case 'security': return <Shield className="w-5 h-5 text-red-500" />;
      case 'academic': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'announcement': return <Megaphone className="w-5 h-5 text-yellow-600" />;
      case 'attendance': return <ListChecks className="w-5 h-5 text-green-600" />;
      case 'payment': return <Wallet className="w-5 h-5 text-purple-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Bell className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
            <span className="ml-3 bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded-full">
              {notifications.filter(n => !n.read).length} unread
            </span>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={markAllAsRead}
              disabled={markingAllRead || notifications.every(n => n.read)}
              className={`flex items-center px-4 py-2 rounded-md ${markingAllRead || notifications.every(n => n.read) 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {markingAllRead ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Mark All as Read
            </button>
            
            <div className="relative">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Notifications</option>
                <option value="program">Programmes</option>
                <option value="security">Security</option>
                <option value="academic">Academic</option>
                <option value="announcement">Announcements</option>
                <option value="attendance">Attendance</option>
                <option value="payment">Payments</option>
              </select>
              <Filter className="w-4 h-4 absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Notification Feed */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading your notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <Inbox className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
              <p className="text-gray-500 max-w-md">
                {activeFilter === 'all' 
                  ? "You're all caught up! New notifications will appear here." 
                  : `No ${activeFilter} notifications to display.`}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredNotifications.map(notification => (
                <li 
                  key={notification.id}
                  className={`relative ${!notification.read ? 'bg-indigo-50' : 'bg-white'}`}
                >
                  <div 
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${expandedId === notification.id ? 'bg-gray-50' : ''}`}
                    onClick={() => toggleExpand(notification.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5 mr-3">
                        {getNotificationIcon(notification.type)}
                        {!notification.read && (
                          <div className="absolute top-4 left-4 w-2 h-2 bg-indigo-600 rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 ml-2">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(notification.timestamp)}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.preview}
                        </p>
                        
                        {expandedId === notification.id && (
                          <div className="mt-3 text-sm text-gray-700">
                            <p>{notification.body}</p>
                            
                            {notification.action && (
                              <div className="mt-3">
                                {notification.action.type === 'link' ? (
                                  <a
                                    href={notification.action.url}
                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                                  >
                                    {notification.action.label}
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </a>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      notification.action.onClick();
                                    }}
                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                                  >
                                    {notification.action.label}
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-shrink-0 flex">
                        {expandedId === notification.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedId === notification.id && (
                    <div className="px-4 pb-3 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          archiveNotification(notification.id);
                        }}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                      >
                        <Archive className="w-4 h-4 mr-1" />
                        Archive
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Empty state for mobile filter */}
        {!loading && activeFilter !== 'all' && filteredNotifications.length === 0 && (
          <div className="mt-4 md:hidden p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
            <MailOpen className="w-5 h-5 mx-auto text-yellow-500 mb-2" />
            <p className="text-sm text-yellow-800">
              No {activeFilter} notifications to display. Try another filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;