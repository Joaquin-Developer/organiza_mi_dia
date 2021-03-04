# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, json, send_from_directory, jsonify, Response
import ControllerDB

app = Flask(__name__)

@app.route("/", methods = ["GET"])
def index():
    return render_template("index.html")

# return css and static files:
@app.route('/public/<path:path>')
def send_css_and_media(path):
    return send_from_directory('public', path)

@app.errorhandler(404)
def page_not_found(error):
    # return html file "Error 404: This file doesnt exists"
    return render_template("404errorPage.html")

def api_test():
    app.run(debug=True)

def run():
    app.run(debug=False)

if __name__ == '__main__':
    api_test()
