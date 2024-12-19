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

  const fromUser = await User.findById(fromUserId);
  const toUser = await User.findById(toUserId);

  if (!fromUser || !toUser) {
    throw new CustomError("User not found", 404);
  }

  const friendRequest = new FriendRequest({
    fromUser: fromUserId,
    toUser: toUserId,
    sender: {
      firstName: fromUser.firstName,
      lastName: fromUser.lastName,
      email: fromUser.email,
    },
    receiver: {
      firstName: toUser.firstName,
      lastName: toUser.lastName,
      email: toUser.email,
    },
  });

  await friendRequest.save();

  const notification = new Notification({
    user: toUserId,
    type: "friendRequest",
    content: "You have a new friend request",
    fromUser: fromUserId,
    requestId: friendRequest._id,
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
      requestId: friendRequest._id,
    });
    await notification.save();
  } else if (status === "rejected") {
    const notification = new Notification({
      user: friendRequest.fromUser,
      type: "friendRequest",
      content: "Your friend request was rejected",
      fromUser: userId,
      requestId: friendRequest._id,
    });
    await notification.save();
  }

  return { status };
};

export const getFriendRequests = async (
  userId: string,
  type: "fromUser" | "toUser"
) => {
  let filter: any;

  if (type === "toUser") {
    filter = { toUser: userId };
  } else if (type === "fromUser") {
    filter = { fromUser: userId };
  }

  const requests = await FriendRequest.find(filter)
    .select("fromUser toUser status createdAt sender receiver")
    .sort({
      status: 1,
      createdAt: -1,
    });

  return requests.map((request) => ({
    ...request.toObject(),
    sender: request.sender,
    receiver: request.receiver,
  }));
};

export const getUserFriends = async (userId: string) => {
  const user = await User.findById(userId).populate<{
    friends: Array<{
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    }>;
  }>("friends", "firstName lastName email");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const friendsData = user.friends.map((friend) => ({
    _id: friend._id,
    firstName: friend.firstName,
    lastName: friend.lastName,
    email: friend.email,
  }));

  return friendsData;
};
