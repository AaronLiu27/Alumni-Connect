from flask import Flask
from flask import render_template, request
from flask_restx import Resource, Api

from flask_pymongo import PyMongo

import logging

app = Flask(__name__)
app.config["DEBUG"] = True
app.config.from_object("db")
app.config.from_object("settings")

logging.basicConfig(level=logging.DEBUG, format=app.config["LOGGING_FORMAT"])
logger = logging.getLogger(__name__)

mongo = PyMongo(app)

api = Api(app)


users = {"admin": "000"}


@api.route("/global-data")
class Hello(Resource):
    def get(self):
        return {"num_of_users": len(users)}


@api.route("/auth")
class Auth(Resource):
    def post(self):
        user_input = request.form.get("username")
        pwd_input = request.form.get("password")
        # return {user_input: pwd_input}
        if user_input not in users:
            return {"result": "no such user"}
        elif users[user_input] != pwd_input:
            return {"result": "wrong password"}
        else:
            return {"result": "login successfully"}


@api.route("/register-to-db")
class Register(Resource):
    def post(self):
        user_input = request.form.get("username")
        pwd_input = request.form.get("password")

        # add new user to db
        users[user_input] = pwd_input
        return {"username": user_input, "password": users[user_input]}


@api.route("/comment")
class Comment(Resource):
    def post(self):
        return

    def get(self):
        return

    def put(self):
        return


@api.route("/profile")
class Profile(Resource):
    def post(self):
        return

    def get(self):
        return

    def put(self):
        return


@api.route("/posts")
class Posts(Resource):
    def post(self):
        return

    def get(self):
        return

    def put(self):
        return


@api.route("/diary")
class Diary(Resource):
    def post(self):
        return

    def get(self):
        return

    def put(self):
        return


@api.route("/messages")
class Messages(Resource):
    def post(self):
        return

    def get(self):
        return

    def put(self):
        return


###########
@app.route("/login", methods=["GET"])
def loginPage():
    return render_template("login.html")


@app.route("/register", methods=["GET"])
def registerPage():
    return render_template("register.html")


# ==================================#
# =============Testing==============#

# Mongodb test
@api.route("/dbtest")
class DBTest(Resource):
    def get(self):
        logger.debug(app.config["MONGO_URI"])
        user_col = mongo.db.users
        logger.debug(user_col.find({"name": "John"})[0])
        # user_col.insert({"name": "Tom"})
        return {"msg": "Connected to the database."}


# =============Testing==============#
# ==================================#

if __name__ == "__main__":
    app.run()
