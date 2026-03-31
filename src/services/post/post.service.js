import authorizedAxiosInstance from '../../utils/authorizedAxios';
import axios from 'axios';
import { API_ROOT } from '../../utils/constants';

const getPosts = async (params = {}) => {
  // Feed is public — use plain axios (no auth required)
  const response = await axios.get(`${API_ROOT}/posts`, {
    params,
    withCredentials: true,
  });
  return response.data;
};

const likePost = async (postId) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/posts/${postId}/like`);
  return response.data;
};

const unlikePost = async (postId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/posts/${postId}/like`);
  return response.data;
};

const savePost = async (postId) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/posts/${postId}/save`);
  return response.data;
};

const createPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/posts`, data);
  return response.data;
};

const deletePost = async (postId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/posts/${postId}`);
  return response.data;
};

export const postService = {
  getPosts,
  likePost,
  unlikePost,
  savePost,
  createPost,
  deletePost,
};
