'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, type Project } from '@/lib/api';
import PipelineStages from '@/components/PipelineStages';

export default function ProyectoPage() {
  const params = useParams();
  const projectName = params.proyecto as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await api.getProject(projectName);
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    }

    if (projectName) {
      fetchProject();
    }
  }, [projectName]);

  if (loading) {
    return <div className="text-center py-12">Cargando proyecto...</div>;
  }

  if (!project) {
    return <div className="text-center py-12 text-red-500">Proyecto no encontrado</div>;
  }

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-zinc-100">{project.display_name}</h1>
        <p className="text-zinc-400">Pipeline de contenidos</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-zinc-100">Arrastra contenidos entre columnas para cambiar estado</h2>
        <PipelineStages projectName={projectName} />
      </div>

      <div className="grid grid-cols-3 gap-6 mt-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-bold text-zinc-100 mb-2">Próximas acciones</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>✏️ Crear nuevo insight</li>
            <li>📋 Generar plan</li>
            <li>🚀 Publicar contenido</li>
          </ul>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-bold text-zinc-100 mb-2">Estado del proyecto</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>Activo</li>
            <li>Sin publicaciones pendientes</li>
          </ul>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-bold text-zinc-100 mb-2">Estadísticas</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>Última actualización: Hoy</li>
            <li>Total de contenidos: —</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
