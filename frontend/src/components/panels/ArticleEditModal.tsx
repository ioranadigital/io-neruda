'use client';

import React, { useState, useRef } from 'react';
import { X, Bold, Italic, Link2, Save } from 'lucide-react';

interface ArticleEditModalProps {
  isOpen: boolean;
  title: string;
  content?: string;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}

export default function ArticleEditModal({
  isOpen,
  title,
  content = '',
  onClose,
  onSave,
}: ArticleEditModalProps) {
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const editorRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Ingresa la URL del enlace:');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  const handleSave = () => {
    const htmlContent = editorRef.current?.innerHTML || '';
    onSave(editTitle, htmlContent);
    onClose();
  };

  const handleClose = () => {
    setEditTitle(title);
    setEditContent(content);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="absolute inset-4 md:inset-12 lg:inset-20 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Editar Artículo</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título del Artículo
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título del artículo..."
            />
          </div>

          {/* Editor Label */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contenido del Artículo
            </label>

            {/* Toolbar */}
            <div className="flex gap-2 mb-3 p-3 bg-gray-100 rounded-lg border border-gray-300 flex-wrap">
              <button
                onClick={() => applyFormat('bold')}
                title="Negrita (Ctrl+B)"
                className="p-2 hover:bg-gray-200 rounded transition flex items-center gap-1 text-sm font-medium"
              >
                <Bold size={16} />
                Negrita
              </button>

              <button
                onClick={() => applyFormat('italic')}
                title="Cursiva (Ctrl+I)"
                className="p-2 hover:bg-gray-200 rounded transition flex items-center gap-1 text-sm font-medium"
              >
                <Italic size={16} />
                Cursiva
              </button>

              <div className="w-px bg-gray-300" />

              <button
                onClick={insertLink}
                title="Insertar enlace"
                className="p-2 hover:bg-gray-200 rounded transition flex items-center gap-1 text-sm font-medium"
              >
                <Link2 size={16} />
                Enlace
              </button>

              <button
                onClick={() => applyFormat('insertUnorderedList')}
                title="Lista sin ordenar"
                className="p-2 hover:bg-gray-200 rounded transition text-sm font-medium"
              >
                • Lista
              </button>

              <button
                onClick={() => applyFormat('createHeading', 'h2')}
                title="Encabezado"
                className="p-2 hover:bg-gray-200 rounded transition text-sm font-medium"
              >
                H2
              </button>

              <div className="w-px bg-gray-300" />

              <button
                onClick={() => applyFormat('removeFormat')}
                title="Limpiar formato"
                className="p-2 hover:bg-gray-200 rounded transition text-sm font-medium text-red-600"
              >
                Limpiar
              </button>
            </div>

            {/* Editor */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="w-full min-h-96 max-h-96 overflow-y-auto p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
              onInput={(e) => setEditContent((e.target as HTMLDivElement).innerHTML)}
              dangerouslySetInnerHTML={{ __html: editContent }}
              style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
              }}
            />
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
            💡 <strong>Tip:</strong> Usa Negrita, Cursiva, Enlaces y Listas para dar formato a tu contenido. Puedes usar Ctrl+B para negrita y Ctrl+I para cursiva.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Save size={16} />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
