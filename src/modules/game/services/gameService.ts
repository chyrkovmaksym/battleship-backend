import mongoose from "mongoose";
import { Game } from "../models/gameModel";

export const createRoom = async (player: string) => {
  const emptyBoard = Array(10).fill(Array(10).fill(""));

  const game = new Game({
    players: [player],
    currentBoardState: emptyBoard,
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
