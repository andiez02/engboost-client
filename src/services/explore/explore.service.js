import authorizedAxiosInstance from '../../utils/authorizedAxios';
import { API_ROOT } from '../../utils/constants';

const getExploreFolders = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/explore/folders`);
  return response.data;
};

const cloneFolder = async (folderId) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/explore/folders/${folderId}/clone`);
  return response.data;
};

export const exploreService = { getExploreFolders, cloneFolder };
