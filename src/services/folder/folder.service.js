/**
 * @fileoverview Folder Service - Handles all folder-related API calls
 */

import authorizedAxiosInstance from '../../utils/authorizedAxios';
import { API_ROOT } from '../../utils/constants';

/**
 * Retrieves all folders for the authenticated user
 * @returns {Promise<Object>} Response data containing list of user's folders
 * @throws {Error} If fetching folders fails
 */
const getFolders = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/folders`);
  return response.data;
};

/**
 * Retrieves all public folders
 * @returns {Promise<Object>} Response data containing list of public folders
 * @throws {Error} If fetching public folders fails
 */
const getPublicFolders = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/folders/public`
  );
  return response.data;
};

/**
 * Retrieves a specific folder by its ID
 * @param {string} folderId - ID of the folder to retrieve
 * @returns {Promise<Object>} Response data containing folder details
 * @throws {Error} If fetching folder fails
 */
const getFolderById = async (folderId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/folders/${folderId}`
  );
  return response.data;
};

/**
 * Creates a new folder
 * @param {Object} data - Folder creation data
 * @param {string} data.name - Name of the folder
 * @param {string} [data.description] - Optional description of the folder
 * @returns {Promise<Object>} Response data containing created folder details
 * @throws {Error} If folder creation fails
 */
const createFolder = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/folders`,
    data
  );
  return response.data;
};

/**
 * Updates an existing folder
 * @param {string} folderId - ID of the folder to update
 * @param {Object} data - Folder update data
 * @param {string} [data.name] - Updated name of the folder
 * @param {string} [data.description] - Updated description of the folder
 * @returns {Promise<Object>} Response data containing updated folder details
 * @throws {Error} If folder update fails
 */
const updateFolder = async (folderId, data) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/folders/${folderId}`,
    data
  );
  return response.data;
};

/**
 * Deletes a folder
 * @param {string} folderId - ID of the folder to delete
 * @returns {Promise<Object>} Response data from the delete endpoint
 * @throws {Error} If folder deletion fails
 */
const deleteFolder = async (folderId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/folders/${folderId}`
  );
  return response.data;
};

/**
 * Makes a folder public
 * @param {string} folderId - ID of the folder to make public
 * @returns {Promise<Object>} Response data containing updated folder details
 * @throws {Error} If making folder public fails
 */
const makeFolderPublic = async (folderId) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/folders/${folderId}/make-public`
  );
  return response.data;
};

export const folderService = {
  getFolders,
  getPublicFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
  makeFolderPublic,
};
