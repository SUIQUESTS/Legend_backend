import NodeCache from "node-cache";
import Notification from "../models/Notification.js";

const notificationCache = new NodeCache({ stdTTL: 60 });

export const createNotification = async (data) => {
  if (!data.userAddress) throw new Error("userAddress is required");
  const notification = await Notification.create(data);
  notificationCache.del(data.userAddress); // invalidate cache
  return notification;
};

export const getNotifications = async (walletAddress) => {
  if (!walletAddress) throw new Error("walletAddress is required");
  
  const cached = notificationCache.get(walletAddress);
  if (cached) return cached;

  const notifications = await Notification.find({ userAddress: walletAddress })
    .sort({ createdAt: -1 })
    .lean();

  notificationCache.set(walletAddress, notifications);
  return notifications;
};

export const deleteNotification = async (notificationId) => {
  const notification = await Notification.findByIdAndDelete(notificationId);
  if (notification) {
    notificationCache.del(notification.userAddress);
  }
  return notification;
};
