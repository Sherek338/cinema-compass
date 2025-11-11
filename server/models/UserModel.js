import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    activationLink: { type: String, index: true },
    isActivated: { type: Boolean, default: false, index: true },
    favoriteList: { type: [Number], default: [] },
    watchList: { type: [Number], default: [] },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1, isActivated: 1 });

export default model('User', UserSchema);