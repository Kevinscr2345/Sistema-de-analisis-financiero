import React from 'react';
import { PlusCircle, Edit, Eye, AlertTriangle, Trash2, X, Plus } from 'lucide-react';

export default function ModalesProductos({
  modalCrear,
  setModalCrear,
  modalEditar,
  setModalEditar,
  modalDetalle,
  setModalDetalle,
  modalEliminar,
  setModalEliminar,
  productoSeleccionado,
  formProducto,
  setFormProducto,
  handleCrearProducto,
  handleActualizarProducto,
  handleEliminarProducto
}) {
  return (
    <>
      {/* MODAL CREAR PRODUCTO */}
      {modalCrear && (
        <div className="modal-backdrop" onClick={() => setModalCrear(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title"><PlusCircle size={20} color="var(--primary)" /> Registrar Nuevo Equipo Informático</h3>
              <button className="modal-close" onClick={() => setModalCrear(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCrearProducto}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Código de Equipo</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' }}>Autogenerado</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formProducto.codigo}
                    readOnly
                    style={{
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: 'var(--primary)',
                      fontWeight: 'bold',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre del Equipo / Modelo</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej. Laptop HP ProBook 450 G8 / Monitor Dell 24''"
                    value={formProducto.nombre}
                    onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio Compra ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="0.00"
                    value={formProducto.precio_compra}
                    onChange={(e) => setFormProducto({ ...formProducto, precio_compra: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio Venta ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="0.00"
                    value={formProducto.precio_venta}
                    onChange={(e) => setFormProducto({ ...formProducto, precio_venta: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Inicial</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    value={formProducto.stock_actual}
                    onChange={(e) => setFormProducto({ ...formProducto, stock_actual: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Mínimo (Alerta)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formProducto.stock_minimo}
                    onChange={(e) => setFormProducto({ ...formProducto, stock_minimo: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Descripción u Observación</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Opcional..."
                    value={formProducto.descripcion}
                    onChange={(e) => setFormProducto({ ...formProducto, descripcion: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalCrear(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary"><Plus size={18} /> Guardar Equipo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR PRODUCTO */}
      {modalEditar && productoSeleccionado && (
        <div className="modal-backdrop" onClick={() => setModalEditar(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title"><Edit size={20} color="var(--warning)" /> Editar Producto en SQL Server</h3>
              <button className="modal-close" onClick={() => setModalEditar(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleActualizarProducto}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Código Producto</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formProducto.codigo}
                    readOnly
                    style={{ background: 'rgba(255,255,255,0.05)', cursor: 'not-allowed' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre del Equipo / Modelo</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formProducto.nombre}
                    onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio Compra ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formProducto.precio_compra}
                    onChange={(e) => setFormProducto({ ...formProducto, precio_compra: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio Venta ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formProducto.precio_venta}
                    onChange={(e) => setFormProducto({ ...formProducto, precio_venta: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Actual</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formProducto.stock_actual}
                    onChange={(e) => setFormProducto({ ...formProducto, stock_actual: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Mínimo (Alerta)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formProducto.stock_minimo}
                    onChange={(e) => setFormProducto({ ...formProducto, stock_minimo: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalEditar(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }}>
                  <Edit size={18} /> Actualizar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE PRODUCTO */}
      {modalDetalle && productoSeleccionado && (
        <div className="modal-backdrop" onClick={() => setModalDetalle(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title"><Eye size={20} color="var(--primary)" /> Detalle Completo del Producto</h3>
              <button className="modal-close" onClick={() => setModalDetalle(false)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CÓDIGO SISTEMA</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--primary)' }}>{productoSeleccionado.codigo}</div>
                </div>
                <span className={`badge ${productoSeleccionado.EstadoStock === 'NORMAL' ? 'badge-normal' : productoSeleccionado.EstadoStock === 'STOCK BAJO' ? 'badge-warning' : 'badge-danger'}`}>
                  {productoSeleccionado.EstadoStock}
                </span>
              </div>

              <div>
                <h4 style={{ fontSize: '1.2rem', margin: '0 0 0.25rem 0' }}>{productoSeleccionado.Producto}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Categoría: {productoSeleccionado.Categoria}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PRECIO COMPRA</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>${Number(productoSeleccionado.precio_compra || 0).toFixed(2)}</div>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PRECIO VENTA</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--success)' }}>${Number(productoSeleccionado.precio_venta || 0).toFixed(2)}</div>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STOCK ACTUAL</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{productoSeleccionado.stock_actual} unidades</div>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STOCK MÍNIMO</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--warning)' }}>{productoSeleccionado.stock_minimo} unidades</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', background: 'rgba(56, 189, 248, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VALOR TOTAL COSTO</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>${Number(productoSeleccionado.ValorTotalCosto || 0).toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VALOR TOTAL VENTA</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>${Number(productoSeleccionado.ValorTotalVenta || 0).toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GANANCIA POTENCIAL</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--success)' }}>+${Number(productoSeleccionado.GananciaPotencial || 0).toFixed(2)}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setModalDetalle(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR PRODUCTO */}
      {modalEliminar && productoSeleccionado && (
        <div className="modal-backdrop" onClick={() => setModalEliminar(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3 className="modal-title"><AlertTriangle size={20} color="var(--danger)" /> Confirmar Eliminación</h3>
              <button className="modal-close" onClick={() => setModalEliminar(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <p style={{ margin: '0 0 1rem 0' }}>¿Estás seguro de que deseas eliminar permanentemente este producto de tu base de datos SQL Server?</p>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#fff' }}>{productoSeleccionado.Producto}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Código: {productoSeleccionado.codigo} | Stock: {productoSeleccionado.stock_actual} unidades</div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setModalEliminar(false)}>Cancelar</button>
              <button type="button" className="btn btn-danger" onClick={handleEliminarProducto}><Trash2 size={18} /> Confirmar Eliminación</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
