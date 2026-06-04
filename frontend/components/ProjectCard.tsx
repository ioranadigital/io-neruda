'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Project {
  id: string;
  name: string;
  display_name: string;
  type: string;
  status: string;
}

interface Stats {
  insights: number;
  plans: number;
  ready: number;
  total: number;
}

export default function ProjectCard({ project }: { project: Project }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.getProjectStats(project.name);
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [project.name]);

  return (
    <Link
      href={`/${project.name}`}
      className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-blue-600 transition fade-in"
    >
      <h2 className="text-xl font-bold text-blue-500 mb-2">{project.display_name}</h2>
      <p className="text-zinc-400 text-sm mb-4">Tipo: {project.type}</p>

      {loading ? (
        <div className="text-zinc-500 text-sm">Cargando estadísticas...</div>
      ) : stats ? (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-800 rounded p-2">
            <p className="text-xs text-zinc-400">Insights</p>
            <p className="text-lg font-bold text-blue-400">{stats.insights}</p>
          </div>
          <div className="bg-zinc-800 rounded p-2">
            <p className="text-xs text-zinc-400">Planes</p>
            <p className="text-lg font-bold text-yellow-400">{stats.plans}</p>
          </div>
          <div className="bg-zinc-800 rounded p-2">
            <p className="text-xs text-zinc-400">Ready</p>
            <p className="text-lg font-bold text-green-400">{stats.ready}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        {project.status === 'active' ? (
          <span className="inline-block bg-green-900 text-green-100 px-2 py-1 rounded text-xs">
            Activo
          </span>
        ) : (
          <span className="inline-block bg-gray-900 text-gray-100 px-2 py-1 rounded text-xs">
            Inactivo
          </span>
        )}
      </div>
    </Link>
  );
}
