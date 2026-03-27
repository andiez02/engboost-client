/**
 * @fileoverview API Facade - Backward compatibility layer
 * Re-exports all service functions with their original API names
 * This allows existing components to continue working without changes
 */

import { userService } from '../services/user/user.service';
import { folderService } from '../services/folder/folder.service';
import { flashcardService } from '../services/flashcard/flashcard.service';
import { courseService } from '../services/course/course.service';
import { chatbotService } from '../services/chatbot/chatbot.service';
import { snaplangService } from '../services/snaplang/snaplang.service';

// User Service exports
export const registerUserAPI = userService.registerUser;
export const verifyUserAPI = userService.verifyUser;
export const refreshTokenAPI = userService.refreshToken;
export const getListUsersAPI = userService.getListUsers;
export const updateUserRoleAPI = userService.updateUserRole;
export const deleteUserAPI = userService.deleteUser;

// Folder Service exports
export const getFoldersAPI = folderService.getFolders;
export const getPublicFoldersAPI = folderService.getPublicFolders;
export const createFolderAPI = folderService.createFolder;
export const getFolderByIdAPI = folderService.getFolderById;
export const updateFolderAPI = folderService.updateFolder;
export const deleteFolderAPI = folderService.deleteFolder;
export const makeFolderPublicAPI = folderService.makeFolderPublic;

// Flashcard Service exports
export const getFlashcardsByFolderAPI = flashcardService.getFlashcardsByFolder;
export const getFlashcardByIdAPI = flashcardService.getFlashcardById;
export const deleteFlashcardAPI = flashcardService.deleteFlashcard;
export const saveFlashcardsToFolderAPI = flashcardService.saveFlashcardsToFolder;

// Course Service exports
export const getAllCoursesAPI = courseService.getAllCourses;
export const getCourseByIdAPI = courseService.getCourseById;
export const createCourseAPI = courseService.createCourse;
export const updateCourseAPI = courseService.updateCourse;
export const deleteCourseAPI = courseService.deleteCourse;
export const getPublicCoursesAPI = courseService.getPublicCourses;
export const registerCourseAPI = courseService.registerCourse;
export const getMyCoursesAPI = courseService.getMyCourses;
export const getMyCourseVideoAPI = courseService.getMyCourseVideo;

// Chatbot Service exports
export const sendChatMessageAPI = chatbotService.sendChatMessage;

// Snaplang Service exports
export const snaplangDetectAPI = snaplangService.snaplangDetect;
