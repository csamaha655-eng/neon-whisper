# Deployment Guide

## Frontend Deployment (Vercel)

### Step 1: Prepare for Deployment

1. Make sure you have a `.env` file with:
```
VITE_SERVER_URL=https://your-backend-server-url.com
```

2. Build the project locally to test:
```bash
npm run build
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (Press Enter for default)
   - Directory? (Press Enter for `./`)
   - Override settings? **No**

5. Set environment variable in Vercel Dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `VITE_SERVER_URL` with your backend server URL

#### Option B: Using GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variable `VITE_SERVER_URL`
7. Click "Deploy"

## Backend Server Deployment

### Option 1: Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo" or "Empty Project"
4. If empty project:
   - Add a new service
   - Select "GitHub Repo" and choose your repo
   - Set root directory to `server/`
5. Set environment variables:
   - `PORT`: `3001` (or leave default)
   - `CLIENT_URL`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
6. Railway will automatically detect Node.js and deploy

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `whisper-server`
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Set environment variables:
   - `CLIENT_URL`: Your Vercel frontend URL
6. Click "Create Web Service"

### Option 3: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create whisper-server`
4. Set environment variables:
   ```bash
   heroku config:set CLIENT_URL=https://your-app.vercel.app
   ```
5. Deploy:
   ```bash
   cd server
   git subtree push --prefix server heroku main
   ```

## Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend server deployed
- [ ] `VITE_SERVER_URL` set in Vercel environment variables
- [ ] `CLIENT_URL` set in backend server environment variables
- [ ] Test creating a room
- [ ] Test joining a room with room code
- [ ] Test game flow end-to-end

## Troubleshooting

### CORS Issues
If you see CORS errors, make sure:
- `CLIENT_URL` in backend matches your frontend URL exactly
- Backend allows your frontend origin

### Socket Connection Issues
- Check that `VITE_SERVER_URL` is set correctly
- Verify backend server is running
- Check browser console for connection errors

### Environment Variables Not Working
- Restart Vercel deployment after adding environment variables
- Make sure variable names start with `VITE_` for Vite to expose them

