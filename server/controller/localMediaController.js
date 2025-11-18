import localMediaService from '../services/localMediaService.js';

const getAll = async (req, res, next) => {
  try {
    const { media_type } = req.query;
    const filters = {};
    if (media_type && ['movie', 'tv'].includes(media_type)) {
      filters.media_type = media_type;
    }

    const media = await localMediaService.getAllLocalMedia(filters);
    res.status(200).json(media);
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const media = await localMediaService.getLocalMediaById(id);
    res.status(200).json(media);
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const mediaData = req.body;
    const newMedia = await localMediaService.createLocalMedia(mediaData);
    res.status(201).json(newMedia);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const mediaData = req.body;
    const updatedMedia = await localMediaService.updateLocalMedia(
      id,
      mediaData
    );
    res.status(200).json(updatedMedia);
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await localMediaService.deleteLocalMedia(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
