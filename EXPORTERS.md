# 🚀 io-neruda Exporters System

**Sistema modular de exportación de contenido markdown a múltiples formatos.**

Un archivo markdown → 6+ formatos diferentes (HTML, JSON, WhatsApp, Email, Social, Markdown limpio)

---

## 📂 Estructura

```
scripts/
├── exporters/                    ← Paquete de exportadores
│   ├── __init__.py
│   ├── base_exporter.py         ← Clase base (interfaz común)
│   ├── markdown_exporter.py     ← MD con diferentes frontmatters
│   ├── whatsapp_exporter.py     ← 4 estilos para WhatsApp
│   ├── html_exporter.py         ← HTML estático limpio
│   ├── json_exporter.py         ← JSON estructurado
│   ├── social_exporter.py       ← Twitter + LinkedIn threads
│   └── email_exporter.py        ← Email con 3 templates
│
└── publish.py                   ← Router principal (CLI)
```

---

## ⚡ Inicio Rápido

```powershell
# Exportar a TODOS los formatos
python scripts/publish.py --file "E:/lib/003-Pipeline-Contenidos/03-Ready-To-Publish/blog-post.md" --target all

# Exportar solo a WhatsApp
python scripts/publish.py --file post.md --target whatsapp

# Exportar a HTML + JSON + Markdown
python scripts/publish.py --file post.md --target html json markdown

# Con URL para CTAs
python scripts/publish.py --file post.md --target all --url "https://surfvintage.com/blog/post"
```

---

## 📚 Exporters Disponibles

### 1️⃣ **Markdown Exporter**

Exporta markdown limpio/normalizado con diferentes frontmatters.

```powershell
python scripts/publish.py --file post.md --target markdown --markdown-styles clean seo email
```

**Estilos:**
- `clean` → Frontmatter minimalista (title, slug)
- `seo` → Con metadatos SEO (meta_description, keywords)
- `email` → Para campañas de email (subject, from_name)
- `social` → Para redes sociales (tags, summary)

**Output:**
```
exports/markdown/
├── clean/
│   └── blog-post.md
├── seo/
│   └── blog-post.md
├── email/
│   └── blog-post.md
└── social/
    └── blog-post.md
```

---

### 2️⃣ **WhatsApp Exporter** 💚

Genera textos optimizados para campañas WhatsApp con 4 estilos diferentes.

```powershell
python scripts/publish.py --file post.md --target whatsapp --whatsapp-styles teaser series catalog
```

**Estilos:**

#### **teaser** (1 mensaje corto)
```
🏄‍♂️ Moda Vintage para Surfistas Primavera 2026

Descubre las mejores piezas vintage para tu estilo surf. Sostenible, auténtico, único. 🔥

👉 Lee la guía completa:
https://surfvintage.com/blog/vintage-primavera

💚 ¿Preguntas? Escribe a nuestro equipo
```

#### **series** (3-5 mensajes estructurados)
```
[MSG 1]
🏄‍♂️ ¿Sabías que la moda vintage es perfecta para el surf?
Descubre los detalles... 🔥

[MSG 2]
✅ Puntos clave:
✅ Surf Heritage 80s-90s
✅ Sostenibilidad como lujo
✅ Minimalismo intencionado

[MSG 3]
💚 Guía completa aquí:
https://surfvintage.com/blog/...

¿Más contenido así? Únete a nuestra newsletter →
```

#### **catalog** (formato catálogo de productos)
```
🏄‍♂️ COLECCIÓN ESSENTIALS - PRIMAVERA 2026

*Vintage Board Shorts 80s*
€45 | Disponible S-XL
👉 Ver más

*Vintage Rashguard Heritage*
€35 | Disponible S-XXL
👉 Ver más

💚 ¿Dudas? Contacta a nuestro equipo
```

#### **newsletter** (resumen estilo newsletter)
```
🏄‍♂️ NEWSLETTER: Moda Vintage Primavera 2026

Descubre las mejores piezas vintage para tu estilo surf...

✅ Lo que aprenderás:
✅ Tendencias actuales
✅ Consejos prácticos
✅ Recomendaciones exclusivas

👉 Leer artículo completo:
https://surfvintage.com/blog/...

💚 Nuevo contenido cada semana
🔥 No te pierdas los próximos
```

**Output:**
```
exports/whatsapp/
├── teaser/
│   └── blog-post_teaser.txt
├── series/
│   └── blog-post_series.txt
├── catalog/
│   └── blog-post_catalog.txt
└── newsletter/
    └── blog-post_newsletter.txt
```

---

### 3️⃣ **HTML Exporter**

Exporta HTML estático limpio con CSS embedded.

```powershell
python scripts/publish.py --file post.md --target html
```

**Output:**
```
exports/html/
└── blog-post.html
```

Genera HTML profesional con:
- Tipografía limpia
- Responsive design
- Meta tags SEO
- Autor y fecha

---

### 4️⃣ **JSON Exporter**

Exporta contenido estructurado para APIs y sistemas headless.

```powershell
python scripts/publish.py --file post.md --target json
```

