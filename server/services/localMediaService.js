import LocalMediaModel from '../models/LocalMediaModel.js';
import ApiError from '../exceptions/ApiError.js';

const getNextLocalId = async () => {
  const lastMedia = await LocalMediaModel.findOne().sort({ id: 1 }).limit(1);
  if (!lastMedia || lastMedia.id >= 0) {
    return -1;
  }
  return lastMedia.id - 1;
};

const getAllLocalMedia = async (filters = {}) => {
  const query = {};
  if (filters.media_type) {
    query.media_type = filters.media_type;
  }
  return await LocalMediaModel.find(query).sort({ createdAt: -1 });
};

const getLocalMediaById = async (id) => {
  const media = await LocalMediaModel.findOne({ id });
  if (!media) {
    throw ApiError.NotFound('Local media not found');
  }
  return media;
};

const createLocalMedia = async (mediaData) => {
  const nextId = await getNextLocalId();

  const newMedia = await LocalMediaModel.create({
    ...mediaData,
    id: nextId,
  });

  return newMedia;
};

const updateLocalMedia = async (id, mediaData) => {
  if (id >= 0) {
    throw ApiError.BadRequest('Can only update local media (negative IDs)');
  }

  const media = await LocalMediaModel.findOneAndUpdate(
    { id },
    { $set: mediaData },
    { new: true, runValidators: true }
  );

  if (!media) {
    throw ApiError.NotFound('Local media not found');
  }

  return media;
};

const deleteLocalMedia = async (id) => {
  if (id >= 0) {
    throw ApiError.BadRequest('Can only delete local media (negative IDs)');
  }

  const media = await LocalMediaModel.findOneAndDelete({ id });
  if (!media) {
    throw ApiError.NotFound('Local media not found');
  }

  return media;
};

export default {
  getAllLocalMedia,
  getLocalMediaById,
  createLocalMedia,
  updateLocalMedia,
  deleteLocalMedia,
};
