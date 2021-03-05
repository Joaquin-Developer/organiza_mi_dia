
import pymysql
import data_connection

def get_connection():
    return pymysql.connect(
        user = data_connection.database_user,
        password = data_connection.database_passw,
        host = data_connection.database_host,
        database = data_connection.database_name
    )

def query(sql_query):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(sql_query)
    connection.commit()
    cursor.close()
    connection.close()

def authentication(key, username):
    final_key = str(key)
    final_username = str(username)
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM keyData")
    # rows = cursor.fetchall()
    rows = cursor.fetchone()
    results = []
    while rows is not None:
        results.append(rows)
        rows = cursor.fetchone()
    
    cursor.close()
    connection.close()
    for elem in results:
        if elem[0] == key and elem[1] == username:
            return True
    raise Exception("Error de autenticación: clave incorrecta")

