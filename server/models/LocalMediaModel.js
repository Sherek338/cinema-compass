import mongoose from 'mongoose';

const localMediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['movie', 'tv'], required: true },
    title: String,
    overview: String,
    poster: String,
    year: Number,
    backdrop: String,
    popularity: Number,
    vote_average: Number,
    vote_count: Number,
  },
  { timestamps: true }
);

export default mongoose.model('LocalMedia', localMediaSchema);
