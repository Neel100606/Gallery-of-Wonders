import express from "express";
const router = express.Router();
import {
  createWork,
  getWorks,
  getWorkById,
  updateWork,
  deleteWork,
  toggleLikeOnWork,
  getMyWorks,
  getWorksByUserId,
  searchWorks,
  getWorkStats, 
} from "../controllers/workController.js";
// Import the comment controllers
import {
  addCommentToWork,
  getCommentsForWork,
} from "../controllers/commentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, createWork).get(getWorks);

router.get("/mine", authenticate, getMyWorks);
router
  .route("/:id")
  .get(getWorkById)
  .put(authenticate, updateWork)
  .delete(authenticate, deleteWork);

router.put("/:id/like", authenticate, toggleLikeOnWork);

// ADD THIS ROUTE for handling comments related to a specific work
router
  .route("/:workId/comments")
  .post(authenticate, addCommentToWork)
  .get(getCommentsForWork);
router.get("/user/:userId", getWorksByUserId);
router.get("/search/:keyword", searchWorks);
router.get("/stats/mine", authenticate, getWorkStats);


export default router;
