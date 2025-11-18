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
  rating: { type: Number, required: true, min: 0, max: 5 },
  movieId: { type: Number, required: true, index: true },
  isSeries: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

ReviewSchema.index({ user: 1, movieId: 1 });

export default model('Review', ReviewSchema);
