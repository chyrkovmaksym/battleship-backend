import { Request, Response } from "express";
import * as gameRequestService from "../services/gameRequestService";
import { handleError } from "../../../utils/handleError";

export const sendGameRequest = async (req: Request, res: Response) => {
  const { toUserId } = req.body;
  const fromUserId = req.userId;

  try {
    const gameRequest = await gameRequestService.sendGameRequest(
      fromUserId,
      toUserId
    );
    res.status(201).json({ message: "Game request sent", gameRequest });
  } catch (error) {
    const { message, status } = handleError(error);
    res.send(status).json({ message });
  }
};

export const respondToGameRequest = async (req: Request, res: Response) => {
  const { requestId, status } = req.body;
  const userId = req.userId;

  try {
    const result = await gameRequestService.respondToGameRequest(
      requestId,
      userId,
      status
    );
    res.status(200).json({ message: `Game request ${status}`, result });
  } catch (error) {
    const { message, status } = handleError(error);
    res.send(status).json({ message });
  }
};
