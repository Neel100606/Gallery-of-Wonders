import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true, 
    },
    profileImage: {
      type: String,
      default: 'https://res.cloudinary.com/dw3dkqiac/image/upload/v1759513698/zqzrken305a14txbfjmv.jpg',
    },
    bio: {
      type: String,
      maxLength: 250,
      default: '',
    },
    works: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Work',
      },
    ],
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
      },
    ],
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;