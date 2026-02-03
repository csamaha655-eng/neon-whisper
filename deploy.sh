#!/bin/bash

# Quick deployment script for Neon Whisper
# This script helps you deploy to Vercel

echo "🚀 Neon Whisper Deployment Helper"
echo "=================================="
echo ""
echo "This script will help you deploy the frontend to Vercel."
echo "Make sure you've already deployed the backend to Railway!"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo ""
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "🌐 Deploying to Vercel..."
echo "   (Follow the prompts in Vercel CLI)"
echo ""

vercel --prod

echo ""
echo "📝 Don't forget to:"
echo "   1. Add VITE_SERVER_URL environment variable in Vercel dashboard"
echo "   2. Set it to your Railway backend URL"
echo "   3. Redeploy after adding the variable"
echo ""
echo "✨ Check VERCEL_DEPLOY.md for detailed instructions!"

