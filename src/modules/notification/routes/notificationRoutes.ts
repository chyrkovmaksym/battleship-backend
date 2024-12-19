import express from "express";
import * as notificationController from "../controllers/notificationController";
import { isAuthenticated } from "../../auth/middleware/authMiddleware";

const router = express.Router();

router.get("/my", isAuthenticated, notificationController.getMyNotifications);
router.patch("/:notificationId/mark-read", isAuthenticated, notificationController.markNotificationAsRead);

export default router;
