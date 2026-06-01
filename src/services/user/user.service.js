/**
 * @fileoverview User Service - Handles all user-related API calls
 */

import authorizedAxiosInstance from '../../utils/authorizedAxios';
import { API_ROOT } from '../../utils/constants';

/**
 * Registers a new user account
 * @param {Object} data - User registration data
 * @param {string} data.email - User's email address
 * @param {string} data.password - User's password
 * @param {string} data.username - User's username
 * @returns {Promise<Object>} Response data from the registration endpoint
 * @throws {Error} If registration fails
 */
const registerUser = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/users/register`,
    data
  );
  return response.data;
};

/**
 * Verifies a user account using verification token
 * @param {Object} data - Verification data
 * @param {string} data.token - Verification token sent to user's email
 * @returns {Promise<Object>} Response data from the verification endpoint
 * @throws {Error} If verification fails
 */
const verifyUser = async (data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/users/verify`,
    data
  );
  return response.data;
};

/**
 * Refreshes the user's authentication token
 * @returns {Promise<Object>} Response data containing new access token
 * @throws {Error} If token refresh fails
 */
const refreshToken = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/users/refresh-token`
  );
  return response.data;
};

/**
 * Retrieves a paginated list of users (Admin only)
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [limit=10] - Number of users per page
 * @param {string} [search=''] - Search query to filter users
 * @param {Object} [filters={}] - Additional filters
 * @param {'ALL'|'ADMIN'|'CLIENT'} [filters.role='ALL'] - Role filter
 * @param {'ALL'|'ACTIVE'|'INACTIVE'} [filters.status='ALL'] - Activation status filter
 * @param {number} [filters.minLevel=0] - Minimum level filter
 * @param {number} [filters.inactiveDays=0] - Inactive days filter
 * @param {'createdAt'|'level'|'xp'|'streak'|'lastStudyDate'} [filters.sortBy='createdAt'] - Sort field
 * @param {'asc'|'desc'} [filters.sortOrder='desc'] - Sort order
 * @returns {Promise<Object>} Response data containing users list and pagination info
 * @throws {Error} If fetching users fails
 */
const getListUsers = async (page = 1, limit = 10, search = '', filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
    });

    if (search) {
      queryParams.append('search', search);
    }
    if (filters.role && filters.role !== 'ALL') {
      queryParams.append('role', filters.role);
    }
    if (filters.status === 'ACTIVE') {
      queryParams.append('isActive', 'true');
    } else if (filters.status === 'INACTIVE') {
      queryParams.append('isActive', 'false');
    }
    if (filters.minLevel && Number(filters.minLevel) > 0) {
      queryParams.append('minLevel', String(filters.minLevel));
    }
    if (filters.inactiveDays && Number(filters.inactiveDays) > 0) {
      queryParams.append('inactiveDays', String(filters.inactiveDays));
    }
    if (filters.sortBy) {
      queryParams.append('sortBy', filters.sortBy);
    }
    if (filters.sortOrder) {
      queryParams.append('sortOrder', filters.sortOrder);
    }

    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/users/admin/users?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Updates a user's role (Admin only)
 * @param {string} userId - ID of the user to update
 * @param {string} role - New role to assign to the user
 * @returns {Promise<Object>} Response data from the update endpoint
 * @throws {Error} If role update fails
 */
const updateUserRole = async (userId, role) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/users/admin/users/${userId}/role`,
    {
      role,
    }
  );
  return response.data;
};

/**
 * Deletes a user account (Admin only)
 * @param {string} userId - ID of the user to delete
 * @returns {Promise<Object>} Response data from the delete endpoint
 * @throws {Error} If user deletion fails
 */
const deleteUser = async (userId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/users/admin/users/${userId}`
  );
  return response.data;
};

const exportUsersExcel = async (search = '', filters = {}) => {
  const queryParams = new URLSearchParams();
  if (search) queryParams.append('search', search);
  if (filters.role && filters.role !== 'ALL') queryParams.append('role', filters.role);
  if (filters.status === 'ACTIVE') queryParams.append('isActive', 'true');
  else if (filters.status === 'INACTIVE') queryParams.append('isActive', 'false');
  if (filters.minLevel && Number(filters.minLevel) > 0) queryParams.append('minLevel', String(filters.minLevel));
  if (filters.inactiveDays && Number(filters.inactiveDays) > 0) queryParams.append('inactiveDays', String(filters.inactiveDays));
  if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
  if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

  return await authorizedAxiosInstance.get(
    `${API_ROOT}/users/admin/users/export?${queryParams.toString()}`,
    { responseType: 'blob' }
  );
};

const getUserAnalytics = async (range = 30) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/users/admin/users/analytics?range=${range}`
  );
  return response.data;
};

const getAchievements = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/users/achievements`);
  return response.data;
};

const getMe = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/users/me`);
  return response.data;
};

export const userService = {
  registerUser,
  verifyUser,
  refreshToken,
  getListUsers,
  updateUserRole,
  deleteUser,
  exportUsersExcel,
  getUserAnalytics,
  getAchievements,
  getMe,
};
