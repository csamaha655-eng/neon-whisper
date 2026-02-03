# Neon Whisper

A cyberpunk-themed social deduction word game where players give clues to identify the impostor.

## Features

- **Single Player Mode**: Play with AI bots
- **Multiplayer Mode**: Play with friends via room codes
- **Real-time Synchronization**: Powered by Socket.io
- **Beautiful UI**: Cyberpunk-themed design with neon effects

## Setup

### Frontend

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```
VITE_SERVER_URL=http://localhost:3001
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

### Backend Server

The backend server is in the `server/` directory. See `server/README.md` for setup instructions.

## Deployment

### Frontend (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variable `VITE_SERVER_URL` to your backend server URL in Vercel dashboard.

### Backend Server

The backend server can be deployed to:
- Railway (recommended)
- Render
- Heroku
- Any Node.js hosting service

Make sure to set the `CLIENT_URL` environment variable to your frontend URL.

## How to Play

1. Choose Single Player or Multiplayer mode
2. For multiplayer, create a room or join with a room code
3. Wait for all players to be ready
4. One player is secretly the IMPOSTOR
5. Give one-word clues related to the secret word
6. After 2 rounds, vote to eliminate the Impostor
7. Civilians win if they catch the Impostor!

## Tech Stack

- React + TypeScript
- Vite
- Zustand (state management)
- Socket.io (real-time multiplayer)
- Tailwind CSS
- Three.js (3D background)
