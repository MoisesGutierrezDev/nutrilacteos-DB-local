import pymysql

def obtener_conexion():
    try:
        conexion = pymysql.connect(
            host="127.0.0.1",
            port=3308,
            user="root",
            password="123456",
            database="nutrilacteos",
            cursorclass=pymysql.cursors.DictCursor
        )
        print("Conexión a MySQL exitosa")
        return conexion
    except Exception as e:
        print(f"Error de conexión a MySQL: {e}")
        return None