'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingCart, Mail, MessageSquare, Calendar, FileText,
  Users, Settings, HelpCircle, BarChart3, Zap, Menu as MenuIcon
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  {
    title: 'MENÚ PRINCIPAL',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/ecommerce', icon: ShoppingCart, label: 'E-commerce' },
    ]
  },
  {
    title: 'APLICACIONES',
    items: [
      { href: '/apps/mail', icon: Mail, label: 'Correo' },
      { href: '/apps/chat', icon: MessageSquare, label: 'Chat' },
      { href: '/apps/calendar', icon: Calendar, label: 'Calendario' },
      { href: '/apps/invoices', icon: FileText, label: 'Facturas' },
    ]
  },
  {
    title: 'GESTIÓN',
    items: [
      { href: '/clients', icon: Users, label: 'Clientes' },
      { href: '/generators', icon: Zap, label: 'Generador' },
      { href: '/analytics', icon: BarChart3, label: 'Analítica' },
    ]
  },
  {
    title: 'SISTEMA',
    items: [
      { href: '/settings', icon: Settings, label: 'Configuración' },
      { href: '/help', icon: HelpCircle, label: 'Ayuda' },
    ]
  }
];

export function DashminSidebar() {
  const path = usePathname() || '';
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 p-2 rounded lg:hidden border-2"
        style={{ backgroundColor: '#7BF1A8', color: 'black', borderColor: '#000000' }}
      >
        <MenuIcon size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white border-r overflow-y-auto transition-all duration-300 lg:translate-x-0 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ borderColor: '#e0e0e0' }}
      >
        <nav className="p-4 space-y-6">
          {NAV_ITEMS.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#727272' }}>
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map(({ href, icon: Icon, label }) => {
                  const isActive = path === href || path.startsWith(href + '/');
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'text-black'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      style={isActive ? { backgroundColor: '#7BF1A8' } : {}}
                    >
                      <Icon size={18} />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
