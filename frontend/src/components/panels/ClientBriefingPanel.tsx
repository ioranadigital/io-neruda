'use client';

import React from 'react';
import { Client } from '@/src/types/client';
import {
  Building2, Globe, Target, Megaphone, Zap, BarChart3,
  Linkedin, FileText, Users, Calendar
} from 'lucide-react';

interface ClientBriefingPanelProps {
  client: Client | null;
}

export default function ClientBriefingPanel({ client }: ClientBriefingPanelProps) {
  if (!client) return null;

  // Canales activos
  const activeChannels = [
    { name: 'Blog', active: client.channel_blog, icon: FileText },
    { name: 'Email', active: client.channel_email, icon: Megaphone },
    { name: 'LinkedIn', active: client.channel_linkedin, icon: Linkedin },
    { name: 'Instagram', active: client.channel_instagram, icon: Globe },
    { name: 'Twitter', active: client.channel_twitter, icon: Megaphone },
    { name: 'TikTok', active: client.channel_tiktok, icon: Zap },
    { name: 'YouTube', active: client.channel_youtube, icon: Globe },
  ].filter(c => c.active);

  // Plataformas de publicación
  const publishingPlatforms = [
    { name: 'LinkedIn', icon: Linkedin, active: client.linkedin_connected },
    { name: 'WordPress', icon: Globe, active: client.wordpress_connected },
  ].filter(p => p.active);

  return (
    <div className="mb-8">
      {/* Grid de información */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Identidad */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 size={24} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Identidad</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide">Tipo de negocio</p>
              <p className="font-semibold text-slate-900 text-base">{client.business_type || '—'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide">Ubicación</p>
              <p className="font-semibold text-slate-900 text-base">{client.country || '—'}</p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <FileText size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Contenido</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide">Frecuencia de publicación</p>
              <p className="font-semibold text-slate-900 text-base">{client.publication_frequency || '—'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide">Promedio palabras</p>
              <p className="font-semibold text-slate-900 text-base">{client.avg_word_count ? `${client.avg_word_count} palabras` : '—'}</p>
            </div>
          </div>
        </div>

        {/* Competencia */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Target size={24} className="text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Competencia</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide">Posicionamiento</p>
              <p className="font-semibold text-slate-900 text-base">{client.market_positioning || '—'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide">Competidores</p>
              <p className="font-semibold text-slate-900 text-base">
                {client.competitor_urls && client.competitor_urls.length > 0
                  ? `${client.competitor_urls.length} sitios`
                  : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Canales & Distribución */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Megaphone size={24} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Canales Activos</h3>
          </div>
          {activeChannels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeChannels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <span
                    key={channel.name}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                  >
                    <Icon size={16} />
                    {channel.name}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Sin canales configurados</p>
          )}
        </div>

        {/* Plataformas de Publicación */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Zap size={24} className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Publicación</h3>
          </div>
          {publishingPlatforms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {publishingPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <span
                    key={platform.name}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium"
                  >
                    <Icon size={16} />
                    {platform.name} ✓
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Sin plataformas conectadas</p>
          )}
        </div>

        {/* KPIs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <BarChart3 size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">KPIs</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide">Objetivo principal</p>
              <p className="font-semibold text-slate-900 text-base">{client.main_objective || '—'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide">KPI principal</p>
              <p className="font-semibold text-slate-900 text-base">{client.main_kpi || '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
