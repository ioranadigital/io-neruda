'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useGenerator } from '@/src/context/GeneratorContext';
import { useRouter } from 'next/navigation';
import {
  Trash2, Edit, Share2, Linkedin, Globe, Archive, FolderOpen,
  RefreshCw, FileText, Search, ChevronDown, X, Download,
} from 'lucide-react';
import ContentEditorModal from '@/src/components/panels/ContentEditorModal';
import ClientSelectorChip from '@/src/components/shared/ClientSelectorChip';

// ─── Constants ────────────────────────────────────────────────────────────────

const FORMAT_OPTIONS = [
  { value: '', label: 'Todos los formatos' },
  { value: 'blog', label: 'Blog' },
  { value: 'email', label: 'Email' },
  { value: 'social', label: 'Social Media' },
  { value: 'pdf', label: 'PDF' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

const TAG_OPTIONS = [
  { value: '', label: 'Todos los tags' },
  { value: 'seo', label: 'SEO' },
  { value: 'geo', label: 'GEO' },
  { value: 'promo', label: 'Promocional' },
  { value: 'educativo', label: 'Educativo' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'draft', label: 'Borrador' },
  { value: 'published', label: 'Publicado' },
];

type TabKey = 'todos' | 'borradores' | 'publicados' | 'archivados';

// ─── Enrichment helpers ───────────────────────────────────────────────────────

function hashId(id: string): number {
  return id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

function deriveGeoScore(id: string): number {
  return 72 + (hashId(id) % 28);
}

function deriveCoreKeyword(title: string, keywords: string[]): string {
  if (keywords?.length > 0) return keywords[0];
  return title.toLowerCase().split(' ').slice(0, 4).join(' ');
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day   = d.getUTCDate().toString().padStart(2, '0');
  const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  const year  = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function deriveTags(id: string): string[] {
  const pool = ['seo', 'geo', 'promo', 'educativo'];
  const h = hashId(id);
  return [pool[h % pool.length]];
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentRow {
  id: string;
  postTitle: string;
  clientName: string;
  outputFormat: string;
  status: 'published' | 'draft' | 'archived';
  generatedDate: string;
  publishedPlatforms?: ('linkedin' | 'wordpress')[];
  body?: string;
  archived?: boolean;
  geoScore: number;
  coreKeyword: string;
  tags: string[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GeoScoreBadge({ score }: { score: number }) {
  const isHigh = score >= 90;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
      isHigh ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
    }`}>
      {score}% GEO
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'published')
    return <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">✓ Publicado</span>;
  if (status === 'archived')
    return <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">📦 Archivado</span>;
  return <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">📝 Borrador</span>;
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV(rows: ContentRow[]) {
  const header = ['Título', 'Cliente', 'Formato', 'Keyword principal', 'Tags', 'Estado', 'GEO Score', 'Fecha'];
  const lines = rows.map(r => [
    `"${r.postTitle.replace(/"/g, '""')}"`,
    `"${r.clientName}"`,
    r.outputFormat,
    `"${r.coreKeyword}"`,
    r.tags.join(' '),
    r.archived ? 'Archivado' : r.status === 'published' ? 'Publicado' : 'Borrador',
    `${r.geoScore}%`,
    formatDate(r.generatedDate),
  ].join(','));
  const csv = [header.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `contenidos-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContenidosPage() {
  const { contentResults } = useGenerator();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [publishingModal, setPublishingModal] = useState<{ contentId: string } | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<('linkedin' | 'wordpress')[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentRow | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [mutarToast, setMutarToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [archivedContents, setArchivedContents] = useState<ContentRow[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [archivedIds, setArchivedIds] = useState<string[]>([]);

  useEffect(() => {
    const raw: Record<string, unknown>[] = JSON.parse(
      localStorage.getItem('io-neruda-archived-contents') || '[]'
    );
    const enriched: ContentRow[] = raw.map(c => ({
      ...(c as unknown as ContentRow),
      geoScore: (c.geoScore as number) ?? deriveGeoScore(c.id as string),
      coreKeyword: (c.coreKeyword as string) ?? deriveCoreKeyword(c.postTitle as string || '', []),
      tags: (c.tags as string[]) ?? deriveTags(c.id as string),
    }));
    setArchivedContents(enriched);
    const deleted = JSON.parse(localStorage.getItem('io-neruda-deleted-contents') || '[]');
    setDeletedIds(deleted);
    const archIds = JSON.parse(localStorage.getItem('io-neruda-archived-ids') || '[]');
    setArchivedIds(archIds);
    setMounted(true);
  }, []);

  const deduplicatedResults = useMemo<ContentRow[]>(() => {
    const raw = Array.from(new Map(contentResults.map(c => [c.id, c])).values());
    return raw.map(c => ({
      id: c.id,
      postTitle: c.postTitle,
      clientName: c.clientName,
      outputFormat: c.outputFormat,
      status: c.status,
      generatedDate: c.generatedDate,
      body: c.generatedContent,
      archived: c.archived,
      geoScore: deriveGeoScore(c.id),
      coreKeyword: deriveCoreKeyword(c.postTitle, c.keywordsUsed || []),
      tags: deriveTags(c.id),
    }));
  }, [contentResults]);

  const activeItems = useMemo(
    () => deduplicatedResults.filter(
      c => !c.archived && !deletedIds.includes(c.id) && !archivedIds.includes(c.id)
    ),
    [deduplicatedResults, deletedIds, archivedIds]
  );

  const drafts    = useMemo(() => activeItems.filter(c => c.status === 'draft'),     [activeItems]);
  const published = useMemo(() => activeItems.filter(c => c.status === 'published'), [activeItems]);

  const tabItems = useMemo<ContentRow[]>(() => {
    switch (activeTab) {
      case 'todos':       return activeItems;
      case 'borradores':  return drafts;
      case 'publicados':  return published;
      case 'archivados':  return archivedContents;
    }
  }, [activeTab, activeItems, drafts, published, archivedContents]);

  const filteredItems = useMemo(() => {
    let items = tabItems;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(c =>
        c.postTitle.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) ||
        c.coreKeyword.toLowerCase().includes(q)
      );
    }
    if (formatFilter) items = items.filter(c => c.outputFormat.toLowerCase().includes(formatFilter));
    if (tagFilter)    items = items.filter(c => c.tags.includes(tagFilter));
    if (statusFilter) items = items.filter(c => c.status === statusFilter);
    return items;
  }, [tabItems, searchQuery, formatFilter, tagFilter, statusFilter]);

  const hasFilters = !!(searchQuery.trim() || formatFilter || tagFilter || statusFilter);

  const stats = useMemo(() => ({
    total:     activeItems.length,
    published: published.length,
    drafts:    drafts.length,
    archived:  archivedContents.length,
  }), [activeItems, published, drafts, archivedContents]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const clearFilters = () => {
    setSearchQuery('');
    setFormatFilter('');
    setTagFilter('');
    setStatusFilter('');
  };

  const handleDelete = (id: string) => {
    if (!confirm('¿Eliminar este contenido permanentemente?')) return;
    const deleted = JSON.parse(localStorage.getItem('io-neruda-deleted-contents') || '[]');
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem('io-neruda-deleted-contents', JSON.stringify(deleted));
    }
    const updated = archivedContents.filter(c => c.id !== id);
    setArchivedContents(updated);
    localStorage.setItem('io-neruda-archived-contents', JSON.stringify(updated));
    setDeletedIds(deleted);
  };

  const handleEdit = (content: ContentRow) => {
    const body = content.body ||
      `<h1>${content.postTitle}</h1>
       <p style="color:#999;font-style:italic;">⚠️ El contenido completo no fue guardado.<br><br>
       Por favor, regenera el contenido desde el generador y guarda nuevamente para editar.</p>`;
    setEditingContent({ ...content, body });
    setEditorOpen(true);
  };

  const handleSaveContent = (id: string, title: string, body: string) => {
    const saved = JSON.parse(localStorage.getItem('io-neruda-saved-contents') || '{}');
    saved[id] = { ...editingContent!, postTitle: title, body };
    localStorage.setItem('io-neruda-saved-contents', JSON.stringify(saved));
    setEditorOpen(false);
    setEditingContent(null);
  };

  const handleArchiveContent = (id: string) => {
    const contentToArchive = editingContent ?? deduplicatedResults.find(c => c.id === id);
    if (!contentToArchive) return;
    // Track archived ID so it disappears from active tabs immediately
    const newArchivedIds = [...archivedIds, id];
    setArchivedIds(newArchivedIds);
    localStorage.setItem('io-neruda-archived-ids', JSON.stringify(newArchivedIds));
    const archived = [
      { ...contentToArchive, archived: true },
      ...archivedContents.filter(c => c.id !== id),
    ];
    setArchivedContents(archived);
    localStorage.setItem('io-neruda-archived-contents', JSON.stringify(archived));
    setEditorOpen(false);
    setEditingContent(null);
  };

  const handleUnarchive = (id: string) => {
    const newArchivedIds = archivedIds.filter(aid => aid !== id);
    setArchivedIds(newArchivedIds);
    localStorage.setItem('io-neruda-archived-ids', JSON.stringify(newArchivedIds));
    const updated = archivedContents.filter(c => c.id !== id);
    setArchivedContents(updated);
    localStorage.setItem('io-neruda-archived-contents', JSON.stringify(updated));
  };

  const handleMutarAno = (content: ContentRow) => {
    setMutarToast(`Inyectando "${content.postTitle}" para refrescar datos estacionales…`);
    setTimeout(() => setMutarToast(null), 3500);
  };

  const toggleRowPreview = (id: string) =>
    setExpandedRowId(prev => (prev === id ? null : id));

  // ─── Tab config ─────────────────────────────────────────────────────────────

  const tabs: { key: TabKey; emoji: string; label: string; count: number }[] = [
    { key: 'todos',      emoji: '📋', label: 'Todos los Contenidos', count: mounted ? activeItems.length : 0 },
    { key: 'borradores', emoji: '📝', label: 'Borradores',           count: mounted ? stats.drafts    : 0 },
    { key: 'publicados', emoji: '✓',  label: 'Publicados',           count: mounted ? stats.published : 0 },
    { key: 'archivados', emoji: '📦', label: 'Archivados',           count: mounted ? stats.archived  : 0 },
  ];

  // ─── Table ──────────────────────────────────────────────────────────────────

  const renderTable = (data: ContentRow[]) => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-[26%]">Título</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Cliente</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Formato</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Keywords</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Tags</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.flatMap(c => {
              const isArchived = activeTab === 'archivados';
              const rows = [
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  {/* Título */}
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-slate-900 leading-snug truncate max-w-[220px]">
                      {c.postTitle}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[220px]">
                      kw: {c.coreKeyword}
                    </p>
                    <div className="mt-1.5">
                      <StatusBadge status={isArchived ? 'archived' : c.status} />
                    </div>
                  </td>

                  {/* Cliente */}
                  <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                    {c.clientName}
                  </td>

                  {/* Formato */}
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {c.outputFormat}
                    </span>
                  </td>

                  {/* Keywords */}
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-slate-500 truncate max-w-[140px] mb-1">{c.coreKeyword}</p>
                    <GeoScoreBadge score={c.geoScore} />
                  </td>

                  {/* Fecha */}
                  <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">
                    {formatDate(c.generatedDate)}
                  </td>

                  {/* Tags */}
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[11px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end items-center gap-1">
                      {!isArchived && (
                        <>
                          <button
                            onClick={() => toggleRowPreview(c.id)}
                            className={`p-1.5 rounded-lg transition ${
                              expandedRowId === c.id
                                ? 'bg-slate-200 text-slate-700'
                                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                            }`}
                            title="Vista previa"
                          >
                            <FileText size={14} />
                          </button>
                          <button
                            onClick={() => handleMutarAno(c)}
                            className="p-1.5 text-violet-500 hover:bg-violet-50 hover:text-violet-700 rounded-lg transition"
                            title="Mutar Año"
                          >
                            <RefreshCw size={14} />
                          </button>
                          <button
                            onClick={() => setPublishingModal({ contentId: c.id })}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Publicar"
                          >
                            <Share2 size={14} />
                          </button>
                          <button
                            onClick={() => handleEdit(c)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleArchiveContent(c.id)}
                            className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition"
                            title="Archivar"
                          >
                            <Archive size={14} />
                          </button>
                        </>
                      )}
                      {isArchived && (
                        <button
                          onClick={() => handleUnarchive(c.id)}
                          className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition font-medium"
                        >
                          Restaurar
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>,
              ];

              if (expandedRowId === c.id) {
                rows.push(
                  <tr key={`${c.id}-preview`} className="bg-slate-50">
                    <td colSpan={7} className="px-5 pb-5 pt-0">
                      <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Vista previa del contenido
                          </p>
                          <div
                            className="text-sm text-slate-700 bg-white rounded-lg border border-slate-200 p-4 max-h-44 overflow-y-auto leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: c.body ||
                                `<p style="color:#94a3b8;font-style:italic">Sin contenido guardado. Regenera desde el generador.</p>`,
                            }}
                          />
                        </div>
                        <button
                          onClick={() => setExpandedRowId(null)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition flex-shrink-0 mt-1"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }

              return rows;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {mutarToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 text-white px-4 py-3 rounded-xl text-sm font-medium shadow-xl flex items-center gap-2">
          <span>⚡</span>
          <span>{mutarToast}</span>
        </div>
      )}

      <div className="w-full h-full flex flex-col overflow-x-hidden">

        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white">
                <FolderOpen size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Mis contenidos</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {mounted ? activeItems.length + archivedContents.length : 0} contenidos generados en total
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => exportCSV(filteredItems)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                <Download size={15} />
                Exportar CSV
              </button>
              <ClientSelectorChip />
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="flex-shrink-0 px-6 pt-5 pb-1">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-slate-900">{mounted ? stats.total     : 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Publicados</p>
              <p className="text-2xl font-bold text-green-600">{mounted ? stats.published : 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Borradores</p>
              <p className="text-2xl font-bold text-yellow-600">{mounted ? stats.drafts   : 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Archivados</p>
              <p className="text-2xl font-bold text-orange-600">{mounted ? stats.archived : 0}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-slate-200 bg-white mt-4 px-6">
          <div className="flex gap-6">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); clearFilters(); }}
                className={`pb-3 pt-0.5 font-medium text-sm border-b-2 transition whitespace-nowrap ${
                  activeTab === t.key
                    ? 'border-violet-600 text-violet-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.emoji} {t.label} ({t.count})
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="px-6 py-4 space-y-4">

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar por título, cliente o keyword…"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-violet-400 focus:outline-none transition text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={formatFilter}
                  onChange={e => setFormatFilter(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-violet-400 focus:outline-none transition text-slate-700 cursor-pointer"
                >
                  {FORMAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={tagFilter}
                  onChange={e => setTagFilter(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-violet-400 focus:outline-none transition text-slate-700 cursor-pointer"
                >
                  {TAG_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {activeTab !== 'archivados' && (
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-violet-400 focus:outline-none transition text-slate-700 cursor-pointer"
                  >
                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              )}

              {hasFilters && (
                <>
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition"
                  >
                    <X size={11} /> Limpiar
                  </button>
                  <span className="text-xs text-slate-400 ml-auto">
                    {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''}
                  </span>
                </>
              )}
            </div>

            {/* Content — only rendered client-side to avoid localStorage/date hydration mismatch */}
            {!mounted && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-400 text-sm">Cargando contenidos…</p>
              </div>
            )}

            {mounted && activeTab !== 'archivados' && activeItems.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500 text-base mb-4">No hay contenidos generados aún</p>
                <button
                  onClick={() => router.push('/generators')}
                  className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium text-sm"
                >
                  Ir a Generador
                </button>
              </div>
            )}

            {mounted && activeTab === 'archivados' && archivedContents.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500 text-base">No hay contenidos archivados</p>
              </div>
            )}

            {mounted && filteredItems.length === 0 && tabItems.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-400 text-sm">Sin resultados para los filtros aplicados</p>
              </div>
            )}

            {mounted && filteredItems.length > 0 && renderTable(filteredItems)}

          </div>
        </div>

      </div>

      {/* Editor Modal */}
      {editingContent && (
        <ContentEditorModal
          isOpen={editorOpen}
          content={{
            id: editingContent.id,
            postTitle: editingContent.postTitle,
            clientName: editingContent.clientName,
            body: editingContent.body || '',
          }}
          onClose={() => { setEditorOpen(false); setEditingContent(null); }}
          onSave={handleSaveContent}
          onArchive={handleArchiveContent}
        />
      )}

      {/* Publishing Modal */}
      {publishingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">🚀 Selecciona Plataformas</h2>
            <p className="text-slate-600 mb-6 text-sm">Elige en qué plataformas deseas publicar:</p>
            <div className="space-y-3 mb-6">
              {(['linkedin', 'wordpress'] as const).map(platform => (
                <label key={platform} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform)}
                    onChange={e => {
                      if (e.target.checked) setSelectedPlatforms([...selectedPlatforms, platform]);
                      else setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                    }}
                    className="w-4 h-4 rounded"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    {platform === 'linkedin'
                      ? <Linkedin size={18} className="text-blue-600" />
                      : <Globe size={18} className="text-slate-600" />
                    }
                    <div>
                      <p className="font-medium text-slate-900 text-sm capitalize">{platform}</p>
                      <p className="text-xs text-slate-500">
                        {platform === 'linkedin' ? 'Publica como post en tu perfil' : 'Publica como artículo en tu blog'}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPublishingModal(null)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  console.log('Publicando:', selectedPlatforms, publishingModal);
                  setPublishingModal(null);
                  setSelectedPlatforms([]);
                }}
                disabled={selectedPlatforms.length === 0}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

