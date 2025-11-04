import * as challengeService from "../services/challengeService.js";

export const createChallenge = async (req, res) => {
  try {
    const challenge = await challengeService.createChallenge(req.body);
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
    const data = await challengeService.getChallengeById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

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
