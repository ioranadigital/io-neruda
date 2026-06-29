'use client';

import React from 'react';
import Link from 'next/link';
import { Client } from '../../types/client';
import { Edit2, Trash2, FileText } from 'lucide-react';

interface ClientCardProps {
  client: Client | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  if (!client) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
        <p className="text-gray-500">Sin cliente seleccionado</p>
        <p className="text-sm text-gray-400">Selecciona un cliente para ver sus detalles</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{client.name}</h3>
          <p className="text-sm text-gray-500">@{client.slug}</p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 text-gray-600 hover:bg-blue-50 rounded-lg transition"
              title="Editar cliente"
            >
              <Edit2 size={18} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-gray-600 hover:bg-red-50 rounded-lg transition"
              title="Eliminar cliente"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {client.description && (
        <p className="text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
          {client.description}
        </p>
      )}

      {/* Brand Colors */}
      {(client.color_primary || client.color_secondary) && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2">Colores de marca</p>
          <div className="flex gap-3">
            {client.color_primary && (
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border border-gray-200"
                  style={{ backgroundColor: client.color_primary }}
                />
                <span className="text-xs text-gray-600">{client.color_primary}</span>
              </div>
            )}
            {client.color_secondary && (
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border border-gray-200"
                  style={{ backgroundColor: client.color_secondary }}
                />
                <span className="text-xs text-gray-600">{client.color_secondary}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Brand Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-gray-500 font-semibold mb-1">Tono por defecto</p>
          <p className="text-gray-800 capitalize">{client.default_tone}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-semibold mb-1">Público objetivo</p>
          <p className="text-gray-800">{client.target_audience || '-'}</p>
        </div>
      </div>

      {/* Keywords Info */}
      {(client.forbidden_keywords?.length > 0 || client.competitor_urls?.length > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {client.forbidden_keywords?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 font-semibold mb-2">Palabras prohibidas</p>
              <div className="flex flex-wrap gap-2">
                {client.forbidden_keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
          {client.competitor_urls?.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-2">URLs de competidores</p>
              <div className="flex flex-wrap gap-2">
                {client.competitor_urls.map((url, idx) => {
                  const getHostname = (urlStr: string) => {
                    try {
                      const fullUrl = urlStr.startsWith('http') ? urlStr : `https://${urlStr}`;
                      return new URL(fullUrl).hostname || urlStr;
                    } catch {
                      return urlStr;
                    }
                  };
                  const href = url.startsWith('http') ? url : `https://${url}`;
                  return (
                    <a
                      key={idx}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:underline"
                    >
                      {getHostname(url)}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Full Profile Button */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <Link
          href={`/clients/${client.id}/edit`}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <FileText size={16} />
          Editar Ficha Completa
        </Link>
      </div>
    </div>
  );
}
