import express from "express";
import * as authController from "../controllers/authController";
import { registerValidator, loginValidator } from "../validators/authValidator";
import { validate } from "../../../utils/validate";

const router = express.Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);

export default router;
