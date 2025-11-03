import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/check/:walletAddress", userController.checkWallet);
router.post("/", userController.createProfile);
router.get("/:walletAddress", userController.getProfile);

export default router;