# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, json, send_from_directory, jsonify, Response
import ControllerDB
from models import Task
import datetime

app = Flask(__name__)

@app.route("/", methods = ["GET"])
def index():
    return render_template("buildingPage.html")

# Provisorie:
@app.route("/index", methods = ["GET"])
def get_index_page():
    # task = Task.Task(1212, "Práctico 2 GAL1", "Sistemas Lineales", datetime.date.today(), True)
    
    #return render_template("index.html")
    try:
        return ControllerDB.get_task_id("Practico 1 GAL", "Repdede")
    except Exception as e:
        return str(e)
    

@app.route("/auth", methods = ["GET"])
def authentication():
    try:        
        authentication = ControllerDB.authentication("joaquin", "123")
        if authentication: return "autenticación ok!"
    except Exception as e:
        print(e)
        return str(e)

@app.route("/get_tasks_from_<username>", methods=["GET"])
def get_all_tasks_from_user(username):
    final_username = str(username)
    try:
        records = ControllerDB.get_all_tasks_from_user(final_username)
        return str(records)
    except Exception as e:
        return str(e)

@app.route("/insert_task", methods=["POST"])
def insert_task():
    data = request.get_json(force=True)
    task = Task.Task(None, data.get("name"), data.get("description"), data.get("date_task"), data.get("status"))
    try:
        ControllerDB.insert_task(task, data.get("username"))
        return str(data)
    except Exception as e:
        return str(e)
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
    test()
