import express from "express";
import * as authController from "../controllers/userController";
import { isAuthenticated } from "../../auth/middleware/authMiddleware";

const router = express.Router();

router.get("/search", isAuthenticated, authController.searchUsers);
router.get("/me", isAuthenticated, authController.getMyUser);

export default router;
