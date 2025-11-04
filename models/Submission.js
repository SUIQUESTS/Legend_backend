import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    challenge:{type:mongoose.Schema.Types.ObjectId,ref:"Challenge",required: true},

    participantAddress:{type:String,required:true},

    submissionLink:{type:String,required:true},

    submittedAt:{type:Date,default:Date.now},
    
},{timestamps:true});

export default mongoose.model("Submission",submissionSchema);