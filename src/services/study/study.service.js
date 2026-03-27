import authorizedAxiosInstance from '../../utils/authorizedAxios';
import { API_ROOT } from '../../utils/constants';

const getDueCards = async (folderId) => {
  const params = folderId ? { folderId } : {};
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/study`, { params });
  return response.data;
};

const reviewCard = async ({ cardId, rating }) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/study/review`, { cardId, rating });
  return response.data;
};

const getStats = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/study/stats`);
  return response.data;
};

export const studyService = { getDueCards, reviewCard, getStats };
