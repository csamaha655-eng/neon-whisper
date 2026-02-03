# Quick Vercel Deployment Guide

Deploy your Neon Whisper game to Vercel and share it with friends!

## 🚀 Quick Start

### Step 1: Deploy Backend to Railway (Free)

1. **Go to [railway.app](https://railway.app)** and sign up/login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `neon-whisper` repository
4. Click **"Add Service"** → **"GitHub Repo"** again
5. In the service settings:
   - **Root Directory**: Set to `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Go to **"Variables"** tab and add:
   - `CLIENT_URL`: `https://your-app.vercel.app` (we'll update this after frontend deploy)
   - `PORT`: `3001` (optional, Railway auto-assigns)
7. Railway will automatically deploy and give you a URL like: `https://your-app.up.railway.app`
8. **Copy this URL** - you'll need it for the frontend!

### Step 2: Deploy Frontend to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   cd /Users/charbelsamaha/Whisper
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? → **Yes**
   - Which scope? → Select your account
   - Link to existing project? → **No** (first time)
   - Project name? → Press Enter (or type `neon-whisper`)
   - Directory? → Press Enter (use `./`)
   - Override settings? → **No**

5. **Add Environment Variable**:
   - After deployment, go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click on your project
   - Go to **Settings** → **Environment Variables**
   - Add:
     - **Name**: `VITE_SERVER_URL`
     - **Value**: Your Railway backend URL (e.g., `https://your-app.up.railway.app`)
     - **Environment**: Production, Preview, Development (select all)
   - Click **Save**

6. **Redeploy** to apply the environment variable:
   ```bash
   vercel --prod
   ```
   Or trigger a redeploy from the Vercel dashboard.

#### Option B: Using GitHub Integration

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign up/login

3. **Click "Add New..." → "Project"**

4. **Import your GitHub repository** (`neon-whisper`)

5. **Configure the project**:
   - Framework Preset: **Vite**
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)

6. **Add Environment Variable**:
   - Before clicking "Deploy", expand **"Environment Variables"**
   - Add:
     - **Name**: `VITE_SERVER_URL`
     - **Value**: Your Railway backend URL
     - **Environment**: Select all (Production, Preview, Development)

7. **Click "Deploy"**

8. **Wait for deployment** (usually 1-2 minutes)

### Step 3: Update Backend CORS

After your frontend is deployed, update the Railway backend:

1. Go back to **Railway dashboard** → Your service
2. Go to **Variables** tab
3. Update `CLIENT_URL` to your Vercel URL (e.g., `https://neon-whisper.vercel.app`)
4. Railway will automatically redeploy

### Step 4: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://neon-whisper.vercel.app`)
2. Try creating a multiplayer room
3. Share the room code with a friend
4. Test the game flow!

## 🔗 Share Your Game

Once deployed, you'll get a URL like:
- **Frontend**: `https://neon-whisper.vercel.app`
- **Backend**: `https://your-app.up.railway.app` (internal, not needed to share)

**Just share the Vercel URL with your friends!** 🎮

## 📝 Environment Variables Summary

### Frontend (Vercel)
- `VITE_SERVER_URL`: Your Railway backend URL

### Backend (Railway)
- `CLIENT_URL`: Your Vercel frontend URL
- `PORT`: `3001` (optional, Railway auto-assigns)

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check that `VITE_SERVER_URL` is set correctly in Vercel
- Make sure the Railway backend is running (check Railway dashboard)
- Verify CORS is configured (check `CLIENT_URL` in Railway)

### CORS errors
- Ensure `CLIENT_URL` in Railway matches your Vercel URL exactly
- Include `https://` in the URL
- Redeploy both services after changing environment variables

### Socket connection fails
- Check browser console for errors
- Verify Railway backend URL is accessible
- Make sure WebSocket connections are allowed (Railway supports this)

## 🎉 You're Done!

Your game is now live and ready to share! Friends can join using the room code system.

