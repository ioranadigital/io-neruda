'use client';

import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface KeywordsImportExportProps {
  clientName: string;
  onImport: (keywordsData: Record<string, string[]>) => void;
}

export default function KeywordsImportExport({ clientName, onImport }: KeywordsImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template data for Excel — nombres de subnivel IDÉNTICOS a los labels de ClientSchemaView
  const TEMPLATE_DATA = [
    // ── Nivel 1 ──────────────────────────────────────────────────────────────
    { nivel: 1, nivel_titulo: 'Nivel 1: Entidad y Core Semántico',     subnivel: 'Core de Negocio',                    kw_1: 'ejemplo core 1',      kw_2: 'ejemplo core 2',       kw_3: 'ejemplo core 3',       kw_4: '', kw_5: '' },
    { nivel: 1, nivel_titulo: 'Nivel 1: Entidad y Core Semántico',     subnivel: 'Branded Keywords',                   kw_1: clientName,            kw_2: `${clientName} online`, kw_3: `${clientName} España`, kw_4: '', kw_5: '' },
    { nivel: 1, nivel_titulo: 'Nivel 1: Entidad y Core Semántico',     subnivel: 'Fabricantes / Marcas de Terceros',   kw_1: 'marca1',              kw_2: 'marca2',               kw_3: 'marca3',               kw_4: '', kw_5: '' },
    { nivel: 1, nivel_titulo: 'Nivel 1: Entidad y Core Semántico',     subnivel: 'Head Terms (Nicho / Sector)',        kw_1: 'categoría1',          kw_2: 'categoría2',           kw_3: 'categoría3',           kw_4: '', kw_5: '' },
    // ── Nivel 2 ──────────────────────────────────────────────────────────────
    { nivel: 2, nivel_titulo: 'Nivel 2: Segmentación y Geolocalización', subnivel: 'Keywords Locales (Geo-targeted)',  kw_1: 'ciudad1',             kw_2: 'ciudad2',              kw_3: 'región1',              kw_4: '', kw_5: '' },
    { nivel: 2, nivel_titulo: 'Nivel 2: Segmentación y Geolocalización', subnivel: 'Perfil de Audiencia',             kw_1: 'perfil1',             kw_2: 'perfil2',              kw_3: 'perfil3',              kw_4: '', kw_5: '' },
    // ── Nivel 3 ──────────────────────────────────────────────────────────────
    { nivel: 3, nivel_titulo: 'Nivel 3: Informacional y Editorial',    subnivel: 'Educacionales / How-to',             kw_1: 'cómo hacer X',        kw_2: 'guía para Y',          kw_3: 'qué es Z',             kw_4: '', kw_5: '' },
    { nivel: 3, nivel_titulo: 'Nivel 3: Informacional y Editorial',    subnivel: 'Problemas / Síntomas',               kw_1: 'problema1',           kw_2: 'síntoma1',             kw_3: 'por qué falla X',      kw_4: '', kw_5: '' },
    { nivel: 3, nivel_titulo: 'Nivel 3: Informacional y Editorial',    subnivel: 'Keywords Estacionales',              kw_1: 'temporada primavera', kw_2: 'ofertas verano',       kw_3: 'especial navidad',     kw_4: '', kw_5: '' },
    // ── Nivel 4 ──────────────────────────────────────────────────────────────
    { nivel: 4, nivel_titulo: 'Nivel 4: Investigación Comercial',      subnivel: 'Comparativas (Vs)',                  kw_1: 'modelo A vs modelo B', kw_2: 'X o Y cuál es mejor', kw_3: 'diferencias X y Z',   kw_4: '', kw_5: '' },
    { nivel: 4, nivel_titulo: 'Nivel 4: Investigación Comercial',      subnivel: 'Listas / Recopilatorios',            kw_1: 'mejores X 2026',      kw_2: 'top 10 Y',             kw_3: 'ranking Z',            kw_4: '', kw_5: '' },
    { nivel: 4, nivel_titulo: 'Nivel 4: Investigación Comercial',      subnivel: 'Reviews / Opiniones de Producto',    kw_1: 'análisis modelo X',   kw_2: 'opiniones producto Y', kw_3: 'review Z',             kw_4: '', kw_5: '' },
    // ── Nivel 5 ──────────────────────────────────────────────────────────────
    { nivel: 5, nivel_titulo: 'Nivel 5: Larga Cola (Long-Tail)',       subnivel: 'Long-Tail Informacional de Nicho',   kw_1: 'longtail info 1',     kw_2: 'longtail info 2',      kw_3: 'longtail info 3',      kw_4: '', kw_5: '' },
    { nivel: 5, nivel_titulo: 'Nivel 5: Larga Cola (Long-Tail)',       subnivel: 'Long-Tail Transaccional Oculta',     kw_1: 'dónde comprar X en Y', kw_2: 'precio Z modelo A',  kw_3: 'comprar W online',     kw_4: '', kw_5: '' },
    // ── Nivel 6 ──────────────────────────────────────────────────────────────
    { nivel: 6, nivel_titulo: 'Nivel 6: Exclusiones y Restricciones',  subnivel: 'Palabras Prohibidas',                kw_1: 'en conclusión',       kw_2: 'es crucial',           kw_3: 'revolucionario',       kw_4: '', kw_5: '' },
    { nivel: 6, nivel_titulo: 'Nivel 6: Exclusiones y Restricciones',  subnivel: 'Tonos Prohibidos',                   kw_1: 'clickbait',           kw_2: 'sensacionalista',      kw_3: 'spam',                 kw_4: '', kw_5: '' },
    { nivel: 6, nivel_titulo: 'Nivel 6: Exclusiones y Restricciones',  subnivel: 'Keywords de Competencia a Evitar',   kw_1: 'competidor1',         kw_2: 'competidor2',          kw_3: 'competidor3',          kw_4: '', kw_5: '' },
  ];

  // Download template as XLS
  const downloadTemplate = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(TEMPLATE_DATA);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Keywords');

      // Set column widths
      const colWidths = [
        { wch: 8  }, // nivel
        { wch: 38 }, // nivel_titulo
        { wch: 32 }, // subnivel
        { wch: 24 }, // kw_1
        { wch: 24 }, // kw_2
        { wch: 24 }, // kw_3
        { wch: 24 }, // kw_4
        { wch: 24 }, // kw_5
      ];
      ws['!cols'] = colWidths;

      XLSX.writeFile(wb, `keywords_template_${clientName}.xlsx`);
      console.log('✅ Template descargado');
    } catch (error) {
      console.error('❌ Error generating template:', error);
      alert('Error al descargar la plantilla');
    }
  };

  // Parse CSV and import
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());

        if (lines.length === 0) return;

        const keywordsMap: Record<string, string[]> = {};

        // Mapping subnivel label (idéntico a la UI) → campo en keywords_hierarchical
        const subnivelToField: Record<string, string> = {
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

        // Skip header row; columns: nivel | nivel_titulo | subnivel | kw_1…kw_5
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(k => k.trim());
          // col 0 = nivel, col 1 = nivel_titulo, col 2 = subnivel, col 3-7 = keywords
          const subnivel  = cols[2] ?? '';
          const keywords  = cols.slice(3).filter(k => k.length > 0);

          if (!subnivel) continue;

          const fieldKey = subnivelToField[subnivel];
          if (!fieldKey) continue; // ignora filas con subnivel desconocido

          keywordsMap[fieldKey] = keywords;
        }

        onImport(keywordsMap);
        console.log('✅ Keywords imported:', keywordsMap);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('❌ Error parsing CSV:', error);
        alert('Error al procesar el archivo CSV');
      }
    };

    reader.readAsText(file);
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

      {/* Import CSV Button */}
      <button
        onClick={handleImportClick}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition"
        style={{
          backgroundColor: '#fef3c7',
          color: '#92400e',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fde68a'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fef3c7'; }}
        title="Cargar palabras clave desde CSV"
      >
        <Upload size={16} />
        Importar CSV
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
}
