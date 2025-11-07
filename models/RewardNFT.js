import mongoose from "mongoose";

const RewardNFTSchema = new mongoose.Schema({
    nft_id: {type:String,required:true,trim:true},
    title:{type:String,required:true},
    image:{type:String, required:true},
    points:{type:Number,required:true,default:0},
    challengeId:{type:mongoose.Schema.Types.ObjectId, ref:"Challenge", required:true},
    transferred:{type:Boolean,default: Date.now}
});
export default mongoose.model("RewardNFT",RewardNFTSchema);