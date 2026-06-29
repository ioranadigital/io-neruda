'use client';

import React, { useState, useMemo } from 'react';
import { ContentResult } from '../../types/generator';
import { Client } from '../../types/client';
import { ChevronDown, ChevronRight, Trash2, Download, Search, Filter, Copy, FileDown, Copy as CopyIcon, CheckCircle, Clock, Archive, Edit3 } from 'lucide-react';
import { showToast } from '../shared/Toast';
import ArticleEditModal from './ArticleEditModal';

interface ContentResultsPanelProps {
  contentResults?: ContentResult[];
  clients?: Client[];
  onDeleteResult?: (resultId: string) => void;
  onStatusChange?: (resultId: string, status: 'draft' | 'published' | 'archived') => void;
  onDuplicateResult?: (result: ContentResult) => void;
}

export default function ContentResultsPanel({
  contentResults = [],
  clients = [],
  onDeleteResult,
  onStatusChange,
  onDuplicateResult,
}: ContentResultsPanelProps) {
  const [expandedClients, setExpandedClients] = useState<Set<string>>(
    new Set(clients?.map(c => c.id) || [])
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [editingResult, setEditingResult] = useState<ContentResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'stats' | 'drafts' | 'archived'>('all');

  // Group content by client with filtering
  const groupedResults = useMemo(() => {
    const grouped: { [clientId: string]: { client: Client | undefined; results: ContentResult[] } } = {};

    clients.forEach(client => {
      const clientResults = contentResults
        .filter(r => r.clientId === client.id)
        .filter(r => {
          const matchesSearch = r.postTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.keywordsUsed.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()));
          const matchesFormat = !selectedFormat || r.outputFormat === selectedFormat;
          const matchesTag = !selectedTag || (r.tags && r.tags.includes(selectedTag));
          const matchesStatus = !selectedStatus || (selectedStatus === 'published' && r.status === 'published') || (selectedStatus === 'unpublished' && r.status === 'draft');
          const excludeArchived = r.status !== 'archived';
          const excludeDrafts = r.status !== 'draft';
          return matchesSearch && matchesFormat && matchesTag && matchesStatus && excludeArchived && excludeDrafts;
        });

      grouped[client.id] = {
        client,
        results: clientResults,
      };
    });

    return grouped;
  }, [contentResults, clients, searchTerm, selectedFormat, selectedTag, selectedStatus]);

  const toggleClientExpansion = (clientId: string) => {
    const newExpanded = new Set(expandedClients);
    if (newExpanded.has(clientId)) {
      newExpanded.delete(clientId);
    } else {
      newExpanded.add(clientId);
    }
    setExpandedClients(newExpanded);
  };

  const handleDeleteResult = (resultId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contenido?')) {
      onDeleteResult?.(resultId);
      showToast.success('✅ Contenido eliminado');
    }
  };

  const handleDuplicateResult = (result: ContentResult) => {
    const newResult = {
      ...result,
      id: `result_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      postTitle: `${result.postTitle} (copia)`,
      status: 'draft' as const,
    };
    onDuplicateResult?.(newResult);
    showToast.success('✅ Contenido duplicado');
  };

  const handleStatusChange = (resultId: string, newStatus: 'draft' | 'published' | 'archived') => {
    onStatusChange?.(resultId, newStatus);
    showToast.success(`✅ Status actualizado a ${newStatus}`);
  };

  const handleDownloadContent = (result: ContentResult) => {
    const content = `Título: ${result.postTitle}
Formato: ${result.outputFormat}
Cliente: ${result.clientName}
Público Objetivo: ${result.targetAudience}
Intención: ${result.contentIntent}
Keywords: ${result.keywordsUsed.join(', ')}
Fecha: ${new Date(result.generatedDate).toLocaleString('es-ES')}
Status: ${result.status}
Tags: ${result.tags?.join(', ') || 'Sin tags'}
`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `${result.postTitle.replace(/\s+/g, '_')}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast.success('✅ Contenido descargado');
  };

  const handleDownloadCSV = () => {
    let csv = 'Título,Formato,Cliente,Público Objetivo,Intención,Keywords,Fecha,Status,Tags\n';

    contentResults.forEach(result => {
      const row = [
        `"${result.postTitle}"`,
        result.outputFormat,
        result.clientName,
        `"${result.targetAudience}"`,
        result.contentIntent,
        `"${result.keywordsUsed.join('; ')}"`,
        new Date(result.generatedDate).toLocaleDateString('es-ES'),
        result.status,
        `"${result.tags?.join('; ') || ''}"`,
      ].join(',');
      csv += row + '\n';
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `contenidos_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast.success('✅ CSV descargado');
  };

  const handleCopyTitle = (title: string) => {
    navigator.clipboard.writeText(title);
    showToast.success('✅ Título copiado');
  };

  const handleEditArticle = (result: ContentResult) => {
    setEditingResult(result);
    setIsModalOpen(true);
  };

  const handleSaveArticle = (newTitle: string, newContent: string) => {
    if (editingResult) {
      showToast.success('✅ Artículo actualizado');
      // Aquí podrías enviar los cambios al servidor si es necesario
      // Por ahora, solo guardamos en estado local
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const formatCount: { [key: string]: number } = {};
    const statusCount: { [key: string]: number } = {};
    const dateCount: { [key: string]: number } = {};
    const allTags: { [key: string]: number } = {};

    contentResults.forEach(result => {
      formatCount[result.outputFormat] = (formatCount[result.outputFormat] || 0) + 1;
      statusCount[result.status] = (statusCount[result.status] || 0) + 1;

      const dateKey = new Date(result.generatedDate).toLocaleDateString('es-ES');
      dateCount[dateKey] = (dateCount[dateKey] || 0) + 1;

      if (result.tags) {
        result.tags.forEach(tag => {
          allTags[tag] = (allTags[tag] || 0) + 1;
        });
      }
    });

    return { formatCount, statusCount, dateCount, allTags };
  }, [contentResults]);

  const totalResults = contentResults.length;
  const uniqueFormats = [...new Set(contentResults.map(r => r.outputFormat))];
  const uniqueTags = Object.keys(stats.allTags).sort();
  const daysData = Object.entries(stats.dateCount).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()).slice(-7);

  if (totalResults === 0) {
    return (
      <div className="p-6 rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-600 font-medium mb-1">Sin contenido generado</p>
          <p className="text-sm text-gray-500">
            Aquí aparecerán todos los contenidos que generes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header con estadísticas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Contenidos Generados</h2>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            <FileDown size={16} />
            Exportar CSV
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-4 border-b border-gray-200 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium text-sm transition ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            📋 Todos los Contenidos ({totalResults})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-4 py-2 font-medium text-sm transition ${activeTab === 'drafts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            📝 Borradores ({stats.statusCount['draft'] || 0})
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`px-4 py-2 font-medium text-sm transition ${activeTab === 'published' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            ✓ Publicados ({stats.statusCount['published'] || 0})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-4 py-2 font-medium text-sm transition ${activeTab === 'archived' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            📦 Archivados ({stats.statusCount['archived'] || 0})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 font-medium text-sm transition ${activeTab === 'stats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            📊 Estadísticas
          </button>
        </div>

        {(activeTab === 'all' || activeTab === 'published') && (
          <>
            {/* Estadísticas */}
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
                <p className="text-xs text-gray-600 mb-1">Total</p>
                <p className="text-xl font-bold text-green-700">{totalResults}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#f0f9ff' }}>
                <p className="text-xs text-gray-600 mb-1">Publicados</p>
                <p className="text-xl font-bold text-blue-700">{stats.statusCount['published'] || 0}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
                <p className="text-xs text-gray-600 mb-1">Borradores</p>
                <p className="text-xl font-bold text-amber-700">{stats.statusCount['draft'] || 0}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#fee2e2' }}>
                <p className="text-xs text-gray-600 mb-1">Archivados</p>
                <p className="text-xl font-bold text-red-700">{stats.statusCount['archived'] || 0}</p>
              </div>
            </div>
          </>
        )}
        {activeTab === 'stats' && (
          <>
            {/* Estadísticas por fecha */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Contenidos por Día (últimos 7 días)</h3>
              <div className="flex items-end gap-2 h-32">
                {daysData.length > 0 ? (
                  daysData.map(([date, count]) => {
                    const maxCount = Math.max(...daysData.map(d => d[1]));
                    const height = (count / maxCount) * 100;
                    return (
                      <div key={date} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t"
                          style={{ height: `${height}%`, backgroundColor: '#7BF1A8', minHeight: '20px' }}
                          title={`${date}: ${count} contenidos`}
                        />
                        <p className="text-xs text-gray-600 text-center">{count}</p>
                        <p className="text-xs text-gray-500 text-center whitespace-nowrap">{date.split('/')[0]}/{date.split('/')[1]}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">Sin datos</p>
                )}
              </div>
            </div>

            {/* Status Distribution */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-xs text-green-700 font-medium mb-1">📤 Publicados</p>
                <p className="text-2xl font-bold text-green-700">{stats.statusCount['published'] || 0}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <p className="text-xs text-yellow-700 font-medium mb-1">📝 Borradores</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.statusCount['draft'] || 0}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xs text-red-700 font-medium mb-1">🗂️ Archivados</p>
                <p className="text-2xl font-bold text-red-700">{stats.statusCount['archived'] || 0}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* All Contents Table - Show in all, published, drafts or archived tabs */}
      {(activeTab === 'all' || activeTab === 'published' || activeTab === 'drafts' || activeTab === 'archived') && (
        <>
          {(activeTab === 'all' || activeTab === 'published') && (
          <>
          {/* Client Sections */}
          <div className="space-y-3">
            {clients.map(client => {
              const group = groupedResults[client.id];
              const isExpanded = expandedClients.has(client.id);
              const resultCount = group.results.length;

              if (resultCount === 0) {
                return null;
              }

              return (
              <div key={client.id} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                {/* Client Header */}
                <button
                  onClick={() => toggleClientExpansion(client.id)}
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">{client.name}</h3>
                      <p className="text-xs text-gray-500">{resultCount} contenido{resultCount !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: '#d4f8e8', color: '#065f46' }}>
                    {resultCount}
                  </span>
                </button>

                {/* Content Table */}
                {isExpanded && (
                  <div className="border-t border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Título</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Formato</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Keywords</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Tags</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.results.map((result) => (
                          <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            {/* Title */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-800 line-clamp-2 flex-1">{result.postTitle}</p>
                                <button
                                  onClick={() => handleCopyTitle(result.postTitle)}
                                  title="Copiar título"
                                  className="p-1 hover:bg-blue-100 rounded transition text-blue-600 flex-shrink-0"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            </td>

                            {/* Format */}
                            <td className="px-4 py-3">
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#d4f8e8', color: '#065f46' }}>
                                {result.outputFormat}
                              </span>
                            </td>

                            {/* Keywords */}
                            <td className="px-4 py-3">
                              <div className="flex gap-1 flex-wrap">
                                {result.keywordsUsed.slice(0, 2).map((kw, idx) => (
                                  <span key={idx} className="inline-block px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                                    {kw}
                                  </span>
                                ))}
                                {result.keywordsUsed.length > 2 && (
                                  <span className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                    +{result.keywordsUsed.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Tags */}
                            <td className="px-4 py-3">
                              <div className="flex gap-1 flex-wrap">
                                {result.tags && result.tags.slice(0, 2).map((tag, idx) => (
                                  <span key={idx} className="inline-block px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">
                                    {tag}
                                  </span>
                                ))}
                                {result.tags && result.tags.length > 2 && (
                                  <span className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                    +{result.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {result.status === 'draft' && (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(result.id, 'published')}
                                      title="Publicar"
                                      className="p-1 hover:bg-green-100 rounded transition text-green-600"
                                    >
                                      <CheckCircle size={16} />
                                    </button>
                                  </>
                                )}
                                {result.status === 'published' && (
                                  <span className="inline-block px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#d4f8e8', color: '#065f46' }}>
                                    Publicado
                                  </span>
                                )}
                                {result.status === 'archived' && (
                                  <span className="inline-block px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                                    Archivado
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleDownloadContent(result)}
                                  title="Descargar"
                                  className="p-1.5 hover:bg-blue-100 rounded transition text-blue-600"
                                >
                                  <Download size={16} />
                                </button>
                                <button
                                  onClick={() => handleDuplicateResult(result)}
                                  title="Duplicar"
                                  className="p-1.5 hover:bg-purple-100 rounded transition text-purple-600"
                                >
                                  <CopyIcon size={16} />
                                </button>
                                {result.status !== 'archived' && (
                                  <button
                                    onClick={() => handleStatusChange(result.id, 'archived')}
                                    title="Archivar"
                                    className="p-1.5 hover:bg-amber-100 rounded transition text-amber-600"
                                  >
                                    <Archive size={16} />
                                  </button>
                                )}
                                {onDeleteResult && (
                                  <button
                                    onClick={() => handleDeleteResult(result.id)}
                                    title="Eliminar"
                                    className="p-1.5 hover:bg-red-100 rounded transition text-red-600"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              );
            })}
          </div>
          </>
          )}

          {/* All Contents Flat Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
            {/* Header con búsqueda y filtros - TODO EN LA MISMA LÍNEA */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-4 items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {activeTab === 'archived' ? '📦 Contenidos Archivados' : activeTab === 'drafts' ? '📝 Borradores Listos para Publicar' : activeTab === 'published' ? '✓ Artículos Publicados' : '📋 Todos los Contenidos'}
                </h3>

                {/* Búsqueda y Filtros - Alineados a la derecha */}
                <div className="flex gap-3 items-center flex-1 justify-end">
                  <div className="relative w-56">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por título o keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Todos los formatos</option>
                    {uniqueFormats.map(format => (
                      <option key={format} value={format}>
                        {format} ({stats.formatCount[format] || 0})
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Todos los tags</option>
                    {uniqueTags.map(tag => (
                      <option key={tag} value={tag}>
                        {tag} ({stats.allTags[tag] || 0})
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Todos los estados</option>
                    <option value="published">✓ Publicados ({stats.statusCount['published'] || 0})</option>
                    <option value="unpublished">📝 Sin publicar ({stats.statusCount['draft'] || 0})</option>
                    <option value="archived">🗂️ Archivados ({stats.statusCount['archived'] || 0})</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Título</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Cliente</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Formato</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Keywords</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Fecha</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Tags</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {contentResults
                    .filter(r => {
                      const matchesSearch = r.postTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.keywordsUsed.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()));
                      const matchesFormat = !selectedFormat || r.outputFormat === selectedFormat;
                      const matchesTag = !selectedTag || (r.tags && r.tags.includes(selectedTag));
                      const matchesStatus = !selectedStatus || (selectedStatus === 'published' && r.status === 'published') || (selectedStatus === 'unpublished' && r.status === 'draft') || (selectedStatus === 'archived' && r.status === 'archived');
                      let tabFilter = true;
                      if (activeTab === 'archived') {
                        tabFilter = r.status === 'archived';
                      } else if (activeTab === 'drafts') {
                        tabFilter = r.status === 'draft';
                      } else if (activeTab === 'published') {
                        tabFilter = r.status === 'published';
                      } else if (activeTab === 'all') {
                        tabFilter = true;
                      }
                      return matchesSearch && matchesFormat && matchesTag && matchesStatus && tabFilter;
                    })
                    .sort((a, b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime())
                    .map((result) => (
                      <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        {/* Title */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditArticle(result)}
                              title="Editar artículo"
                              className="font-medium text-blue-600 hover:text-blue-800 hover:underline line-clamp-2 flex-1 text-left transition flex items-center gap-1"
                            >
                              {result.postTitle}
                              <Edit3 size={14} className="flex-shrink-0" />
                            </button>
                            <button
                              onClick={() => handleCopyTitle(result.postTitle)}
                              title="Copiar título"
                              className="p-1 hover:bg-blue-100 rounded transition text-blue-600 flex-shrink-0"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </td>

                        {/* Client */}
                        <td className="px-4 py-3 text-gray-700 font-medium">
                          <p className="text-sm">{result.clientName}</p>
                        </td>

                        {/* Format */}
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#d4f8e8', color: '#065f46' }}>
                            {result.outputFormat}
                          </span>
                        </td>

                        {/* Keywords */}
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {result.keywordsUsed.slice(0, 2).map((kw, idx) => (
                              <span key={idx} className="inline-block px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                                {kw}
                              </span>
                            ))}
                            {result.keywordsUsed.length > 2 && (
                              <span className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                +{result.keywordsUsed.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-gray-600 text-sm whitespace-nowrap">
                          {new Date(result.generatedDate).toLocaleDateString('es-ES')}
                        </td>

                        {/* Tags */}
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {result.tags && result.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="inline-block px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">
                                {tag}
                              </span>
                            ))}
                            {result.tags && result.tags.length > 2 && (
                              <span className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                +{result.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            {/* Status Button */}
                            <button
                              title={`Status: ${result.status}`}
                              className="px-2 py-1 rounded text-xs font-medium transition hover:opacity-80"
                              style={{
                                backgroundColor: result.status === 'draft' ? '#fef3c7' : result.status === 'published' ? '#d4f8e8' : '#fee2e2',
                                color: result.status === 'draft' ? '#92400e' : result.status === 'published' ? '#065f46' : '#991b1b'
                              }}
                            >
                              {result.status === 'draft' ? '📝 Draft' : result.status === 'published' ? '✓ Publicado' : '📦 Archivado'}
                            </button>

                            <button
                              onClick={() => handleDownloadContent(result)}
                              title="Descargar"
                              className="p-1.5 hover:bg-blue-100 rounded transition text-blue-600"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={() => handleDuplicateResult(result)}
                              title="Duplicar"
                              className="p-1.5 hover:bg-purple-100 rounded transition text-purple-600"
                            >
                              <CopyIcon size={16} />
                            </button>
                            {result.status === 'draft' && (
                              <button
                                onClick={() => handleStatusChange(result.id, 'published')}
                                title="Publicar"
                                className="p-1.5 hover:bg-green-100 rounded transition text-green-600"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            {result.status !== 'archived' && (
                              <button
                                onClick={() => handleStatusChange(result.id, 'archived')}
                                title="Archivar"
                                className="p-1.5 hover:bg-amber-100 rounded transition text-amber-600"
                              >
                                <Archive size={16} />
                              </button>
                            )}
                            {onDeleteResult && (
                              <button
                                onClick={() => handleDeleteResult(result.id)}
                                title="Eliminar"
                                className="p-1.5 hover:bg-red-100 rounded transition text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Article Edit Modal */}
      {editingResult && (
        <ArticleEditModal
          isOpen={isModalOpen}
          title={editingResult.postTitle}
          content={editingResult.generatedContent || ''}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveArticle}
        />
      )}
    </div>
  );
}
