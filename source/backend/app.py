from flask import Flask
from flask_restx import Api
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
app.config.from_object("settings")
app.config.from_object("db")
app.config.from_object("auth")

mongo.init_app(app)

logging.basicConfig(level=logging.DEBUG, format=app.config["LOGGING_FORMAT"])
logger = logging.getLogger(__name__)

api = Api(app)
api.add_namespace(ns_users)
api.add_namespace(ns_profiles)
api.add_namespace(ns_auth)

users = {"admin": "000"}

jwt = JWTManager(app)


if __name__ == "__main__":
    app.run(
        host=app.config["HOST"] or "0.0.0.0",
        port=app.config["PORT"] or 5000
    )
