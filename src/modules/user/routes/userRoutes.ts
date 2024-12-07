import express from "express";
import * as authController from "../controllers/userController";
import { isAuthenticated } from "../../auth/middleware/authMiddleware";

const router = express.Router();

router.get("/search", isAuthenticated, authController.searchUsers);

export default router;
