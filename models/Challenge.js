import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    creator:{type: String,required: true},

    title:{type:String,required: true},

    description:{type:String,required: true},

    participantLimit:{type:Number,default:null},

    submissionRequirement:{type:String,default:"media link"},

    deadline:{type:Date,required:true},

    status:{type:String,enum: ["active","completed"],default:"active"},
    
    dateCreated:{type:Date,default:Date.now},

    submissions: [{type: mongoose.Schema.Types.ObjectId, ref: "Submission"}],

},{timestamps: true});

export default mongoose.model("Challenge", challengeSchema);