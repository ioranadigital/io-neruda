# io-neruda Exporters System - DEMO
# Script para demostrar todos los exportadores

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        io-neruda Exporters System - DEMO                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$pythonPath = "python"
$scriptPath = "scripts/publish.py"
$postFile = "E:/lib/003-Pipeline-Contenidos/03-Ready-To-Publish/blog-vintage-primavera-2026-20260520.md"
$outputDir = "./exports-demo"

# Verificar que el archivo existe
if (-not (Test-Path $postFile)) {
    Write-Host "❌ Error: No encontré el archivo de blog" -ForegroundColor Red
    Write-Host "Esperaba: $postFile" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Archivo fuente: $(Split-Path $postFile -Leaf)" -ForegroundColor Green
Write-Host "📁 Output directory: $outputDir`n" -ForegroundColor Green

# Limpiar outputs anteriores
if (Test-Path $outputDir) {
    Write-Host "🧹 Limpiando outputs anteriores..." -ForegroundColor Yellow
    Remove-Item $outputDir -Recurse -Force
}

Write-Host "`n" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "DEMO 1: Exportar TODOS los formatos" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Gray

& $pythonPath $scriptPath `
    --file $postFile `
    --target all `
    --output $outputDir `
    --url "https://surfvintage.com/blog/moda-vintage-primavera-2026"

Write-Host "`n" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "DEMO 2: Solo WhatsApp - Todos los estilos" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Gray

& $pythonPath $scriptPath `
    --file $postFile `
    --target whatsapp `
    --output "$outputDir-whatsapp" `
    --whatsapp-styles teaser series catalog newsletter `
    --url "https://surfvintage.com/blog/moda-vintage-primavera-2026"

Write-Host "`n" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "DEMO 3: Solo Email - Templates specific" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Gray

& $pythonPath $scriptPath `
    --file $postFile `
    --target email `
    --output "$outputDir-email" `
    --email-templates standard fancy

Write-Host "`n" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "DEMO 4: Social Media - Twitter + LinkedIn" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Gray

& $pythonPath $scriptPath `
    --file $postFile `
    --target social `
    --output "$outputDir-social" `
    --social-platforms twitter linkedin

Write-Host "`n" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "✅ DEMOSTRACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Gray

Write-Host "📁 Outputs generados en:" -ForegroundColor Yellow
Write-Host "   • $outputDir/" -ForegroundColor Gray
Write-Host "   • $outputDir-whatsapp/" -ForegroundColor Gray
Write-Host "   • $outputDir-email/" -ForegroundColor Gray
Write-Host "   • $outputDir-social/`n" -ForegroundColor Gray

Write-Host "📖 Documentación completa: EXPORTERS.md`n" -ForegroundColor Cyan

Write-Host "Ejemplos de uso individual:`n" -ForegroundColor Yellow
Write-Host "  Markdown limpio:" -ForegroundColor Gray
Write-Host "    python scripts/publish.py --file post.md --target markdown`n" -ForegroundColor DarkGray

Write-Host "  WhatsApp teaser:" -ForegroundColor Gray
Write-Host "    python scripts/publish.py --file post.md --target whatsapp --whatsapp-styles teaser`n" -ForegroundColor DarkGray

Write-Host "  Todo a la vez:" -ForegroundColor Gray
Write-Host "    python scripts/publish.py --file post.md --target all --url https://example.com`n" -ForegroundColor DarkGray
