'use client';

import { useGenerator } from '@/src/context/GeneratorContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Eye, Share2, Linkedin, Globe } from 'lucide-react';
import { useState } from 'react';

interface ContentWithPublishing {
  id: string;
  postTitle: string;
  clientName: string;
  outputFormat: string;
  status: 'published' | 'draft';
  generatedDate: string;
  publishedPlatforms?: ('linkedin' | 'wordpress')[];
}

export default function ContenidosPage() {
  const { contentResults } = useGenerator();
  const router = useRouter();
  const [publishingModal, setPublishingModal] = useState<{ contentId: string; clientId: string } | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<('linkedin' | 'wordpress')[]>([]);

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este contenido?')) {
      console.log('Eliminar contenido:', id);
    }
  };

  const handleView = (id: string) => {
    router.push(`/contenidos/${id}`);
  };

  const handlePublish = (contentId: string, clientId: string) => {
    setPublishingModal({ contentId, clientId });
    setSelectedPlatforms([]);
  };

  const handlePublishSubmit = async () => {
    if (!publishingModal || selectedPlatforms.length === 0) return;

    console.log('Publicando en plataformas:', selectedPlatforms, publishingModal);
    // Aquí iría la lógica de publicación real
    setPublishingModal(null);
    setSelectedPlatforms([]);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-x-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 md:px-8 pt-6 pb-4 border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <h1 className="text-4xl font-bold text-slate-900 mb-2">📁 Mis Contenidos</h1>
        <p className="text-slate-600">
          {contentResults.length} contenidos generados
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto w-full">
        <div className="px-6 md:px-8 py-6 w-full">

        {/* Tabla de Contenidos */}
        {contentResults.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <p className="text-slate-500 text-lg mb-4">No hay contenidos generados aún</p>
            <button
              onClick={() => router.push('/generators')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Ir a Generador
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Título
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Formato
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Plataformas
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {contentResults.map((content) => (
                    <tr key={content.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                        {content.postTitle}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {content.clientName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {content.outputFormat}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-xs text-slate-400">—</span>
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
                          <button
                            onClick={() => handlePublish(content.id, 'client-id')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Publicar en plataformas"
                          >
                            <Share2 size={18} />
                          </button>
                          <button
                            onClick={() => handleView(content.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Ver"
                          >
                            <Eye size={18} />
                          </button>
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
        )}

        {/* Estadísticas */}
        {contentResults.length > 0 && (
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <p className="text-slate-600 text-sm mb-2">Total Generados</p>
              <p className="text-3xl font-bold text-slate-900">{contentResults.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <p className="text-slate-600 text-sm mb-2">Publicados</p>
              <p className="text-3xl font-bold text-green-600">
                {contentResults.filter((c) => c.status === 'published').length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <p className="text-slate-600 text-sm mb-2">Borradores</p>
              <p className="text-3xl font-bold text-yellow-600">
                {contentResults.filter((c) => c.status === 'draft').length}
              </p>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Publishing Modal */}
      {publishingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">🚀 Selecciona Plataformas</h2>
            <p className="text-slate-600 mb-6">Elige en qué plataformas deseas publicar este contenido:</p>

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
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={handlePublishSubmit}
                disabled={selectedPlatforms.length === 0}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publicar en {selectedPlatforms.length} {selectedPlatforms.length === 1 ? 'plataforma' : 'plataformas'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
