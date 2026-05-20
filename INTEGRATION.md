# Integración de io-neruda con E:\lib\003-Pipeline-Contenidos

## ✅ Estado de Integración

io-neruda está **100% integrado** con tu estructura local de contenidos.

### Estructura de Carpetas

```
E:\lib\003-Pipeline-Contenidos\
├── 01-Buzon-Insights/        ← Nuevos insights (input)
│   ├── Sin título.md
│   └── test-insight.md
├── 02-Generador-Planes/      ← Planes generados (processing)
│   └── plan-seo-guadalajara.md
├── 03-Ready-To-Publish/      ← Posts listos (output)
│   └── post-seo-local-guadalajara.md
└── assets/                   ← Imágenes destacadas (NEW)
```

## 🔄 Flujo del Pipeline

```
1. Crear Insight
   └─> Guardar en: 01-Buzon-Insights/insight-tema.md

2. Generar Plan
   └─> Guardar en: 02-Generador-Planes/plan-tema.md

3. Generar Contenido Final
   └─> Guardar en: 03-Ready-To-Publish/post-tema.md

4. Agregar Imagen (opcional)
   └─> Guardar en: assets/imagen-tema.jpg

5. Publicar a WordPress
   └─> python scripts/publish_to_wp.py --env .env.cliente --file post-tema.md --publish
```

## 📝 Formato de Insight

Archivo: `E:\lib\003-Pipeline-Contenidos\01-Buzon-Insights\insight-tema.md`

```markdown
---
title: Título del Insight
client: resogar.es
author: Tu Nombre
date: 2026-05-20
---

# Insight: [Tema]

## Tema Central
Descripción breve del tema...

## Contexto
Por qué este tema es importante...

## Deliverables
1. Blog post (800-1200 palabras)
2. LinkedIn post
3. Twitter thread (3-5 tweets)

## Keywords
- palabra clave 1
- palabra clave 2
```

## 📋 Formato de Plan

Archivo: `E:\lib\003-Pipeline-Contenidos\02-Generador-Planes\plan-tema.md`

```markdown
---
title: Plan SEO para Tema
client: resogar.es
tone: inspirational
audience: viajeros españoles
---

# Plan de Contenido

## Blog Post (800 palabras)
### Estructura
- Introducción (150 palabras)
- Sección 1 (200 palabras)
- Sección 2 (200 palabras)
- Conclusión (100 palabras)

### SEO
- Keywords principales: ...
- Keywords secundarias: ...
- Meta description: ...
- Slug: ...

## LinkedIn Post
- Tono: profesional pero cercano
- CTA: "¿Compartimos tu experiencia?"

## Twitter Thread
- 5 tweets máximo
- Hashtags: #Turismo #Guadalajara
```

## 📰 Formato de Post Listo

Archivo: `E:\lib\003-Pipeline-Contenidos\03-Ready-To-Publish\post-tema.md`

```markdown
---
title: Título SEO Completo
author: io-neruda
date: 2026-05-20
client: resogar.es
featured_image: assets/imagen-tema.jpg
meta_description: Descripción para meta tags (160 caracteres)
categories: Turismo, Local
tags: guadalajara, experiencias, viajeros
---

# Contenido Final Listo para Publicar

Este contenido ya está listo para publicarse directamente.

Incluye:
- ✅ Estructura H2/H3 optimizada
- ✅ Keywords bien distribuidas
- ✅ Meta description
- ✅ Imagen destacada
- ✅ CTAs claros
```

## 🔧 Comandos Útiles

### Verificar estado del pipeline
```bash
python scripts/pipeline.py status
```

Output esperado:
```
🟢 INSIGHTS: 2 archivos
🟡 PLANES: 1 archivo  
🔵 LISTOS: 1 archivo
```

### Listar insights
```bash
python scripts/pipeline.py list --type insights
```

### Listar planes
```bash
python scripts/pipeline.py list --type plans
```

### Listar posts listos para publicar
```bash
python scripts/pipeline.py list --type ready
```

## 🎯 Seleccionar Tono para Cliente

