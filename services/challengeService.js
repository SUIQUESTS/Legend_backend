import Challenge from "../models/Challenge.js";
import Submission from "../models/Submission.js";

export const createChallenge = async (data) => {
  return await Challenge.create(data);
};

export const getAllChallenges = async () => {
  return await Challenge.find().sort({ createdAt: -1 });
};

export const getChallengeById = async (id) => {
  const challenge = await Challenge.findById(id).populate("submissions");
  if (!challenge) throw new Error("Challenge not found");
  return challenge;
};

export const submitToChallenge = async (id, data) => {
  const challenge = await Challenge.findById(id);
  if (!challenge) throw new Error("Challenge not found");
  if (challenge.status === "completed") throw new Error("Challenge is closed");

  const participantLimitIsExceeded = challenge.participantLimit && challenge.submissions.length >= challenge.participantLimit;
  if(participantLimitIsExceeded){
    throw new Error("Partcipant limit reached for this challenge");
  }

  const submission = await Submission.create({
    challenge: id,
    participant_address: data.participant_address,
    submission_link: data.submission_link,
  });

  console.log("✅ Submission created:", submission);

   await Challenge.findByIdAndUpdate(
  id,
  { $push: { submissions: submission._id } },
  { new: true }
);
console.log("✅ Challenge updated:", challenge);

   return submission;
};

export const getSubmissionsByUser = async (walletAddress) => {
  return await Submission.find({ participant_address: walletAddress })
    .populate("challenge", "title status");
};

export const completeChallenge = async (id) => {
  const challenge = await Challenge.findByIdAndUpdate(
    id,
    { status: "completed" },
    { new: true }
  ).populate("submissions");

  if (!challenge) throw new Error("Challenge not found");

  return challenge;
};

export const ChallengeWinner = async (challengeId, winnerId, creator) => {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) throw new Error("Challenge not found");

  // Verify creator
  if (challenge.creator !== creator) {
    throw new Error("Only the challenge creator can select a winner");
  }

  if (challenge.status !== "completed") {
    throw new Error("Challenge must be completed before selecting a winner");
  }

  challenge.winner = winnerId;
  await challenge.save();

  return challenge;
};


