import mongoose, { Schema, Document, Types } from "mongoose";

interface IUserDetails {
  firstName: string;
  lastName: string;
  email: string;
}

interface IFriendRequest extends Document {
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  sender: IUserDetails;
  receiver: IUserDetails;
}

const friendRequestSchema = new Schema<IFriendRequest>({
  fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  toUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  sender: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
  },
  receiver: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
  },
});

export const FriendRequest = mongoose.model<IFriendRequest>(
  "FriendRequest",
  friendRequestSchema
);
