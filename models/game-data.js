import mongoose from 'mongoose';

const { Schema } = mongoose;

const ratingSchema = new Schema({
  id: { type: Number },
  title: { type: String },
  count: { type: Number },
  percent: { type: Number },
});

const gameDataSchema = new Schema({
  idGameBD: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  playtime: { type: Number },
  platforms: [{ type: String }],
  stores: [{ type: String }],
  released: { type: Date },
  rating: { type: Number },
  ratings: [ratingSchema],
  ratings_count: { type: Number },
  reviews_text_count: { type: Number },
  added: { type: Number },
  added_by_status: {
    yet: { type: Number },
    owned: { type: Number },
    beaten: { type: Number },
    toplay: { type: Number },
    dropped: { type: Number },
    playing: { type: Number },
  },
  metacritic: { type: Number },
  suggestions_count: { type: Number },
  background_image: { type: String },
  tags: [{ type: String }],
  esrb_rating: {
    name: { type: String },
  },
  short_screenshots: [{ type: String }],
});

export default mongoose.model('game-data', gameDataSchema);
