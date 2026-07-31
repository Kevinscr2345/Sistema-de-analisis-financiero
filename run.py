from flask import Flask
from flask_cors import CORS
from app.routes.api_routes import api_bp

class AplicacionBackend:
    """
    Clase principal para la inicialización y arranque de la aplicación Flask backend.
    """
    def __init__(self, host: str = "127.0.0.1", port: int = 5000):
        self.host = host
        self.port = port
        self.app = Flask(__name__)
        self.app.json.ensure_ascii = False
        CORS(self.app)
        self.configurar_rutas()

    def configurar_rutas(self):
        @self.app.route('/')
        def inicio():
            from flask import jsonify
            return jsonify({
                "mensaje": "Servidor Backend del Sistema de Análisis Financiero",
                "estado": "Activo",
                "rutas_disponibles": [
                    "/api/estado",
                    "/api/dashboard",
                    "/api/financiero",
                    "/api/inventario"
                ]
            })
        self.app.register_blueprint(api_bp)

    def iniciar(self):
        from config import ConfiguracionConexion
        print(f"================================================================")
        print(f" Servidor Backend iniciado en http://{self.host}:{self.port}")
        print(f" Conexión SQL Server configurada a: {ConfiguracionConexion.SERVIDOR}")
        print(f" Base de Datos: {ConfiguracionConexion.BASE_DATOS} (Autenticación de Windows)")
        print(f"================================================================")
        self.app.run(host=self.host, port=self.port, debug=True)

if __name__ == "__main__":
    servidor = AplicacionBackend()
    servidor.iniciar()
