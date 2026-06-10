'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered, Table, Save, Archive } from 'lucide-react';
import { showToast } from '../shared/Toast';

interface ContentEditorModalProps {
  isOpen: boolean;
  content: {
    id: string;
    postTitle: string;
    clientName: string;
    body: string;
  };
  onClose: () => void;
  onSave: (id: string, title: string, body: string) => void;
  onArchive: (id: string) => void;
}

export default function ContentEditorModal({
  isOpen,
  content,
  onClose,
  onSave,
  onArchive,
}: ContentEditorModalProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(content.postTitle);
  const [body, setBody] = useState(content.body);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(content.postTitle);
    setBody(content.body);
    if (editorRef.current) {
      editorRef.current.innerHTML = content.body;
    }
  }, [content, isOpen]);

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Ingresa la URL:');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  const insertTable = () => {
    const rows = prompt('Número de filas:', '3');
    const cols = prompt('Número de columnas:', '3');
    if (rows && cols) {
      let table = '<table style="border-collapse: collapse; width: 100%; margin: 12px 0;"><tbody>';
      for (let i = 0; i < parseInt(rows); i++) {
        table += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          const cellType = i === 0 ? 'th' : 'td';
          table += `<${cellType} style="border: 1px solid #ccc; padding: 8px;">Celda</${cellType}>`;
        }
        table += '</tr>';
      }
      table += '</tbody></table>';
      document.execCommand('insertHTML', false, table);
      editorRef.current?.focus();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const htmlContent = editorRef.current?.innerHTML || body;
      onSave(content.id, title, htmlContent);
      showToast.success('Contenido guardado exitosamente');
    } catch (err) {
      showToast.error('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (confirm('¿Archivar este contenido?')) {
      onArchive(content.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Editar Contenido</h2>
            <p className="text-sm text-slate-600">{content.clientName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {/* Title Input */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200">
            <label className="text-sm font-semibold text-slate-700 block mb-2">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título del artículo"
            />
          </div>

          {/* Editor Toolbar */}
          <div className="flex-shrink-0 px-6 py-3 border-b border-slate-200 bg-slate-50">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyFormat('bold')}
                className="p-2 hover:bg-slate-200 rounded transition"
                title="Negrita"
              >
                <Bold size={18} className="text-slate-700" />
              </button>
              <button
                onClick={() => applyFormat('italic')}
                className="p-2 hover:bg-slate-200 rounded transition"
                title="Cursiva"
              >
                <Italic size={18} className="text-slate-700" />
              </button>
              <button
                onClick={() => applyFormat('underline')}
                className="p-2 hover:bg-slate-200 rounded transition"
                title="Subrayado"
              >
                <Underline size={18} className="text-slate-700" />
              </button>

              <div className="w-px bg-slate-300"></div>

              <button
                onClick={insertLink}
                className="p-2 hover:bg-slate-200 rounded transition"
                title="Insertar enlace"
              >
                <LinkIcon size={18} className="text-slate-700" />
              </button>

              <button
                onClick={insertTable}
                className="p-2 hover:bg-slate-200 rounded transition"
                title="Insertar tabla"
              >
                <Table size={18} className="text-slate-700" />
              </button>

              <div className="w-px bg-slate-300"></div>

              <button
                onClick={() => applyFormat('insertUnorderedList')}
                className="p-2 hover:bg-slate-200 rounded transition"
                title="Lista desordenada"
              >
                <List size={18} className="text-slate-700" />
              </button>

              <button
                onClick={() => applyFormat('insertOrderedList')}
                className="p-2 hover:bg-slate-200 rounded transition"
                title="Lista ordenada"
              >
                <ListOrdered size={18} className="text-slate-700" />
              </button>

              <div className="w-px bg-slate-300"></div>

              <select
                onChange={(e) => applyFormat('formatBlock', e.target.value)}
                className="px-3 py-1 border border-slate-300 rounded text-sm"
                defaultValue="p"
              >
                <option value="p">Párrafo</option>
                <option value="h1">Encabezado 1</option>
                <option value="h2">Encabezado 2</option>
                <option value="h3">Encabezado 3</option>
                <option value="blockquote">Cita</option>
              </select>
            </div>
          </div>

          {/* Editor Body */}
          <div
            ref={editorRef}
            contentEditable
            className="flex-1 min-h-0 overflow-y-auto px-6 py-4 text-slate-700 focus:outline-none bg-white prose prose-sm max-w-none"
            style={{
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={handleArchive}
            className="flex items-center gap-2 px-4 py-2 border border-orange-300 text-orange-700 hover:bg-orange-50 rounded-lg transition font-medium"
          >
            <Archive size={18} />
            Archivar
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg transition font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition font-medium"
            >
              <Save size={18} />
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
