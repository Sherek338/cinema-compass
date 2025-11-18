import bannedMediaService from '../services/bannedMediaService.js';

const getAll = async (req, res, next) => {
  try {
    const { media_type } = req.query;
    const filters = {};
    if (media_type && ['movie', 'tv'].includes(media_type)) {
      filters.media_type = media_type;
    }

    const banned = await bannedMediaService.getAllBanned(filters);
    res.status(200).json(banned);
  } catch (e) {
    next(e);
  }
};

const add = async (req, res, next) => {
  try {
    const { tmdbId, media_type, reason } = req.body;
    const banned = await bannedMediaService.addToBanned(
      tmdbId,
      media_type,
      reason
    );
    res.status(201).json(banned);
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const { tmdbId, media_type } = req.body;
    await bannedMediaService.removeFromBanned(tmdbId, media_type);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};

export default {
  getAll,
  add,
  remove,
};
