import React from 'react';

export default function FinanzasView({ ultimasTransacciones }) {
  return (
    <section className="card-panel">
      <div className="panel-header">
        <h3 className="panel-title">Historial de Flujo de Caja y Transacciones</h3>
      </div>

      <div className="data-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Concepto</th>
              <th>Categoría</th>
              <th>Método Pago</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {ultimasTransacciones.map((tx) => (
              <tr key={tx.id_transaccion}>
                <td>{new Date(tx.fecha_transaccion).toLocaleDateString('es-MX')}</td>
                <td>
                  <span className={`badge ${tx.tipo === 'INGRESO' ? 'badge-normal' : 'badge-danger'}`}>
                    {tx.tipo}
                  </span>
                </td>
                <td style={{ fontWeight: '600' }}>{tx.concepto}</td>
                <td>{tx.Categoria}</td>
                <td>{tx.metodo_pago}</td>
                <td style={{
                  fontWeight: 'bold',
                  color: tx.tipo === 'INGRESO' ? 'var(--success)' : 'var(--danger)'
                }}>
                  {tx.tipo === 'INGRESO' ? '+' : '-'}${Number(tx.monto || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
