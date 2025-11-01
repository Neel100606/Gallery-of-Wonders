import express from 'express';
const router = express.Router();
import {
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

// Routes for individual comment actions by commentId
router.route('/:commentId')
  .put(authenticate, updateComment)
  .delete(authenticate, deleteComment);

export default router;