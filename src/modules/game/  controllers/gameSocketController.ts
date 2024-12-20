import { Server, Socket } from "socket.io";
import {
  createRoom,
  hideShips,
  joinRoom,
  markSurroundingCellsAsMissed,
} from "../services/gameService";
import { Game } from "../models/gameModel";

export const handleGameSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    socket.on("createRoom", async (data) => {
      try {
        const { playerId } = data;

        const game = await createRoom(playerId);

        socket.join(game.id);
        socket.emit("roomCreated", { gameId: game.id });
      } catch (error) {
        console.error("Error creating room:", error);
        socket.emit("error", { message: "Failed to create room." });
      }
    });

    socket.on("joinRoom", async (data) => {
      try {
        const { gameId, playerId } = data;

        const game = await joinRoom(gameId, playerId);

        socket.join(gameId);
        io.to(gameId).emit("playerJoined", {
          gameId: game.id,
          players: game.players,
        });
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join room." });
      }
    });

    socket.on("submitBoard", async (data) => {
      try {
        const { gameId, playerId, board } = data;

        const game = await Game.findById(gameId);
        if (!game) throw new Error("Game not found");

        // Validate board dimensions and content
        if (
          !Array.isArray(board) ||
          board.length !== 10 ||
          board.some((row) => row.length !== 10)
        ) {
          throw new Error("Invalid board dimensions");
        }

        const isPlayer1 = game.players[0].toString() === playerId;

        // Save board for the corresponding player
        if (isPlayer1) {
          game.boards.player1 = board;
        } else if (game.players[1] && game.players[1].toString() === playerId) {
          game.boards.player2 = board;
        } else {
          throw new Error("Invalid player");
        }

        game.markModified("boards");
        await game.save();

        // Check if both players have submitted their boards
        if (game.boards.player1 && game.boards.player2) {
          game.isActive = true;
          game.turn = game.players[0];
          await game.save();

          io.to(gameId).emit("gameStarted", {
            gameId: game.id,
            turn: game.turn,
          });
        } else {
          socket.emit("waitingForOpponent", {
            message: "Waiting for the other player to submit their board.",
          });
        }
      } catch (error) {
        console.error("Error submitting board:", error);
        socket.emit("error", { message: (error as any).message });
      }
    });

    socket.on("makeMove", async (data) => {
      try {
        const { gameId, playerId, x, y } = data;

        const game = await Game.findById(gameId);
        if (!game) throw new Error("Game not found");
        if (!game.isActive) throw new Error("Game has not started yet");
        if (game.turn.toString() !== playerId) throw new Error("Not your turn");

        const isPlayer1 = game.players[0].toString() === playerId;

        // Determine which board is the player's and which is the opponent's
        const opponentBoard = (
          isPlayer1 ? game.boards.player2 : game.boards.player1
        )?.map((item) => [...item]);

        if (!opponentBoard) throw new Error("Opponent's board is empty");

        const cell = opponentBoard[x][y];

        // If the cell was already targeted, return an error
        if (cell === "M" || cell.startsWith("H") || cell === "K") {
          throw new Error("Cell already targeted");
        }

        let moveResult = "";
        if (cell === "") {
          // Miss
          opponentBoard[x][y] = "M";
          moveResult = "miss";
        } else if (cell.startsWith("S")) {
          const newValue = "H_" + cell;
          // Hit
          opponentBoard[x][y] = newValue;

          // Check if the ship is completely sunk
          const isSunk = opponentBoard.every((row) => !row.includes(cell));
          if (isSunk) {
            // Mark all parts of the ship as "K" (killed)
            for (let i = 0; i < opponentBoard.length; i++) {
              for (let j = 0; j < opponentBoard[i].length; j++) {
                if (opponentBoard[i][j] === newValue) {
                  opponentBoard[i][j] = "K";
                }
              }
            }
            for (let i = 0; i < opponentBoard.length; i++) {
              for (let j = 0; j < opponentBoard[i].length; j++) {
                // Mark surrounding cells as missed (M)
                markSurroundingCellsAsMissed(opponentBoard, i, j);
              }
            }
            moveResult = "killed";
          } else {
            moveResult = "hit";
          }
        }

        if (isPlayer1) {
          game.boards.player2 = opponentBoard;
        } else {
          game.boards.player1 = opponentBoard;
        }

        // Switch turn
        if (moveResult !== "hit" && moveResult !== "killed") {
          game.turn = isPlayer1 ? game.players[1] : game.players[0];
        }
        game.markModified("boards");
        await game.save();

        // Check if the opponent has any remaining ships
        const opponentStillHasShips = opponentBoard.some((row) =>
          row.some((cell) => cell.startsWith("S"))
        );

        if (!opponentStillHasShips) {
          game.isActive = false;
          const winnerId = playerId;

          await game.save();

          io.to(gameId).emit("gameOver", {
            winner: winnerId,
            boards: {
              updatedBoard: hideShips(opponentBoard),
            },
            turn: game.turn,
            result: moveResult,
            x,
            y,
          });
          return;
        }

        // Notify players about the move and send modified boards
        io.to(gameId).emit("moveMade", {
          boards: {
            updatedBoard: hideShips(opponentBoard),
          },
          turn: game.turn,
          result: moveResult,
          x,
          y,
        });
      } catch (error) {
        console.error("Error making move:", error);
        socket.emit("error", { message: (error as any).message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
