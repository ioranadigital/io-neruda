# io-neruda Project Migrator
# Migra contenido existente a la nueva estructura de proyecto

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectName,

    [Parameter(Mandatory=$true)]
    [string]$SourceInsightsDir,

    [Parameter(Mandatory=$false)]
    [string]$SourcePlansDir = "",

    [Parameter(Mandatory=$false)]
    [string]$SourceReadyDir = ""
)

$PipelineRoot = "E:\lib\003-Pipeline-Contenidos"
$ProjectPath = "$PipelineRoot\$ProjectName"

Write-Host "`n" -ForegroundColor Gray
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        io-neruda Project Migrator                          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "Migrando proyecto: $ProjectName`n" -ForegroundColor Yellow

# 1. Verificar que el proyecto existe
if (-not (Test-Path $ProjectPath)) {
    Write-Host "Error: Proyecto $ProjectName no existe en $PipelineRoot" -ForegroundColor Red
    Write-Host "Crea el proyecto primero con: .\create_project.ps1 -ProjectName $ProjectName" -ForegroundColor Yellow
    exit 1
}

# 2. Migrar insights
if (Test-Path $SourceInsightsDir) {
    Write-Host "📄 Migrando insights..." -ForegroundColor Cyan
    $insights = Get-ChildItem -Path $SourceInsightsDir -Filter "*.md"

    foreach ($file in $insights) {
        Copy-Item -Path $file.FullName -Destination "$ProjectPath\01-Buzon-Insights\" -Force
        Write-Host "   ✅ $($file.Name)" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Insights directory no encontrado: $SourceInsightsDir" -ForegroundColor Yellow
}

# 3. Migrar planes
if ($SourcePlansDir -and (Test-Path $SourcePlansDir)) {
    Write-Host "`n📋 Migrando planes..." -ForegroundColor Cyan
    $plans = Get-ChildItem -Path $SourcePlansDir -Filter "*.md"

    foreach ($file in $plans) {
        Copy-Item -Path $file.FullName -Destination "$ProjectPath\02-Generador-Planes\" -Force
        Write-Host "   ✅ $($file.Name)" -ForegroundColor Green
    }
}

# 4. Migrar ready-to-publish
if ($SourceReadyDir -and (Test-Path $SourceReadyDir)) {
    Write-Host "`n📤 Migrando ready-to-publish..." -ForegroundColor Cyan
    $ready = Get-ChildItem -Path $SourceReadyDir -Filter "*.md"

    foreach ($file in $ready) {
        Copy-Item -Path $file.FullName -Destination "$ProjectPath\03-Ready-To-Publish\" -Force
        Write-Host "   ✅ $($file.Name)" -ForegroundColor Green
    }
}

# 5. Resumen
Write-Host "`n" -ForegroundColor Gray
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "Migracion completada!" -ForegroundColor Green
Write-Host "═════════════════════════════════════════════════════════════`n" -ForegroundColor Green

Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Edita config.json: $ProjectPath\00-Config\config.json" -ForegroundColor Gray
Write-Host "  2. Edita .env: $ProjectPath\00-Config\.env.$ProjectName" -ForegroundColor Gray
Write-Host "  3. Agrega credenciales de WordPress" -ForegroundColor Gray
Write-Host "  4. Exporta contenido:" -ForegroundColor Gray
Write-Host "     python scripts/publish.py --project $ProjectName --file 'post.md' --target all`n" -ForegroundColor Gray
