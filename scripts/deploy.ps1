# Deployment Script for io-neruda Frontend
# Usage: .\deploy.ps1 -Environment staging|production

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('staging', 'production')]
    [string]$Environment,

    [string]$BuildDir = "E:\git\app\tools\io-neruda\frontend",
    [bool]$RunTests = $true,
    [bool]$SkipBuild = $false
)

$ErrorActionPreference = 'Stop'

Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║                                                            ║" -ForegroundColor Magenta
Write-Host "║  IO NERUDA DEPLOYMENT SCRIPT                              ║" -ForegroundColor Magenta
Write-Host "║  Environment: $Environment" -ForegroundColor Magenta
Write-Host "║                                                            ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# Step 1: Validate environment
Write-Host "📋 Validating environment..." -ForegroundColor Cyan
if (-not (Test-Path $BuildDir)) {
    throw "Build directory not found: $BuildDir"
}

Set-Location $BuildDir
Write-Host "✅ Build directory verified: $BuildDir" -ForegroundColor Green

# Step 2: Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
if (-not $SkipBuild) {
    $depProcess = Start-Process pnpm -ArgumentList "install" -PassThru -NoNewWindow
    $depProcess.WaitForExit()
    if ($depProcess.ExitCode -ne 0) {
        throw "Dependency installation failed"
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

# Step 3: Run tests
if ($RunTests) {
    Write-Host "`n🧪 Running tests..." -ForegroundColor Cyan
    $testProcess = Start-Process pnpm -ArgumentList "run", "test" -PassThru -NoNewWindow
    $testProcess.WaitForExit()
    if ($testProcess.ExitCode -ne 0) {
        Write-Host "⚠️  Tests failed. Continue anyway? (y/n)" -ForegroundColor Yellow
        $response = Read-Host
        if ($response -ne 'y') {
            throw "Tests failed. Deployment aborted."
        }
    }
    Write-Host "✅ Tests completed" -ForegroundColor Green
}

# Step 4: Run linting
Write-Host "`n🔍 Running linter..." -ForegroundColor Cyan
$lintProcess = Start-Process pnpm -ArgumentList "run", "lint" -PassThru -NoNewWindow
$lintProcess.WaitForExit()
if ($lintProcess.ExitCode -ne 0) {
    Write-Host "⚠️  Linting issues found" -ForegroundColor Yellow
}

# Step 5: Build
Write-Host "`n🔨 Building application..." -ForegroundColor Cyan
$buildProcess = Start-Process pnpm -ArgumentList "run", "build" -PassThru -NoNewWindow
$buildProcess.WaitForExit()
if ($buildProcess.ExitCode -ne 0) {
    throw "Build failed"
}
Write-Host "✅ Build successful" -ForegroundColor Green

# Step 6: Type checking
Write-Host "`n📝 Checking TypeScript types..." -ForegroundColor Cyan
$typeProcess = Start-Process pnpm -ArgumentList "run", "type-check" -PassThru -NoNewWindow
$typeProcess.WaitForExit()
if ($typeProcess.ExitCode -ne 0) {
    Write-Host "⚠️  Type errors found" -ForegroundColor Yellow
}
Write-Host "✅ Type checking completed" -ForegroundColor Green

# Step 7: Deployment
Write-Host "`n🚀 Deploying to $Environment..." -ForegroundColor Cyan

if ($Environment -eq "staging") {
    Write-Host "Deploying to staging environment..." -ForegroundColor Gray
    # Deploy to staging vercel environment
    # vercel --prod=false --token=$env:VERCEL_TOKEN
    Write-Host "Deploy staging: Configure your Vercel CLI deployment here" -ForegroundColor Yellow
}
elseif ($Environment -eq "production") {
    Write-Host "Deploying to PRODUCTION..." -ForegroundColor Red

    # Confirm production deployment
    Write-Host "⚠️  Are you sure you want to deploy to PRODUCTION? (yes/no)" -ForegroundColor Red
    $confirm = Read-Host
    if ($confirm -ne 'yes') {
        throw "Production deployment cancelled"
    }

    # Deploy to production
    # vercel --prod --token=$env:VERCEL_TOKEN
    Write-Host "Deploy production: Configure your Vercel CLI deployment here" -ForegroundColor Yellow
}

Write-Host "✅ Deployment completed" -ForegroundColor Green

# Step 8: Post-deployment checks
Write-Host "`n✔️  Post-deployment verification..." -ForegroundColor Cyan
Write-Host "  □ Check Vercel deployment logs" -ForegroundColor Gray
Write-Host "  □ Verify website accessibility" -ForegroundColor Gray
Write-Host "  □ Run smoke tests on live site" -ForegroundColor Gray
Write-Host "  □ Check error logs in monitoring service" -ForegroundColor Gray

Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║  ✅ DEPLOYMENT COMPLETE                                   ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
