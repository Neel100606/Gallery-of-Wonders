import express from 'express';
const router = express.Router();
import {
  createCollection,
  getMyCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addWorkToCollection,
  removeWorkFromCollection,
  getCollectionsByUserId,
} from '../controllers/collectionController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

router.route('/')
  .post(authenticate, createCollection);

router.get('/mine', authenticate, getMyCollections);
router.get('/user/:userId', getCollectionsByUserId);

router.route('/:id')
  .get(getCollectionById)
  .put(authenticate, updateCollection)
  .delete(authenticate, deleteCollection);

router.put('/:id/add-work', authenticate, addWorkToCollection);
router.put('/:id/remove-work', authenticate, removeWorkFromCollection);

export default router;