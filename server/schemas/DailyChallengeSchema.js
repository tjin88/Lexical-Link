import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  startWord: { type: String, required: true },
  targetWord: { type: String, required: true },
  hints: { type: Array, default: [] }
});

export default mongoose.model('DailyChallenge', dailyChallengeSchema);