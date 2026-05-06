@echo off
echo ===================================================
echo Starting 3D SaaS Application (Development Mode)
echo ===================================================
echo.
echo 1. Starting Backend API Server...
start cmd /k "cd backend && npm start"

echo 2. Starting Frontend Auto-Updating Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo DONE! The application will open in your browser shortly.
echo ANY code changes you make will now update instantly!
echo ===================================================
timeout /t 3 > nul
start http://localhost:5173
