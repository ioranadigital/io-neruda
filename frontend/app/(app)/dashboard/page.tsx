'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type Project } from '@/lib/api';

interface Stats {
  projects: number;
  contents: number;
  exports: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, contents: 0, exports: 0 });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const projects = await api.listProjects();
        setRecentProjects(projects.slice(0, 5));
        setStats({
          projects: projects.length,
          contents: 0,
          exports: 0,
        });
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Cargando dashboard...</div>;
  }

  return (
    <div className="fade-in">
      <h1 className="text-4xl font-bold mb-8 text-zinc-100">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-blue-600 transition">
          <div className="text-zinc-400 text-sm font-medium">Proyectos Activos</div>
          <div className="text-5xl font-bold text-blue-500 mt-2">{stats.projects}</div>
          <p className="text-zinc-500 text-sm mt-4">Tus proyectos de contenido</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-yellow-600 transition">
          <div className="text-zinc-400 text-sm font-medium">Contenidos Totales</div>
          <div className="text-5xl font-bold text-yellow-500 mt-2">{stats.contents}</div>
          <p className="text-zinc-500 text-sm mt-4">En todos los estadios</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-green-600 transition">
          <div className="text-zinc-400 text-sm font-medium">Exportaciones</div>
          <div className="text-5xl font-bold text-green-500 mt-2">{stats.exports}</div>
          <p className="text-zinc-500 text-sm mt-4">Generadas este mes</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-zinc-100">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Link
              href="/proyectos"
              className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center transition"
            >
              Ver Todos los Proyectos
            </Link>
            <button
              onClick={() => alert('TODO: Crear nuevo proyecto')}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded transition"
            >
              + Crear Proyecto
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-zinc-100">Actividad Reciente</h2>
          <div className="space-y-2 text-sm text-zinc-400">
            {recentProjects.length > 0 ? (
              recentProjects.map((proj) => (
                <Link
                  key={proj.id}
                  href={`/${proj.name}`}
                  className="block hover:text-blue-400 transition"
                >
                  → {proj.display_name}
                </Link>
              ))
            ) : (
              <p className="text-zinc-500">Sin actividad reciente</p>
            )}
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-blue-900 to-zinc-900 border border-blue-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">¿Necesitas ayuda?</h2>
        <p className="text-zinc-300 mb-6">
          io-neruda te ayuda a gestionar contenidos en múltiples formatos (Markdown, WhatsApp, HTML, JSON, Social, Email).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/proyectos" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center transition">
            Explorar Proyectos
          </a>
          <a href="/config" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded text-center transition">
            Configuración
          </a>
          <button
            onClick={() => alert('Documentación: https://github.com/iorana/io-neruda')}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded text-center transition"
          >
            Documentación
          </button>
        </div>
      </div>
    </div>
  );
}
