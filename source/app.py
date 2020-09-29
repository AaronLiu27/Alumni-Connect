from flask import Flask
from flask import render_template, request
from flask_restx import Resource, Api

app = Flask(__name__)
app.config["DEBUG"] = True

api = Api(app)

users = {'admin': '000'}

@api.route("/hello")
class Hello(Resource):
    def get(self):
        return {"hello": "world"}

@api.route("/auth")
class Auth(Resource):
    def post(self):
        user_input = request.form.get("username")
        pwd_input = request.form.get("password")
        #return {user_input: pwd_input}
        if (user_input not in users):
            return {"result": "no such user"}
        elif (users[user_input] != pwd_input):
            return {"result": "wrong password"}
        else:
            return {"result": "login successfully"}

@api.route("/register_to_db")
class Register(Resource):
    def post(self):
        user_input = request.form.get("username")
        pwd_input = request.form.get("password")
        users[user_input] = pwd_input
        return {"username":user_input, "password":users[user_input]}


##############
@app.route("/login", methods=['GET'])
def loginPage():
    return render_template("login.html")

@app.route("/register", methods=['GET'])
def registerPage():
    return render_template("register.html")

    


if __name__ == "__main__":
    app.run()
