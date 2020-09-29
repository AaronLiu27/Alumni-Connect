from flask import Flask
from flask import render_template
from flask_restx import Resource, Api

app = Flask(__name__)
app.config["DEBUG"] = True

api = Api(app)


@api.route("/hello")
class Hello(Resource):
    def get(self):
        return {"hello": "world"}


@app.route("/login", methods=['GET'])
def login():
    return render_template("login.html")
    


if __name__ == "__main__":
    app.run()
