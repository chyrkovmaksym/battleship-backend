import { User } from "../models/userModel";

export const searchUsers = async (
  searchTerm: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const users = await User.find({
    $or: [
      { firstName: { $regex: searchTerm, $options: "i" } },
      { lastName: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
    ],
  })
    .select("firstName lastName email")
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments({
    $or: [
      { firstName: { $regex: searchTerm, $options: "i" } },
      { lastName: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
    ],
  });

  return { users, totalUsers };
};
