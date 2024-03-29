# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, json, send_from_directory, jsonify, Response
import ControllerDB
from models import Task
from flask_cors import CORS, cross_origin
import datetime, os
from config import Config

app = Flask(__name__)
CORS(app)   # permit all origins

@app.route("/", methods = ["GET"])
def index():
    # return render_template("buildingPage.html")
    return render_template("index.html", title = "Inicio")

@app.route("/insert_task", methods = ["GET"])
def get_insert_task():
    # return render_template("buildingPage.html")
    return render_template("insertTask.html", title = "Ingreso de Tareas")

@app.route("/modify_my_tasks", methods = ["GET"])
def get_modify_my_tasks():
    return render_template("modifyMyTasks.html", title = "Editar Mis Tareas")

@app.route("/sign_in", methods = ["GET"])
def get_sign_in():
    return render_template("sign_in.html", title = "Registro")

@app.route("/quick_tasks", methods = ["GET"])
def get_quick_tasks():
    return render_template("quick_tasks.html", title = "Tareas rápidas")

@app.route("/function_sign_in", methods = ["POST"])
def sign_in():
    try:
        data = request.get_json(force=True)
        resp = ControllerDB.create_new_user(data.get("new_username"), data.get("new_password"))        
        if resp[0]:
            return json.dumps({"status": True, "message": resp[1]}, ensure_ascii= False)
        else:
            return json.dumps({"status": False, "message": resp[1]}, ensure_ascii= False)

    except Exception as e:
        print(e)
        return json.dumps({"status": False, "message": "Se produjo un error interno."}, ensure_ascii= False)

# Provisorie:
# @app.route("/index", methods = ["GET"])
# def get_index_page():
#     #return render_template("index.html")
#     try:
#         return ControllerDB.get_task_id("Practico 1 GAL", "Repdede")
#     except Exception as e:
#         return str(e)
    

@app.route("/auth", methods = ["POST"])
def authentication():
    try:
        data = request.get_json(force=True)
        authentication = ControllerDB.authentication(data.get("username"), data.get("psw"))
        if authentication: return json.dumps({"status": True, "error": ""}, ensure_ascii= False)
        else: return json.dumps({"status": False, "error": ""}, ensure_ascii= False)
    except Exception as e:
        print(e)
        return json.dumps({"status": False, "error": str(e)}, ensure_ascii= False)
        # return str(e)

@app.route("/get_tasks_from_<username>", methods=["GET"])
def get_all_tasks_from_user(username):
    final_username = str(username)
    try:
        records = ControllerDB.get_all_tasks_from_user(final_username)
        return str(records)
    except Exception as e:
        return str(e)

@app.route("/get_all_tasks_for_<today>_from_<username>", methods=["GET"])
def get_all_tasks_for_today(today, username):
    final_username = str(username)
    try:
        records = ControllerDB.get_all_tasks_for_today(today, final_username)
        return str(records)
    except Exception as e:
        return str(e)

@app.route("/get_all_tasks_to_do_for_<today>_from_<username>", methods=["GET"])
def get_all_tasks_to_do_for_today(today, username):
    final_username = str(username)
    try:
        records = ControllerDB.get_all_tasks_to_do_for_today(today, final_username)
        return str(records)
    except Exception as e:
        return str(e)

@app.route("/get_all_tasks_for_this_week_from_<username>_actualdate_<today>", methods=["GET"])
def get_all_tasks_for_this_week(username, today):
    final_username = str(username)
    try:
        records = ControllerDB.get_all_tasks_for_this_week(today, final_username)
        return str(records)
    except Exception as e:
        return str(e)

@app.route("/get_all_tasks_for_this_week_to_do_from_<username>_actualdate_<today>", methods=["GET"])
def get_all_tasks_for_this_week_to_do(username, today):
    final_username = str(username)
    try:
        records = ControllerDB.get_all_tasks_for_this_week_to_do(today, final_username)
        return str(records)
    except Exception as e:
        return str(e)

