import Comment from '../models/commentModel.js';
import Work from '../models/workModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const addCommentToWork = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { workId } = req.params;

  if (!text) {
    res.status(400);
    throw new Error('Comment text is required.');
  }

  const work = await Work.findById(workId);
  if (!work) {
    res.status(404);
    throw new Error('Work not found.');
  }

  const newComment = await Comment.create({
    user: req.user._id,
    work: workId,
    text,
  });

  if (newComment) {
    work.comments.push(newComment._id);
    await work.save();
    res.status(201).json(newComment);
  } else {
    res.status(400);
    throw new Error('Invalid comment data.');
  }
});

const getCommentsForWork = asyncHandler(async (req, res) => {
  const { workId } = req.params;

  const comments = await Comment.find({ work: workId })
    .populate('user', 'name profileImage')
    .sort({ createdAt: -1 }); // Show newest comments first

  if (comments) {
    res.status(200).json(comments);
  } else {
    res.status(404);
    throw new Error('No comments found for this work.');
  }
});

const updateComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { commentId } = req.params;

  if (!text) {
    res.status(400);
    throw new Error('Comment text cannot be empty.');
  }

  const comment = await Comment.findById(commentId);

  if (comment) {
    if (comment.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this comment.');
    }

    comment.text = text;
    const updatedComment = await comment.save();
    res.status(200).json(updatedComment);
  } else {
    res.status(404);
    throw new Error('Comment not found.');
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (comment) {
    if (comment.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this comment.');
    }

    // Remove comment ID from the parent work's comments array
    await Work.findByIdAndUpdate(comment.work, {
      $pull: { comments: comment._id },
    });

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment removed successfully.' });
  } else {
    res.status(404);
    throw new Error('Comment not found.');
  }
});

export { addCommentToWork, getCommentsForWork, updateComment, deleteComment };