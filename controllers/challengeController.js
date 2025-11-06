import * as challengeService from "../services/challengeService.js";


export const createChallenge = async (req, res) => {
  try {
    const data = {
      ...req.body,
      participant_limit: req.body.participant_limit
        ? Number(req.body.participant_limit)
        : null
    };

    const challenge = await challengeService.createChallenge(data);
    res.status(201).json(challenge);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
