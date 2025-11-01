import Collection from '../models/collectionModel.js';
import User from '../models/userModel.js';
import Work from '../models/workModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const createCollection = asyncHandler(async (req, res) => {
  const { name, description, isPrivate } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Collection name is required.');
  }
  const newCollection = await Collection.create({
    user: req.user._id,
    name,
    description: description || '',
    isPrivate: isPrivate || false,
  });
  if (newCollection) {
    await User.findByIdAndUpdate(req.user._id, {
      $push: { collections: newCollection._id },
    });
    res.status(201).json(newCollection);
  } else {
    res.status(400);
    throw new Error('Invalid collection data.');
  }
});

const getMyCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({ user: req.user._id }).populate('works', 'title fileUrls');
  res.status(200).json(collections);
});

const getCollectionById = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id)
    .populate('user', 'name profileImage _id')
    .populate({
      path: 'works',
      select: 'title fileUrls category likes comments saves createdAt user',
      populate: {
        path: 'user',
        select: 'name profileImage _id' // Make sure to populate user for each work
      }
    });

  if (collection) {
    if (collection.isPrivate && collection.user.toString() !== req.user?._id?.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this private collection.');
    }
    res.status(200).json(collection);
  } else {
    res.status(404);
    throw new Error('Collection not found.');
  }
});

const updateCollection = asyncHandler(async (req, res) => {
  const { name, description, isPrivate } = req.body;
  const collection = await Collection.findById(req.params.id);
  if (collection) {
    if (collection.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this collection.');
    }
    collection.name = name || collection.name;
    collection.description = description ?? collection.description;
    collection.isPrivate = isPrivate ?? collection.isPrivate;
    const updatedCollection = await collection.save();
    res.status(200).json(updatedCollection);
  } else {
    res.status(404);
    throw new Error('Collection not found.');
  }
});

const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (collection) {
    if (collection.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this collection.');
    }
    if (collection.works && collection.works.length > 0) {
      await Work.updateMany(
        { _id: { $in: collection.works } },
        { $inc: { saves: -1 } }
      );
    }
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { collections: collection._id },
    });
    await collection.deleteOne();
    res.status(200).json({ message: 'Collection removed successfully.' });
  } else {
    res.status(404);
    throw new Error('Collection not found.');
  }
});

const addWorkToCollection = asyncHandler(async (req, res) => {
  const { workId } = req.body;
  const collection = await Collection.findById(req.params.id);
  if (!workId) {
    res.status(400);
    throw new Error('Work ID is required.');
  }
  if (collection) {
    if (collection.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to modify this collection.');
    }
    const work = await Work.findById(workId);
    if (!work) {
      res.status(404);
      throw new Error('Work not found.');
    }    
    collection.works.push(workId);
    await Work.findByIdAndUpdate(workId, { $inc: { saves: 1 } });
    const updatedCollection = await collection.save();
    res.status(200).json(updatedCollection);
  } else {
    res.status(404);
    throw new Error('Collection not found.');
  }
});

const removeWorkFromCollection = asyncHandler(async (req, res) => {
  const { workId } = req.body;
  const collection = await Collection.findById(req.params.id);
  if (!workId) {
    res.status(400);
    throw new Error('Work ID is required.');
  }
  if (collection) {
    if (collection.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to modify this collection.');
    }
    if (!collection.works.includes(workId)) {
      res.status(400);
      throw new Error('Work not found in this collection.');
    }
    collection.works = collection.works.filter((id) => id.toString() !== workId.toString());
    await Work.findByIdAndUpdate(workId, { $inc: { saves: -1 } });
    const updatedCollection = await collection.save();
    res.status(200).json(updatedCollection);
  } else {
    res.status(404);
    throw new Error('Collection not found.');
  }
});

const getCollectionsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const collections = await Collection.find({ user: userId, isPrivate: false })
    .populate('user', 'name profileImage')
    .populate({
      path: 'works',
      select: 'fileUrls title user',
      populate: {
        path: 'user',
        select: 'name profileImage _id'
      },
      perDocumentLimit: 4 // Limit works for preview
    })
    .sort({ createdAt: -1 });
  
  if (collections) {
    res.status(200).json(collections);
  } else {
    res.status(404);
    throw new Error('Collections not found for this user.');
  }
});

export {
  createCollection,
  getMyCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addWorkToCollection,
  removeWorkFromCollection,
  getCollectionsByUserId,
};