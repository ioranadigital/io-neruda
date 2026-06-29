'use client';

import { Settings, Key, Bell, Palette, Globe, Shield } from 'lucide-react';

const CONFIG_SECTIONS = [
  {
    icon: Key,
    title: 'APIs & Credenciales',
    description: 'Configura las claves de API para OpenAI, Anthropic, Supabase y otros servicios.',
    items: ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'],
  },
  {
    icon: Bell,
    title: 'Notificaciones',
    description: 'Ajusta cómo y cuándo recibes notificaciones del sistema.',
    items: ['Notificaciones de generación', 'Alertas de error', 'Resumen diario'],
  },
  {
    icon: Palette,
    title: 'Apariencia',
    description: 'Personaliza el tema y la interfaz del dashboard.',
    items: ['Tema claro / oscuro', 'Densidad de contenido', 'Idioma de la interfaz'],
  },
  {
    icon: Globe,
    title: 'Idioma & Región',
    description: 'Configura el idioma por defecto para la generación de contenidos.',
    items: ['Idioma de generación', 'Zona horaria', 'Formato de fecha'],
  },
  {
    icon: Shield,
    title: 'Seguridad',
    description: 'Gestiona el acceso y permisos de la plataforma.',
    items: ['Autenticación', 'Sesiones activas', 'Exportar datos'],
  },
];

export default function ConfigPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4aa87a, #2d7a58)' }}>
          <Settings size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
          <p className="text-sm text-slate-500">Ajustes globales de la plataforma IO Neruda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CONFIG_SECTIONS.map(({ icon: Icon, title, description, items }) => (
          <div key={title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50">
                <Icon size={18} style={{ color: '#4aa87a' }} />
              </div>
              <h2 className="font-semibold text-slate-900">{title}</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4">{description}</p>
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 last:border-0">
                  <span className="text-slate-700 font-mono text-xs">{item}</span>
                  <span className="text-xs text-slate-400 italic">próximamente</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        Configuración avanzada disponible en <code className="bg-slate-100 px-1 rounded">.env.local</code>
      </p>
    </div>
  );
}
