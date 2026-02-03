# Whisper Game Server

Backend server for the Whisper multiplayer game using Socket.io.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```
PORT=3001
CLIENT_URL=http://localhost:5173
```

3. Run in development:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Deployment

This server can be deployed to:
- Railway (recommended)
- Render
- Heroku
- Any Node.js hosting service

Make sure to set the `CLIENT_URL` environment variable to your frontend URL.

