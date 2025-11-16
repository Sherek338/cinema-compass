import { Schema, model } from 'mongoose';

const ReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  author: { type: String, required: true },
  review: { type: String, required: true },
  movieId: { type: Number, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  rating: { type: Number, required: true, min: 0, max: 5 },
});

ReviewSchema.index({ user: 1, movieId: 1 });

export default model('Review', ReviewSchema);