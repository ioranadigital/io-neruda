# io-neruda 🎨

**Sistema de Orquestación Automática de Contenidos**

Agente inteligente que automatiza la creación, optimización y publicación de contenido (blogs, redes sociales, backlinks) para múltiples clientes web.

## 🏗️ Arquitectura

```
io-neruda
├── config/              # Configuración de tonos y clientes
├── scripts/             # Scripts de publicación y prospección
├── backlinks.db.json    # Base de datos de backlinks y outreach
└── README.md
```

## 📋 Requisitos

- Python 3.8+
- WordPress REST API habilitada
- E:\lib\003-Pipeline-Contenidos accesible
- Credenciales en `.env.cliente` files
- Google Drive API (opcional, para guardar borradores)

### Instalación Rápida

```bash
# 1. Instalar dependencias
pip install -r requirements.txt

# 2. Copiar template de configuración
copy .env.example .env.resogar
copy .env.example .env.esgarden

# 3. Editar credenciales de WordPress
notepad .env.resogar
# Agregar WORDPRESS_URL, WORDPRESS_USERNAME, WORDPRESS_PASSWORD
```

## 🚀 Inicio Rápido

### 1. Configurar Cliente

Crear archivo `.env.cliente`:
```
WORDPRESS_URL=https://ejemplo.es
WORDPRESS_USERNAME=admin
WORDPRESS_PASSWORD=app_password_token
GOOGLE_DRIVE_FOLDER_ID=drive_folder_id
```

### 2. Crear Insight

Guardar en `E:\lib\003-Pipeline-Contenidos\01-Buzon-Insights\`:
```markdown
# Insight: [Tema]
## Tema Central
...
## Deliverables
1. Blog post
2. LinkedIn posts
3. Twitter thread
```

### 3. Generar Contenido

```bash
Actúa como io-neruda.
Cliente: ejemplo.es
Insight: insight-tema.md
```

### 4. Publicar

```bash
python scripts/publish_to_wp.py \
  --env .env.cliente \
  --file post-tema.md \
  --publish
```

## 🔍 Verificar Pipeline

```bash
# Ver estado del pipeline
python scripts/pipeline.py status

# Listar insights disponibles
python scripts/pipeline.py list --type insights

# Listar planes
python scripts/pipeline.py list --type plans

# Listar posts listos para publicar
python scripts/pipeline.py list --type ready
```

## 📖 Documentación Completa

Ver: `Instrucciones-io-neruda.md` en E:\git\tools\

## 🎯 Características

- ✅ Selección automática de tonalidad
- ✅ Generación de múltiples formatos (blog, social)
- ✅ Publicación a WordPress
- ✅ Prospección automática de backlinks
- ✅ Seguimiento de outreach campaigns

## 📝 Tonos Disponibles

- **Profesional:** Formal, Informativo, Autoritario
- **Marketing:** Amigable, Persuasivo, Entusiasta
- **Creativo:** Humorístico, Inspiracional, Misterioso

## 🔗 Pipeline de Contenidos

```
01-Buzon-Insights
  → 02-Generador-Planes
    → /assets (imágenes)
      → 03-Ready-To-Publish
        → WordPress LIVE
          → Backlinks Outreach
```

## 📊 Status

- Versión: 1.0.0
- Estado: Producción
- Última actualización: 2026-05-20
- Pipeline local integrado: ✅ E:\lib\003-Pipeline-Contenidos

## 🔧 Scripts Disponibles

- `tone_selector.py` - Selecciona tonos para clientes
- `publish_to_wp.py` - Publica contenido a WordPress  
- `pipeline.py` - Orquesta el flujo completo (NEW)
