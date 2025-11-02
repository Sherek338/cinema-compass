import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  activationLink: { type: String },
  isActivated: { type: Boolean, default: false },
  favoriteList: { type: [Number], default: [] },
  watchList: { type: [Number], default: [] },
});

export default model('User', UserSchema);
