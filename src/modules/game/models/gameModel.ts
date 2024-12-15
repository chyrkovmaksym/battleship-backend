import mongoose, { Schema, Document, Types } from "mongoose";

interface IGame extends Document {
  players: Types.ObjectId[];
  boards: {
    player1: string[][];
    player2: string[][];
  };
  turn: Types.ObjectId;
  isActive: boolean;
}

const gameSchema = new Schema<IGame>({
  players: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  boards: {
    player1: {
      type: [[String]],
      default: Array(10).fill(Array(10).fill("")),
    },
    player2: {
      type: [[String]],
      default: Array(10).fill(Array(10).fill("")),
    },
  },
  turn: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true },
});

export const Game = mongoose.model<IGame>("Game", gameSchema);