```bash
# Ver tonos disponibles
python scripts/tone_selector.py --list

# Recomendación para resogar.es
python scripts/tone_selector.py --client resogar.es

# Recomendación para esgarden.es
python scripts/tone_selector.py --client esgarden.es --context "lanzamiento nuevo"
```

## 🚀 Publicar a WordPress

### Setup Previo
1. Crear `.env.resogar` con credenciales WordPress:
   ```
   WORDPRESS_URL=https://resogar.es
   WORDPRESS_USERNAME=admin
   WORDPRESS_PASSWORD=app_password_xxxx
   ```

2. Asegurar que el post esté en `03-Ready-To-Publish/`

### Publicar como borrador
```bash
python scripts/publish_to_wp.py \
  --env .env.resogar \
  --file "E:\lib\003-Pipeline-Contenidos\03-Ready-To-Publish\post-seo-local-guadalajara.md" \
  --draft
```

### Publicar en vivo
```bash
python scripts/publish_to_wp.py \
  --env .env.resogar \
  --file "E:\lib\003-Pipeline-Contenidos\03-Ready-To-Publish\post-seo-local-guadalajara.md" \
  --publish
```

### Programar publicación
```bash
python scripts/publish_to_wp.py \
  --env .env.resogar \
  --file "E:\lib\003-Pipeline-Contenidos\03-Ready-To-Publish\post-seo-local-guadalajara.md" \
  --schedule "2026-05-25 09:00"
```

## 🖼️ Gestionar Imágenes Destacadas

Las imágenes se guardan en: `E:\lib\003-Pipeline-Contenidos\assets\`

```bash
# Publicar con imagen destacada
python scripts/publish_to_wp.py \
  --env .env.resogar \
  --file post-seo-local-guadalajara.md \
  --featured "E:\lib\003-Pipeline-Contenidos\assets\imagen-tema.jpg" \
  --publish
```

## 📊 Base de Datos de Backlinks

Ubicación: `E:\git\app\tools\io-neruda\backlinks.db.json`

Formato:
```json
{
  "campaigns": [
    {
      "id": "campaign-001",
      "client": "resogar.es",
      "target_url": "https://sitio-destino.com",
      "anchor_text": "texto del enlace",
      "status": "pending|sent|accepted|published",
      "date_created": "2026-05-20",
      "date_updated": "2026-05-20"
    }
  ]
}
```

## 🔐 Variables de Entorno

Archivo: `.env.cliente`

```bash
# WordPress (requerido)
WORDPRESS_URL=https://example.es
WORDPRESS_USERNAME=admin
WORDPRESS_PASSWORD=app_password_xxxx

# Google Drive (opcional)
GOOGLE_DRIVE_FOLDER_ID=your_folder_id

# Pipeline (opcional - defaults a E:\lib\003-Pipeline-Contenidos)
INSIGHTS_PATH=E:\lib\003-Pipeline-Contenidos\01-Buzon-Insights
PLANS_PATH=E:\lib\003-Pipeline-Contenidos\02-Generador-Planes
PUBLISH_PATH=E:\lib\003-Pipeline-Contenidos\03-Ready-To-Publish
ASSETS_PATH=E:\lib\003-Pipeline-Contenidos\assets
```

## 🐛 Troubleshooting

### Error: "Ruta no encontrada"
Verifica que E:\lib\003-Pipeline-Contenidos exista:
```powershell
Test-Path "E:\lib\003-Pipeline-Contenidos"
```

### Error: "Módulo no encontrado"
Reinstala dependencias:
```bash
pip install -r requirements.txt
```

### Error: "Credenciales inválidas"
Verifica el archivo .env:
```bash
notepad .env.resogar
# Confirma: WORDPRESS_URL, WORDPRESS_USERNAME, WORDPRESS_PASSWORD
```

## 📈 Siguiente Paso

Ya está todo listo para:
1. ✅ Crear insights en `01-Buzon-Insights/`
2. ✅ Generar planes en `02-Generador-Planes/`
3. ✅ Publicar posts en `03-Ready-To-Publish/`
4. ✅ Publicar a WordPress con un comando

¡El pipeline está optimizado y listo para producción! 🚀
