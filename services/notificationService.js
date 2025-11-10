import NodeCache from "node-cache";
import Notification from "../models/Notification.js";

const notificationCache = new NodeCache({ stdTTL: 60 });
export const createNotification = async (data) => {
 const notification = await Notification.create(data);
 notificationCache.del(data.userAddress);
  return notification;
}

export const getNotifications = async (walletAddress) => {
const cached = notificationCache.get(userAddress);
  if (cached) return cached;

  const notifications = await Notification.find({ userAddress })
    .sort({ createdAt: -1 })
    .lean();

  notificationCache.set(userAddress, notifications);
  return notifications;
};