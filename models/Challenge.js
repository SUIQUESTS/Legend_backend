import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    creator:{type: String,required: true},

    title:{type:String,required: true},

    description:{type:String,required: true},

    participant_limit:{type:Number,default:null},

    nft_id:{type:String,required:true},

    deadline:{type:Date,required:true},
    
    status:{type:String,enum: ["active","completed"],default:"active"},
    
    dateCreated:{type:Date,default:Date.now},

    submissions: [{type: mongoose.Schema.Types.ObjectId, ref: "Submission"}],

    winner: { type: String, default: null },

    rewardPoints: { type: Number, default: 100 }

},{timestamps: true});

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
