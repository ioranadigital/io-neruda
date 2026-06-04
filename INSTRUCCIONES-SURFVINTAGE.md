# 🎨 io-neruda × Surfvintage

**Sistema de Generación Automática de Contenido para Blog**

---

## 📋 Requisitos Previos

✅ **Ya configurado:**
- WordPress Surfvintage en `http://localhost:8081`
- Archivo `.env.surfvintage` con credenciales
- Python 3.8+

✅ **Instalaciones necesarias:**
```bash
pip install requests python-dotenv
```

---

## 🚀 Flujo de Trabajo

### Paso 1: Crear un Insight (Brief de Contenido)

Ubicación: `E:\lib\003-Pipeline-Contenidos\01-Buzon-Insights\`

**Archivo:** `insight-[tema].md`

Ejemplo ya creado:
```
📄 insight-surfvintage-primavera-2026.md
```

**Estructura mínima:**
```markdown
# Insight: [Tema]

## 📋 Tema Central
[Descripción del tema]

## 🎯 Palabras Clave Target
- keyword 1
- keyword 2

## 📝 Deliverables
### 1. Blog Post (1500-2000 palabras)
**Título:** ...
**Secciones:**
- ...
```

### Paso 2: Generar Contenido con Claude

**Modo 1: Desde Claude Code (Recomendado)**
```
Actúa como io-neruda.
Cliente: Surfvintage
Tone: seo
Insight: insight-surfvintage-primavera-2026.md
Genera un blog post sobre: [tema]
```

**Modo 2: Script de Python**
```bash
python generate_content.py --insight insight-surfvintage-primavera-2026.md --tone seo
```

### Paso 3: Guardar el Borrador

Ubicación: `E:\lib\003-Pipeline-Contenidos\02-Generador-Planes\`

**Archivo:** `blog-[tema]-YYYY-MM-DD.md`

Ejemplo:
```
📄 blog-vintage-primavera-2026-2026-05-20.md
```

### Paso 4: Publicar a WordPress

**Opción A: Como Borrador (Recomendado para revisar)**
```bash
python publish_to_wp.py \
  --file "E:\lib\003-Pipeline-Contenidos\02-Generador-Planes\blog-vintage-primavera-2026-2026-05-20.md" \
  --env .env.surfvintage
```

**Opción B: Publicar Directamente**
```bash
python publish_to_wp.py \
  --file "ruta/al/archivo.md" \
  --env .env.surfvintage \
  --publish
```

---

## 📚 Ejemplos de Uso

### Ejemplo 1: Blog Post sobre Tendencias Vintage

```bash
# 1. Insight ya existe: insight-surfvintage-primavera-2026.md

# 2. Generar contenido (en Claude Code o manual)
# → Guardar en: blog-vintage-primavera-2026-2026-05-20.md

# 3. Publicar como borrador
cd E:\git\app\tools\io-neruda
python publish_to_wp.py \
  --file "E:\lib\003-Pipeline-Contenidos\02-Generador-Planes\blog-vintage-primavera-2026-2026-05-20.md" \
  --env .env.surfvintage

# 4. Revisar en WordPress: http://localhost:8081/wp-admin
# → Editar → Revisar → Publicar manualmente
```

### Ejemplo 2: Generar Múltiples Posts

```bash
# Crear múltiples insights
📄 insight-tutorial-como-limpiar-ropa-vintage.md
📄 insight-historia-surf-vintage.md
📄 insight-sostenibilidad-moda.md

# Generar y publicar todos
for file in E:\lib\003-Pipeline-Contenidos\01-Buzon-Insights\insight-*.md; do
    # Generar contenido (manual o script)
    # Luego publicar cada uno
    python publish_to_wp.py \
      --file "$generated_file" \
      --env .env.surfvintage
done
```

---

## 🎯 Comandos Rápidos

### Listar posts publicados
```bash
python publish_to_wp.py --env .env.surfvintage --list-posts
```

### Publicar como borrador (default)
```bash
python publish_to_wp.py --file archivo.md --env .env.surfvintage
```

### Publicar directamente (LIVE)
```bash
python publish_to_wp.py --file archivo.md --env .env.surfvintage --publish
```

---

## 🔧 Configuración (.env.surfvintage)

**Variables principales:**
```
WORDPRESS_URL=http://localhost:8081
WORDPRESS_USERNAME=admin
WORDPRESS_PASSWORD=[credencial admin]
PUBLISH_STATUS=draft  # o 'publish'
CONTENT_TONE=seo      # professional, casual, persuasive, seo, creative
```

**Cambiar credenciales:**
1. Editar `.env.surfvintage`
2. Actualizar `WORDPRESS_PASSWORD` con tu contraseña admin
3. Guardar y listo

---

## 📊 Pipeline Visual

```
01-Buzon-Insights/
    ↓
insight-tema.md (Brief)
    ↓
[Claude Code: Generar Contenido]
    ↓
02-Generador-Planes/
    ↓
blog-tema-YYYY-MM-DD.md (Borrador)
    ↓
python publish_to_wp.py
    ↓
WordPress Borrador → 
    ↓
[Revisar en http://localhost:8081/wp-admin]
    ↓
Publicar Manualmente o con --publish flag
    ↓
🌐 Blog LIVE
```

---

## 🐛 Troubleshooting

### Error: "Conexión rechazada"
```
❌ Error conectando a WordPress: [Errno 111] Connection refused
```

**Solución:**
- Verificar que WordPress está corriendo: `docker ps | grep surfvintage`
- Si no está corriendo: `docker start surfvintage-wordpress`

### Error: "Autenticación fallida (401)"
```
❌ Error: 401
   Respuesta: {"code":"rest_cannot_create","message":"Sorry, you are not allowed to create posts..."}
```

**Solución:**
- Verificar credenciales en `.env.surfvintage`
- Crear "Application Password" en WordPress admin:
  1. Ir a http://localhost:8081/wp-admin
  2. Usuarios → Perfil
  3. Bajar a "Contraseñas de Aplicación"
  4. Crear nueva
  5. Copiar y pegar en `.env.surfvintage`

### Error: "Archivo no encontrado"
```
❌ Archivo no encontrado: archivo.md
```

**Solución:**
- Verificar ruta absoluta correcta
- Ejemplo correcto: `E:\lib\003-Pipeline-Contenidos\02-Generador-Planes\blog-tema.md`

---

## 📈 Próximos Pasos

- [ ] Crear primer insight para tema SEO
- [ ] Generar contenido con Claude
- [ ] Publicar como borrador
- [ ] Revisar en WordPress admin
- [ ] Publicar LIVE
- [ ] Monitorear rendimiento en Google Analytics

---

## 📝 Notas

- Todos los posts se publican como **borrador** por defecto (seguridad)
- Usar `--publish` solo después de revisar el contenido
- Los insights se guardan en git para histórico
- Los borradores se pueden usar para A/B testing

---

**Última actualización:** 2026-05-20  
**Versión:** 1.0  
**Mantenedor:** Iorana Digital
