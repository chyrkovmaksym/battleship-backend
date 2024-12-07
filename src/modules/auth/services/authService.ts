import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { CustomError } from "../../../utils/customError";

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("Email is already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  return await user.save();
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CustomError("Invalid credentials", 400);
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "", {
    expiresIn: "8h",
  });
  return { token, user };
};
