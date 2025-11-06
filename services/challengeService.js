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

  const participantLimitIsExceeded = challenge.participant_limit && challenge.submissions.length >= challenge.participant_limit;
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
  const challenge = await Challenge.findById(challengeId)
    .populate("submissions");

  if (!challenge) {throw new Error("Challenge not found");}

  if (challenge.creator !== creator) {throw new Error("Unauthorized: Only the challenge creator can select a winner");}

  if (challenge.status === "completed") {throw new Error("This challenge already has a winner");}

  const validWinner = challenge.submissions.some(
    (submission) => submission.participant_address === winnerId );

  if (!validWinner) {throw new Error("The selected winner did not participate in this challenge");}

  challenge.winner = winnerId;
  challenge.status = "completed";
  await challenge.save();

  const updatedChallenge = await Challenge.findById(challengeId)
    .populate("winner", "name walletAddress _id") // if linked to User model
    .populate("submissions");

  return updatedChallenge;
};

export const findChallengesByCreator = async (creatorAddress, status, page, limit) => {
  const filter = { creator: creatorAddress };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const [challenges, total] = await Promise.all([
    Challenge.find(filter)
      .populate("submissions")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Challenge.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    creator: creatorAddress,
    totalChallenges: total,
    currentPage: page,
    totalPages,
    challenges
  };
};
