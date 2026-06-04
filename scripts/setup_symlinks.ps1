# io-neruda Symlinks Setup
# Crea enlaces simbolicos en el Framework

Write-Host "`nio-neruda Symlinks Setup`n" -ForegroundColor Cyan

# Rutas
$ProjectRoot = "E:\git\app\tools\io-neruda"
$FrameworkDir = "E:\lib\000-Framework\000-IO-TOOLS\✅ 010-io-neruda"

# Verificar que existen
if (-not (Test-Path $ProjectRoot)) {
    Write-Host "Error: No encontre $ProjectRoot" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $FrameworkDir)) {
    Write-Host "Error: No encontre $FrameworkDir" -ForegroundColor Red
    exit 1
}

Write-Host "Creando symlinks...`n" -ForegroundColor Cyan

# Crear symlink para INSTRUCCIONES
$InstructionsSource = "$ProjectRoot\docs\INSTRUCCIONES-io-neruda.md"
$InstructionsLink = "$FrameworkDir\INSTRUCCIONES-io-neruda.md"

if (Test-Path $InstructionsSource) {
    if (Test-Path $InstructionsLink) {
        Remove-Item -Path $InstructionsLink -Force
    }

    try {
        New-Item -ItemType SymbolicLink -Path $InstructionsLink -Target $InstructionsSource -Force | Out-Null
        Write-Host "OK: INSTRUCCIONES-io-neruda.md" -ForegroundColor Green
    }
    catch {
        Write-Host "ERROR: No se pudo crear symlink para INSTRUCCIONES" -ForegroundColor Red
        Write-Host "(Necesita permisos de administrador)" -ForegroundColor Yellow
    }
}

# Crear symlink para EXPORTERS
$ExportersSource = "$ProjectRoot\EXPORTERS.md"
$ExportersLink = "$FrameworkDir\EXPORTERS.md"

if (Test-Path $ExportersSource) {
    if (Test-Path $ExportersLink) {
        Remove-Item -Path $ExportersLink -Force
    }

    try {
        New-Item -ItemType SymbolicLink -Path $ExportersLink -Target $ExportersSource -Force | Out-Null
        Write-Host "OK: EXPORTERS.md" -ForegroundColor Green
    }
    catch {
        Write-Host "ERROR: No se pudo crear symlink para EXPORTERS" -ForegroundColor Red
    }
}

# Crear symlink para scripts
$ScriptsSource = "$ProjectRoot\scripts"
$ScriptsLink = "$FrameworkDir\scripts"

if (Test-Path $ScriptsSource) {
    if (Test-Path $ScriptsLink) {
        Remove-Item -Path $ScriptsLink -Force
    }

    try {
        New-Item -ItemType SymbolicLink -Path $ScriptsLink -Target $ScriptsSource -Force | Out-Null
        Write-Host "OK: scripts/" -ForegroundColor Green
    }
    catch {
        Write-Host "ERROR: No se pudo crear symlink para scripts" -ForegroundColor Red
    }
}

Write-Host "`nSe crear: $FrameworkDir`n" -ForegroundColor Gray
