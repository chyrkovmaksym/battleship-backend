import { CustomError } from "../../../utils/customError";
import { Notification } from "../../notification/models/notificationModel";
import { User } from "../../user/models/userModel";
import { FriendRequest } from "../models/friendModel";

export const sendFriendRequest = async (
  fromUserId: string,
  toUserId: string
) => {
  if (fromUserId === toUserId) {
    throw new CustomError("You cannot send a friend request to yourself", 400);
  }

  const existingRequest = await FriendRequest.findOne({
    fromUser: fromUserId,
    toUser: toUserId,
  });

  if (existingRequest) {
    throw new CustomError("Friend request already sent", 400);
  }

  const friendRequest = new FriendRequest({
    fromUser: fromUserId,
    toUser: toUserId,
  });
  await friendRequest.save();

  const notification = new Notification({
    user: toUserId,
    type: "friendRequest",
    content: "You have a new friend request",
    fromUser: fromUserId,
  });
  await notification.save();

  return friendRequest;
};

export const respondToFriendRequest = async (
  requestId: string,
  userId: string,
  status: "accepted" | "rejected"
) => {
  const friendRequest = await FriendRequest.findById(requestId);

  if (!friendRequest) {
    throw new CustomError("Friend request not found", 400);
  }

  if (friendRequest.toUser.toString() !== userId) {
    throw new CustomError("Unauthorized to respond to this request", 400);
  }

  friendRequest.status = status;
  await friendRequest.save();

  if (status === "accepted") {
    await User.findByIdAndUpdate(userId, {
      $push: { friends: friendRequest.fromUser },
    });
    await User.findByIdAndUpdate(friendRequest.fromUser, {
      $push: { friends: userId },
    });

    const notification = new Notification({
      user: friendRequest.fromUser,
      type: "friendRequest",
      content: "Your friend request was accepted",
      fromUser: userId,
    });
    await notification.save();
  } else if (status === "rejected") {
    const notification = new Notification({
      user: friendRequest.fromUser,
      type: "friendRequest",
      content: "Your friend request was rejected",
      fromUser: userId,
    });
    await notification.save();
  }

  return { status };
};
