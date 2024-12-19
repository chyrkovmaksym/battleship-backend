# Battleship Backend

This repository contains the backend for the Battleship game, a strategic multiplayer game where users can challenge friends or play against AI. The backend is built using **Express** and **TypeScript**, with **MongoDB** as the database.

### Battleship Game Rules

- **Objective**: The goal is to sink all of your opponent's ships before they sink yours.
- **Setup**: Each player places their fleet of ships on a grid, hidden from the opponent. Ships can be positioned horizontally or vertically.
- **Gameplay**:
  1. Players take turns calling out a grid coordinate (e.g., A5) to attack.
  2. The opponent responds with "hit" or "miss" based on whether a ship occupies the targeted coordinate.
  3. When all coordinates of a ship are hit, the ship is considered "sunk."
- **Winning**: The first player to sink all of the opponent's ships wins.
- **Grid Size**: The standard grid size is 10x10, but variations can be used for different difficulty levels.


## Features

### User Management

- **Authentication**: Secure user authentication using JSON Web Tokens (JWT).
- **Friend Management**: Add and manage friends.

### Game Features

- **Game Requests**: Send and manage game requests between users.
- **Real-Time Gameplay**: Enable real-time communication between players during a game (requires WebSocket integration).

### Notifications

- **Notification System**: Send and manage notifications for events like game requests and friend requests.

### Search

- **User Search**: Search for users with pagination, allowing users to find others by name or email while skipping friends and themselves from the results.

### Pagination

- **Paginated Endpoints**: The search and other list endpoints support pagination by accepting `page` and `limit` query parameters to control the number of results per page.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (>= 16.x)
- [MongoDB](https://www.mongodb.com/) (>= 4.x)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/chyrkovmaksym/battleship-backend.git
   cd battleship-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/battleship
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The server should now be running at `http://localhost:8000`.

## Scripts

- `npm run dev`: Start the server in development mode using `ts-node`.
- `npm run build`: Compile TypeScript into JavaScript.
- `npm start`: Run the compiled JavaScript code.

## Development Notes

### Error Handling

Errors are handled using a custom `CustomError` class, ensuring consistent error messages and status codes across the application.

### Middleware

- `isAuthenticated`: Verifies the JWT token for protected routes.

### Database Models

- **User**: Stores user information and friend relationships.
- **Notification**: Manages notifications for users.
- **GameRequest**: Handles game requests.
- **FriendRequest**: Tracks and manages friend request interactions.

