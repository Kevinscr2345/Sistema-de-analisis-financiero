import os
import pyodbc

class ConfiguracionConexion:
    """
    Clase para gestionar la configuración de conexión a SQL Server Express
    utilizando Autenticación de Windows (Trusted Connection).
    """
    SERVIDOR = os.getenv("DB_SERVER", r".\SQLEXPRESS")
    BASE_DATOS = os.getenv("DB_NAME", "FinanzasInventarioDB")
    
    @classmethod
    def obtener_driver_disponible(cls) -> str:
        try:
            drivers = pyodbc.drivers()
        except Exception:
            drivers = []
        drivers_preferidos = [
            'ODBC Driver 18 for SQL Server',
            'ODBC Driver 17 for SQL Server',
            'ODBC Driver 13 for SQL Server',
            'SQL Server Native Client 11.0',
            'SQL Server'
        ]
        for driver in drivers_preferidos:
            if driver in drivers:
                return driver
        return 'SQL Server'

    @classmethod
    def obtener_cadena_conexion(cls) -> str:
        driver = cls.obtener_driver_disponible()
        cadena = (
            f"DRIVER={{{driver}}};"
            f"SERVER={cls.SERVIDOR};"
            f"DATABASE={cls.BASE_DATOS};"
            "Trusted_Connection=yes;"
            "Integrated Security=SSPI;"
            "TrustServerCertificate=yes;"
        )
        return cadena

if __name__ == "__main__":
    print("=== PRUEBA DE CONFIGURACIÓN DE CONEXIÓN ===")
    print("Servidor:", ConfiguracionConexion.SERVIDOR)
    print("Base de Datos:", ConfiguracionConexion.BASE_DATOS)
    print("Driver Seleccionado:", ConfiguracionConexion.obtener_driver_disponible())
    print("Cadena de Conexión:", ConfiguracionConexion.obtener_cadena_conexion())
