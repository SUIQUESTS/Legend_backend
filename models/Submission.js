import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    challenge:{type:mongoose.Schema.Types.ObjectId,ref:"Challenge",required: true},

    participant_address:{type:String,required:true},

    submission_link:{type:String,required:true},

    submittedAt:{type:Date,default:Date.now},
    
},{timestamps:true});

const Submission = mongoose.model("Submission",submissionSchema);
export default Submission;