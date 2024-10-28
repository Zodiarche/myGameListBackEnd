import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  followers: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'user' }],
});

export default mongoose.model('user', userSchema);
