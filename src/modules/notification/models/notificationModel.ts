import mongoose, { Schema, Document, Types } from "mongoose";

interface INotification extends Document {
  user: Types.ObjectId;
  type: "friendRequest" | "gameRequest";
  content: string;
  fromUser: Types.ObjectId;
  isRead: boolean;
  requestId: Types.ObjectId;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["friendRequest", "gameRequest"],
    required: true,
  },
  content: { type: String, required: true },
  fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isRead: { type: Boolean, default: false },
  requestId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
