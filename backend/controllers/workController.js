import Work from "../models/workModel.js";
import User from "../models/userModel.js"; // Needed to update user's 'works' array
import asyncHandler from "../middlewares/asyncHandler.js";
import Comment from "../models/commentModel.js";
import axios from 'axios';

// @desc    Create a new work
// @route   POST /api/works
// @access  Private
const createWork = asyncHandler(async (req, res) => {
  const { title, description, fileUrls, category, tags, summary } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error("Please provide title, description, and category.");
  }

  if (
    (category === "Art" || category === "Photography") &&
    (!fileUrls || fileUrls.length === 0)
  ) {
    res.status(400);
    throw new Error(
      "Art and Photography categories require at least one image."
    );
  }

  const newWork = await Work.create({
    user: req.user._id,
    title,
    description,
    fileUrls: fileUrls || [],
    category,
    summary,
    tags: tags || [],
  });

  if (newWork) {
    await User.findByIdAndUpdate(req.user._id, {
      $push: { works: newWork._id },
    });
    res.status(201).json(newWork);
  } else {
    res.status(400);
    throw new Error("Invalid work data provided.");
  }
});

// @desc    Get all works
// @route   GET /api/works
// @access  Public
const getWorks = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};

  const works = await Work.find(filter).populate("user", "name profileImage");
  res.status(200).json(works);
});

// @desc    Get single work by ID
// @route   GET /api/works/:id
// @access  Public
const getWorkById = asyncHandler(async (req, res) => {
  const work = await Work.findById(req.params.id).populate(
    "user",
    "name profileImage"
  );

  if (work) {
    // Optionally increment views here if you want to track it
    // work.views = work.views + 1;
    // await work.save();
    res.status(200).json(work);
  } else {
    res.status(404);
    throw new Error("Work not found.");
  }
});

// @desc    Update a work
// @route   PUT /api/works/:id
// @access  Private (Owner only)
const updateWork = asyncHandler(async (req, res) => {
  const { title, description, fileUrl, category, tags, summary } = req.body;
  const work = await Work.findById(req.params.id);

  if (work) {
    if (work.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this work.");
    }

    work.title = title || work.title;
    work.description = description || work.description;
    work.fileUrl = fileUrl || work.fileUrl;
    work.category = category || work.category;
    work.tags = tags || work.tags;
    work.summary = summary || work.summary;

    const updatedWork = await work.save();
    res.status(200).json(updatedWork);
  } else {
    res.status(404);
    throw new Error("Work not found.");
  }
});

// @desc    Delete a work
// @route   DELETE /api/works/:id
// @access  Private (Owner only)
const deleteWork = asyncHandler(async (req, res) => {
  const work = await Work.findById(req.params.id);

  if (work) {
    if (work.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this work.");
    }

    // **NEW LOGIC: Delete all comments associated with this work**
    await Comment.deleteMany({ work: work._id });

    await User.findByIdAndUpdate(work.user, {
      $pull: { works: work._id },
    });

    await work.deleteOne();
    res
      .status(200)
      .json({ message: "Work and associated comments removed successfully." });
  } else {
    res.status(404);
    throw new Error("Work not found.");
  }
});

const toggleLikeOnWork = asyncHandler(async (req, res) => {
  const workId = req.params.id; 
  const work = await Work.findById(req.params.id);

  if (!work) {
    res.status(404);
    throw new Error("Work not found");
  }

  const userId = req.user._id;
  const hasLiked = work.likes.includes(userId);

  if (hasLiked) {
    work.likes.pull(userId);
  } else {
    work.likes.push(userId);
  }

  await work.save();

  // Populate the user field before sending the update
  const updatedWork = await Work.findById(workId).populate(
    "user",
    "name profileImage"
  );

  // 👇 Emit a general 'workUpdated' event to ALL connected clients
  req.io.emit("workUpdated", updatedWork);

  console.log(`[Socket.IO] Emitted 'workUpdated' for work ID: ${workId}`);

  res.status(200).json(updatedWork);
});

const getMyWorks = asyncHandler(async (req, res) => {
  const works = await Work.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(works);
});
const getWorksByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const works = await Work.find({ user: userId }).sort({ createdAt: -1 });
  if (works) {
    res.status(200).json(works);
  } else {
    res.status(404);
    throw new Error("Works not found for this user.");
  }
});

const searchWorks = asyncHandler(async (req, res) => {
  const { keyword } = req.params;

  // Create a case-insensitive regular expression from the keyword
  const searchRegex = new RegExp(keyword, "i");

  // Find works where the title or description matches the keyword
  const works = await Work.find({
    $or: [
      { title: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
    ],
  }).populate("user", "name profileImage");

  if (works) {
    res.json(works);
  } else {
    res.status(404);
    throw new Error("No works found");
  }
});

const analyzeContentWithAI = asyncHandler(async (req, res) => {
  const { imageUrl, textContent } = req.body;

  if (!imageUrl && !textContent) {
    res.status(400);
    throw new Error('Image URL or text content is required.');
  }

  try {
    // Forward the request to the Python AI server
    const { data } = await axios.post(process.env.PYTHON_AI_API_URL, {
      imageUrl,
      textContent,
    });
    
    // Send the AI server's response back to the React client
    res.json(data);

  } catch (error) {
    console.error('Error calling Python AI service:', error.message);
    res.status(500);
    throw new Error('Failed to analyze content with AI.');
  }
});

const getWorkStats = asyncHandler(async (req, res) => {
  // Find all works by the current user
  const userWorks = await Work.find({ user: req.user._id });

  if (userWorks) {
    const totalWorks = userWorks.length;
    const totalLikes = userWorks.reduce(
      (sum, work) => sum + work.likes.length,
      0
    );
    const totalComments = userWorks.reduce(
      (sum, work) => sum + work.comments.length,
      0
    );
    const totalSaves = userWorks.reduce((sum, work) => sum + work.saves, 0);

    // Find the most liked work
    const mostLikedWork = userWorks.reduce(
      (max, work) => (work.likes.length > max.likes.length ? work : max),
      userWorks[0] || null
    );

    res.json({
      totalWorks,
      totalLikes,
      totalComments,
      totalSaves,
      mostLikedWork: mostLikedWork
        ? { title: mostLikedWork.title, likes: mostLikedWork.likes.length }
        : null,
    });
  } else {
    res.status(404);
    throw new Error("User works not found");
  }
});

export {
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
  analyzeContentWithAI as analyzeImageWithAI,
};
