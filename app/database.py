import pyodbc
import decimal
import datetime
from typing import List, Dict, Any, Optional
from config import ConfiguracionConexion

def _convertir_valor(val):
    if isinstance(val, decimal.Decimal):
        return float(val)
    if isinstance(val, (datetime.date, datetime.datetime)):
        return val.isoformat()
    return val

def _convertir_fila(columnas, fila):
    return {col: _convertir_valor(val) for col, val in zip(columnas, fila)}

class ConexionBaseDatos:
    """
    Clase Singleton encargada de administrar el ciclo de vida de la conexión
    a la base de datos SQL Server Express utilizando pyodbc y Autenticación de Windows.
    """
    _instancia: Optional['ConexionBaseDatos'] = None

    def __new__(cls):
        if cls._instancia is None:
            cls._instancia = super(ConexionBaseDatos, cls).__new__(cls)
            cls._instancia.cadena_conexion = ConfiguracionConexion.obtener_cadena_conexion()
        return cls._instancia

    def obtener_conexion(self):
        """
        Retorna un objeto conexión activo de pyodbc o lanza una excepción clara.
        """
        return pyodbc.connect(self.cadena_conexion, autocommit=False)

    def ejecutar_consulta(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        """
        Ejecuta una consulta SELECT y retorna una lista de diccionarios con las filas devueltas.
        """
        conn = self.obtener_conexion()
        cursor = conn.cursor()
        try:
            cursor.execute(query, params)
            columnas = [column[0] for column in cursor.description] if cursor.description else []
            filas = cursor.fetchall()
            resultado = []
            for fila in filas:
                resultado.append(_convertir_fila(columnas, fila))
            return resultado
        finally:
            cursor.close()
            conn.close()

    def ejecutar_comando(self, query: str, params: tuple = ()) -> int:
        """
        Ejecuta una sentencia INSERT, UPDATE o DELETE y realiza commit.
        Retorna la cantidad de filas afectadas.
        """
        conn = self.obtener_conexion()
        cursor = conn.cursor()
        try:
            cursor.execute(query, params)
            filas_afectadas = cursor.rowcount
            conn.commit()
            return filas_afectadas
        except Exception:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def ejecutar_procedimiento(self, nombre_procedimiento: str, params: tuple = ()) -> Any:
        """
        Ejecuta un procedimiento almacenado en SQL Server.
        """
        conn = self.obtener_conexion()
        cursor = conn.cursor()
        try:
            placeholders = ",".join(["?"] * len(params))
            sql = f"{{CALL {nombre_procedimiento} ({placeholders})}}"
            cursor.execute(sql, params)
            
            resultado = []
            if cursor.description:
                columnas = [col[0] for col in cursor.description]
                filas = cursor.fetchall()
                for fila in filas:
                    resultado.append(_convertir_fila(columnas, fila))
            conn.commit()
            return resultado
        except Exception:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()
