Write-Host "Setting up environment variables for Next.js..." -ForegroundColor Green
Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host ".env.local already exists!" -ForegroundColor Yellow
    Write-Host "Please check if it contains the correct values." -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    exit
}

# Copy env.example to .env.local
Write-Host "Copying env.example to .env.local..." -ForegroundColor Cyan
try {
    Copy-Item "env.example" ".env.local"
    Write-Host ""
    Write-Host "✅ Environment file created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Please verify that .env.local contains the correct values:" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Gray
    Write-Host "- NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Gray
    Write-Host "- RESEND_API_KEY" -ForegroundColor Gray
    Write-Host "- NOTIFICATION_EMAILS" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Then restart your Next.js development server." -ForegroundColor Yellow
} catch {
    Write-Host ""
    Write-Host "❌ Failed to create environment file!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please manually copy env.example to .env.local" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to continue"