**Output Structure:**
```json
{
  "metadata": {
    "title": "Moda Vintage para Surfistas Primavera 2026",
    "slug": "moda-vintage-surfistas-primavera-2026",
    "author": "io-neruda",
    "date": "2026-05-20",
    "type": "article"
  },
  "seo": {
    "meta_description": "Descubre las mejores piezas vintage...",
    "keywords": ["vintage", "moda", "sostenibilidad"],
    "og_image": ""
  },
  "content": {
    "word_count": 1850,
    "char_count": 12450,
    "body": "..."
  }
}
```

**Output:**
```
exports/json/
└── blog-post.json
```

---

### 5️⃣ **Social Media Exporter**

Genera threads para Twitter y posts para LinkedIn.

```powershell
python scripts/publish.py --file post.md --target social --social-platforms twitter linkedin
```

**Twitter Thread:**
```
🧵 Moda Vintage para Surfistas Primavera 2026

Vamos a explorar esto 5 puntos importantes 👇

1. Las tendencias de moda vintage para primavera 2026...

2. Estilo retro años 80-90: Influencia del movimiento surf vintage

3. Sostenibilidad: Ropa de segunda mano como alternativa eco-friendly

4. Autenticidad: Piezas únicas vs. moda rápida

5. Comunidad: Lifestyle surf y vintage como identidad

Gracias por leer este thread 🙌
#vintage #moda #sostenibilidad #surf
```

**Output:**
```
exports/social/
├── twitter/
│   └── blog-post_twitter_thread.txt
└── linkedin/
    └── blog-post_linkedin_post.txt
```

---

### 6️⃣ **Email Exporter**

Exporta HTML optimizado para email con 3 templates diferentes.

```powershell
python scripts/publish.py --file post.md --target email --email-templates standard minimal fancy
```

**Templates:**
- `standard` → Email profesional limpio
- `minimal` → Email muy simple
- `fancy` → Email con gradientes y diseño avanzado

**Features:**
- Responsive design
- Buena compatibilidad con clientes email
- CTA buttons
- Unsubscribe links
- Metadatos de campaña

**Output:**
```
exports/email/
└── blog-post_email.html
```

---

## 🎯 Casos de Uso

### Para un Blog Post

```powershell
python scripts/publish.py \
  --file blog-vintage-primavera.md \
  --target markdown html json social email \
  --url "https://surfvintage.com/blog/vintage-primavera"
```

**Genera:**
- ✅ Markdown limpio (para repositorio)
- ✅ HTML (para página web)
- ✅ JSON (para API)
- ✅ Twitter + LinkedIn threads
- ✅ 2 templates email

### Para una Campaña WhatsApp

```powershell
python scripts/publish.py \
  --file blog-vintage-primavera.md \
  --target whatsapp \
  --whatsapp-styles teaser series \
  --url "https://surfvintage.com/blog/vintage-primavera"
```

**Genera:**
- ✅ Teaser (para send inicial)
- ✅ Series (para follow-up)

### Para Producto en Catálogo

```powershell
python scripts/publish.py \
  --file producto-vintage-shorts.md \
  --target whatsapp \
  --whatsapp-styles catalog
```

**Genera:**
- ✅ Catálogo WhatsApp (con precios)

---

## 🔧 Configuración

### Frontmatter Soportado

El sistema reconoce estos campos en el frontmatter YAML:

```yaml
---
title: Mi Artículo
slug: mi-articulo
author: Nombre Autor
date: 2026-05-20
type: article
meta_description: Descripción para SEO
keywords: tag1, tag2, tag3
og_image: /images/header.jpg
url: https://example.com/blog/post
tags: vintage, moda, sostenibilidad
---
```

---

## 📊 Estructura de Outputs

```
exports/
├── markdown/
│   ├── clean/
│   ├── seo/
│   ├── email/
│   └── social/
├── whatsapp/
│   ├── teaser/
│   ├── series/
│   ├── catalog/
│   └── newsletter/
├── html/
├── json/
├── social/
│   ├── twitter/
│   └── linkedin/
└── email/
```

---

## 💻 API Programática

También puedes usar los exportadores directamente en Python:

```python
from scripts.exporters import WhatsAppExporter, HTMLExporter

# WhatsApp
wp = WhatsAppExporter("post.md", "exports")
wp.export(style='teaser', url='https://example.com')

# HTML
html = HTMLExporter("post.md", "exports")
html.export(include_css=True)
```

---

## 🚀 Próximas Mejoras

- [ ] WordPressExporter (publicar directamente a WordPress)
- [ ] InstagramExporter (carousels, reels)
- [ ] PDFExporter (reportes)
- [ ] SlackExporter (mensajes de canal)
- [ ] TelegramExporter (canales públicos)

---

## 📝 Notas

- **Sin dependencias externas complejas:** Solo `requests` y `python-dotenv` (que ya tenías)
- **Markdown parsing simple:** Manual, sin librerías, más control
- **Completamente modular:** Agregar nuevos exportadores es trivial
- **Output agnóstico:** El contenido en `03-Ready-To-Publish` es la VERDAD única

---

**Documentación:** 2026-05-29  
**Estado:** ✅ Operacional  
**Versión:** 1.0.0
