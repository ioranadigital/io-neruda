'use client';
import Link from 'next/link';
import { Bell, Settings, LogOut, User } from 'lucide-react';
import { useState } from 'react';

export function DashminHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b shadow-sm z-50" style={{ borderColor: '#e0e0e0' }}>
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded border-2" style={{ backgroundColor: '#7BF1A8', borderColor: '#000000' }}>
            <div className="w-full h-full flex items-center justify-center text-black font-bold text-lg">D</div>
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#333333' }}>Dashmin</h1>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell size={20} style={{ color: '#727272' }} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#67CF94' }}></span>
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Settings size={20} style={{ color: '#727272' }} />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
            >
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#8280FD' }}>
                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">A</div>
              </div>
              <span style={{ color: '#333333' }} className="text-sm font-medium">Admin</span>
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border" style={{ borderColor: '#e0e0e0' }}>
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-50 flex items-center gap-2" style={{ color: '#333333' }}>
                  <User size={16} /> Mi Perfil
                </Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-gray-50 flex items-center gap-2" style={{ color: '#333333' }}>
                  <Settings size={16} /> Configuración
                </Link>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2" style={{ color: '#333333' }}>
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
