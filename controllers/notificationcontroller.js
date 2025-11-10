import * as notificationService from "../services/notificationService.js";

export const createNotificationController = async (req, res) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).json({
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getNotificationsController = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const notifications = await notificationService.getNotifications(walletAddress);
    res.status(200).json({
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotificationController = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await notificationService.deleteNotification(notificationId);
    if (notification) {
      res.status(200).json({ message: "Notification deleted successfully" });
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: error.message });
  }
};
