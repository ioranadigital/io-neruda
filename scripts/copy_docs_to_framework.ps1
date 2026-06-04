# Script para copiar documentación al Framework
# Ejecutar después de instalar io-neruda

$SourceFile = "E:\git\app\tools\io-neruda\docs\INSTRUCCIONES-io-neruda.md"
$TargetDir = "E:\lib\000-Framework\000-IO-TOOLS\✅ 010-io-neruda"

Write-Host "`n📚 Copiando documentación al Framework...`n" -ForegroundColor Cyan

if (-not (Test-Path $SourceFile)) {
    Write-Host "❌ Error: No encontré $SourceFile" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $TargetDir)) {
    Write-Host "❌ Error: No encontré $TargetDir" -ForegroundColor Red
    Write-Host "Crear la carpeta manualmente: $TargetDir" -ForegroundColor Yellow
    exit 1
}

try {
    Copy-Item -Path $SourceFile -Destination "$TargetDir\INSTRUCCIONES-io-neruda.md" -Force
    Write-Host "✅ Documentación copiada correctamente" -ForegroundColor Green
    Write-Host "📍 Ubicación: $TargetDir\INSTRUCCIONES-io-neruda.md`n" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Error al copiar: $_" -ForegroundColor Red
    exit 1
}
