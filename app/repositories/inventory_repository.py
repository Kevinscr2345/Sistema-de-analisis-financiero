from typing import List, Dict, Any
from app.database import ConexionBaseDatos

class RepositorioInventario:
    """
    Clase RepositorioInventario (Capa de Acceso a Datos DAL):
    Maneja las consultas SQL y transacciones de inventario contra SQL Server.
    """
    def __init__(self, conexion_db: ConexionBaseDatos = None):
        self.db = conexion_db or ConexionBaseDatos()

    def obtener_productos_valorados(self) -> List[Dict[str, Any]]:
        query = """
        SELECT id_producto, codigo, Producto, Categoria, stock_actual, stock_minimo, 
               precio_compra, precio_venta, ValorTotalCosto, ValorTotalVenta, GananciaPotencial, EstadoStock
        FROM dbo.vw_ValoracionInventario
        ORDER BY Producto ASC;
        """
        try:
            return self.db.ejecutar_consulta(query)
        except Exception:
            return self._datos_demo_productos()

    def registrar_venta_procedimiento(self, id_producto: int, cantidad: int, precio_venta: float, id_cliente: int = None, metodo_pago: str = 'TRANSFERENCIA', concepto: str = None) -> bool:
        try:
            self.db.ejecutar_procedimiento(
                "dbo.sp_RegistrarVentaEInventario",
                (id_producto, cantidad, precio_venta, id_cliente, metodo_pago, concepto)
            )
            return True
        except Exception as e:
            print("Error al ejecutar procedimiento de venta:", e)
            return False

    def obtener_alertas_stock(self) -> List[Dict[str, Any]]:
        query = """
        SELECT a.id_alerta, p.nombre AS Producto, p.codigo, a.tipo_alerta, a.mensaje, a.fecha_alerta, a.estado
        FROM dbo.AlertasStock a
        INNER JOIN dbo.Productos p ON a.id_producto = p.id_producto
        WHERE a.estado = 'PENDIENTE'
        ORDER BY a.fecha_alerta DESC;
        """
        try:
            return self.db.ejecutar_consulta(query)
        except Exception:
            return self._datos_demo_alertas()

    def obtener_categorias(self) -> List[Dict[str, Any]]:
        query = "SELECT id_categoria, nombre FROM dbo.Categorias ORDER BY nombre ASC;"
        try:
            return self.db.ejecutar_consulta(query)
        except Exception:
            return [
                {"id_categoria": 1, "nombre": "Laptops y Portátiles"},
                {"id_categoria": 2, "nombre": "Computadoras de Escritorio"},
                {"id_categoria": 3, "nombre": "Monitores y Pantallas"},
                {"id_categoria": 4, "nombre": "Impresoras y Escáneres"},
                {"id_categoria": 5, "nombre": "Periféricos y Accesorios"},
                {"id_categoria": 6, "nombre": "Servidores y Redes"},
                {"id_categoria": 7, "nombre": "Componentes y Almacenamiento"}
            ]

    def crear_producto(self, codigo: str, nombre: str, id_categoria: int, precio_compra: float, precio_venta: float, stock_actual: int, stock_minimo: int, descripcion: str = "") -> bool:
        query = """
        INSERT INTO dbo.Productos (codigo, nombre, id_categoria, precio_compra, precio_venta, stock_actual, stock_minimo, descripcion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """
        try:
            self.db.ejecutar_comando(query, (codigo, nombre, id_categoria, precio_compra, precio_venta, stock_actual, stock_minimo, descripcion))
            return True
        except Exception as e:
            print("Error al crear producto:", e)
            return False

    def actualizar_producto(self, id_producto: int, codigo: str, nombre: str, id_categoria: int, precio_compra: float, precio_venta: float, stock_actual: int, stock_minimo: int, descripcion: str = "") -> bool:
        query = """
        UPDATE dbo.Productos
        SET codigo = ?, nombre = ?, id_categoria = ?, precio_compra = ?, precio_venta = ?, stock_actual = ?, stock_minimo = ?, descripcion = ?
        WHERE id_producto = ?;
        """
        try:
            self.db.ejecutar_comando(query, (codigo, nombre, id_categoria, precio_compra, precio_venta, stock_actual, stock_minimo, descripcion, id_producto))
            return True
        except Exception as e:
            print("Error al actualizar producto:", e)
            return False

    def eliminar_producto(self, id_producto: int) -> bool:
        try:
            # Eliminar alertas y movimientos relacionados para preservar integridad referencial
            self.db.ejecutar_comando("DELETE FROM dbo.AlertasStock WHERE id_producto = ?;", (id_producto,))
            self.db.ejecutar_comando("DELETE FROM dbo.MovimientosInventario WHERE id_producto = ?;", (id_producto,))
            self.db.ejecutar_comando("DELETE FROM dbo.Productos WHERE id_producto = ?;", (id_producto,))
            return True
        except Exception as e:
            print("Error al eliminar producto:", e)
            return False

    def _datos_demo_productos(self) -> List[Dict[str, Any]]:
        return [
            {"id_producto": 1, "codigo": "EQP-001", "Producto": "Laptop Dell Vostro 15", "Categoria": "Laptops y Portátiles", "stock_actual": 12, "stock_minimo": 3, "precio_compra": 650.00, "precio_venta": 890.00, "ValorTotalCosto": 7800.00, "ValorTotalVenta": 10680.00, "GananciaPotencial": 2880.00, "EstadoStock": "NORMAL"},
            {"id_producto": 2, "codigo": "EQP-002", "Producto": "Monitor LG 27 pulgadas 4K", "Categoria": "Monitores y Pantallas", "stock_actual": 8, "stock_minimo": 2, "precio_compra": 240.00, "precio_venta": 340.00, "ValorTotalCosto": 1920.00, "ValorTotalVenta": 2720.00, "GananciaPotencial": 800.00, "EstadoStock": "NORMAL"},
            {"id_producto": 3, "codigo": "EQP-003", "Producto": "Teclado Mecánico Inalámbrico", "Categoria": "Periféricos y Accesorios", "stock_actual": 4, "stock_minimo": 5, "precio_compra": 45.00, "precio_venta": 75.00, "ValorTotalCosto": 180.00, "ValorTotalVenta": 300.00, "GananciaPotencial": 120.00, "EstadoStock": "STOCK BAJO"},
            {"id_producto": 4, "codigo": "EQP-004", "Producto": "Servidor Dell PowerEdge T150", "Categoria": "Servidores y Redes", "stock_actual": 3, "stock_minimo": 2, "precio_compra": 1200.00, "precio_venta": 1750.00, "ValorTotalCosto": 3600.00, "ValorTotalVenta": 5250.00, "GananciaPotencial": 1650.00, "EstadoStock": "NORMAL"},
            {"id_producto": 5, "codigo": "EQP-005", "Producto": "Impresora Multifuncional Epson", "Categoria": "Impresoras y Escáneres", "stock_actual": 2, "stock_minimo": 3, "precio_compra": 180.00, "precio_venta": 260.00, "ValorTotalCosto": 360.00, "ValorTotalVenta": 520.00, "GananciaPotencial": 160.00, "EstadoStock": "STOCK BAJO"}
        ]

    def _datos_demo_alertas(self) -> List[Dict[str, Any]]:
        return [
            {"id_alerta": 1, "Producto": "Teclado Mecánico Inalámbrico", "codigo": "EQP-003", "tipo_alerta": "STOCK_BAJO", "mensaje": "El equipo Teclado Mecánico Inalámbrico tiene 4 unidades en stock (Mínimo: 5)", "fecha_alerta": "2026-07-30T10:00:00", "estado": "PENDIENTE"},
            {"id_alerta": 2, "Producto": "Impresora Multifuncional Epson", "codigo": "EQP-005", "tipo_alerta": "STOCK_BAJO", "mensaje": "El equipo Impresora Multifuncional Epson tiene 2 unidades en stock (Mínimo: 3)", "fecha_alerta": "2026-07-30T10:00:00", "estado": "PENDIENTE"}
        ]

