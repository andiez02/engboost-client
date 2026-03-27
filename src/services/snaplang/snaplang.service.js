/**
 * @fileoverview Snaplang Service - Handles language detection API calls
 */

import authorizedAxiosInstance from '../../utils/authorizedAxios';
import { API_ROOT } from '../../utils/constants';

/**
 * Detects the language of the provided text data
 * @param {Object} data - The data object containing text for language detection
 * @returns {Promise<Object>} Response data containing detected language information
 * @throws {Error} If language detection fails
 */
const snaplangDetect = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/snaplang/detect`,
    data
  );
  return response.data;
};

export const snaplangService = {
  snaplangDetect,
};
