import { Request, Response } from "express";
import * as userService from "../services/userService";
import { handleError } from "../../../utils/handleError";

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { searchTerm = "", page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const { users, totalUsers } = await userService.searchUsers(
      searchTerm as string,
      pageNumber,
      limitNumber
    );

    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    res.send(status).json({ message });
  }
};
