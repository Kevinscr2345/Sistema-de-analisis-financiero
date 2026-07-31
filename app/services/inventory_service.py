from typing import Dict, Any, List
from app.repositories.inventory_repository import RepositorioInventario

class ServicioInventario:
    """
    Clase ServicioInventario (Capa de Negocio):
    Contiene la lógica de negocio para valoración, rotación y alertas de inventarios.
    """
    def __init__(self, repositorio: RepositorioInventario = None):
        self.repo = repositorio or RepositorioInventario()

    def obtener_analisis_inventario(self) -> Dict[str, Any]:
        """
        Retorna la lista de productos valorados y las alertas de stock pendientes.
        """
        productos = self.repo.obtener_productos_valorados()
        alertas = self.repo.obtener_alertas_stock()

        valor_total_costo = sum(p.get("ValorTotalCosto", 0) for p in productos)
        valor_total_venta = sum(p.get("ValorTotalVenta", 0) for p in productos)
        ganancia_potencial = sum(p.get("GananciaPotencial", 0) for p in productos)
        total_productos = len(productos)
        productos_stock_bajo = len([p for p in productos if p.get("EstadoStock") in ["STOCK BAJO", "AGOTADO"]])

        return {
            "resumen": {
                "total_productos": total_productos,
                "valor_total_costo": valor_total_costo,
                "valor_total_venta": valor_total_venta,
                "ganancia_potencial": ganancia_potencial,
                "productos_stock_bajo": productos_stock_bajo
            },
            "productos": productos,
            "alertas": alertas
        }

    def procesar_venta(self, id_producto: int, cantidad: int, precio_venta: float, id_cliente: int = None, metodo_pago: str = 'TRANSFERENCIA', concepto: str = None) -> Dict[str, Any]:
        """
        Ejecuta la transacción de venta afectando simultáneamente inventario y finanzas.
        """
        if cantidad <= 0:
            return {"exito": False, "mensaje": "La cantidad vendida debe ser mayor a cero."}
        if precio_venta <= 0:
            return {"exito": False, "mensaje": "El precio de venta debe ser positivo."}

        resultado = self.repo.registrar_venta_procedimiento(id_producto, cantidad, precio_venta, id_cliente, metodo_pago, concepto)
        if resultado:
            return {"exito": True, "mensaje": "Venta e inventario procesados correctamente."}
        else:
            return {"exito": False, "mensaje": "Ocurrió un error al procesar la venta."}

    def obtener_categorias(self) -> List[Dict[str, Any]]:
        return self.repo.obtener_categorias()

    def crear_producto(self, datos: Dict[str, Any]) -> Dict[str, Any]:
        codigo = datos.get('codigo', '').strip()
        nombre = datos.get('nombre', '').strip()
        id_categoria = int(datos.get('id_categoria', 1))
        precio_compra = float(datos.get('precio_compra', 0))
        precio_venta = float(datos.get('precio_venta', 0))
        stock_actual = int(datos.get('stock_actual', 0))
        stock_minimo = int(datos.get('stock_minimo', 5))
        descripcion = datos.get('descripcion', '').strip()

        if not codigo or not nombre:
            return {"exito": False, "mensaje": "El código y el nombre del producto son obligatorios."}
        if precio_compra < 0 or precio_venta < 0:
            return {"exito": False, "mensaje": "Los precios de compra y venta no pueden ser negativos."}
        if stock_actual < 0 or stock_minimo < 0:
            return {"exito": False, "mensaje": "Las cantidades de stock no pueden ser negativas."}

        exito = self.repo.crear_producto(codigo, nombre, id_categoria, precio_compra, precio_venta, stock_actual, stock_minimo, descripcion)
        if exito:
            return {"exito": True, "mensaje": f"Producto '{nombre}' creado exitosamente."}
        return {"exito": False, "mensaje": "No se pudo registrar el producto en la base de datos."}

    def actualizar_producto(self, id_producto: int, datos: Dict[str, Any]) -> Dict[str, Any]:
        codigo = datos.get('codigo', '').strip()
        nombre = datos.get('nombre', '').strip()
        id_categoria = int(datos.get('id_categoria', 1))
        precio_compra = float(datos.get('precio_compra', 0))
        precio_venta = float(datos.get('precio_venta', 0))
        stock_actual = int(datos.get('stock_actual', 0))
        stock_minimo = int(datos.get('stock_minimo', 5))
        descripcion = datos.get('descripcion', '').strip()

        if not codigo or not nombre:
            return {"exito": False, "mensaje": "El código y el nombre del producto son obligatorios."}
        if precio_compra < 0 or precio_venta < 0:
            return {"exito": False, "mensaje": "Los precios no pueden ser negativos."}

        exito = self.repo.actualizar_producto(id_producto, codigo, nombre, id_categoria, precio_compra, precio_venta, stock_actual, stock_minimo, descripcion)
        if exito:
            return {"exito": True, "mensaje": f"Producto '{nombre}' actualizado exitosamente."}
        return {"exito": False, "mensaje": "No se pudo actualizar el producto en la base de datos."}

    def eliminar_producto(self, id_producto: int) -> Dict[str, Any]:
        exito = self.repo.eliminar_producto(id_producto)
        if exito:
            return {"exito": True, "mensaje": "Producto eliminado exitosamente del inventario."}
        return {"exito": False, "mensaje": "Ocurrió un error al intentar eliminar el producto."}
