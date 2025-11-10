import express from "express";
import * as notificationController from "../controllers/notificationcontroller.js";
const router = express.Router();

router.post("/create", notificationController.createNotification);
router.get("/:userAddress/notifications", notificationController.getNotifications);
router.delete("/delete/:notificationId", notificationController.deleteNotification);
export default router;