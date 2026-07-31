from typing import List, Dict, Any
from app.database import ConexionBaseDatos

class RepositorioFinanciero:
    """
    Clase RepositorioFinanciero (Capa de Acceso a Datos DAL):
    Maneja las consultas SQL y transacciones financieras contra SQL Server.
    """
    def __init__(self, conexion_db: ConexionBaseDatos = None):
        self.db = conexion_db or ConexionBaseDatos()

    def obtener_resumen_mensual(self) -> List[Dict[str, Any]]:
        query = """
        SELECT Anio, Mes, TotalIngresos, TotalGastos, BalanceNeto, MargenUtilidadPorcentaje
        FROM dbo.vw_ResumenFinanciero
        ORDER BY Anio DESC, Mes DESC;
        """
        try:
            return self.db.ejecutar_consulta(query)
        except Exception:
            return self._datos_demo_resumen()

    def obtener_flujo_caja(self) -> List[Dict[str, Any]]:
        query = """
        SELECT TOP 50 id_transaccion, fecha_transaccion, tipo, concepto, monto, metodo_pago, Categoria, ClienteProveedor
        FROM dbo.vw_FlujoCajaMensual
        ORDER BY fecha_transaccion DESC;
        """
        try:
            return self.db.ejecutar_consulta(query)
        except Exception:
            return self._datos_demo_flujo()

    def obtener_kpis(self) -> Dict[str, Any]:
        try:
            res = self.db.ejecutar_procedimiento("dbo.sp_ObtenerKPIsFinancieros")
            if res:
                return res[0]
            return self._datos_demo_kpis()
        except Exception:
            return self._datos_demo_kpis()

    def registrar_transaccion(self, tipo: str, concepto: str, monto: float, id_categoria: int, metodo_pago: str = 'TRANSFERENCIA', id_entidad: int = None) -> bool:
        query = """
        INSERT INTO dbo.TransaccionesFinancieras (tipo, concepto, monto, id_categoria, id_entidad, metodo_pago)
        VALUES (?, ?, ?, ?, ?, ?);
        """
        try:
            filas = self.db.ejecutar_comando(query, (tipo, concepto, monto, id_categoria, id_entidad, metodo_pago))
            return filas > 0
        except Exception:
            return False

    # Datos Demo en caso de indisponibilidad temporal de la BD local
    def _datos_demo_kpis(self) -> Dict[str, Any]:
        return {
            "TotalIngresos": 5780.00,
            "TotalGastos": 3030.00,
            "BalanceNeto": 2750.00,
            "ValorInventarioCosto": 11300.00,
            "TotalAlertasStock": 2
        }

    def _datos_demo_resumen(self) -> List[Dict[str, Any]]:
        return [
            {"Anio": 2026, "Mes": 7, "TotalIngresos": 4580.00, "TotalGastos": 3030.00, "BalanceNeto": 1550.00, "MargenUtilidadPorcentaje": 33.84},
            {"Anio": 2026, "Mes": 6, "TotalIngresos": 6200.00, "TotalGastos": 3400.00, "BalanceNeto": 2800.00, "MargenUtilidadPorcentaje": 45.16},
            {"Anio": 2026, "Mes": 5, "TotalIngresos": 5100.00, "TotalGastos": 2900.00, "BalanceNeto": 2200.00, "MargenUtilidadPorcentaje": 43.14}
        ]

    def _datos_demo_flujo(self) -> List[Dict[str, Any]]:
        return [
            {"id_transaccion": 1, "fecha_transaccion": "2026-07-29T14:30:00", "tipo": "INGRESO", "concepto": "Venta Laptops Dell Vostro", "monto": 3560.00, "metodo_pago": "TRANSFERENCIA", "Categoria": "Venta de Mercadería", "ClienteProveedor": "Comercializadora Global R.L."},
            {"id_transaccion": 2, "fecha_transaccion": "2026-07-25T11:00:00", "tipo": "INGRESO", "concepto": "Servicios de Consultoría TI", "monto": 1200.00, "metodo_pago": "TRANSFERENCIA", "Categoria": "Servicios Profesionales", "ClienteProveedor": "Consultores Financieros Alfa"},
            {"id_transaccion": 3, "fecha_transaccion": "2026-07-22T09:15:00", "tipo": "GASTO", "concepto": "Pago Alquiler de Local Comercial", "monto": 850.00, "metodo_pago": "TRANSFERENCIA", "Categoria": "Gastos Operativos", "ClienteProveedor": "N/A"},
            {"id_transaccion": 4, "fecha_transaccion": "2026-07-20T16:45:00", "tipo": "GASTO", "concepto": "Pago de Servicios Públicos", "monto": 230.00, "metodo_pago": "EFECTIVO", "Categoria": "Gastos Operativos", "ClienteProveedor": "N/A"}
        ]
