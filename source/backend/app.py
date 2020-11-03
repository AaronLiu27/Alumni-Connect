import os

from flask import Flask
from flask_restx import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from source.backend.db import mongo

import logging

# namespaces
from source.backend.users import api as ns_users
from source.backend.profiles import api as ns_profiles
from source.backend.posts import api as ns_posts
from source.backend.auth import api as ns_auth

app = Flask(__name__)
CORS(app)
app.config.from_object("source.backend.settings")
app.config.from_object("source.backend.db")
app.config.from_object("source.backend.auth")

mongo.init_app(app)

logging.basicConfig(level=logging.DEBUG, format=app.config["LOGGING_FORMAT"])
logger = logging.getLogger(__name__)

api = Api(app)
api.add_namespace(ns_users)
api.add_namespace(ns_profiles)
api.add_namespace(ns_posts)
api.add_namespace(ns_auth)

users = {"admin": "000"}

jwt = JWTManager(app)


if __name__ == "__main__":
    host = '0.0.0.0'
    port = int(os.environ.get('PORT', 5000))
    app.run(
        host=host,
        port=port
    )
