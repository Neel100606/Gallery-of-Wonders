import Work from '../models/workModel.js';
import User from '../models/userModel.js'; // Needed to update user's 'works' array
import asyncHandler from '../middlewares/asyncHandler.js';

// @desc    Create a new work
// @route   POST /api/works
// @access  Private
const createWork = asyncHandler(async (req, res) => {
  const { title, description, fileUrl, category, tags } = req.body;

  if (!title || !description || !fileUrl || !category) {
    res.status(400);
    throw new Error('Please provide title, description, file URL, and category.');
  }

  // Ensure category is one of the allowed enums
  const allowedCategories = ['Art', 'Photography', 'Writing', 'Other'];
  if (!allowedCategories.includes(category)) {
    res.status(400);
    throw new Error(`Category must be one of: ${allowedCategories.join(', ')}`);
  }

  const newWork = await Work.create({
    user: req.user._id, // User ID comes from the authenticated user
    title,
    description,
    fileUrl,
    category,
    tags: tags || [], // Tags are optional
  });

  if (newWork) {
    // Also update the user's works array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { works: newWork._id },
    });

    res.status(201).json(newWork);
  } else {
    res.status(400);
    throw new Error('Invalid work data provided.');
  }
});

// @desc    Get all works
// @route   GET /api/works
// @access  Public
const getWorks = asyncHandler(async (req, res) => {
  const works = await Work.find({}).populate('user', 'name profileImage'); // Populate user info
  res.status(200).json(works);
});

// @desc    Get single work by ID
// @route   GET /api/works/:id
// @access  Public
const getWorkById = asyncHandler(async (req, res) => {
  const work = await Work.findById(req.params.id).populate('user', 'name profileImage');

  if (work) {
    // Optionally increment views here if you want to track it
    // work.views = work.views + 1;
    // await work.save();
    res.status(200).json(work);
  } else {
    res.status(404);
    throw new Error('Work not found.');
  }
});

// @desc    Update a work
// @route   PUT /api/works/:id
// @access  Private (Owner only)
const updateWork = asyncHandler(async (req, res) => {
  const { title, description, fileUrl, category, tags } = req.body;
  const work = await Work.findById(req.params.id);

  if (work) {
    if (work.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this work.');
    }

    work.title = title || work.title;
    work.description = description || work.description;
    work.fileUrl = fileUrl || work.fileUrl;
    work.category = category || work.category;
    work.tags = tags || work.tags;

    const updatedWork = await work.save();
    res.status(200).json(updatedWork);
  } else {
    res.status(404);
    throw new Error('Work not found.');
  }
});


// @desc    Delete a work
// @route   DELETE /api/works/:id
// @access  Private (Owner only)
const deleteWork = asyncHandler(async (req, res) => {
  const work = await Work.findById(req.params.id);

  if (work) {
    // Ensure the authenticated user is the owner of the work
    if (work.user.toString() !== req.user._id.toString()) {
      res.status(403); // Forbidden
      throw new Error('Not authorized to delete this work.');
    }

    // Also remove the work from the user's 'works' array
    await User.findByIdAndUpdate(work.user, {
      $pull: { works: work._id },
    });

    await work.deleteOne();
    res.status(200).json({ message: 'Work removed successfully.' });
  } else {
    res.status(404);
    throw new Error('Work not found.');
  }
});

const toggleLikeOnWork = asyncHandler(async (req, res) => {
  const work = await Work.findById(req.params.id);

  if (!work) {
    res.status(404);
    throw new Error('Work not found');
  }

  const userId = req.user._id;
  const hasLiked = work.likes.includes(userId);

  if (hasLiked) {
    // User has already liked, so unlike it
    work.likes.pull(userId);
  } else {
    // User has not liked, so like it
    work.likes.push(userId);
  }

  await work.save();
  res.status(200).json(work);
});

export { createWork, getWorks, getWorkById, updateWork, deleteWork, toggleLikeOnWork };