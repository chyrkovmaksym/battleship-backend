import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import { handleError } from "../../../utils/handleError";

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    await authService.registerUser(firstName, lastName, email, password);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    const { message, status } = handleError(error);
    res.status(status).json({ message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    res.status(200).json({ message: "Login successful", token: user.token });
  } catch (error) {
    const { message, status } = handleError(error);
    res.status(status).json({ message });
  }
};
