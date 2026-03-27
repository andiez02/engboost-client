/**
 * @fileoverview Flashcard Service - Handles all flashcard-related API calls
 */

import authorizedAxiosInstance from '../../utils/authorizedAxios';
import { API_ROOT } from '../../utils/constants';

/**
 * Retrieves all flashcards for a specific folder
 * @param {string} folderId - ID of the folder to retrieve flashcards from
 * @returns {Promise<Object>} Response data containing list of flashcards in the folder
 * @throws {Error} If fetching flashcards fails
 */
const getFlashcardsByFolder = async (folderId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/flashcards/folder/${folderId}`
  );
  return response.data;
};

/**
 * Retrieves a specific flashcard by its ID
 * @param {string} flashcardId - ID of the flashcard to retrieve
 * @returns {Promise<Object>} Response data containing flashcard details
 * @throws {Error} If fetching flashcard fails
 */
const getFlashcardById = async (flashcardId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/flashcards/${flashcardId}`
  );
  return response.data;
};

/**
 * Deletes a flashcard
 * @param {string} flashcardId - ID of the flashcard to delete
 * @returns {Promise<Object>} Response data from the delete endpoint
 * @throws {Error} If flashcard deletion fails
 */
const deleteFlashcard = async (flashcardId) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/flashcards/${flashcardId}`
  );
  return response.data;
};

/**
 * Saves flashcards to a folder
 * @param {Object} data - Flashcard save data
 * @param {string} data.folderId - ID of the folder to save flashcards to
 * @param {Array<Object>} data.flashcards - Array of flashcard objects to save
 * @returns {Promise<Object>} Response data containing saved flashcards details
 * @throws {Error} If saving flashcards fails
 */
const saveFlashcardsToFolder = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/flashcards/save-to-folder`,
    data
  );
  return response.data;
};

export const flashcardService = {
  getFlashcardsByFolder,
  getFlashcardById,
  deleteFlashcard,
  saveFlashcardsToFolder,
};
