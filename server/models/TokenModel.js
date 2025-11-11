import { Schema, model } from 'mongoose';

const TokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  refreshToken: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 2592000 },
  userAgent: { type: String },
  ip: { type: String },
});

TokenSchema.index({ user: 1, createdAt: -1 });

export default model('Token', TokenSchema);