import { Schema, model } from 'mongoose';

const MediaRefSchema = new Schema(
  {
    id: { type: Number, required: true },
    type: { type: String, enum: ['movie', 'series'], required: true },
  },
  { _id: false }
);

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
    isAdmin: { type: Boolean, default: false },
    favoriteList: [
      {
        id: { type: Number, required: true },
        type: { type: String, enum: ['movie', 'series'], required: true },
      },
    ],
    watchList: [
      {
        id: { type: Number, required: true },
        type: { type: String, enum: ['movie', 'series'], required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1, isActivated: 1 });

export default model('User', UserSchema);
