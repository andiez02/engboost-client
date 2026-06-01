import authorizedAxiosInstance from '../../utils/authorizedAxios';
import { API_ROOT } from '../../utils/constants';

const BASE = `${API_ROOT}/admin/folders`;

const listPublicFolders = async () => {
  const response = await authorizedAxiosInstance.get(BASE);
  return response.data;
};

const createPublicFolder = async (data) => {
  const response = await authorizedAxiosInstance.post(BASE, data);
  return response.data;
};
const updatePublicFolder = async (folderId, data) => {
  const response = await authorizedAxiosInstance.put(`${BASE}/${folderId}`, data);
  return response.data;
};

const deletePublicFolder = async (folderId) => {
  const response = await authorizedAxiosInstance.delete(`${BASE}/${folderId}`);
  return response.data;
};

const getFolderFlashcards = async (folderId) => {
  const response = await authorizedAxiosInstance.get(`${BASE}/${folderId}/flashcards`);
  return response.data;
};

const addFlashcard = async (folderId, data) => {
  const response = await authorizedAxiosInstance.post(`${BASE}/${folderId}/flashcards`, data);
  return response.data;
};

const deleteFlashcard = async (folderId, flashcardId) => {
  const response = await authorizedAxiosInstance.delete(`${BASE}/${folderId}/flashcards/${flashcardId}`);
  return response.data;
};

const listCommunityFolders = async () => {
  const response = await authorizedAxiosInstance.get(`${BASE}/community`);
  return response.data;
};

const createCommunityFolder = async (data) => {
  const response = await authorizedAxiosInstance.post(`${BASE}/community`, data);
  return response.data;
};

const getCommunityFolderFlashcards = async (folderId) => {
  const response = await authorizedAxiosInstance.get(`${BASE}/community/${folderId}/flashcards`);
  return response.data;
};

const addCommunityFlashcard = async (folderId, data) => {
  const response = await authorizedAxiosInstance.post(`${BASE}/community/${folderId}/flashcards`, data);
  return response.data;
};

const deleteCommunityFlashcard = async (folderId, flashcardId) => {
  const response = await authorizedAxiosInstance.delete(`${BASE}/community/${folderId}/flashcards/${flashcardId}`);
  return response.data;
};

const updateCommunityFolder = async (folderId, data) => {
  const response = await authorizedAxiosInstance.put(`${BASE}/community/${folderId}`, data);
  return response.data;
};

const deleteCommunityFolder = async (folderId) => {
  const response = await authorizedAxiosInstance.delete(`${BASE}/community/${folderId}`);
  return response.data;
};

const listAllFlashcards = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await authorizedAxiosInstance.get(`${BASE}/flashcards?${query}`);
  return response.data;
};

const deleteAnyFlashcard = async (flashcardId) => {
  const response = await authorizedAxiosInstance.delete(`${BASE}/flashcards/${flashcardId}`);
  return response.data;
};

export const adminFolderService = {
  listPublicFolders,
  createPublicFolder,
  updatePublicFolder,
  deletePublicFolder,
  getFolderFlashcards,
  addFlashcard,
  deleteFlashcard,
  listCommunityFolders,
  createCommunityFolder,
  getCommunityFolderFlashcards,
  addCommunityFlashcard,
  deleteCommunityFlashcard,
  updateCommunityFolder,
  deleteCommunityFolder,
  listAllFlashcards,
  deleteAnyFlashcard,
};
