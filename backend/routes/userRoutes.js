import express from 'express';
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser,
}from '../controllers/userController.js';
import { authenticate,authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(createUser).get(authenticate, authorizeAdmin, getAllUsers);
router.post('/auth', loginUser);
router.post('/logout', logoutCurrentUser);

router
  .route('/profile')
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

router.route('/:id')
  .get(authenticate, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById)
  .delete(authenticate, authorizeAdmin, deleteUser);

export default router;