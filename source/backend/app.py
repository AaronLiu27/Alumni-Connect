from flask import Flask
from flask import render_template, request
from flask_restx import Resource, Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from db import mongo

import logging

# namespaces
from users import api as ns_users
from profiles import api as ns_profiles
from auth import api as ns_auth

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True
app.config.from_object("db")
app.config.from_object("settings")
app.config.from_object("auth")

mongo.init_app(app)

logging.basicConfig(level=logging.DEBUG, format=app.config["LOGGING_FORMAT"])
logger = logging.getLogger(__name__)

api = Api(app)
api.add_namespace(ns_users)
api.add_namespace(ns_profiles)
api.add_namespace(ns_auth)

users = {"admin": "000"}


app.config["JWT_SECRET_KEY"] = "iwjnDcjwei1374jfnu@#hfhq384"
jwt = JWTManager(app)


@api.route("/register-to-db")
class Register(Resource):
    def post(self):
        user_input = request.form.get("username")
        pwd_input = request.form.get("password")

        # add new user to db
        users[user_input] = pwd_input
        return {"username": user_input, "password": users[user_input]}


###########
@app.route("/login", methods=["GET"])
def loginPage():
    return render_template("login.html")


@app.route("/register", methods=["GET"])
def registerPage():
    return render_template("register.html")


if __name__ == "__main__":
    app.run(host=(app.config["HOST"] or "0.0.0.0"))
