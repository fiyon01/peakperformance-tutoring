import { useState, useEffect } from 'react';
import { 
  Bell, ChevronRight, Check, X, Clock, Calendar, Shield, Megaphone, 
  FileText, ListChecks, Wallet, ChevronDown, ChevronUp, 
  Filter, Archive, Loader2, Inbox, MailOpen
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
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          toast.error('Session expired. Please log in again.');
          return;
        }
  
        const response = await axios.get('http://localhost:3500/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Log the notifications fetched from the API
        console.log('Fetched Notifications:', response.data.notifications);
    
        // Ensure all notifications have unique IDs and transform them
        const transformedData = response.data.notifications.map(notification => {
          if (!notification.id) {
            console.warn('Notification missing ID, generating fallback ID');
            notification.id = `fallback-id-${Math.random()}`;
          }
    
          return {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            preview: notification.preview,
            body: notification.body,
            timestamp: notification.timestamp,
            read: notification.read,
            action: notification.action_type ? {
              type: notification.action_type,
              label: notification.action_label,
              url: notification.action_url,
              onClick: notification.action_onClick ? 
                () => eval(notification.action_onClick) : null
            } : null
          };
        });
    
        // Log the transformed notifications
        console.log('Transformed Notifications:', transformedData);
    
        // Update the state with the transformed data
        setNotifications(transformedData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error(
          error.response?.data?.error || 'Failed to load notifications'
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
      if (!token) {
        throw new Error('No token found');
      }
  
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }
  
      const response = await axios.patch(
        `http://localhost:3500/api/notifications/${id}/read`, 
        { read: true }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status !== 200) {
        throw new Error('Failed to mark as read');
      }
  
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error(error.message || 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarkingAllRead(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }
  
      const response = await axios.patch(
        'http://localhost:3500/api/notifications/mark-all-read', 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status !== 200) {
        throw new Error('Failed to mark all as read');
      }
  
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
      if (!token) {
        throw new Error('No token found');
      }
  
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }
  
      const response = await axios.delete(
        `http://localhost:3500/api/notifications/${id}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status !== 200) {
        throw new Error('Failed to archive notification');
      }
  
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification archived');
    } catch (error) {
      console.error('Error archiving notification:', error);
      toast.error(error.message || 'Failed to archive notification');
    }
  };

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!notifications.find(n => n.id === id)?.read) {
        markAsRead(id);
      }
    }
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
              {filteredNotifications.map(notification => {
                if (!notification.id) {
                  console.error('Notification missing ID:', notification);
                  return null;
                }
                
                return (
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
                      <div className="px-4 pb-3 flex justify-end space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                          disabled={notification.read}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Mark as Read
                        </button>
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
                );
              })}
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