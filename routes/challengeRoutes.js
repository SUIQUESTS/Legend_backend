import express from "express";
import * as challengeController from "../controllers/challengeController.js";

const router = express.Router();

router.post("/create", challengeController.createChallenge);
router.get("/getall", challengeController.getAllChallenges);
router.get("/:id", challengeController.getChallengeById);
router.post("/:id/submit", challengeController.submitToChallenge);
router.get("/user/:walletAddress", challengeController.getSubmissionsByUser);
router.put("/:id/complete", challengeController.completeChallenge);
router.put("/select-winner", challengeController.selectWinner);

export default router;
