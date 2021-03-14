# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, json, send_from_directory, jsonify, Response
import ControllerDB
from models import Task
import datetime
import os

app = Flask(__name__)

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

# Provisorie:
# @app.route("/index", methods = ["GET"])
# def get_index_page():
#     # task = Task.Task(1212, "Práctico 2 GAL1", "Sistemas Lineales", datetime.date.today(), True)
    
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

@app.route("/get_all_tasks_for_today_from_<username>", methods=["GET"])
def get_all_tasks_for_today(username):
    final_username = str(username)
    try:
        records = ControllerDB.get_all_tasks_for_today(final_username)
        return str(records)
    except Exception as e:
        return str(e)

@app.route("/get_all_tasks_to_do_for_today_from_<username>", methods=["GET"])
def get_all_tasks_to_do_for_today(username):
    final_username = str(username)
    try:
        records = ControllerDB.get_all_tasks_to_do_for_today(final_username)
        return str(records)
    except Exception as e:
        return str(e)

@app.route("/get_all_tasks_for_this_week_from_<username>", methods=["GET"])
def get_all_tasks_for_this_week(username):
    final_username = str(username)
    try:
        records = ControllerDB.get_all_tasks_for_this_week(final_username)
        return str(records)
    except Exception as e:
        return str(e)

@app.route("/get_all_tasks_for_this_week_to_do_from_<username>", methods=["GET"])
def get_all_tasks_for_this_week_to_do(username):
    final_username = str(username)
    try:
        records = ControllerDB.get_all_tasks_for_this_week_to_do(final_username)
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
    #test()
    run()
