'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap, Sparkles, Users, Settings, BarChart3, FileText, Bolt, HelpCircle, Map, Archive
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'Contenidos',
    items: [
      { href: '/dashboard', icon: BarChart3, label: 'Dashboard', desc: 'Análisis y métricas' },
      { href: '/generators', icon: Sparkles, label: 'Generador', desc: 'Crear contenido' },
      { href: '/planner', icon: Map, label: 'Planificador', desc: 'Crear planes de contenido' },
    ]
  },
  {
    title: 'Gestión',
    items: [
      { href: '/contenidos', icon: Archive, label: 'Mis contenidos', desc: 'Generados y guardados' },
      { href: '/clients', icon: Users, label: 'Clientes', desc: 'Fichas y perfiles' },
      { href: '/templates', icon: FileText, label: 'Plantillas', desc: 'Contenidos reutilizables' },
    ]
  },
  {
    title: 'Sistema',
    items: [
      { href: '/config', icon: Settings, label: 'Configuración', desc: 'Ajustes globales' },
      { href: '/integraciones', icon: Bolt, label: 'Integraciones', desc: 'APIs y conectores' },
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
    <aside className="flex-shrink-0 w-64 h-screen border-r flex flex-col bg-[#e8f5ee]" style={{ borderColor: '#c8e6d4' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: '#c8e6d4' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4aa87a' }}>
            <Zap size={14} style={{ color: '#ffffff' }} />
          </div>
          <div>
            <p className="text-sm font-bold leading-none" style={{ color: '#1a1a1a' }}>IO Neruda</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#6b7280' }}>Content Hub</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={section.title} className={idx > 0 ? 'mt-4' : ''}>
            <p className="text-[11px] font-semibold uppercase tracking-widest px-2 mb-1.5" style={{ color: '#6b9e80' }}>
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ href, icon: Icon, label, desc }) => {
                const active = path === href || (href !== '/config' && path.startsWith(href + '/'));
                return (
                  <Link
                    key={`${href}-${label}`}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all border"
                    style={active
                      ? { backgroundColor: '#4aa87a', borderColor: '#3d9068', color: '#ffffff' }
                      : { borderColor: 'transparent', color: '#2d2d2d' }
                    }
                    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#d4ece0'; }}
                    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'; }}
                  >
                    <Icon size={15} strokeWidth={active ? 2 : 1.5} className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{label}</p>
                      <p className="text-[11px] truncate" style={{ color: active ? 'rgba(255,255,255,0.75)' : '#6b7280' }}>{desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            {idx < NAV_SECTIONS.length - 1 && (
              <div className="mt-4 border-t" style={{ borderColor: '#c8e6d4' }} />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t" style={{ borderColor: '#c8e6d4' }}>
        <p className="text-[11px]" style={{ color: '#6b7280' }}>v2.0.0 · Production</p>
      </div>
    </aside>
  );
}
