/**
 * DATOS SIMULADOS — Usuarios de la agencia (MODO TEST)
 *
 * Consumidos por app/admin/usuarios/page.tsx. Viven solo en estado de React
 * (useState inicializado con INITIAL_MOCK_USERS) — no hay fetch ni escritura
 * a Supabase. Migración futura: sustituir este array por una consulta a una
 * tabla `agency_users` vía @iorana/lib / supabase-js.
 */

export type AgencyRole = 'Admin' | 'Consultor' | 'Redactor';
export type AgencyStatus = 'Activo' | 'Revocado';

export interface AgencyUser {
  id: string;
  email: string;
  nombre: string;
  rol: AgencyRole;
  ultimoAcceso: string;
  estado: AgencyStatus;
}

export const INITIAL_MOCK_USERS: AgencyUser[] = [
  {
    id: '1',
    email: 'honatuya@gmail.com',
    nombre: 'Honatuya',
    rol: 'Admin',
    ultimoAcceso: '2026-07-07 09:14',
    estado: 'Activo',
  },
  {
    id: '2',
    email: 'rherreravarela@gmail.com',
    nombre: 'R. Herrera Varela',
    rol: 'Redactor',
    ultimoAcceso: '2026-07-05 17:32',
    estado: 'Activo',
  },
];
