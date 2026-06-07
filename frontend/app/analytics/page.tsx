import { DashminLayout } from '@/src/components/layout/DashminLayout';

export default function AnalyticsPage() {
  return (
    <DashminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#333333' }}>
            Analítica
          </h1>
          <p style={{ color: '#727272' }}>
            Visualiza el desempeño de tu contenido y clientes
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Vistas Totales', value: '25,847', trend: '↑ 12%' },
            { label: 'Clics', value: '4,234', trend: '↑ 8%' },
            { label: 'CTR', value: '16.4%', trend: '↑ 3%' },
            { label: 'Conversiones', value: '642', trend: '↑ 18%' },
          ].map((kpi, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-6 border shadow-sm"
              style={{ borderColor: '#e0e0e0' }}
            >
              <p style={{ color: '#727272' }} className="text-sm mb-2">
                {kpi.label}
              </p>
              <div className="flex justify-between items-baseline">
                <p className="text-2xl font-bold" style={{ color: '#333333' }}>
                  {kpi.value}
                </p>
                <span style={{ color: '#67CF94' }} className="text-sm font-medium">
                  {kpi.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Chart */}
          <div
            className="bg-white rounded-lg border p-6 shadow-sm"
            style={{ borderColor: '#e0e0e0' }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: '#333333' }}>
              Tráfico por Día
            </h2>
            <div className="h-64 flex items-end justify-around">
              {[45, 52, 38, 65, 55, 70, 60].map((val, idx) => (
                <div
                  key={idx}
                  className="w-8 rounded-t transition hover:opacity-80"
                  style={{
                    height: `${(val / 70) * 100}%`,
                    backgroundColor: '#8280FD',
                  }}
                  title={`${val}%`}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs" style={{ color: '#727272' }}>
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab', 'Dom'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>

          {/* Conversion Funnel */}
          <div
            className="bg-white rounded-lg border p-6 shadow-sm"
            style={{ borderColor: '#e0e0e0' }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: '#333333' }}>
              Embudo de Conversión
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Visitantes', value: '25,847', pct: 100 },
                { label: 'Usuarios Activos', value: '18,234', pct: 70 },
                { label: 'Leads', value: '8,456', pct: 35 },
                { label: 'Conversiones', value: '642', pct: 3 },
              ].map((step, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: '#333333' }} className="font-medium">
                      {step.label}
                    </span>
                    <span style={{ color: '#727272' }} className="text-sm">
                      {step.value}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded overflow-hidden"
                    style={{ backgroundColor: '#f0f0f0' }}
                  >
                    <div
                      className="h-full rounded transition-all"
                      style={{
                        width: `${step.pct}%`,
                        backgroundColor: '#6045E2',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div
          className="bg-white rounded-lg border p-6 shadow-sm"
          style={{ borderColor: '#e0e0e0' }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: '#333333' }}>
            Páginas Principales
          </h2>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottomColor: '#f0f0f0', borderBottom: '1px solid' }}>
                <th className="text-left py-2 px-2" style={{ color: '#727272', fontWeight: 600 }}>
                  Página
                </th>
                <th className="text-right py-2 px-2" style={{ color: '#727272', fontWeight: 600 }}>
                  Vistas
                </th>
                <th className="text-right py-2 px-2" style={{ color: '#727272', fontWeight: 600 }}>
                  Tiempo Promedio
                </th>
                <th className="text-right py-2 px-2" style={{ color: '#727272', fontWeight: 600 }}>
                  Rebote
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { page: '/generators', views: '8,234', time: '3:42', bounce: '24%' },
                { page: '/clients', views: '6,845', time: '2:18', bounce: '32%' },
                { page: '/dashboard', views: '5,342', time: '5:12', bounce: '18%' },
                { page: '/analytics', views: '3,256', time: '4:05', bounce: '28%' },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  style={{ borderBottomColor: '#f0f0f0', borderBottom: '1px solid' }}
                >
                  <td className="py-3 px-2" style={{ color: '#333333' }}>
                    {row.page}
                  </td>
                  <td className="text-right py-3 px-2" style={{ color: '#333333' }}>
                    {row.views}
                  </td>
                  <td className="text-right py-3 px-2" style={{ color: '#727272' }}>
                    {row.time}
                  </td>
                  <td className="text-right py-3 px-2" style={{ color: '#727272' }}>
                    {row.bounce}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashminLayout>
  );
}
