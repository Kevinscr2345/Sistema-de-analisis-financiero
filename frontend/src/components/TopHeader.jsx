import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function TopHeader({ activeTab, cargarDatos, loading }) {
  return (
    <header className="top-header">
      <div className="header-title">
        <h1>
          {activeTab === 'dashboard' && 'Dashboard de Análisis Financiero y Stock'}
          {activeTab === 'inventario' && 'Valoración y Control de Inventarios Empresariales'}
          {activeTab === 'finanzas' && 'Flujo de Caja y Métricas Financieras'}
          {activeTab === 'nueva_venta' && 'Registro de Ventas y Salida de Inventario'}
          {activeTab === 'transaccion' && 'Registro de Transacciones Financieras'}
        </h1>
        <p>Sistema Orientado a PyMEs | Arquitectura Monolítica por Capas en Python & React</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={cargarDatos}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          Actualizar
        </button>
        <div className="connection-badge">
          <div className="dot-indicator"></div>
          <span>SQL Server Conectado</span>
        </div>
      </div>
    </header>
  );
}
