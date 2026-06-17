'use client';

import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';

interface KeywordsImportExportProps {
  clientName: string;
  onImport: (keywordsData: Record<string, string[]>) => void;
}

export default function KeywordsImportExport({ clientName, onImport }: KeywordsImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template CSV structure
  const CSV_TEMPLATE = `nivel,bloque,keyword1,keyword2,keyword3,keyword4,keyword5
1,Core de Negocio,ejemplo1,ejemplo2,ejemplo3,,
1,Branded Keywords,${clientName},${clientName} online,${clientName} España,,
1,Fabricantes de Terceros,marca1,marca2,marca3,,
1,Head Terms,categoría1,categoría2,categoría3,,
2,Local,ciudad1,ciudad2,región1,,
2,Audience Profile,perfil1,perfil2,perfil3,,
3,Educational How-to,guía1,guía2,guía3,,
3,Problem/Symptom,problema1,problema2,problema3,,
3,Seasonal,temporada1,temporada2,temporada3,,
4,Comparative,comparación1,comparación2,comparación3,,
4,Lists & Roundups,lista1,lista2,lista3,,
4,Reviews & Opinions,review1,review2,review3,,
5,Longtail Informational,longtail1,longtail2,longtail3,,
5,Longtail Transactional,transaccional1,transaccional2,transaccional3,,
6,Banned Words,palabra_evitar1,palabra_evitar2,palabra_evitar3,,
6,Banned Tones,tono_evitar1,tono_evitar2,tono_evitar3,,
6,Competing Keywords,competidor1,competidor2,competidor3,,`;

  // Download template
  const downloadTemplate = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(CSV_TEMPLATE));
    element.setAttribute('download', `keywords_template_${clientName}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
          const [nivel, bloque, ...keywords] = lines[i].split(',').map(k => k.trim()).filter(Boolean);

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
        title="Descargar plantilla CSV para cargar palabras clave"
      >
        <Download size={16} />
        Descargar Plantilla
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
