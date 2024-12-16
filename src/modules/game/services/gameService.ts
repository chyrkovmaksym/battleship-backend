import mongoose from "mongoose";
import { Game } from "../models/gameModel";

export const createRoom = async (player: string) => {
  const game = new Game({
    players: [player],
    turn: player,
  });
  return await game.save();
};

export const joinRoom = async (gameId: string, player: string) => {
  const game = await Game.findById(gameId);
  if (!game) throw new Error("Room not found");
  if (game.players.length >= 2) throw new Error("Room is full");

  const playerId = new mongoose.Types.ObjectId(player);
  game.players.push(playerId);
  await game.save();

  return game;
};

export const markSurroundingCellsAsMissed = (
  board: string[][],
  x: number,
  y: number
) => {
  const directions = [
    [-1, 0], // North
    [-1, 1], // North-East
    [0, 1], // East
    [1, 1], // South-East
    [1, 0], // South
    [1, -1], // South-West
    [0, -1], // West
    [-1, -1], // North-West
  ];

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;

    if (nx >= 0 && nx < board.length && ny >= 0 && ny < board[0].length) {
      if (board[nx][ny] !== "K" && board[nx][ny] !== "M") {
        board[nx][ny] = "M"; // Mark surrounding cell as missed
      }
    }
  }
};
