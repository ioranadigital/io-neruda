import { DashminLayout } from '@/src/components/layout/DashminLayout';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <DashminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#333333' }}>
            Dashboard Principal
          </h1>
          <p style={{ color: '#727272' }}>
            Bienvenido de vuelta. Aquí están tus estadísticas principales.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Clientes', value: '12', change: '+2.5%', icon: '👥' },
            { label: 'Contenido Generado', value: '128', change: '+12.5%', icon: '📄' },
            { label: 'Tasa Conversión', value: '24.5%', change: '+4.3%', icon: '📈' },
            { label: 'Ingresos Totales', value: '$12,450', change: '+18.2%', icon: '💰' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-6 border shadow-sm hover:shadow-md transition"
              style={{ borderColor: '#e0e0e0' }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="text-3xl">{stat.icon}</div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: '#67CF94', color: 'white' }}
                >
                  {stat.change}
                </span>
              </div>
              <p style={{ color: '#727272' }} className="text-sm mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold" style={{ color: '#333333' }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div
            className="lg:col-span-2 bg-white rounded-lg border p-6 shadow-sm"
            style={{ borderColor: '#e0e0e0' }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: '#333333' }}>
              Actividad Reciente
            </h2>
            <div className="space-y-3">
              {[
                { action: 'Nuevo cliente agregado', time: 'Hace 2 horas', icon: '✅' },
                { action: 'Contenido generado', time: 'Hace 4 horas', icon: '📝' },
                { action: 'Informe descargado', time: 'Hace 6 horas', icon: '📥' },
                { action: 'Cliente actualizado', time: 'Hace 8 horas', icon: '🔄' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b" style={{ borderColor: '#f0f0f0' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p style={{ color: '#333333' }} className="font-medium">
                        {item.action}
                      </p>
                      <p style={{ color: '#727272' }} className="text-xs">
                        {item.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className="bg-white rounded-lg border p-6 shadow-sm"
            style={{ borderColor: '#e0e0e0' }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: '#333333' }}>
              Acciones Rápidas
            </h2>
            <div className="space-y-3">
              <Link
                href="/generators"
                className="block w-full px-4 py-3 rounded-lg font-medium text-white transition"
                style={{ backgroundColor: '#6045E2' }}
              >
                ⚡ Generar Contenido
              </Link>
              <Link
                href="/clients"
                className="block w-full px-4 py-3 rounded-lg font-medium text-white transition"
                style={{ backgroundColor: '#8280FD' }}
              >
                👥 Nuevo Cliente
              </Link>
              <Link
                href="/analytics"
                className="block w-full px-4 py-3 rounded-lg font-medium text-white transition"
                style={{ backgroundColor: '#67CF94' }}
              >
                📊 Ver Analítica
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Generador', desc: 'Crea contenido con IA', href: '/generators', color: '#6045E2' },
            { title: 'Clientes', desc: 'Gestiona tus clientes', href: '/clients', color: '#8280FD' },
            { title: 'Analítica', desc: 'Visualiza tus datos', href: '/analytics', color: '#67CF94' },
          ].map((section, idx) => (
            <Link
              key={idx}
              href={section.href}
              className="bg-white rounded-lg p-6 border shadow-sm hover:shadow-md transition cursor-pointer"
              style={{ borderColor: '#e0e0e0' }}
            >
              <div
                className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-lg"
                style={{ backgroundColor: section.color, color: 'white' }}
              >
                {section.title[0]}
              </div>
              <h3 className="font-bold mb-1" style={{ color: '#333333' }}>
                {section.title}
              </h3>
              <p style={{ color: '#727272' }} className="text-sm">
                {section.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </DashminLayout>
  );
}
