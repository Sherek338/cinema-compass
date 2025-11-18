import { Schema, model } from 'mongoose';

const LocalMediaSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    overview: { type: String, default: '' },
    release_date: { type: String },
    first_air_date: { type: String },
    poster_path: { type: String },
    backdrop_path: { type: String },
    vote_average: { type: Number, default: 0, min: 0, max: 10 },
    genres: [
      {
        id: { type: Number },
        name: { type: String },
      },
    ],
    genre_names: [{ type: String }],
    media_type: {
      type: String,
      enum: ['movie', 'tv'],
      required: true,
      index: true,
    },
    runtime: { type: Number },
    number_of_seasons: { type: Number },
    number_of_episodes: { type: Number },
    episode_run_time: [{ type: Number }],
    homepage: { type: String },
    original_language: { type: String, default: 'en' },
  },
  {
    timestamps: true,
  }
);

LocalMediaSchema.index({ media_type: 1, id: 1 });

export default model('LocalMedia', LocalMediaSchema);
