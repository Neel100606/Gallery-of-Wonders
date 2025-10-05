import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Establishes a link to the creator
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fileUrls: {
      type: [String],
      required: false,
    },

    category: {
      type: String,
      required: true,
      enum: ["Art", "Photography", "Writing", "Other"], // Predefined categories
    },
    tags: [String], // For AI or user-generated tags
    views: {
      type: Number,
      default: 0,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    saves: {
      type: Number,
      default: 0,
    },
    // References to all comments on this work
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Work = mongoose.model("Work", workSchema);

export default Work;
