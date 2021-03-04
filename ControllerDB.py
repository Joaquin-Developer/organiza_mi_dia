
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
    cursor = connection_bd.cursor()
    cursor.execute(sql_query)
    connection_bd.commit()
    cursor.close()
    connection_bd.close()

# seguir mañana...
