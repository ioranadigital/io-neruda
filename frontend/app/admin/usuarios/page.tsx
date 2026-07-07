/**
 * GESTIÓN DE USUARIOS DE LA AGENCIA — MODO TEST (MOCKED)
 *
 * Tabla + modal de alta 100% en estado local de React, sembrada desde
 * src/data/mockUsers.ts (INITIAL_MOCK_USERS). No hay fetch/insert/update
 * contra Supabase: todo alta, cambio de rol y toggle de estado vive y
 * muere en este componente (se pierde al recargar la página).
 *
 * Migración futura: sustituir el useState inicial por una query a la
 * tabla `agency_users`, y `handleAddUser` / `toggleEstado` por
 * insert/update reales vía supabase-js.
 */
'use client';

import { useState } from 'react';
import { UserPlus, X, Users } from 'lucide-react';
import { AgencyUser, AgencyRole, INITIAL_MOCK_USERS } from '@/src/data/mockUsers';

const ROLE_STYLES: Record<AgencyRole, { bg: string; color: string }> = {
  Admin: { bg: '#e8f5ee', color: '#2d7a58' },
  Consultor: { bg: '#eff6ff', color: '#2563eb' },
  Redactor: { bg: '#f5f3ff', color: '#7c3aed' },
};

const STATUS_STYLES: Record<AgencyUser['estado'], { bg: string; color: string }> = {
  Activo: { bg: '#e8f5ee', color: '#2d7a58' },
  Revocado: { bg: '#fef2f2', color: '#b91c1c' },
};

export default function UsuariosAgenciaPage() {
  const [users, setUsers] = useState<AgencyUser[]>(INITIAL_MOCK_USERS);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newNombre, setNewNombre] = useState('');
  const [newRol, setNewRol] = useState<AgencyRole>('Redactor');

  function toggleEstado(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, estado: u.estado === 'Activo' ? 'Revocado' : 'Activo' } : u
      )
    );
  }

  function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const nuevoUsuario: AgencyUser = {
      id: crypto.randomUUID(),
      email: newEmail.trim().toLowerCase(),
      nombre: newNombre.trim() || newEmail.trim().split('@')[0],
      rol: newRol,
      ultimoAcceso: '—',
      estado: 'Activo',
    };

    setUsers((prev) => [...prev, nuevoUsuario]);
    setNewEmail('');
    setNewNombre('');
    setNewRol('Redactor');
    setModalOpen(false);
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4aa87a, #2d7a58)' }}
          >
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Usuarios de la Agencia</h1>
            <p className="text-sm text-slate-500">Accesos de redactores y consultores (modo test)</p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#4aa87a' }}
        >
          <UserPlus size={14} className="mr-2" />
          Añadir Acceso
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Usuario / Email</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Nombre</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Rol</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Último Acceso</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Estado</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3 text-slate-900 font-medium">{user.email}</td>
                  <td className="px-5 py-3 text-slate-600">{user.nombre}</td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: ROLE_STYLES[user.rol].bg, color: ROLE_STYLES[user.rol].color }}
                    >
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{user.ultimoAcceso}</td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: STATUS_STYLES[user.estado].bg, color: STATUS_STYLES[user.estado].color }}
                    >
                      {user.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => toggleEstado(user.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                      style={
                        user.estado === 'Activo'
                          ? { borderColor: '#fecaca', color: '#b91c1c', backgroundColor: '#fff' }
                          : { borderColor: '#c8e6d4', color: '#2d7a58', backgroundColor: '#fff' }
                      }
                    >
                      {user.estado === 'Activo' ? 'Revocar' : 'Reactivar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        {users.length} usuario{users.length !== 1 ? 's' : ''} · datos simulados en memoria (modo test)
      </p>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900">Añadir Acceso</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nombre@agencia.com"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#4aa87a' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#4aa87a' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Rol</label>
                <select
                  value={newRol}
                  onChange={(e) => setNewRol(e.target.value as AgencyRole)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#4aa87a' } as React.CSSProperties}
                >
                  <option value="Admin">Admin</option>
                  <option value="Consultor">Consultor</option>
                  <option value="Redactor">Redactor</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#4aa87a' }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
