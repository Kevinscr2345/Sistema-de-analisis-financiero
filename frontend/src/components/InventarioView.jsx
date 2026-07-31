import React from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

export default function InventarioView({
  productosFiltrados,
  busquedaProducto,
  setBusquedaProducto,
  abrirModalCrear,
  abrirModalDetalle,
  abrirModalEditar,
  abrirModalEliminar
}) {
  return (
    <section className="card-panel">
      <div className="panel-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h3 className="panel-title">Inventario de Productos y Valoración en Stock</h3>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Buscar por código o equipo..."
              value={busquedaProducto}
              onChange={(e) => setBusquedaProducto(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={abrirModalCrear}>
            <Plus size={18} />
            Nuevo Equipo
          </button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock Actual</th>
              <th>Precio Compra</th>
              <th>Precio Venta</th>
              <th>Valor Total (Costo)</th>
              <th>Ganancia Potencial</th>
              <th>Estado Stock</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((prod) => (
              <tr key={prod.id_producto}>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{prod.codigo}</td>
                <td style={{ fontWeight: '600' }}>{prod.Producto}</td>
                <td>{prod.Categoria}</td>
                <td style={{ fontWeight: 'bold' }}>{prod.stock_actual} / <span style={{ color: 'var(--text-dim)' }}>Min: {prod.stock_minimo}</span></td>
                <td>${Number(prod.precio_compra || 0).toFixed(2)}</td>
                <td>${Number(prod.precio_venta || 0).toFixed(2)}</td>
                <td style={{ fontWeight: 'bold' }}>${Number(prod.ValorTotalCosto || 0).toFixed(2)}</td>
                <td style={{ color: 'var(--success)', fontWeight: 'bold' }}>+${Number(prod.GananciaPotencial || 0).toFixed(2)}</td>
                <td>
                  <span className={`badge ${prod.EstadoStock === 'NORMAL' ? 'badge-normal' :
                    prod.EstadoStock === 'STOCK BAJO' ? 'badge-warning' : 'badge-danger'
                    }`}>
                    {prod.EstadoStock}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                    <button className="btn-icon btn-view" title="Ver Detalle" onClick={() => abrirModalDetalle(prod)}>
                      <Eye size={16} />
                    </button>
                    <button className="btn-icon btn-edit" title="Editar Producto" onClick={() => abrirModalEditar(prod)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon btn-delete" title="Eliminar Producto" onClick={() => abrirModalEliminar(prod)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
