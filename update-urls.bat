@echo off
REM QuickShow Deployment URL Updater (Windows)
REM Run this after deploying to update all URLs

echo 🚀 QuickShow Deployment URL Updater
echo ==================================
echo.

set /p RENDER_URL="Enter your Render server URL (e.g., https://quickshow-server.onrender.com): "
set /p VERCEL_URL="Enter your Vercel client URL (e.g., https://quickshow-client.vercel.app): "

echo.
echo 📝 Updating configuration files...
echo ==================================

REM Update client .env
echo Updating client/.env...
powershell -Command "(Get-Content client/.env) -replace 'VITE_BASE_URL=.*', 'VITE_BASE_URL=%RENDER_URL%' | Set-Content client/.env"

echo.
echo ⚠️  MANUAL STEPS REQUIRED:
echo ========================
echo 1. In Render Dashboard → Your Server → Environment:
echo    Set FRONTEND_URL=%VERCEL_URL%
echo.
echo 2. In Vercel Dashboard → Your Client → Environment:
echo    Set VITE_BASE_URL=%RENDER_URL%
echo.
echo 3. In Clerk Dashboard → Webhooks:
echo    Update webhook URL to: %RENDER_URL%/api/inngest
echo.

echo ✅ Local files updated!
echo 📋 URLs configured:
echo    - Server: %RENDER_URL%
echo    - Client: %VERCEL_URL%
echo.
echo 🎉 Ready for testing!

pause