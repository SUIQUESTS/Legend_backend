import * as challengeService from "../services/challengeService.js";
import * as Achievement from "../models/Achievement.js"
import * as Challenge from "../models/Challenge.js"

export const createChallenge = async (req, res) => {
  try {
    const { title, description, nftId, deadline } = req.body;

    const challenge = await Challenge.create({ title, description, deadline });
    
    await RewardNFT.findByIdAndUpdate(nftId, { challengeId: challenge._id });

    res.status(201).json({ challenge });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await challengeService.getAllChallenges();
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChallengeById = async (req, res) => {
  try {
    const {id} = req.params;
    const challenge = await challengeService.getChallengeById(id);
    
    res.status(200).json({
        message: "Challenge is retrieved successfully",
        data: challenge,
    }); 
} catch (error) {
    console.error("error fetching challenge:", error);
    res.status(404).json({
        message: error.message || "Challenge not found"
    })
 };
}
export const submitToChallenge = async (req, res) => {
  try {
    const submission = await challengeService.submitToChallenge(req.params.id, req.body);
    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSubmissionsByUser = async (req, res) => {
  try {
    const submissions = await challengeService.getSubmissionsByUser(req.params.walletAddress);
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeChallenge = async (req, res) => {
  try {
    const updated = await challengeService.completeChallenge(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const ChallengeWinner = async (req, res) => {
  try {
    const { challengeId, winnerId, creator } = req.body;

    if (!challengeId || !winnerId || !creator) {
      return res.status(400).json({
        message: "challengeId, winnerId, and creator are required",
      });
    }

    const updatedChallenge = await challengeService.ChallengeWinner(challengeId, winnerId, creator);

    res.status(200).json({
      message: "Winner has been successfully selected by the creator",
      data: updatedChallenge,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getChallengesByCreator = async (req, res) => {
  try {
    const { creatorAddress } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    const result = await challengeService.findChallengesByCreator(
      creatorAddress,
      status,
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json({
      message: "Challenges retrieved successfully",
      ...result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserChallenges = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const result = await challengeService.getUserChallenges(walletAddress);
    res.status(200).json({
      message: "User challenges retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserAchievements = async (req, res) => {
  try {
    const { userAddress } = req.params;
    const achievements = await Achievement.find({ userAddress }).sort({ dateEarned: -1 });
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


