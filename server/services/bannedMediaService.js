import BannedMediaModel from '../models/BannedMediaModel.js';

class BannedMediaService {
  async getAllBanned(filters = {}) {
    return BannedMediaModel.find(filters).sort({ createdAt: -1 });
  }

  async addToBanned(tmdbId, media_type, reason = '') {
    if (!tmdbId || !media_type) {
      throw new Error('tmdbId and media_type are required');
    }

    const exists = await BannedMediaModel.findOne({ tmdbId, media_type });
    if (exists) {
      throw new Error('This media is already banned');
    }

    const banned = await BannedMediaModel.create({
      tmdbId,
      media_type,
      reason,
    });

    return banned;
  }

  async removeFromBanned(tmdbId, media_type) {
    if (!tmdbId || !media_type) {
      throw new Error('tmdbId and media_type are required');
    }

    const result = await BannedMediaModel.findOneAndDelete({
      tmdbId,
      media_type,
    });

    if (!result) {
      throw new Error('Media not found in banned list');
    }

    return true;
  }
}

export default new BannedMediaService();
