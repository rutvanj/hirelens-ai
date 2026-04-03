@echo off
echo Starting Student Project Analyzer...

:: Start FastAPI backend in a new window
start "Backend - FastAPI" cmd /k "cd /d "%~dp0backend" && python -m uvicorn app.main:app --reload"

:: Give backend 2 seconds to initialize
timeout /t 2 /nobreak > nul

:: Start Next.js frontend in a new window
start "Frontend - Next.js" cmd /k "cd /d "%~dp0" && npm run dev"

:: Wait for Next.js to fully compile before opening browser
echo Waiting for servers to initialize...
timeout /t 12 /nobreak > nul

:: Open browser
start http://localhost:3000

echo.
echo Both servers are running.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo.
echo Press any key to close this window (servers will keep running).
pause > nul
