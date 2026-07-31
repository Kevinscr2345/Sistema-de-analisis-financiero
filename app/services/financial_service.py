from typing import Dict, Any, List
from app.repositories.financial_repository import RepositorioFinanciero

class ServicioFinanciero:
    """
    Clase ServicioFinanciero (Capa de Negocio):
    Contiene la lógica de negocio para el análisis de finanzas empresariales.
    """
    def __init__(self, repositorio: RepositorioFinanciero = None):
        self.repo = repositorio or RepositorioFinanciero()

    def obtener_resumen_dashboard(self) -> Dict[str, Any]:
        """
        Calcula y consolida el resumen de indicadores clave y tendencias.
        """
        kpis = self.repo.obtener_kpis()
        resumen_mensual = self.repo.obtener_resumen_mensual()
        flujo_reciente = self.repo.obtener_flujo_caja()

        return {
            "kpis": kpis,
            "tendencia_mensual": resumen_mensual,
            "ultimas_transacciones": flujo_reciente
        }

    def registrar_nueva_transaccion(self, tipo: str, concepto: str, monto: float, id_categoria: int, metodo_pago: str = 'TRANSFERENCIA', id_entidad: int = None) -> Dict[str, Any]:
        """
        Valida y procesa el registro de un ingreso o gasto.
        """
        if monto <= 0:
            return {"exito": False, "mensaje": "El monto debe ser mayor a cero."}
        if not concepto or len(concepto.strip()) == 0:
            return {"exito": False, "mensaje": "El concepto no puede estar vacío."}

        exito = self.repo.registrar_transaccion(tipo, concepto, monto, id_categoria, metodo_pago, id_entidad)
        if exito:
            return {"exito": True, "mensaje": f"{tipo.capitalize()} registrado exitosamente en el sistema."}
        else:
            return {"exito": False, "mensaje": "No se pudo registrar la transacción financiera."}
