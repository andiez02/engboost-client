import authorizedAxiosInstance from '../../utils/authorizedAxios';
import { API_ROOT } from '../../utils/constants';

/**
 * Get all notifications for the current user
 * @returns {Promise<Object>} Response data
 */
const getNotifications = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/notifications`);
  return response.data;
};

/**
 * Mark a specific notification as read
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Response data
 */
const markAsRead = async (id) => {
  const response = await authorizedAxiosInstance.patch(`${API_ROOT}/notifications/${id}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Response data
 */
const markAllAsRead = async () => {
  const response = await authorizedAxiosInstance.patch(`${API_ROOT}/notifications/read-all`);
  return response.data;
};

export const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
