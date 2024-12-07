import express from "express";
import * as gameRequestController from "../controllers/gameRequestController";
import { isAuthenticated } from "../../auth/middleware/authMiddleware";

const router = express.Router();

router.post("/send", isAuthenticated, gameRequestController.sendGameRequest);
router.post(
  "/respond",
  isAuthenticated,
  gameRequestController.respondToGameRequest
);

export default router;
