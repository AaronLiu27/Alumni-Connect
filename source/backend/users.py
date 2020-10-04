from flask import request, abort
from flask_restx import Namespace, Resource, fields
import json
import db
import logging
from bson.objectid import ObjectId
from flask_gravatar import Gravatar

import hashlib
from passlib.context import CryptContext

logger = logging.getLogger(__name__)
mongo = db.mongo

api = Namespace("users", description="User related routes")

user = api.model(
    "User",
    {
        "_id": fields.String(required=True, description="User ID"),
        "username": fields.String(required=True, description="Username"),
        "email": fields.String(),
        "passwd": fields.String(),
        "avatar": fields.String(),
    },
)

USERS = [
    {
        "_id": "5f7968905510ad91c3510870",
        "username": "john123",
        "email": "john@gmail.com",
        "passwd": "$pbkdf2-sha256$30000$c66Vcg5hzLn3nnOOsdaakw$xgqdzQ8K.vrC/BQ8ExhNu13lSR2coEVSpauLhoTrKZk",
        "avatar": "http://www.gravatar.com/avatar/1f9d9a9efc2f523b2f09629444632b5c?s=100&d=identicon&r=g",
    },
    {
        "_id": "5f7a3d5e41462499b1283a52",
        "username": "Tom2020",
        "email": "Tom2020@gmail.com",
        "passwd": "$pbkdf2-sha256$30000$kvJ.zzkHwHivtdbae8.5dw$dRyLdzymDkW2FjPHAAiXX27Z7K3YuRvOCKbhBOt6LGY",
        "avatar": "http://www.gravatar.com/avatar/ed52c8b513c402e201ad18a3b41d7a95?s=100&d=identicon&r=g",
    },
]


class UserUtil:
    pwd_context = CryptContext(
        schemes=["pbkdf2_sha256"],
        default="pbkdf2_sha256",
        pbkdf2_sha256__default_rounds=30000,
    )

    def gravatar(self, email, size=100, default="identicon", rating="g"):
        url = "http://www.gravatar.com/avatar"
        hashed_email = hashlib.md5(email.encode("utf-8")).hexdigest()
        return "{url}/{hash}?s={size}&d={default}&r={rating}".format(
            url=url, hash=hashed_email, size=size, default=default, rating=rating
        )

    def encrypt_password(self, password):
        return UserUtil.pwd_context.hash(password)

    def check_encrypted_password(self, password, hashed):
        return UserUtil.pwd_context.verify(password, hashed)


userUtil = UserUtil()


@api.route("/")
# @api.param('id')
# @api.response(404, 'User not found')
class Users(Resource):
    @api.doc("Fetch Users")
    @api.marshal_list_with(user)
    def get(self):
        """Fetch Users"""
        user_col = mongo.db.users
        users = user_col.find()
        USERS = list(users)
        logger.debug(USERS)

        if USERS:
            return USERS, 200
        else:
            return abort(404, "No users found.")

    @api.doc("Create a User")
    @api.marshal_with(user)
    def post(self):
        """Create a user"""
        if not request.form:
            return abort(400, "Bad Request")

        user_new = {}
        user_new["email"] = request.form.get("email")
        user_new["uname"] = request.form.get("username")
        user_new["passwd"] = request.form.get("password")
        user_new["avatar"] = userUtil.gravatar(user_new["email"])

        user_col = mongo.db.users
        user_added = user_col.insert_one(user_new)
        user_new["_id"] = user_added.inserted_id

        logger.debug(user_new)
        if user_added:
            return user_new, 200
        else:
            return abort(500, "Failed to create user.")


@api.route("/user/<userid>")
class User(Resource):
    @api.doc("Get user by userid")
    @api.marshal_with(user)
    def get(self, userid):
        if not userid:
            return abort(400, "Bad request.")
        user_col = mongo.db.users
        target_user = user_col.find_one({"_id": ObjectId(userid)})
        if target_user:
            return target_user, 200
        else:
            return abort(404, "User Not Found.")


if __name__ == "__main__":
    print(userUtil.gravatar("john@gmail.com"))
    print(userUtil.encrypt_password("abc"))
    print(userUtil.encrypt_password("abc"))
