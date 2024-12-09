import { User } from "../models/userModel";

export const searchUsers = async (
  searchTerm: string,
  page: number,
  limit: number,
  userId: string
) => {
  const skip = (page - 1) * limit;

  const searchQuery = {
    $or: [
      { firstName: { $regex: searchTerm, $options: "i" } },
      { lastName: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
    ],
    _id: { $ne: userId },
  };

  const users = await User.find(searchQuery)
    .select("firstName lastName email")
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments(searchQuery);

  return { users, totalUsers };
};
