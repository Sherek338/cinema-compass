import mongoose from 'mongoose';

const bannedMediaSchema = new mongoose.Schema(
  {
    tmdb_id: { type: Number, required: true },
    type: { type: String, enum: ['movie', 'tv'], required: true },
    reason: { type: String, default: '' },
  },
  { timestamps: true }
);

bannedMediaSchema.index({ tmdb_id: 1, type: 1 }, { unique: true });

export default mongoose.model('BannedMedia', bannedMediaSchema);
