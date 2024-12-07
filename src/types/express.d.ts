import { IUser } from "../modules/auth/models/userModel";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
