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

  // Template data for Excel
  const TEMPLATE_DATA = [
    { nivel: 1, bloque: 'Core de Negocio', keyword1: 'ejemplo1', keyword2: 'ejemplo2', keyword3: 'ejemplo3', keyword4: '', keyword5: '' },
    { nivel: 1, bloque: 'Branded Keywords', keyword1: clientName, keyword2: `${clientName} online`, keyword3: `${clientName} España`, keyword4: '', keyword5: '' },
    { nivel: 1, bloque: 'Fabricantes de Terceros', keyword1: 'marca1', keyword2: 'marca2', keyword3: 'marca3', keyword4: '', keyword5: '' },
    { nivel: 1, bloque: 'Head Terms', keyword1: 'categoría1', keyword2: 'categoría2', keyword3: 'categoría3', keyword4: '', keyword5: '' },
    { nivel: 2, bloque: 'Local', keyword1: 'ciudad1', keyword2: 'ciudad2', keyword3: 'región1', keyword4: '', keyword5: '' },
    { nivel: 2, bloque: 'Audience Profile', keyword1: 'perfil1', keyword2: 'perfil2', keyword3: 'perfil3', keyword4: '', keyword5: '' },
    { nivel: 3, bloque: 'Educational How-to', keyword1: 'guía1', keyword2: 'guía2', keyword3: 'guía3', keyword4: '', keyword5: '' },
    { nivel: 3, bloque: 'Problem/Symptom', keyword1: 'problema1', keyword2: 'problema2', keyword3: 'problema3', keyword4: '', keyword5: '' },
    { nivel: 3, bloque: 'Seasonal', keyword1: 'temporada1', keyword2: 'temporada2', keyword3: 'temporada3', keyword4: '', keyword5: '' },
    { nivel: 4, bloque: 'Comparative', keyword1: 'comparación1', keyword2: 'comparación2', keyword3: 'comparación3', keyword4: '', keyword5: '' },
    { nivel: 4, bloque: 'Lists & Roundups', keyword1: 'lista1', keyword2: 'lista2', keyword3: 'lista3', keyword4: '', keyword5: '' },
    { nivel: 4, bloque: 'Reviews & Opinions', keyword1: 'review1', keyword2: 'review2', keyword3: 'review3', keyword4: '', keyword5: '' },
    { nivel: 5, bloque: 'Longtail Informational', keyword1: 'longtail1', keyword2: 'longtail2', keyword3: 'longtail3', keyword4: '', keyword5: '' },
    { nivel: 5, bloque: 'Longtail Transactional', keyword1: 'transaccional1', keyword2: 'transaccional2', keyword3: 'transaccional3', keyword4: '', keyword5: '' },
    { nivel: 6, bloque: 'Banned Words', keyword1: 'palabra_evitar1', keyword2: 'palabra_evitar2', keyword3: 'palabra_evitar3', keyword4: '', keyword5: '' },
    { nivel: 6, bloque: 'Banned Tones', keyword1: 'tono_evitar1', keyword2: 'tono_evitar2', keyword3: 'tono_evitar3', keyword4: '', keyword5: '' },
    { nivel: 6, bloque: 'Competing Keywords', keyword1: 'competidor1', keyword2: 'competidor2', keyword3: 'competidor3', keyword4: '', keyword5: '' },
  ];

  // Download template as XLS
  const downloadTemplate = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(TEMPLATE_DATA);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Keywords');

      // Set column widths
      const colWidths = [
        { wch: 8 },  // nivel
        { wch: 25 }, // bloque
        { wch: 20 }, // keyword1
        { wch: 20 }, // keyword2
        { wch: 20 }, // keyword3
        { wch: 20 }, // keyword4
        { wch: 20 }, // keyword5
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

        // Skip header row
        for (let i = 1; i < lines.length; i++) {
          const [nivel, bloque, ...keywords] = lines[i].split(',').map(k => k.trim()).filter(k => k.length > 0);

          if (!nivel || !bloque) continue;

          // Map bloque to keywords_hierarchical key
          const keyPrefix = `level${nivel}_`;
          let keyField = keyPrefix;

          // Map Spanish names to field keys
          const blockMap: Record<string, string> = {
            'Core de Negocio': 'entity_core',
            'Branded Keywords': 'branded',
            'Fabricantes de Terceros': 'brand_third_party',
            'Head Terms': 'niche_sector',
            'Local': 'local',
            'Audience Profile': 'audience_profile',
            'Educational How-to': 'educational_howto',
            'Problem/Symptom': 'problem_symptom',
            'Seasonal': 'seasonal',
            'Comparative': 'comparative_vs',
            'Lists & Roundups': 'lists_roundups',
            'Reviews & Opinions': 'review_opinions',
            'Longtail Informational': 'longtail_informational',
            'Longtail Transactional': 'longtail_transactional',
            'Banned Words': 'banned_words',
            'Banned Tones': 'banned_tones',
            'Competing Keywords': 'competing_keywords',
          };

          keyField += blockMap[bloque] || bloque.toLowerCase().replace(/\s+/g, '_');
          keywordsMap[keyField] = keywords.filter(k => k.length > 0);
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
