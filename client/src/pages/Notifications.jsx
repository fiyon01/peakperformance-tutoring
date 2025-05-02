import { useState, useEffect } from 'react';
import { 
  Bell, ChevronRight, Check, Clock, Calendar, Shield, Megaphone, 
  FileText, ListChecks, Wallet, ChevronDown, ChevronUp,
  Filter, Archive, Loader2, Inbox, AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [markingAllRead, setMarkingAllRead] = useState(false);

  // Fetch notifications from database
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
  
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No authentication token found');
          return;
        }
  
        // Check if token is expired
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          toast.error('Session expired. Please log in again.');
          return;
        }
  
        const response = await axios.get('http://localhost:3500/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Debug: Log the API response
        console.log('API Response:', response.data.notifications);

        // Handle different response structures
                let notificationsData = [];
        if (Array.isArray(response.data)) {
          notificationsData = response.data;
        } else if (Array.isArray(response.data?.notifications?.[0])) {
          notificationsData = response.data.notifications[0];
        } else if (Array.isArray(response.data?.notifications)) {
          notificationsData = response.data.notifications;
        } else if (response.data?.data) {
          notificationsData = Array.isArray(response.data.data) ? response.data.data : [];
        }


        // Ensure all notifications have required fields
        const processedNotifications = notificationsData.map(notification => ({
          id: notification.id || Math.random().toString(36).substr(2, 9),
          type: notification.type || 'general',
          title: notification.title || 'New Notification',
          preview: notification.preview || notification.body?.substring(0, 50) || '',
          body: notification.body || '',
          timestamp: notification.timestamp || new Date().toISOString(),
          read: Boolean(notification.read),
          action: notification.action_type ? {
            type: notification.action_type,
            label: notification.action_label || 'View',
            url: notification.action_url,
            onClick: notification.action_onClick
          } : null
        }));
// Debug: Log the processed notifications
console.log('Processed Notifications:', processedNotifications);
        setNotifications(processedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error(
          error.response?.data?.message || 'Failed to load notifications'
        );
      } finally {
        setLoading(false);
      }
    };
  
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      await axios.patch(
        `http://localhost:3500/api/notifications/${id}/read`, 
        { read: true }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error(error.message || 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarkingAllRead(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      await axios.patch(
        'http://localhost:3500/api/notifications/mark-all-read', 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error(error.message || 'Failed to mark all notifications as read');
    } finally {
      setMarkingAllRead(false);
    }
  };

  const archiveNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      await axios.delete(
        `http://localhost:3500/api/notifications/${id}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification archived');
    } catch (error) {
      console.error('Error archiving notification:', error);
      toast.error(error.message || 'Failed to archive notification');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
    if (!notifications.find(n => n.id === id)?.read) {
      markAsRead(id);
    }
  };

  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    switch(type) {
      case 'program': return <Calendar className={`${iconClass} text-indigo-500`} />;
      case 'security': return <Shield className={`${iconClass} text-red-500`} />;
      case 'academic': return <FileText className={`${iconClass} text-blue-500`} />;
      case 'announcement': return <Megaphone className={`${iconClass} text-amber-500`} />;
      case 'attendance': return <ListChecks className={`${iconClass} text-emerald-500`} />;
      case 'payment': return <Wallet className={`${iconClass} text-purple-500`} />;
      default: return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter);

  const formatTimeAgo = (dateString) => {
    try {
      if (!dateString) return 'Recently';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing as timestamp if ISO string fails
        const timestamp = parseInt(dateString);
        if (!isNaN(timestamp)) {
          date = new Date(timestamp);
        } else {
          return 'Recently';
        }
      }
      
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: (date.getFullYear() !== now.getFullYear()) ? 'numeric' : undefined
      });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Bell className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
              <p className="text-sm text-gray-500">
                {notifications.filter(n => !n.read).length} unread • {notifications.length} total
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
              >
                <option value="all">All Notifications</option>
                <option value="program">Programs</option>
                <option value="security">Security</option>
                <option value="academic">Academic</option>
                <option value="announcement">Announcements</option>
                <option value="attendance">Attendance</option>
                <option value="payment">Payments</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
            </div>
            
            <button 
              onClick={markAllAsRead}
              disabled={markingAllRead || notifications.every(n => n.read)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                markingAllRead || notifications.every(n => n.read)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
              }`}
            >
              {markingAllRead ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Mark all read</span>
            </button>
          </div>
        </div>
        
        {/* Notification Feed */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-gray-600">Loading your notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
              <div className="p-3 bg-gray-100 rounded-full">
                <Inbox className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
                <p className="text-gray-500 max-w-md">
                  {activeFilter === 'all' 
                    ? "You're all caught up! New notifications will appear here." 
                    : `No ${activeFilter} notifications found.`}
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredNotifications.map(notification => (
                <li 
                  key={notification.id}
                  className={`relative transition-colors ${!notification.read ? 'bg-indigo-50/50' : 'bg-white hover:bg-gray-50'}`}
                >
                  <div 
                    className={`p-4 cursor-pointer ${expandedId === notification.id ? 'bg-gray-50' : ''}`}
                    onClick={() => toggleExpand(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                        {!notification.read && (
                          <div className="absolute top-4 left-4 w-2 h-2 bg-indigo-600 rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <p className={`text-sm font-medium line-clamp-1 ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 whitespace-nowrap">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(notification.timestamp)}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {notification.preview}
                        </p>
                        
                        {expandedId === notification.id && (
                          <div className="mt-3 space-y-3">
                            <p className="text-sm text-gray-700">
                              {notification.body}
                            </p>
                            
                            {notification.action && (
                              <div className="mt-2">
                                {notification.action.type === 'link' ? (
                                  <a
                                    href={notification.action.url}
                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    onClick={(e) => e.stopPropagation()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {notification.action.label}
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </a>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      notification.action.onClick?.();
                                    }}
                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
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
                      
                      <div className="flex-shrink-0">
                        {expandedId === notification.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedId === notification.id && (
                    <div className="px-4 pb-3 flex justify-end gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                        disabled={notification.read}
                      >
                        <Check className="w-4 h-4" />
                        Mark read
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          archiveNotification(notification.id);
                        }}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                      >
                        <Archive className="w-4 h-4" />
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
          <div className="mt-4 md:hidden p-4 bg-amber-50 rounded-lg border border-amber-200 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">
                No {activeFilter} notifications found. Try another filter.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;