import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';

export default function KPISection({ kpis }) {
  return (
    <section className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Total Ingresos</span>
          <div className="kpi-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
            <TrendingUp size={22} />
          </div>
        </div>
        <div className="kpi-value" style={{ color: 'var(--success)' }}>
          ${Number(kpis.TotalIngresos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </div>
        <div className="kpi-subtext">
          <span>+12.4% vs mes anterior</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Total Gastos</span>
          <div className="kpi-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
            <TrendingDown size={22} />
          </div>
        </div>
        <div className="kpi-value" style={{ color: 'var(--danger)' }}>
          ${Number(kpis.TotalGastos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </div>
        <div className="kpi-subtext">
          <span>Gastos operativos y compras</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Balance Neto</span>
          <div className="kpi-icon-wrapper" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)' }}>
            <DollarSign size={22} />
          </div>
        </div>
        <div className="kpi-value" style={{ color: 'var(--primary)' }}>
          ${Number(kpis.BalanceNeto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </div>
        <div className="kpi-subtext">
          <span>Margen Operativo Disponible</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Valor Inventario (Costo)</span>
          <div className="kpi-icon-wrapper" style={{ background: 'rgba(129, 140, 248, 0.15)', color: 'var(--secondary)' }}>
            <Package size={22} />
          </div>
        </div>
        <div className="kpi-value">
          ${Number(kpis.ValorInventarioCosto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </div>
        <div className="kpi-subtext">
          <span>Activos en almacén</span>
        </div>
      </div>
    </section>
  );
}
