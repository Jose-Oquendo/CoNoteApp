@echo off
echo =======================================================
echo   CoNote - AWS SAM Local Emulation Launcher
echo =======================================================
echo.
echo 1. Building AWS SAM package...
call sam build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] AWS SAM build failed. Please make sure AWS SAM CLI and Docker are running.
    exit /b %ERRORLEVEL%
)

echo.
echo 2. Starting AWS SAM Local API on http://localhost:3001 ...
echo    (Press Ctrl+C to stop)
call sam local start-api --port 3001
