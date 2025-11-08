import User from "../models/User.js";
import Challenge from "../models/Challenge.js";
import RewardNFT from "../models/RewardNFT.js";
import Submission from "../models/Submission.js";
import Achievement from "../models/Achievement.js";
import NodeCache from "node-cache";

const leaderboardCache = new NodeCache({ stdTTL: 300 });

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



export const ChallengeWinner = async (challengeId, winnerAddress, nftDetails, creatorAddress) => {
  const challenge = await Challenge.findById(challengeId).populate("submissions");

  if (!challenge) throw new Error("Challenge not found");
  //if (challenge.creator !== creatorAddress) throw new Error("Unauthorized: Only the creator can select a winner");
  if (challenge.status === "completed") throw new Error("This challenge already has a winner");

  const validWinner = challenge.submissions.some(
    (submission) => submission.participant_address === winnerAddress
  );
  if (!validWinner) throw new Error("Selected winner did not participate in this challenge");

  const nft = await RewardNFT.create({
    nft_id: nftDetails.nft_id,
    title: nftDetails.title || challenge.title,
    image: nftDetails.image,
    points: nftDetails.points,
    challengeId: challenge._id,
    transferred: false
  });

  
  const achievement = await Achievement.create({
    userAddress: winnerAddress,
    nft_id: nft.nft_id,
    image: nft.image,
    title: challenge.title,
    points: nft.points,
    challengeId: challenge._id,
  });

  challenge.winner = winnerAddress;
  challenge.status = "completed";
  await challenge.save();

  await User.updateOne(
    {walletAddress: winnerAddress},
    {$inc:{totalPoints: nft.points || 0}},
    {upsert:true}
  );

  leaderboardCache.del("leaderboard");

  return {
    message: "Winner selected successfully",
    challenge,
    achievement: achievement,
    pointsAwarded:nft.points
  };
};

export const getUserChallenges = async (walletAddress) =>{
  const userSubmissions = await Submission.find({participant_address: walletAddress});

  const won = await Challenge.find({winner: walletAddress})
  .populate("submissions")
  .sort({createdAt: -1});

  const active = await Challenge.find({status: "active"})
  .populate("submissions")
  .sort({createdAt: -1});

  return{
    walletAddress,
    won,
    active
  };
};


export const getUserAchievements = async (userAddress) => {
 const achievements = await Achievement.find({ userAddress }).sort({ createdAt: -1 });
  return achievements;
};

export const getLeaderBoard = async () => {
  const cached = leaderboardCache.get("leaderboard");
  if(cached) return cached;

  const leaderboard = await Achievement.aggregate([
    {
      $group:{
        _id:"$userAddress",
        totalPoints: {$sum: "$points"},
      },
    },
    {$sort:{totalPoints: -1}},
  ]);
  const results = await Promise.all(
    leaderboard.map(async (entry) =>{
      const user = await User.findOne({walletAddress:entry._id});
      return{
        userAddress:entry._id,
        totalPoints:entry.totalPoints,
        name: user?.username,
        profilePicture:user?.profilePicture
      };
    })
  );
  leaderboardCache.set("leaderboard",results);
  return results;
};