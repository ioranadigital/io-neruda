# Importar Palabras Clave desde CSV

## ¿Cómo funciona?

En la pestaña **Keywords** del formulario de edición de clientes, verás dos botones nuevos:

- **📥 Descargar Plantilla** - Descarga un archivo CSV con la estructura correcta
- **📤 Importar CSV** - Carga tus palabras clave desde un CSV

## Estructura del CSV

El archivo debe tener estas columnas:

```
nivel, bloque, keyword1, keyword2, keyword3, keyword4, keyword5
```

### Niveles y Bloques Soportados:

#### **Nivel 1: Entidad y Core Semántico**
- `Core de Negocio` - La esencia de qué vende tu negocio
- `Branded Keywords` - Búsquedas con el nombre de la empresa
- `Fabricantes de Terceros` - Marcas que distribuyes
- `Head Terms` - Keywords genéricas del sector

#### **Nivel 2: Segmentación**
- `Local` - Keywords geo-localizadas
- `Audience Profile` - Keywords por perfil de audiencia

#### **Nivel 3: Informacionales y Editoriales**
- `Educational How-to` - Guías de cómo hacer
- `Problem/Symptom` - Problemas que resuelves
- `Seasonal` - Keywords estacionales

#### **Nivel 4: Investigación Comercial**
- `Comparative` - Comparativas de productos
- `Lists & Roundups` - Top 10, mejores marcas, etc.
- `Reviews & Opinions` - Reviews y análisis

#### **Nivel 5: Larga Cola**
- `Longtail Informational` - Preguntas específicas
- `Longtail Transactional` - Palabras clave de compra

#### **Nivel 6: Exclusiones y Restricciones**
- `Banned Words` - Palabras a evitar
- `Banned Tones` - Tonos a evitar
- `Competing Keywords` - Keywords de competencia

## Ejemplo de CSV

```csv
nivel,bloque,keyword1,keyword2,keyword3,keyword4,keyword5
1,Core de Negocio,barbacoas,piscinas,estufas pellets,,
1,Branded Keywords,Esgarden,Esgarden online,Esgarden España,,
1,Fabricantes de Terceros,Weber,Moretti Design,NetSpa,,
1,Head Terms,Barbacoas de gas,Piscinas desmontables,Estufas de pellets,,
2,Local,barbacoa gas Madrid,piscinas Barcelona,estufas Bilbao,,
2,Audience Profile,barbacoa para terraza pequeña,piscina segura niños,estufa pellets eficiente,,
3,Educational How-to,cómo encender barbacoa,cómo limpiar piscina,cómo calentar con estufa pellets,,
3,Problem/Symptom,piscina agua verde,estufa pellets fuma,barbacoa no enciende,,
3,Seasonal,barbacoa Semana Santa,piscina verano,estufa invierno,,
4,Comparative,barbacoa gas vs carbón,piscina acero vs pvc,estufa pellets vs bomba calor,,
4,Lists & Roundups,mejores barbacoas,piscinas calidad precio,estufas más silenciosas,,
4,Reviews & Opinions,análisis Weber Spirit,opiniones NetSpa,test piscinas Intex,,
5,Longtail Informational,cuánto consume estufa pellets,cómo limpiar filtro piscina,mantenimiento barbacoa,,
5,Longtail Transactional,comprar barbacoa gas online,ofertas piscinas desmontables,estufa pellets con instalación,,
6,Banned Words,barato,defectuoso,mala calidad,,
6,Banned Tones,clickbait,sensacionalista,spam,,
6,Competing Keywords,Amazon barbacoas,Leroy Merlin piscinas,Carrefour estufas,,
```

## Pasos para Importar

1. Ve a la pestaña **Keywords** del cliente
2. Haz clic en **📥 Descargar Plantilla**
3. Abre el CSV en Excel o Google Sheets
4. Rellena tus palabras clave
5. Guarda como CSV
6. Haz clic en **📤 Importar CSV** en la app
7. Selecciona tu archivo
8. ✅ Las palabras clave se cargarán automáticamente en todos los bloques

## Notas Importantes

- Los keywords se separados por comas en el CSV
- Solo se importarán los keywords no vacíos
- Los keywords existentes se sobrescribirán
- Debes guardar el formulario después de importar

## Formato Alternativo

Si prefieres en Google Sheets:
1. Copia la plantilla a Google Sheets
2. Rellena tus datos
3. Exporta como CSV (Archivo → Descargar → CSV)
4. Importa en la app
