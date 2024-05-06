import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  wordsUsed: { type: Array, required: true },
  score: { type: Number, required: true },
  hintsUsed: { type: Number, default: 0 }
});

export default mongoose.model('UserProgress', userProgressSchema);