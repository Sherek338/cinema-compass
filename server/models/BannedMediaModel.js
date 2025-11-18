import mongoose from 'mongoose';

const BannedMediaSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true },
    media_type: { type: String, enum: ['movie', 'tv'], required: true },
    reason: { type: String, default: '' },
  },
  { timestamps: true }
);

BannedMediaSchema.index({ tmdbId: 1, media_type: 1 }, { unique: true });

export default mongoose.model('BannedMedia', BannedMediaSchema);
