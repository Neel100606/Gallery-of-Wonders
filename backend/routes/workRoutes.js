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
  analyzeImageWithAI,
  findSimilarWorks,
} from "../controllers/workController.js";
import {
  addCommentToWork,
  getCommentsForWork,
} from "../controllers/commentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, createWork).get(getWorks);
router.get("/mine", authenticate, getMyWorks);
router.get("/stats/mine", authenticate, getWorkStats);
router.get("/user/:userId", getWorksByUserId);
router.get("/search/:keyword", searchWorks);

router
  .route("/:id")
  .get(getWorkById)
  .put(authenticate, updateWork)
  .delete(authenticate, deleteWork);

router.put("/:id/like", authenticate, toggleLikeOnWork);

router
  .route("/:workId/comments")
  .post(authenticate, addCommentToWork)
  .get(getCommentsForWork);

router.post("/analyze-image", authenticate, analyzeImageWithAI);
router.get("/:id/similar", findSimilarWorks);

export default router;