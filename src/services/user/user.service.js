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
    `${API_ROOT}/users/refresh_token`
  );
  return response.data;
};

/**
 * Retrieves a paginated list of users (Admin only)
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [limit=10] - Number of users per page
 * @param {string} [search=''] - Search query to filter users
 * @returns {Promise<Object>} Response data containing users list and pagination info
 * @throws {Error} If fetching users fails
 */
const getListUsers = async (page = 1, limit = 10, search = '') => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
    });

    if (search) {
      queryParams.append('search', search);
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

export const userService = {
  registerUser,
  verifyUser,
  refreshToken,
  getListUsers,
  updateUserRole,
  deleteUser,
};
