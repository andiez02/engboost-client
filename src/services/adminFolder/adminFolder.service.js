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

export const adminFolderService = {
  listPublicFolders,
  createPublicFolder,
  updatePublicFolder,
  deletePublicFolder,
  getFolderFlashcards,
};
