
import pymysql, json, datetime
from models import Task
from database import data_connection
from config import Config


def get_connection():
    try:
        if Config.config.get("debug_mode"):
            # localhost database
            return pymysql.connect(
                user = data_connection.dev_database_user,
                password = data_connection.dev_database_passw,
                host = data_connection.dev_database_host,
                database = data_connection.dev_database_name
            )
        else:
            # (In production: GearHost MySQL database)
            return pymysql.connect(
                user = data_connection.database_user,
                password = data_connection.database_passw,
                host = data_connection.database_host,
                database = data_connection.database_name
            )
    except Exception as e:
        raise e
        pass

def query(sql_query):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        cursor.execute(sql_query)
    except Exception as e:
        connection.rollback()
    else:
        connection.commit()
        cursor.close()
        connection.close()

def select_query(sql_query, get_json):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(sql_query)
    rows = cursor.fetchall()

    if get_json:
        records = json.dumps(tuple(rows), indent=4, sort_keys=True, default=str)
        # print(records)
    else:
        records = rows

    cursor.close()
    connection.close()
    return records


def authentication(username, keyValue):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT * FROM users")
    except Exception as e:
        raise e
    else:
        # rows = cursor.fetchall()
        rows = cursor.fetchone()
        results = []
        while rows is not None:
            results.append(rows)
            rows = cursor.fetchone()
    
        cursor.close()
        connection.close()
        for elem in results:
            if elem[0] == username and elem[1] == keyValue:
                return True
        return False                
        #raise Exception("Error de autenticación: clave incorrecta")


def insert_task(task, username):
    # Insert task in table Task:
    status_task = 1 if (task.status == True) else 0
    
    # task: (id,name,description,date_task,status,is_active)
    sql_query = "insert into task values(null, '{}', '{}', '{}', {}, 1)"
    query(sql_query.format(task.name, task.description, task.date_task, status_task))

    # Insert in table task_user:
    relation_task_user(task, username)
    pass

def relation_task_user(task, username):
    id_task = get_task_id(task.name, task.description)
    sql_query = "insert into task_user(id,username) values({}, '{}')"
    query(sql_query.format(id_task, username))

def get_last_task_id():
    pass

def get_task_id(name, description):
    sql_query = "select id from task where name='{}' and description='{}'".format(name, description)    
    records = select_query(sql_query, get_json=False)
    # id_task = results[0][0]

    if records == None:
        raise Exception("No se encontró el índice de la tarea solicitada")
    else:
        print(int(records[0][0]))
        return int(records[0][0])


def get_all_tasks_from_user(username):
    sql_query = """select tu.id, tu.username, t.name, t.description, t.date_task,
    t.status from task_user tu join task t on(t.id=tu.id)
    where tu.username='{}' and t.is_active=1 order by t.date_task asc"""
    records = select_query(sql_query.format(username), get_json=False)
    data = []
    for t in records:
        task = Task.Task(t[0], t[2], t[3], t[4], t[5])
        data.append(task_to_object(task))
    
    return str(data).replace("'", '"')

def get_all_tasks_for_today(today, username):
    sql_query = """select tu.id, tu.username, t.name, t.description, t.date_task,
    t.status from task_user tu join task t on(t.id=tu.id)
    where tu.username='{}' and t.is_active=1 and t.date_task = '{}' order by t.date_task asc"""
    records = select_query(sql_query.format(username, today), get_json=False)
    data = []
    for t in records:
        task = Task.Task(t[0], t[2], t[3], t[4], t[5])
        data.append(task_to_object(task))
    
    return str(data).replace("'", '"')

def get_all_tasks_to_do_for_today(today, username):
    sql_query = """select tu.id, tu.username, t.name, t.description, t.date_task,
    t.status from task_user tu join task t on(t.id=tu.id)
    where tu.username='{}' and t.is_active=1 and t.date_task = '{}' and status = 0 
    order by t.date_task asc"""
    records = select_query(sql_query.format(username, today), get_json=False)
    data = []
    for t in records:
        task = Task.Task(t[0], t[2], t[3], t[4], t[5])
        data.append(task_to_object(task))    
    return str(data).replace("'", '"')

