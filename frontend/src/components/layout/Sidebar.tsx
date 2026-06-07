'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap, Sparkles, Users, Settings, BarChart3, FileText, Bolt, HelpCircle
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'Generador',
    items: [
      { href: '/generators', icon: Sparkles, label: 'Generador', desc: 'Crear contenido' },
      { href: '/dashboard', icon: BarChart3, label: 'Dashboard', desc: 'Análisis y métricas' },
    ]
  },
  {
    title: 'Gestión',
    items: [
      { href: '/clients', icon: Users, label: 'Clientes', desc: 'Fichas y perfiles' },
      { href: '/templates', icon: FileText, label: 'Plantillas', desc: 'Contenidos reutilizables' },
    ]
  },
  {
    title: 'Sistema',
    items: [
      { href: '/config', icon: Settings, label: 'Configuración', desc: 'Ajustes globales' },
      { href: '/integrations', icon: Bolt, label: 'Integraciones', desc: 'APIs y conectores' },
    ]
  },
  {
    title: 'Ayuda',
    items: [
      { href: '/help', icon: HelpCircle, label: 'Guía', desc: 'Instrucciones de uso' },
    ]
  },
];

export function Sidebar() {
  const path = usePathname() || '';

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 border-r flex flex-col z-40" style={{ backgroundColor: '#18bdc1', borderColor: '#70c5d0' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: '#0f7a80' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#ffffff' }}>
            <Zap size={14} style={{ color: '#18bdc1' }} />
          </div>
          <div>
            <p className="text-sm font-bold leading-none" style={{ color: '#ffffff' }}>IO Neruda</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#ffffff' }}>Content Hub</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={section.title} className={idx > 0 ? 'mt-4' : ''}>
            <p className="text-[11px] font-semibold uppercase tracking-widest px-2 mb-1.5" style={{ color: '#ffffff' }}>
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ href, icon: Icon, label, desc }) => {
                const active = path === href || (href !== '/config' && path.startsWith(href + '/'));
                return (
                  <Link
                    key={`${href}-${label}`}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all border ${
                      active
                        ? 'text-white'
                        : 'border-transparent text-white hover:bg-white/20'
                    }`}
                    style={active ? { backgroundColor: '#ffffff', borderColor: '#ffffff', color: '#18bdc1' } : {}}
                  >
                    <Icon size={15} strokeWidth={active ? 2 : 1.5} className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{label}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            {idx < NAV_SECTIONS.length - 1 && (
              <div className="mt-4 border-t border-zinc-800/60" />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t" style={{ borderColor: '#0f7a80' }}>
        <p className="text-[11px]" style={{ color: '#ffffff' }}>v2.0.0 · Production</p>
      </div>
    </aside>
  );
}
