# io-neruda Setup Script
# PowerShell script para configurar el entorno local

Write-Host "Iniciando setup de io-neruda..." -ForegroundColor Green

# 1. Crear venv
Write-Host "`nCreando entorno virtual..." -ForegroundColor Cyan
if (-not (Test-Path "venv")) {
    python -m venv venv
    Write-Host "[OK] venv creado" -ForegroundColor Green
} else {
    Write-Host "[WARN] venv ya existe" -ForegroundColor Yellow
}

# 2. Activar venv
Write-Host "`nActivando venv..." -ForegroundColor Cyan
& .\venv\Scripts\Activate.ps1

# 3. Instalar dependencias
Write-Host "`nInstalando dependencias..." -ForegroundColor Cyan
pip install -r requirements.txt

# 4. Crear carpetas si no existen
Write-Host "`nVerificando carpetas del pipeline..." -ForegroundColor Cyan
$pipelinePath = "E:\lib\003-Pipeline-Contenidos"
$folders = @(
    "$pipelinePath\01-Buzon-Insights",
    "$pipelinePath\02-Generador-Planes",
    "$pipelinePath\03-Ready-To-Publish",
    "$pipelinePath\assets"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "[OK] Creada: $folder" -ForegroundColor Green
    } else {
        Write-Host "[*] Existe: $folder" -ForegroundColor Green
    }
}

# 5. Crear .env files desde template si no existen
Write-Host "`nConfigurando archivos .env..." -ForegroundColor Cyan
$clients = @("resogar", "esgarden")

foreach ($client in $clients) {
    $envFile = ".env.$client"
    if (-not (Test-Path $envFile)) {
        Copy-Item ".env.example" $envFile
        Write-Host "[OK] Creado: $envFile" -ForegroundColor Green
        Write-Host "     [!] Edita $envFile con tus credenciales de WordPress" -ForegroundColor Yellow
    } else {
        Write-Host "[*] Existe: $envFile" -ForegroundColor Green
    }
}

# 6. Verificar estructura
Write-Host "`nVerificando estructura del pipeline..." -ForegroundColor Cyan
python scripts/pipeline.py status

Write-Host "`n[OK] Setup completado!" -ForegroundColor Green
Write-Host "`nProximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Edita los archivos .env.* con tus credenciales de WordPress"
Write-Host "  2. Ejecuta: python scripts/tone_selector.py --list"
Write-Host "  3. Ejecuta: python scripts/pipeline.py status"
Write-Host ""
