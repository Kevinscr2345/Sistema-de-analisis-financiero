import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function DashboardView({ tendenciaMensual, alertas }) {
  return (
    <section className="charts-grid">
      <div className="card-panel">
        <div className="panel-header">
          <h3 className="panel-title">Evolución de Ingresos y Gastos Mensuales</h3>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tendenciaMensual}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="mesNombre" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="TotalIngresos" stroke="#10b981" fillOpacity={1} fill="url(#colorIngresos)" name="Ingresos ($)" />
              <Area type="monotone" dataKey="TotalGastos" stroke="#ef4444" fillOpacity={1} fill="url(#colorGastos)" name="Gastos ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-panel">
        <div className="panel-header">
          <h3 className="panel-title">Alertas de Stock Crítico</h3>
          <span className="badge badge-warning">{alertas.length} Pendientes</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {alertas.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No hay alertas de inventario pendientes.</p>
          ) : (
            alertas.map((alerta, idx) => (
              <div key={idx} style={{
                padding: '1rem',
                background: 'rgba(245, 158, 11, 0.1)',
                borderLeft: '4px solid var(--warning)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{alerta.Producto}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {alerta.mensaje}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
