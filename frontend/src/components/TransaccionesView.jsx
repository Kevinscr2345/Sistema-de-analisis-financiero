import React from 'react';
import { PlusCircle } from 'lucide-react';

export default function TransaccionesView({
  formTransaccion,
  setFormTransaccion,
  handleRegistrarTransaccion
}) {
  return (
    <section className="card-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="panel-header">
        <h3 className="panel-title">Registro de Ingreso o Gasto Operativo</h3>
      </div>
      <form onSubmit={handleRegistrarTransaccion}>
        <div className="form-group">
          <label className="form-label">Tipo de Transacción</label>
          <select
            className="form-select"
            value={formTransaccion.tipo}
            onChange={(e) => setFormTransaccion({ ...formTransaccion, tipo: e.target.value })}
          >
            <option value="INGRESO">Ingreso (+)</option>
            <option value="GASTO">Gasto (-)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Concepto / Descripción</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej. Pago de alquiler, venta de servicios TI..."
            value={formTransaccion.concepto}
            onChange={(e) => setFormTransaccion({ ...formTransaccion, concepto: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Monto ($)</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            placeholder="0.00"
            value={formTransaccion.monto}
            onChange={(e) => setFormTransaccion({ ...formTransaccion, monto: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Método de Pago</label>
          <select
            className="form-select"
            value={formTransaccion.metodo_pago}
            onChange={(e) => setFormTransaccion({ ...formTransaccion, metodo_pago: e.target.value })}
          >
            <option value="TRANSFERENCIA">Transferencia Bancaria</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          <PlusCircle size={18} />
          Guardar Transacción Financiera
        </button>
      </form>
    </section>
  );
}
