from flask import Blueprint, jsonify, request
from app.services.financial_service import ServicioFinanciero
from app.services.inventory_service import ServicioInventario

api_bp = Blueprint('api', __name__, url_prefix='/api')

class ControladorAPI:
    """
    Clase ControladorAPI:
    Encargada de exponer las rutas RESTful en Flask conectando la solicitud HTTP
    con la capa de servicios del sistema.
    """
    def __init__(self, servicio_financiero: ServicioFinanciero = None, servicio_inventario: ServicioInventario = None):
        self.servicio_finanzas = servicio_financiero or ServicioFinanciero()
        self.servicio_inventario = servicio_inventario or ServicioInventario()

    def registrar_rutas(self, bp: Blueprint):
        @bp.route('/estado', methods=['GET'])
        def obtener_estado():
            return jsonify({
                "estado": "OK",
                "mensaje": "Servidor Backend en Python operando correctamente con arquitectura por capas.",
                "sistema": "Plataforma de Análisis Financiero y Control de Inventarios"
            })

        @bp.route('/dashboard', methods=['GET'])
        def obtener_dashboard():
            resumen_finanzas = self.servicio_finanzas.obtener_resumen_dashboard()
            resumen_inventario = self.servicio_inventario.obtener_analisis_inventario()
            return jsonify({
                "financiero": resumen_finanzas,
                "inventario": resumen_inventario.get("resumen"),
                "alertas": resumen_inventario.get("alertas")
            })

        @bp.route('/financiero', methods=['GET'])
        def obtener_datos_financieros():
            data = self.servicio_finanzas.obtener_resumen_dashboard()
            return jsonify(data)

        @bp.route('/transacciones', methods=['POST'])
        def registrar_transaccion():
            body = request.get_json() or {}
            tipo = body.get('tipo', 'INGRESO')
            concepto = body.get('concepto', '')
            monto = float(body.get('monto', 0))
            id_categoria = int(body.get('id_categoria', 3))
            metodo_pago = body.get('metodo_pago', 'TRANSFERENCIA')

            res = self.servicio_finanzas.registrar_nueva_transaccion(tipo, concepto, monto, id_categoria, metodo_pago)
            return jsonify(res)

        @bp.route('/inventario', methods=['GET'])
        def obtener_inventario():
            data = self.servicio_inventario.obtener_analisis_inventario()
            return jsonify(data)

        @bp.route('/ventas', methods=['POST'])
        def procesar_venta():
            body = request.get_json() or {}
            id_producto = int(body.get('id_producto', 1))
            cantidad = int(body.get('cantidad', 1))
            precio_venta = float(body.get('precio_venta', 0.0))
            id_cliente = body.get('id_cliente')
            metodo_pago = body.get('metodo_pago', 'TRANSFERENCIA')

            res = self.servicio_inventario.procesar_venta(id_producto, cantidad, precio_venta, id_cliente, metodo_pago)
            return jsonify(res)

        @bp.route('/categorias', methods=['GET'])
        def obtener_categorias():
            data = self.servicio_inventario.obtener_categorias()
            return jsonify(data)

        @bp.route('/productos', methods=['POST'])
        def crear_producto():
            body = request.get_json() or {}
            res = self.servicio_inventario.crear_producto(body)
            return jsonify(res)

        @bp.route('/productos/<int:id_producto>', methods=['PUT'])
        def actualizar_producto(id_producto):
            body = request.get_json() or {}
            res = self.servicio_inventario.actualizar_producto(id_producto, body)
            return jsonify(res)

        @bp.route('/productos/<int:id_producto>', methods=['DELETE'])
        def eliminar_producto(id_producto):
            res = self.servicio_inventario.eliminar_producto(id_producto)
            return jsonify(res)

# Instancia global del Controlador API
controlador_api = ControladorAPI()
controlador_api.registrar_rutas(api_bp)
