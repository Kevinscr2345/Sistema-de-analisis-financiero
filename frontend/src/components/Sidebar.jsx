import React from 'react';
import {
  LayoutDashboard, Package, DollarSign, ShoppingCart, PlusCircle, BarChart3
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <div className="brand-logo">
        <div className="brand-icon">
          <BarChart3 size={24} />
        </div>
        <div className="brand-text">
          <h2>SistemFinance</h2>
        </div>
      </div>

      <ul className="nav-menu">
        <li
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard General</span>
        </li>
        <li
          className={`nav-item ${activeTab === 'inventario' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventario')}
        >
          <Package size={18} />
          <span>Control Inventario</span>
        </li>
        <li
          className={`nav-item ${activeTab === 'finanzas' ? 'active' : ''}`}
          onClick={() => setActiveTab('finanzas')}
        >
          <DollarSign size={18} />
          <span>Análisis Financiero</span>
        </li>
        <li
          className={`nav-item ${activeTab === 'nueva_venta' ? 'active' : ''}`}
          onClick={() => setActiveTab('nueva_venta')}
        >
          <ShoppingCart size={18} />
          <span>Registrar Venta</span>
        </li>
        <li
          className={`nav-item ${activeTab === 'transaccion' ? 'active' : ''}`}
          onClick={() => setActiveTab('transaccion')}
        >
          <PlusCircle size={18} />
          <span>Ingreso / Gasto</span>
        </li>
      </ul>
    </aside>
  );
}
