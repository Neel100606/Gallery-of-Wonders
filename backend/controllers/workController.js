import Work from "../models/workModel.js";
import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import axios from "axios";

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
    summary,
    fileUrls: fileUrls || [],
    category,
    tags: tags || [],
  });

  if (newWork) {
    await User.findByIdAndUpdate(req.user._id, {
      $push: { works: newWork._id },
    });

    // Asynchronously generate embedding and index in Pinecone
    (async () => {
      try {
        const aiPayload =
          category === "Writing"
            ? { textContent: description }
            : { imageUrl: newWork.fileUrls[0] };
        const aiResponse = await axios.post(
          process.env.PYTHON_AI_API_URL,
          aiPayload
        );
        const { embedding } = aiResponse.data;

        if (embedding) {
          // Call the /index-work endpoint on the Python server
          await axios.post(
            `${process.env.PYTHON_AI_API_URL.replace(
              "/analyze-content",
              "/index-work"
            )}`,
            {
              workId: newWork._id.toString(),
              embedding: embedding,
            }
          );
          console.log(
            `[Pinecone] Successfully indexed work ID: ${newWork._id}`
          );
        }
      } catch (err) {
        console.error("[Pinecone] Failed to index work:", err.message);
        // This error is logged but doesn't block the user's response.
      }
    })();

    res.status(201).json(newWork);
  } else {
    res.status(400);
    throw new Error("Invalid work data provided.");
  }
});

const getWorks = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const works = await Work.find(filter).populate("user", "name profileImage");
  res.status(200).json(works);
});

const getWorkById = asyncHandler(async (req, res) => {
  const work = await Work.findById(req.params.id).populate(
    "user",
    "name profileImage"
  );
  if (work) {
    res.status(200).json(work);
  } else {
    res.status(404);
    throw new Error("Work not found.");
  }
});

const updateWork = asyncHandler(async (req, res) => {
  const { title, description, category, tags } = req.body;
  const work = await Work.findById(req.params.id);

  if (work) {
    if (work.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this work.");
    }
    work.title = title || work.title;
    work.description = description || work.description;
    work.category = category || work.category;
    work.tags = tags || work.tags;
    const updatedWork = await work.save();
    res.status(200).json(updatedWork);
  } else {
    res.status(404);
    throw new Error("Work not found.");
  }
});

const deleteWork = asyncHandler(async (req, res) => {
  const work = await Work.findById(req.params.id);
  if (work) {
    if (work.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this work.");
    }
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
  const work = await Work.findById(workId);

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
  const updatedWork = await Work.findById(workId).populate(
    "user",
    "name profileImage"
  );
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

  const works = await Work.find({ user: userId })
    .populate("user", "name profileImage _id") // Make sure user is populated
    .sort({ createdAt: -1 });

  if (works) {
    res.status(200).json(works);
  } else {
    res.status(404);
    throw new Error("Works not found for this user.");
  }
});

const searchWorks = asyncHandler(async (req, res) => {
  const { keyword } = req.params;
  const searchRegex = new RegExp(keyword, "i");
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

const getWorkStats = asyncHandler(async (req, res) => {
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

const analyzeContentWithAI = asyncHandler(async (req, res) => {
  const { imageUrl, textContent } = req.body;
  if (!imageUrl && !textContent) {
    res.status(400);
    throw new Error("Image URL or text content is required.");
  }
  try {
    const { data } = await axios.post(process.env.PYTHON_AI_API_URL, {
      imageUrl,
      textContent,
    });
    res.json(data);
  } catch (error) {
    // 👇 Enhanced Error Logging
    console.error("--- ERROR CALLING PYTHON AI SERVICE ---");
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data); // Log the response data from Python
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request Error: No response received.", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Axios Error:", error.message);
    }
    console.error("--------------------------------------");

    res.status(500); // Keep the 500 status for the frontend
    throw new Error("Failed to analyze content with AI."); // Generic message for frontend
  }
});

const findSimilarWorks = asyncHandler(async (req, res) => {
  const { id: workId } = req.params;

  try {
    // 1. Ask the Python AI server for similar work IDs
    const aiResponse = await axios.post(
      `${process.env.PYTHON_AI_API_URL.replace(
        "/analyze-content",
        "/find-similar"
      )}`,
      {
        workId: workId,
      }
    );

    const { similar_ids } = aiResponse.data;

    if (similar_ids && similar_ids.length > 0) {
      // 2. Fetch the full work documents from MongoDB using the IDs
      const similarWorks = await Work.find({
        _id: { $in: similar_ids },
      }).populate("user", "name profileImage");
      res.json(similarWorks);
    } else {
      res.json([]); // Return an empty array if no similar works are found
    }
  } catch (error) {
    console.error("Error finding similar works:", error.message);
    res.status(500).json({ message: "Failed to find similar works." });
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
  findSimilarWorks,
};
