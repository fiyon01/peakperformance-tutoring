import { useState, useEffect, useRef } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-toastify';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousUnreadRef = useRef(0);
  const previousCountRef = useRef(0);

  const transformNotification = (notification) => ({
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
  });

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        console.warn('Token expired');
        return;
      }

      const response = await axios.get('http://localhost:3500/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const transformed = response.data.map(transformNotification);
      const currentUnread = transformed.filter(n => !n.read).length;
      
      setNotifications(transformed);
      setLoading(false);

      // Show toast only if new unread notifications arrive
      if (currentUnread > previousUnreadRef.current) {
        const diff = currentUnread - previousUnreadRef.current;
        toast.info(`You have ${diff} new notification${diff > 1 ? 's' : ''}`);
      }

      previousUnreadRef.current = currentUnread;
      previousCountRef.current = transformed.length;

      return transformed;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to load notifications');
      }
      setLoading(false);
      throw error;
    }
  };

  const markAsRead = async (id) => {
    try {
      if (!id) {
        console.error('Notification ID is missing!');
        return;
      }
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3500/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      previousUnreadRef.current = Math.max(0, previousUnreadRef.current - 1);
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
      throw error;
    }
  };
  

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:3500/api/notifications/mark-all-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => prev.map(n => ({...n, read: true})));
      previousUnreadRef.current = 0;
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
      throw error;
    }
  };

  const archiveNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3500/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => {
        const archived = prev.find(n => n.id === id);
        const newList = prev.filter(n => n.id !== id);
        
        // Update unread count if archived notification was unread
        if (archived && !archived.read) {
          previousUnreadRef.current = Math.max(0, previousUnreadRef.current - 1);
        }
        
        return newList;
      });
      
      toast.success('Notification archived');
    } catch (error) {
      console.error('Error archiving notification:', error);
      toast.error('Failed to archive notification');
      throw error;
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  return {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    archiveNotification
  };
};

export default useNotifications;