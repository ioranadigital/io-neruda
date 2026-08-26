'use client';

import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { showToast } from '@/src/components/shared/Toast';

interface KeywordsImportExportProps {
  clientName: string;
  onImport: (keywordsData: Record<string, string[]>) => void;
}

// Mapping subnivel label (idéntico a los labels de ClientSchemaView) → campo en keywords_hierarchical
const SUBNIVEL_TO_FIELD: Record<string, string> = {
  // Nivel 1
  'Core de Negocio':                   'level1_entity_core',
  'Branded Keywords':                  'level1_branded',
  'Fabricantes / Marcas de Terceros':  'level1_brand_third_party',
  'Head Terms (Nicho / Sector)':       'level1_niche_sector',
  // Nivel 2
  'Keywords Locales (Geo-targeted)':   'level2_local',
  'Perfil de Audiencia':               'level2_audience_profile',
  // Nivel 3
  'Educacionales / How-to':            'level3_educational_howto',
  'Problemas / Síntomas':              'level3_problem_symptom',
  'Keywords Estacionales':             'level3_seasonal',
  // Nivel 4
  'Comparativas (Vs)':                 'level4_comparative_vs',
  'Listas / Recopilatorios':           'level4_lists_roundups',
  'Reviews / Opiniones de Producto':   'level4_review_opinions',
  // Nivel 5
  'Long-Tail Informacional de Nicho':  'level5_longtail_informational',
  'Long-Tail Transaccional Oculta':    'level5_longtail_transactional',
  // Nivel 6
  'Palabras Prohibidas':               'level6_banned_words',
  'Tonos Prohibidos':                  'level6_banned_tones',
  'Keywords de Competencia a Evitar':  'level6_competing_keywords',
};

// Hoja "Subniveles" de la plantilla — lista de referencia, idéntica a ClientSchemaView
const SUBNIVEL_REFERENCE: Array<{ nivel: number; nivel_titulo: string; subnivel: string; hint: string }> = [
  { nivel: 1, nivel_titulo: 'Nivel 1: Entidad y Core Semántico', subnivel: 'Core de Negocio', hint: 'La esencia de qué vende o hace tu negocio' },
  { nivel: 1, nivel_titulo: 'Nivel 1: Entidad y Core Semántico', subnivel: 'Branded Keywords', hint: 'Búsquedas que incluyen directamente el nombre de la empresa' },
  { nivel: 1, nivel_titulo: 'Nivel 1: Entidad y Core Semántico', subnivel: 'Fabricantes / Marcas de Terceros', hint: 'Marcas líderes que distribuyes o referencias como autoridad' },
  { nivel: 1, nivel_titulo: 'Nivel 1: Entidad y Core Semántico', subnivel: 'Head Terms (Nicho / Sector)', hint: 'Keywords genéricas de 1–2 palabras de tus categorías maestras' },
  { nivel: 2, nivel_titulo: 'Nivel 2: Segmentación y Geolocalización', subnivel: 'Keywords Locales (Geo-targeted)', hint: 'Palabras clave con ubicación geográfica. Cruciales para SEO Local' },
  { nivel: 2, nivel_titulo: 'Nivel 2: Segmentación y Geolocalización', subnivel: 'Perfil de Audiencia', hint: 'Segmentación por tipo de usuario, experiencia o necesidad' },
  { nivel: 3, nivel_titulo: 'Nivel 3: Informacional y Editorial', subnivel: 'Educacionales / How-to', hint: 'Búsquedas que empiezan por "cómo", "qué", "cuándo", "por qué"' },
  { nivel: 3, nivel_titulo: 'Nivel 3: Informacional y Editorial', subnivel: 'Problemas / Síntomas', hint: 'El usuario detecta un problema sin saber aún qué producto necesita' },
  { nivel: 3, nivel_titulo: 'Nivel 3: Informacional y Editorial', subnivel: 'Keywords Estacionales', hint: 'Búsquedas que explotan en épocas muy concretas del año' },
  { nivel: 4, nivel_titulo: 'Nivel 4: Investigación Comercial', subnivel: 'Comparativas (Vs)', hint: 'Enfrentan dos tecnologías, marcas o modelos para resolver la duda del comprador' },
  { nivel: 4, nivel_titulo: 'Nivel 4: Investigación Comercial', subnivel: 'Listas / Recopilatorios', hint: 'Agrupan los mejores productos bajo un criterio de calidad o precio' },
  { nivel: 4, nivel_titulo: 'Nivel 4: Investigación Comercial', subnivel: 'Reviews / Opiniones de Producto', hint: 'Análisis profundos de un modelo exacto. Tráfico hiper-cualificado' },
  { nivel: 5, nivel_titulo: 'Nivel 5: Larga Cola (Long-Tail)', subnivel: 'Long-Tail Informacional de Nicho', hint: 'Resuelven una duda extremadamente específica' },
  { nivel: 5, nivel_titulo: 'Nivel 5: Larga Cola (Long-Tail)', subnivel: 'Long-Tail Transaccional Oculta', hint: 'Búsquedas tan detalladas que revelan intención de compra inmediata' },
  { nivel: 6, nivel_titulo: 'Nivel 6: Exclusiones y Restricciones', subnivel: 'Palabras Prohibidas', hint: 'Términos y frases que NO deben aparecer' },
  { nivel: 6, nivel_titulo: 'Nivel 6: Exclusiones y Restricciones', subnivel: 'Tonos Prohibidos', hint: 'Estilos de escritura que NO encajan con la voz de la marca' },
  { nivel: 6, nivel_titulo: 'Nivel 6: Exclusiones y Restricciones', subnivel: 'Keywords de Competencia a Evitar', hint: 'Búsquedas donde los competidores dominan' },
];

