/**
 * @fileoverview Course Service - Handles all course-related API calls
 */

import authorizedAxiosInstance from '../../utils/authorizedAxios';
import { API_ROOT } from '../../utils/constants';

/**
 * Retrieves all courses (Admin only)
 * @returns {Promise<Object>} Response data containing all courses
 * @throws {Error} If fetching courses fails
 */
const getAllCourses = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/courses`);
  return response.data;
};

/**
 * Retrieves a specific course by ID (Admin only)
 * @param {string} courseId - ID of the course to retrieve
 * @returns {Promise<Object>} Response data containing course details
 * @throws {Error} If fetching course fails
 */
const getCourseById = async (courseId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/courses/${courseId}`
  );
  return response.data;
};

/**
 * Creates a new course (Admin only)
 * @param {FormData} courseData - Course data including files (multipart/form-data)
 * @returns {Promise<Object>} Response data containing created course
 * @throws {Error} If course creation fails
 */
const createCourse = async (courseData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/courses`,
    courseData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Updates an existing course (Admin only)
 * @param {string} courseId - ID of the course to update
 * @param {FormData} courseData - Updated course data including files (multipart/form-data)
 * @returns {Promise<Object>} Response data containing updated course
 * @throws {Error} If course update fails
 */
const updateCourse = async (courseId, courseData) => {
  const response = await authorizedAxiosInstance.put(
    `${API_ROOT}/courses/${courseId}`,
    courseData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Deletes a course (Admin only)
 * @param {string} courseId - ID of the course to delete
 * @returns {Promise<Object>} Response data from the delete endpoint
 * @throws {Error} If course deletion fails
 */
const deleteCourse = async (courseId) => {
  return authorizedAxiosInstance.delete(`${API_ROOT}/courses/${courseId}`);
};

/**
 * Retrieves all public courses available for registration
 * @returns {Promise<Object>} Response data containing public courses
 * @throws {Error} If fetching public courses fails
 */
const getPublicCourses = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/public-courses`
  );
  return response.data;
};

/**
 * Registers the current user for a course
 * @param {string} courseId - ID of the course to register for
 * @returns {Promise<Object>} Response data from the registration endpoint
 * @throws {Error} If course registration fails
 */
const registerCourse = async (courseId) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/courses/${courseId}/register`
  );
  return response.data;
};

/**
 * Retrieves all courses the current user is enrolled in
 * @returns {Promise<Object>} Response data containing user's enrolled courses
 * @throws {Error} If fetching user courses fails
 */
const getMyCourses = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/my-courses`);
  return response.data;
};

/**
 * Retrieves video content for a specific course the user is enrolled in
 * @param {string} courseId - ID of the course to get video for
 * @returns {Promise<Object>} Response data containing course video details
 * @throws {Error} If fetching course video fails
 */
const getMyCourseVideo = async (courseId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/my-courses/${courseId}`
  );
  return response.data;
};

export const courseService = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getPublicCourses,
  registerCourse,
  getMyCourses,
  getMyCourseVideo,
};
