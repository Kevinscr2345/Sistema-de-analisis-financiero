import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function VentasView({
  productos,
  formVenta,
  setFormVenta,
  handleProcesarVenta
}) {
  return (
    <section className="card-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="panel-header">
        <h3 className="panel-title">Módulo de Salida de Inventario y Venta</h3>
      </div>
      <form onSubmit={handleProcesarVenta}>
        <div className="form-group">
          <label className="form-label">Seleccionar Producto en Stock</label>
          <select
            className="form-select"
            value={formVenta.id_producto}
            onChange={(e) => {
              const prodId = parseInt(e.target.value);
              const prodEncontrado = productos.find(p => p.id_producto === prodId);
              setFormVenta({
                ...formVenta,
                id_producto: prodId,
                precio_venta: prodEncontrado ? prodEncontrado.precio_venta : 0
              });
            }}
          >
            {productos.map(p => (
              <option key={p.id_producto} value={p.id_producto}>
                {p.Producto} (Stock: {p.stock_actual} - ${Number(p.precio_venta || 0).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Cantidad a Vender</label>
          <input
            type="number"
            className="form-input"
            min="1"
            value={formVenta.cantidad}
            onChange={(e) => setFormVenta({ ...formVenta, cantidad: parseInt(e.target.value) || 1 })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Precio Venta Unitario ($)</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            value={formVenta.precio_venta}
            onChange={(e) => setFormVenta({ ...formVenta, precio_venta: parseFloat(e.target.value) || 0 })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Método de Pago</label>
          <select
            className="form-select"
            value={formVenta.metodo_pago}
            onChange={(e) => setFormVenta({ ...formVenta, metodo_pago: e.target.value })}
          >
            <option value="TRANSFERENCIA">Transferencia Bancaria</option>
            <option value="TARJETA">Tarjeta de Crédito / Débito</option>
            <option value="EFECTIVO">Efectivo</option>
          </select>
        </div>

        <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monto Total Venta:</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
            ${(formVenta.cantidad * formVenta.precio_venta).toFixed(2)}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          <ShoppingCart size={18} />
          Completar Venta y Actualizar Inventario
        </button>
      </form>
    </section>
  );
}
