import { Request, Response } from "express";
import * as notificationService from "../services/notificationService";
import { handleError } from "../../../utils/handleError";

export const getMyNotifications = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const notifications = await notificationService.getMyNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    const { message, status } = handleError(error);
    res.send(status).json({ message });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  const { notificationId } = req.params;

  try {
    await notificationService.markNotificationAsRead(notificationId);
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    const { message, status } = handleError(error);
    res.status(status).json({ message });
  }
};