def get_all_tasks_for_this_week(today, username):
    sql_query = """select tu.id, tu.username, t.name, t.description, t.date_task,
    t.status from task_user tu join task t on(t.id=tu.id)
    where tu.username='{}' and t.is_active=1 and week(date_task,3) = week('{}', 3)
    order by t.date_task asc"""
    records = select_query(sql_query.format(username, today), get_json=False)
    data = []
    for t in records:
        task = Task.Task(t[0], t[2], t[3], t[4], t[5])
        data.append(task_to_object(task))    
    return str(data).replace("'", '"')

def get_all_tasks_done(username):
    sql_query = """select tu.id, tu.username, t.name, t.description, t.date_task,
    t.status from task_user tu join task t on(t.id=tu.id)
    where tu.username='{}' and t.is_active=1 and t.status = 1
    order by t.date_task asc"""
    records = select_query(sql_query.format(username), get_json=False)
    data = []
    for t in records:
        task = Task.Task(t[0], t[2], t[3], t[4], t[5])
        data.append(task_to_object(task))    
    return str(data).replace("'", '"')

def get_all_tasks_for_this_week_to_do(today, username):
    sql_query = """select tu.id, tu.username, t.name, t.description, t.date_task,
    t.status from task_user tu join task t on(t.id=tu.id)
    where tu.username='{}' and t.is_active=1 
    and status = 0 and week(date_task,3) = week('{}', 3)
    order by t.date_task asc"""
    records = select_query(sql_query.format(username, today), get_json=False)
    data = []
    for t in records:
        task = Task.Task(t[0], t[2], t[3], t[4], t[5])
        data.append(task_to_object(task))    
    return str(data).replace("'", '"')

def get_all_tasks_to_do(username):
    sql_query = """select tu.id, tu.username, t.name, t.description, t.date_task,
    t.status from task_user tu join task t on(t.id=tu.id)
    where tu.username='{}' and t.is_active=1 and t.status = 0
    order by t.date_task asc"""
    records = select_query(sql_query.format(username), get_json=False)
    data = []
    for t in records:
        task = Task.Task(t[0], t[2], t[3], t[4], t[5])
        data.append(task_to_object(task))    
    return str(data).replace("'", '"')


def update_task(task, username):
    print(task.my_base())
    sql_query = """update task 
    set name = '{}',
    description = '{}',
    date_task = '{}',
    status = {}
    where id = {} """
    query(sql_query.format(task.name, task.description, task.date_task, task.status, task.id_task))

def delete_task_from_user(id_task):
    sql_query = "update task set is_active=0 where id={}".format(id_task)
    query(sql_query)

def delete_all_tasks_from_user(username):
    sql_query = ""  # seguir...
    query(sql_query)
    pass

def remove_task_by_id(id_task):
    sql_query = "update task set is_active = 0 where id={}".format(id_task)
    query(sql_query)

# t as task()
def task_to_object(t):
    return {"id": t.id_task, "name": t.name, "description": t.description, "date": date_to_js_format(t.date_task), "status": t.status}


def date_to_js_format(date_task):
    months = ["Enero", "Feb.", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Set.", "Oct.", "Nov.", "Dic."]
    # month = date_task.month
    # print(type(month))
    # if month < 10: month = str("0" + month)

    # day = date_task.day
    # if day < 10: day = str("0" + day)

    return str(date_task.year) + "-" + str(date_task.month) + "-" + str(date_task.day)

    # return str(date_task.day) + " de " + str(months[date_task.month - 1]) + ", " + str(date_task.year)
    pass

def create_new_user(username, keyValue):
    sql_query =  "select username from users where username = '{}'"
    records = select_query(sql_query.format(username), get_json=False)
    if len(records) != 0:
        print(len(records))
        return [False, "Ya existe un usuario con este nombre."]
    
    sql_query_insert_user = "insert into users (username,keyValue) values('{}', '{}')"
    query(sql_query_insert_user.format(username, keyValue))
    return [True, "Usuario creado correctamente."]
