import Challenge from "../models/Challenge.js";
import Submission from "../models/Submission.js";

export const createChallenge = async (data) => {
  return await Challenge.create(data);
};

export const getAllChallenges = async () => {
  return await Challenge.find().sort({ createdAt: -1 });
};

export const getChallengeById = async (id) => {
  const challenge = await Challenge.findById(id);
  if (!challenge) throw new Error("Challenge not found");

  const submissions = await Submission.find({ challengeId: id });
  return { challenge, submissions };
};

export const submitToChallenge = async (id, data) => {
  const challenge = await Challenge.findById(id);
  if (!challenge) throw new Error("Challenge not found");
  if (challenge.status === "completed") throw new Error("Challenge is closed");

  return await Submission.create({
    challenge: id,
    participant_address: data.participant_address,
    submission_link: data.submission_link,
  });
};

export const getSubmissionsByUser = async (walletAddress) => {
  return await Submission.find({ participant_address: walletAddress })
    .populate("challenge", "title status");
};

export const completeChallenge = async (id) => {
  return await Challenge.findByIdAndUpdate(id, { status: "completed" }, { new: true });
};
