@echo off
echo Setting up environment variables for Next.js...
echo.

REM Check if .env.local exists
if exist .env.local (
    echo .env.local already exists!
    echo Please check if it contains the correct values.
    pause
    exit /b
)

REM Copy env.example to .env.local
echo Copying env.example to .env.local...
copy env.example .env.local

if %errorlevel% equ 0 (
    echo.
    echo ✅ Environment file created successfully!
    echo.
    echo Please verify that .env.local contains the correct values:
    echo - NEXT_PUBLIC_SUPABASE_URL
    echo - NEXT_PUBLIC_SUPABASE_ANON_KEY
    echo - RESEND_API_KEY
    echo - NOTIFICATION_EMAILS
    echo.
    echo Then restart your Next.js development server.
) else (
    echo.
    echo ❌ Failed to create environment file!
    echo Please manually copy env.example to .env.local
)

echo.
pause
