import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userAddress: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["challenge_win", "new_challenge", "system"], 
    default: "system" 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
