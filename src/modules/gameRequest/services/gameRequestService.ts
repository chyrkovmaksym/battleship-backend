import { CustomError } from "../../../utils/customError";
import { Notification } from "../../notification/models/notificationModel";
import { User } from "../../user/models/userModel";
// import { GameRequest } from "../models/gameRequestModel";

export const sendGameRequest = async (
  fromUserId: string,
  toUserId: string,
  gameId: string
) => {
  if (fromUserId === toUserId) {
    throw new CustomError("You cannot send a game request to yourself", 400);
  }

  const isFriend = await User.exists({ _id: fromUserId, friends: toUserId });
  if (!isFriend) {
    throw new CustomError(
      "You can only send game requests to your friends",
      400
    );
  }

  const notification = new Notification({
    user: toUserId,
    type: "gameRequest",
    content: "You have a new game request",
    fromUser: fromUserId,
    requestId: gameId,
  });

  await notification.save();

  // const existingRequest = await GameRequest.findOne({
  //   fromUser: fromUserId,
  //   toUser: toUserId,
  //   status: "pending",
  // });

  // if (existingRequest) {
  //   throw new CustomError("Game request already sent", 400);
  // }

  // const gameRequest = new GameRequest({
  //   fromUser: fromUserId,
  //   toUser: toUserId,
  // });
  // await gameRequest.save();
};

// export const respondToGameRequest = async (
//   requestId: string,
//   userId: string,
//   status: "accepted" | "rejected"
// ) => {
//   const gameRequest = await GameRequest.findById(requestId);

//   if (!gameRequest) {
//     throw new CustomError("Game request not found", 400);
//   }

//   if (gameRequest.toUser.toString() !== userId) {
//     throw new CustomError("Unauthorized to respond to this request", 400);
//   }

//   gameRequest.status = status;
//   await gameRequest.save();

//   if (status === "accepted") {
//     const gameRoomId = `game_${gameRequest.fromUser}_${gameRequest.toUser}`;
//     return { gameRoomId };
//   }

//   return { status };
// };
