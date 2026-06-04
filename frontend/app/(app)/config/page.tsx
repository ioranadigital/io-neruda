'use client';

export default function Config() {
  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-8 text-zinc-100">Configuración</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-zinc-100">Configuración General</h2>
        <div className="space-y-4 text-zinc-300">
          <p>Base de datos: Supabase</p>
          <p>Frontend: Next.js 15</p>
          <p>Backend: Node.js + Express</p>
          <p>Puertos: 3003 (frontend) / 4003 (backend)</p>
        </div>
      </div>
    </div>
  );
}
