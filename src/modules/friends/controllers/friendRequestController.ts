import { Request, Response } from "express";
import * as friendRequestService from "../services/friendRequestService";
import { handleError } from "../../../utils/handleError";
import { CustomError } from "../../../utils/customError";

export const sendFriendRequest = async (req: Request, res: Response) => {
  const { toUserId } = req.body;
  const fromUserId = req.userId;

  try {
    const friendRequest = await friendRequestService.sendFriendRequest(
      fromUserId,
      toUserId
    );
    res.status(201).json({ message: "Friend request sent", friendRequest });
  } catch (error) {
    const { message, status } = handleError(error);
    res.status(status).json({ message });
  }
};

export const respondToFriendRequest = async (req: Request, res: Response) => {
  const { requestId, status } = req.body;
  const userId = req.userId;

  try {
    const result = await friendRequestService.respondToFriendRequest(
      requestId,
      userId,
      status
    );
    res.status(200).json({ message: `Friend request ${status}`, result });
  } catch (error) {
    const { message, status } = handleError(error);
    res.status(status).json({ message });
  }
};

export const getFriendRequests = async (req: Request, res: Response) => {
  const userId = req.userId;
  const type = req.query.type as "fromUser" | "toUser";

  try {
    if (!type || !["fromUser", "toUser"].includes(type)) {
      throw new CustomError("Invalid request type", 400);
    }

    const requests = await friendRequestService.getFriendRequests(userId, type);

    res.status(200).json({
      type,
      requests,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    res.status(status).json({ message });
  }
};

export const getUserFriends = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const friends = await friendRequestService.getUserFriends(userId);
    res.status(200).json(friends);
  } catch (error) {
    const { message, status } = handleError(error);
    res.status(status).json({ message });
  }
};
