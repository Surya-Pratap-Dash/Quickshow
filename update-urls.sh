#!/bin/bash

# QuickShow Deployment URL Updater
# Run this after deploying to update all URLs

echo "🚀 QuickShow Deployment URL Updater"
echo "=================================="

# Get URLs from user
echo "Enter your Render server URL (e.g., https://quickshow-server.onrender.com):"
read RENDER_URL

echo "Enter your Vercel client URL (e.g., https://quickshow-client.vercel.app):"
read VERCEL_URL

echo ""
echo "📝 Updating configuration files..."
echo "=================================="

# Update client .env
echo "Updating client/.env..."
sed -i "s|VITE_BASE_URL=.*|VITE_BASE_URL=$RENDER_URL|" client/.env

# Update server CORS (you'll need to do this manually in Render dashboard)
echo ""
echo "⚠️  MANUAL STEPS REQUIRED:"
echo "========================"
echo "1. In Render Dashboard → Your Server → Environment:"
echo "   Set FRONTEND_URL=$VERCEL_URL"
echo ""
echo "2. In Vercel Dashboard → Your Client → Environment:"
echo "   Set VITE_BASE_URL=$RENDER_URL"
echo ""
echo "3. In Clerk Dashboard → Webhooks:"
echo "   Update webhook URL to: $RENDER_URL/api/inngest"
echo ""

echo "✅ Local files updated!"
echo "📋 URLs configured:"
echo "   - Server: $RENDER_URL"
echo "   - Client: $VERCEL_URL"
echo ""
echo "🎉 Ready for testing!"