@app.route("/get_all_tasks_done_from_<username>", methods=["GET"])
def get_all_tasks_done(username):
    final_username = str(username)
    try:
        records = ControllerDB.get_all_tasks_done(final_username)
        return str(records)
    except Exception as e:
        return str(e)

@app.route("/get_all_tasks_to_do_from_<username>", methods=["GET"])
def get_all_tasks_to_do(username):
    final_username = str(username)
    try:
        records = ControllerDB.get_all_tasks_to_do(final_username)
        return str(records)
    except Exception as e:
        return str(e)

@app.route("/insert_task", methods=["POST"])
def insert_task():
    data = request.get_json(force=True)
    task = Task.Task(None, data.get("name"), data.get("description"), data.get("date_task"), status=False)
    try:
        ControllerDB.insert_task(task, data.get("username"))
        return json.dumps({"status": True}, ensure_ascii= False)
        
    except Exception as e:
        print(e)
        return json.dumps({"status": False}, ensure_ascii= False)
    # return json.dumps({ "data": message }, ensure_ascii= False)


@app.route("/update_task", methods=["POST"])
def update_task():
    data = request.get_json(force=True)
    task = Task.Task(data.get("id"), data.get("name"), data.get("description"), data.get("date_task"), data.get("status"))
    try:
        ControllerDB.update_task(task, data.get("username"))
        return json.dumps({"status": True}, ensure_ascii= False)
    except Exception as e:
        print(e)
        return json.dumps({"status": False}, ensure_ascii= False)

@app.route("/change_status_of_all_tasks_to_done", methods = ["POST"])
def change_status_of_all_tasks_to_done():
    req = request.get_json(force=True)
    username = req.get("username")
    # (add webToken validation...)
    # key = str(req.get("key_value"))
    try:
        ControllerDB.change_status_of_all_tasks_to_done(username)
        return json.dumps({ "status": True }, ensure_ascii= False)
    except Exception as e:
        print(e)
        return json.dumps({ "status": False }, ensure_ascii= False)


##############################################################################
# Out of use:
@app.route("/delete_task_from_user", methods=["POST"])
def delete_task_from_user():
    req = request.get_json(force=True)
    username = req.get("username")
    key = str(req.get("key_value"))
    try:
        authentication = ControllerDB.authentication(username, key)
        if authentication:
            print("autenticacion ok")
            ControllerDB.delete_task_from_user(req.get("id_task"))
            return "Tarea borrada exitosamente!"
        #return str(req)
        
    except Exception as e:
        print(e)
        return str(e)
##############################################################################        

@app.route("/delete_task_by_id_<id>", methods = ["GET"])
def delete_task_by_id(id):
    final_id = str(id)
    try:
        ControllerDB.remove_task_by_id(final_id)
        return json.dumps({"status": True}, ensure_ascii = False)
    except Exception as e:
        return json.dumps({"status": False}, ensure_ascii = False)
    # return json.dumps({ "data": message }, ensure_ascii= False)

##############################################################################    
@app.route("/delete_all_tasks_from_user", methods = ["POST"])
def delete_all_tasks_from_user():
    # missing authentication...
    req = request.get_json(force=True)
    username = req.get("username")
    # ....
    try:
        ControllerDB.delete_all_tasks_from_user(username)
        return json.dumps({"status": True}, ensure_ascii = False)
        print(f"Se realizó una baja lógica de todas las tareas del usuario { username }")
    except Exception as e:
        return json.dumps({ "status": False }, ensure_ascii = False)

# return css and static files:
@app.route('/public/<path:path>')
def send_css_and_media(path):
    return send_from_directory('public', path)

@app.errorhandler(404)
def page_not_found(error):
    # return html file "Error 404: This file doesnt exists"
    return render_template("404errorPage.html")

def test():
    app.run(debug=True)

def run():
    app.run(debug=False)

if __name__ == '__main__':
    if (Config.config.get("debug_mode")):
        test()
    else: 
        run()
