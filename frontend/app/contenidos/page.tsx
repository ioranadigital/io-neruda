'use client';

import { useGenerator } from '@/src/context/GeneratorContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Edit, Share2, Linkedin, Globe, Archive } from 'lucide-react';
import { useState, useEffect } from 'react';
import ContentEditorModal from '@/src/components/panels/ContentEditorModal';

interface ContentWithPublishing {
  id: string;
  postTitle: string;
  clientName: string;
  outputFormat: string;
  status: 'published' | 'draft';
  generatedDate: string;
  publishedPlatforms?: ('linkedin' | 'wordpress')[];
  body?: string;
  archived?: boolean;
}

export default function ContenidosPage() {
  const { contentResults } = useGenerator();
  const router = useRouter();
  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [publishingModal, setPublishingModal] = useState<{ contentId: string; clientId: string } | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<('linkedin' | 'wordpress')[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentWithPublishing | null>(null);
  const [archivedContents, setArchivedContents] = useState<ContentWithPublishing[]>([]);

  // Deduplicar contentResults por ID (evita duplicados si usuario hace clic múltiples veces)
  const deduplicatedResults = Array.from(
    new Map(contentResults.map(c => [c.id, c])).values()
  );
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  useEffect(() => {
    const archived = JSON.parse(localStorage.getItem('io-neruda-archived-contents') || '[]');
    setArchivedContents(archived);

    const deleted = JSON.parse(localStorage.getItem('io-neruda-deleted-contents') || '[]');
    setDeletedIds(deleted);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este contenido permanentemente?')) {
      // Guardar IDs eliminados para filtrar contentResults
      const deletedIds = JSON.parse(localStorage.getItem('io-neruda-deleted-contents') || '[]');
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('io-neruda-deleted-contents', JSON.stringify(deletedIds));
      }

      // Eliminar de archivados si existe
      const updated = archivedContents.filter(c => c.id !== id);
      setArchivedContents(updated);
      localStorage.setItem('io-neruda-archived-contents', JSON.stringify(updated));
    }
  };

  const handleEdit = (content: ContentWithPublishing) => {
    // Si no hay body guardado, mostrar mensaje
    const body = content.body || `
      <h1>${content.postTitle}</h1>
      <p style="color: #999; font-style: italic;">
        ⚠️ El contenido completo no fue guardado.
        <br><br>
        Por favor, regenera el contenido desde el generador y guarda nuevamente para editar.
      </p>
    `;

    setEditingContent({
      ...content,
      body,
    });
    setEditorOpen(true);
  };

  const handlePublish = (contentId: string, clientId: string) => {
    setPublishingModal({ contentId, clientId });
    setSelectedPlatforms([]);
  };

  const handlePublishSubmit = async () => {
    if (!publishingModal || selectedPlatforms.length === 0) return;
    console.log('Publicando en plataformas:', selectedPlatforms, publishingModal);
    setPublishingModal(null);
    setSelectedPlatforms([]);
  };

  const handleSaveContent = (id: string, title: string, body: string) => {
    const updatedContent = {
      ...editingContent!,
      postTitle: title,
      body,
    };

    const saved = JSON.parse(localStorage.getItem('io-neruda-saved-contents') || '{}');
    saved[id] = updatedContent;
    localStorage.setItem('io-neruda-saved-contents', JSON.stringify(saved));

    setEditorOpen(false);
    setEditingContent(null);
  };

  const handleArchiveContent = (id: string) => {
    const contentToArchive = editingContent || deduplicatedResults.find(c => c.id === id);
    if (!contentToArchive) return;

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
    const updated = archivedContents.filter(c => c.id !== id);
    setArchivedContents(updated);
    localStorage.setItem('io-neruda-archived-contents', JSON.stringify(updated));
  };

  const renderTable = (data: ContentWithPublishing[]) => (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Título</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Cliente</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Formato</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Estado</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Fecha</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((content) => (
              <tr key={content.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">{content.postTitle}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{content.clientName}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {content.outputFormat}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      content.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {content.status === 'published' ? '✓ Publicado' : '📝 Borrador'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(content.generatedDate).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {tab === 'active' && (
                      <>
                        <button
                          onClick={() => handlePublish(content.id, 'client-id')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Publicar"
                        >
                          <Share2 size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(content)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleArchiveContent(content.id)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                          title="Archivar"
                        >
                          <Archive size={18} />
                        </button>
                      </>
                    )}
                    {tab === 'archived' && (
                      <button
                        onClick={() => handleUnarchive(content.id)}
                        className="px-3 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition font-medium"
                      >
                        Restaurar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col overflow-x-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 md:px-6 pt-4 pb-3 border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3 font-medium text-sm"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">📁 Mis Contenidos</h1>
        <p className="text-slate-600 text-sm">{deduplicatedResults.length + archivedContents.length} contenidos en total</p>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-white">
        <div className="px-4 md:px-6 flex gap-6">
          <button
            onClick={() => setTab('active')}
            className={`py-3 font-medium text-sm border-b-2 transition ${
              tab === 'active'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Activos ({deduplicatedResults.filter(c => !c.archived && !deletedIds.includes(c.id)).length})
          </button>
          <button
            onClick={() => setTab('archived')}
            className={`py-3 font-medium text-sm border-b-2 transition ${
              tab === 'archived'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            📦 Archivados ({archivedContents.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto w-full">
        <div className="px-4 md:px-6 py-4 w-full">
          {tab === 'active' && deduplicatedResults.filter(c => !c.archived && !deletedIds.includes(c.id)).length === 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-500 text-lg mb-4">No hay contenidos generados aún</p>
              <button
                onClick={() => router.push('/generators')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
              >
                Ir a Generador
              </button>
            </div>
          )}

          {tab === 'active' && deduplicatedResults.filter(c => !c.archived && !deletedIds.includes(c.id)).length > 0 && (
            renderTable(deduplicatedResults.filter(c => !c.archived && !deletedIds.includes(c.id)))
          )}

          {tab === 'archived' && archivedContents.length === 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-500 text-lg">No hay contenidos archivados</p>
            </div>
          )}

          {tab === 'archived' && archivedContents.length > 0 && (
            renderTable(archivedContents)
          )}

          {/* Stats */}
          {tab === 'active' && deduplicatedResults.filter(c => !c.archived && !deletedIds.includes(c.id)).length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-6">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-slate-600 text-xs mb-1">Total Activos</p>
                <p className="text-2xl font-bold text-slate-900">{deduplicatedResults.filter(c => !c.archived && !deletedIds.includes(c.id)).length}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-slate-600 text-xs mb-1">Publicados</p>
                <p className="text-2xl font-bold text-green-600">
                  {deduplicatedResults.filter(c => c.status === 'published' && !c.archived && !deletedIds.includes(c.id)).length}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-slate-600 text-xs mb-1">Borradores</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {deduplicatedResults.filter(c => c.status === 'draft' && !c.archived && !deletedIds.includes(c.id)).length}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-slate-600 text-xs mb-1">Archivados</p>
                <p className="text-2xl font-bold text-orange-600">{archivedContents.length}</p>
              </div>
            </div>
          )}
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
          onClose={() => {
            setEditorOpen(false);
            setEditingContent(null);
          }}
          onSave={handleSaveContent}
          onArchive={handleArchiveContent}
        />
      )}

      {/* Publishing Modal */}
      {publishingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">🚀 Selecciona Plataformas</h2>
            <p className="text-slate-600 mb-6">Elige en qué plataformas deseas publicar:</p>

            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes('linkedin')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPlatforms([...selectedPlatforms, 'linkedin']);
                    } else {
                      setSelectedPlatforms(selectedPlatforms.filter(p => p !== 'linkedin'));
                    }
                  }}
                  className="w-4 h-4 rounded"
                />
                <div className="flex items-center gap-2 flex-1">
                  <Linkedin size={18} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-900">LinkedIn</p>
                    <p className="text-xs text-slate-500">Publica como post en tu perfil</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes('wordpress')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPlatforms([...selectedPlatforms, 'wordpress']);
                    } else {
                      setSelectedPlatforms(selectedPlatforms.filter(p => p !== 'wordpress'));
                    }
                  }}
                  className="w-4 h-4 rounded"
                />
                <div className="flex items-center gap-2 flex-1">
                  <Globe size={18} className="text-slate-600" />
                  <div>
                    <p className="font-medium text-slate-900">WordPress</p>
                    <p className="text-xs text-slate-500">Publica como artículo en tu blog</p>
                  </div>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPublishingModal(null)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handlePublishSubmit}
                disabled={selectedPlatforms.length === 0}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
