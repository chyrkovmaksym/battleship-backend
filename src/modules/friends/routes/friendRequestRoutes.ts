import express from "express";
import * as friendRequestController from "../controllers/friendRequestController";
import { isAuthenticated } from "../../auth/middleware/authMiddleware";

const router = express.Router();

router.post(
  "/send",
  isAuthenticated,
  friendRequestController.sendFriendRequest
);
router.post(
  "/respond",
  isAuthenticated,
  friendRequestController.respondToFriendRequest
);

router.get(
  "/requests",
  isAuthenticated,
  friendRequestController.getFriendRequests
);

router.get("/my", isAuthenticated, friendRequestController.getUserFriends);

export default router;
