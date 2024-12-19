import { Notification } from "../../notification/models/notificationModel";

export const getMyNotifications = async (userId: string) => {
  const notifications = await Notification.find({ user: userId })
    .populate("fromUser", "firstName lastName")
    .sort({
      createdAt: -1,
    });

  return notifications;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new Error("Notification not found");
  }

  notification.isRead = true;
  await notification.save();
};
