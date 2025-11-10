import express from "express";
import * as notificationController from "../controllers/notificationController.js";

const router = express.Router();

router.post("/create", notificationController.createNotificationController);
router.get("/:walletAddress", notificationController.getNotificationsController);
router.delete("/:notificationId", notificationController.deleteNotificationController);

export default router;
