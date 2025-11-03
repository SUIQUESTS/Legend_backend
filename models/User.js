import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  walletAddress: { type: String, required: true, unique: true },
  score: { type: Number, default: 0 },
});

export default mongoose.model("User", userSchema);
