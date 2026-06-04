# io-neruda Project Creator
# Script para crear nuevo proyecto en E:\lib\003-Pipeline-Contenidos

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectName,

    [Parameter(Mandatory=$true)]
    [string]$ProjectDisplayName,

    [Parameter(Mandatory=$false)]
    [string]$ProjectType = "blog",

    [Parameter(Mandatory=$false)]
    [string]$WordPressURL = "",

    [Parameter(Mandatory=$false)]
    [string]$WordPressUser = ""
)

# Configuración
$PipelineRoot = "E:\lib\003-Pipeline-Contenidos"
$ProjectPath = "$PipelineRoot\$ProjectName"

Write-Host "`n" -ForegroundColor Gray
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        io-neruda Project Creator                           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "📋 Nuevo Proyecto:" -ForegroundColor Yellow
Write-Host "   Nombre: $ProjectName" -ForegroundColor Gray
Write-Host "   Display: $ProjectDisplayName" -ForegroundColor Gray
Write-Host "   Tipo: $ProjectType" -ForegroundColor Gray
Write-Host "   Ruta: $ProjectPath`n" -ForegroundColor Gray

# 1. Verificar que 003-Pipeline-Contenidos existe
if (-not (Test-Path $PipelineRoot)) {
    Write-Host "❌ Error: No encontré $PipelineRoot" -ForegroundColor Red
    exit 1
}

# 2. Verificar que proyecto no exista
if (Test-Path $ProjectPath) {
    Write-Host "❌ Error: El proyecto $ProjectName ya existe" -ForegroundColor Red
    exit 1
}

# 3. Crear estructura de carpetas
Write-Host "🔧 Creando estructura de carpetas..." -ForegroundColor Cyan

$folders = @(
    "$ProjectPath\00-Config",
    "$ProjectPath\01-Buzon-Insights",
    "$ProjectPath\02-Generador-Planes",
    "$ProjectPath\03-Ready-To-Publish",
    "$ProjectPath\assets",
    "$ProjectPath\assets\headers",
    "$ProjectPath\assets\images"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
    Write-Host "   ✅ $($folder -replace [regex]::Escape($PipelineRoot), '')" -ForegroundColor Green
}

# 4. Crear config.json
Write-Host "`n🔧 Creando config.json..." -ForegroundColor Cyan

$configJson = @{
    project = $ProjectName
    name = $ProjectDisplayName
    type = $ProjectType
    wordpress_url = $WordPressURL
    wordpress_user = $WordPressUser
    tone = @{
        primary = "professional"
        secondary = "friendly"
        keywords = @()
    }
    exporters = @{
        enabled = @("markdown", "whatsapp", "html", "json", "social", "email")
        defaults = @{
            whatsapp_styles = @("teaser", "series")
            email_templates = @("standard", "minimal")
            social_platforms = @("twitter", "linkedin")
        }
    }
    team = @{
        owner = "ioranadigital"
        reviewers = @()
    }
    status = "active"
    created = Get-Date -Format "yyyy-MM-dd"
    updated = Get-Date -Format "yyyy-MM-dd"
} | ConvertTo-Json -Depth 10

$configJson | Set-Content "$ProjectPath\00-Config\config.json" -Encoding UTF8
Write-Host "   ✅ config.json creado" -ForegroundColor Green

# 5. Crear .env template
Write-Host "`n🔧 Creando .env template..." -ForegroundColor Cyan

$envTemplate = @"
# WordPress Configuration for $ProjectName

WORDPRESS_URL=$WordPressURL
WORDPRESS_USERNAME=$WordPressUser
WORDPRESS_PASSWORD=app_password_here

# Google Drive (opcional)
GOOGLE_DRIVE_FOLDER_ID=

# Configuración io-neruda
PROJECT_NAME=$ProjectName
PROJECT_TYPE=$ProjectType
"@

$envTemplate | Set-Content "$ProjectPath\00-Config\.env.$ProjectName" -Encoding UTF8
Write-Host "   ✅ .env.$ProjectName creado" -ForegroundColor Green

# 6. Crear README.md del proyecto
Write-Host "`n🔧 Creando README.md..." -ForegroundColor Cyan

$readmeContent = @"
# Proyecto: $ProjectDisplayName

**Tipo:** $ProjectType
**Estado:** Activo
**Creado:** $(Get-Date -Format "yyyy-MM-dd")

---

## 📂 Estructura

