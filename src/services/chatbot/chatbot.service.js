/**
 * @fileoverview Chatbot Service - Handles chatbot-related API calls
 */

import authorizedAxiosInstance from '../../utils/authorizedAxios';
import { API_ROOT } from '../../utils/constants';

/**
 * Sends a chat message to the chatbot API
 * @param {string} message - The message to send to the chatbot
 * @returns {Promise<Object>} Response object from the chatbot API
 * @throws {Error} If sending the chat message fails
 */
const sendChatMessage = async (message) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/chatbot/chat`,
    {
      message: message,
    }
  );
  return response;
};

export const chatbotService = {
  sendChatMessage,
};