// Variantes de cabecera aceptadas al importar (case-insensitive), para admitir
// exports de keyword research reales sin obligar a renombrar columnas antes.
const KEYWORD_HEADER_ALIASES = ['keyword', 'keywords', 'keyword limpia', 'kw'];
const SUBNIVEL_HEADER_ALIASES = ['subnivel', 'sub_nivel', 'sub-nivel'];

function findColumn(row: Record<string, unknown>, aliases: string[]): string | null {
  const keys = Object.keys(row);
  for (const alias of aliases) {
    const match = keys.find(k => k.trim().toLowerCase() === alias);
    if (match) return match;
  }
  return null;
}

export default function KeywordsImportExport({ clientName, onImport }: KeywordsImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Descarga plantilla con estructura completa (keyword_limpia, NIVEL, SUBNIVEL, etc.)
  // más una hoja de referencia con los 17 subniveles válidos.
  const downloadTemplate = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Estructura completa idéntica a keywords-base-analisis.xlsx
      const exampleRows = [
        {
          keyword_limpia: 'barbacoas weber',
          NIVEL: 'Nivel 1',
          SUBNIVEL: 'Fabricantes / Marcas de Terceros',
          'BUYER PERSONA': 'Propietario vivienda unifamiliar',
          'Intención / Pain Point': 'Búsqueda de marca específica',
          ESTADO: 'Activa'
        },
        {
          keyword_limpia: 'cómo elegir barbacoa de gas',
          NIVEL: 'Nivel 3',
          SUBNIVEL: 'Educacionales / How-to',
          'BUYER PERSONA': 'Comprador indeciso',
          'Intención / Pain Point': 'Necesita guía de selección',
          ESTADO: 'Activa'
        },
        {
          keyword_limpia: 'barbacoa gas vs carbón',
          NIVEL: 'Nivel 4',
          SUBNIVEL: 'Comparativas (Vs)',
          'BUYER PERSONA': 'Comprador indeciso',
          'Intención / Pain Point': 'Comparar opciones',
          ESTADO: 'Activa'
        },
        {
          keyword_limpia: 'dónde comprar recambios weber',
          NIVEL: 'Nivel 5',
          SUBNIVEL: 'Long-Tail Transaccional Oculta',
          'BUYER PERSONA': 'Cliente actual',
          'Intención / Pain Point': 'Compra de accesorios',
          ESTADO: 'Activa'
        },
      ];

      const wsKeywords = XLSX.utils.json_to_sheet(exampleRows);
      wsKeywords['!cols'] = [
        { wch: 30 },  // keyword_limpia
        { wch: 15 },  // NIVEL
        { wch: 35 },  // SUBNIVEL
        { wch: 30 },  // BUYER PERSONA
        { wch: 30 },  // Intención / Pain Point
        { wch: 12 },  // ESTADO
      ];
      XLSX.utils.book_append_sheet(wb, wsKeywords, 'Keywords');

      const wsSubniveles = XLSX.utils.json_to_sheet(SUBNIVEL_REFERENCE);
      wsSubniveles['!cols'] = [{ wch: 8 }, { wch: 38 }, { wch: 34 }, { wch: 60 }];
      XLSX.utils.book_append_sheet(wb, wsSubniveles, 'Subniveles');

      XLSX.writeFile(wb, `keywords_template_${clientName}.xlsx`);
      showToast.success('Plantilla descargada con estructura completa');
    } catch (error) {
      console.error('❌ Error generating template:', error);
      showToast.error('Error al descargar la plantilla');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames.includes('Keywords') ? 'Keywords' : workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

        if (rows.length === 0) {
          showToast.error('El archivo no tiene filas de datos');
          return;
        }

        const keywordCol = findColumn(rows[0], KEYWORD_HEADER_ALIASES);
        const subnivelCol = findColumn(rows[0], SUBNIVEL_HEADER_ALIASES);
        if (!keywordCol || !subnivelCol) {
          showToast.error('No se reconocen las columnas "keyword" y "subnivel". Usa la plantilla.');
          return;
        }

        const keywordsMap: Record<string, string[]> = {};
        const unknownSubniveles = new Set<string>();
        let importedCount = 0;

        for (const row of rows) {
          const keyword = String(row[keywordCol] ?? '').trim();
          const subnivel = String(row[subnivelCol] ?? '').trim();
          if (!keyword || !subnivel) continue;

          const fieldKey = SUBNIVEL_TO_FIELD[subnivel];
          if (!fieldKey) {
            unknownSubniveles.add(subnivel);
            continue;
          }

          if (!keywordsMap[fieldKey]) keywordsMap[fieldKey] = [];
          if (!keywordsMap[fieldKey].includes(keyword)) {
            keywordsMap[fieldKey].push(keyword);
            importedCount++;
          }
        }

        if (importedCount === 0) {
          showToast.error('No se encontraron keywords válidas en el archivo');
          return;
        }

        onImport(keywordsMap);

        if (unknownSubniveles.size > 0) {
          const sample = Array.from(unknownSubniveles).slice(0, 3).join(', ');
          showToast.warning(
            `${importedCount} keywords importadas · ${unknownSubniveles.size} filas ignoradas por subnivel desconocido (${sample}${unknownSubniveles.size > 3 ? '…' : ''})`
          );
        } else {
          showToast.success(`${importedCount} keywords importadas correctamente`);
        }
      } catch (error) {
        console.error('❌ Error parsing file:', error);
        showToast.error('Error al procesar el archivo. Usa el formato de la plantilla (.xlsx)');
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex gap-2 mb-4">
      {/* Download Template Button */}
      <button
        onClick={downloadTemplate}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition"
        style={{
          backgroundColor: '#e8f5ee',
          color: '#4aa87a',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#d4ece0'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#e8f5ee'; }}
        title="Descargar plantilla Excel para cargar palabras clave"
      >
        <Download size={16} />
        Descargar Plantilla (.xlsx)
      </button>

      {/* Import Button */}
      <button
        onClick={handleImportClick}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition"
        style={{
          backgroundColor: '#fef3c7',
          color: '#92400e',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fde68a'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fef3c7'; }}
        title="Cargar palabras clave desde Excel o CSV"
      >
        <Upload size={16} />
        Importar Excel/CSV
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
}