\`\`\`
$ProjectName/
├── 00-Config/                  ← Configuración del proyecto
│   ├── config.json            ← Metadatos del proyecto
│   ├── .env.$ProjectName       ← Credenciales WordPress
│   └── README.md
│
├── 01-Buzon-Insights/         ← Ideas sin procesar
│   └── [Aquí van los insights]
│
├── 02-Generador-Planes/       ← Planes expandidos
│   └── [Planes generados por IA]
│
├── 03-Ready-To-Publish/       ← VERDAD ÚNICA (posts finales)
│   └── [Contenido listo para publicar]
│
└── assets/                     ← Recursos del proyecto
    ├── headers/
    └── images/
\`\`\`

---

## 🚀 Flujo de Trabajo

1. **Crear Insight**
   \`\`\`
   Guardar en: 01-Buzon-Insights/
   Formato: markdown con frontmatter
   \`\`\`

2. **Generar Plan**
   \`\`\`
   IA expande a: 02-Generador-Planes/
   Incorpora: estructura, SEO, ejemplos
   \`\`\`

3. **Revisar & Publicar**
   \`\`\`
   Final en: 03-Ready-To-Publish/
   Estado: listo para exportar a múltiples formatos
   \`\`\`

---

## 📤 Exportar Contenido

\`\`\`powershell
# Exportar a todos los formatos
python scripts/publish.py --project $ProjectName --file "blog-post.md" --target all

# Solo WhatsApp
python scripts/publish.py --project $ProjectName --file "blog-post.md" --target whatsapp

# Con URL específica
python scripts/publish.py --project $ProjectName --file "blog-post.md" --target all --url "https://example.com/blog/post"
\`\`\`

---

## 🔧 Configuración

Editar: \`00-Config/config.json\`

- **tone:** Tonalidad principal y secundaria
- **exporters:** Formatos habilitados
- **wordpress_url:** URL del sitio WordPress
- **team:** Propietario y revisores

---

## 📝 Notas

- Los archivos en \`03-Ready-To-Publish/\` son la **verdad única**
- Todos los exports se generan desde \`03-Ready-To-Publish/\`
- Usar \`.gitignore\` para no commitear credenciales
- Los assets van en \`assets/\`

---

**Documentación:** E:\lib\000-Framework\000-IO-TOOLS\✅ 010-io-neruda\INSTRUCCIONES-io-neruda.md
"@

$readmeContent | Set-Content "$ProjectPath\00-Config\README.md" -Encoding UTF8
Write-Host "   ✅ README.md creado" -ForegroundColor Green

# 7. Crear .gitkeep en carpetas vacías
Write-Host "`n🔧 Creando .gitkeep..." -ForegroundColor Cyan

@(
    "$ProjectPath\01-Buzon-Insights\.gitkeep",
    "$ProjectPath\02-Generador-Planes\.gitkeep",
    "$ProjectPath\03-Ready-To-Publish\.gitkeep",
    "$ProjectPath\assets\.gitkeep"
) | ForEach-Object {
    New-Item -ItemType File -Path $_ -Force | Out-Null
}

Write-Host "   ✅ .gitkeep creados" -ForegroundColor Green

# 8. Crear .gitignore
Write-Host "`n🔧 Creando .gitignore..." -ForegroundColor Cyan

$gitignoreContent = @"
# Credenciales
.env.*
*.env

# Sistema
.DS_Store
Thumbs.db
*.tmp

# Python
__pycache__/
*.pyc
*.pyo
venv/

# Node
node_modules/

# IDE
.vscode/
.idea/

# Exports (generados, no commitear)
exports/
"@

$gitignoreContent | Set-Content "$ProjectPath\.gitignore" -Encoding UTF8
Write-Host "   ✅ .gitignore creado" -ForegroundColor Green

# 9. Resumen
Write-Host "`n" -ForegroundColor Gray
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ PROYECTO CREADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "═════════════════════════════════════════════════════════════`n" -ForegroundColor Green

Write-Host "📍 Ruta del proyecto:" -ForegroundColor Yellow
Write-Host "   $ProjectPath`n" -ForegroundColor Gray

Write-Host "🔧 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Edita: $ProjectPath\00-Config\.env.$ProjectName" -ForegroundColor Gray
Write-Host "      (Agrega credenciales de WordPress)" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray
Write-Host "   2. Edita: $ProjectPath\00-Config\config.json" -ForegroundColor Gray
Write-Host "      (Personaliza tonos, exporters, equipo)" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray
Write-Host "   3. Crea tu primer insight en:" -ForegroundColor Gray
Write-Host "      $ProjectPath\01-Buzon-Insights\insight-tema.md" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray
Write-Host "   4. Exporta cuando esté listo:" -ForegroundColor Gray
Write-Host "      python scripts/publish.py --project $ProjectName --file 'post.md' --target all`n" -ForegroundColor Gray

Write-Host "📖 Ver documentación:" -ForegroundColor Cyan
Write-Host "   E:\lib\000-Framework\000-IO-TOOLS\✅ 010-io-neruda\INSTRUCCIONES-io-neruda.md`n" -ForegroundColor Gray
