import { useState, useEffect, useCallback } from 'react';
import { getNotificationsAPI, markNotificationAsReadAPI, markAllNotificationsAsReadAPI } from '../apis';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/user/userSlice';

export const useNotifications = (pollingInterval = 60000) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Use redux to check if user is logged in
  const currentUser = useSelector(selectCurrentUser);

  const fetchNotifications = useCallback(async (showLoading = false) => {
    if (!currentUser) return;
    
    try {
      if (showLoading) setLoading(true);
      const res = await getNotificationsAPI();
      if (res?.success) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [currentUser]);

  // Initial fetch and setup polling
  useEffect(() => {
    fetchNotifications(true);

    if (currentUser) {
      const intervalId = setInterval(() => fetchNotifications(false), pollingInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchNotifications, pollingInterval, currentUser]);

  const markAsRead = async (id) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      await markNotificationAsReadAPI(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Revert optimism if needed (fetch original)
      fetchNotifications(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Optimistic upate
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);

      await markAllNotificationsAsReadAPI();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      fetchNotifications(false);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};

export default useNotifications;
