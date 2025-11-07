import mongoose from "mongoose";

const userAchievementSchema = new mongoose.Schema({
  userAddress: { type: String, required: true }, 
  nft_id: { type: String, required: true }, 
  image: { type: String, required: true }, 
  title: { type: String, required: true }, 
  points: { type: Number, default: 0 }, 
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
  dateEarned: { type: Date, default: Date.now },
},{timestamps: true});

export default mongoose.model("Achievement", userAchievementSchema);
