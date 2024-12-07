import { Request, Response } from "express";
import * as friendRequestService from "../services/friendRequestService";
import { handleError } from "../../../utils/handleError";

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
