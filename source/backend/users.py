from flask import request, abort, redirect, url_for
from flask_restx import Namespace, Resource, fields

from flask_jwt_extended import jwt_required, get_jwt_identity

from source.backend.auth import auth_parser, auth_fields, register_fields
import source.backend.db as db

from bson.objectid import ObjectId

import logging

import hashlib
from passlib.context import CryptContext

logger = logging.getLogger(__name__)
mongo = db.mongo

api = Namespace("users", description="User related routes", path="/api/users")

user = api.model(
    "User",
    {
        "_id": fields.String(description="User ID"),
        "username": fields.String(required=True, description="Username"),
        "email": fields.String(),
        "passwd": fields.String(required=True, description="Password"),
        "avatar": fields.String(),
    },
)

USERS = [

]


class UserUtil:
    pwd_context = CryptContext(
        schemes=["pbkdf2_sha256"],
        default="pbkdf2_sha256",
        pbkdf2_sha256__default_rounds=30000,
    )

    @staticmethod
    def gravatar(email, size=100, default="identicon", rating="g"):
        url = "http://www.gravatar.com/avatar"
        hashed_email = hashlib.md5(email.encode("utf-8")).hexdigest()
        return "{url}/{hash}?s={size}&d={default}&r={rating}".format(
            url=url,
            hash=hashed_email,
            size=size,
            default=default,
            rating=rating
        )

    @staticmethod
    def encrypt_password(password):
        return UserUtil.pwd_context.hash(password)

    @staticmethod
    def check_encrypted_password(password, hashed):
        return UserUtil.pwd_context.verify(password, hashed)


@api.route("/")
class Users(Resource):
    @jwt_required
    @api.doc(parser=auth_parser)
    @api.marshal_list_with(user, mask="_id,username")
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

    @api.expect(body=register_fields)
    def post(self):
        """Create a new user
        Payload:
        `username`: required
        `passwd`: required
        `email`: optional

        Returns:
            Access token(if success)
        """
        payload = request.get_json(force=True)
        logger.debug(payload)
        if not payload:
            return abort(400, "Bad Request")

        username = payload["username"]
        password = payload["passwd"]
        email = payload.get("email", "")

        user_col = mongo.db.users
        if user_col.find_one({"username": username}):
            return abort(400, "Usernmae already exists.")
        if email and user_col.find_one({"email": email}):
            return abort(400, "Email already exists.")

        user_new = {}
        user_new["username"] = username
        user_new["passwd"] = password
        user_new["email"] = email
        user_new["avatar"] = UserUtil.gravatar(email) if email else ""

        user_added = user_col.insert_one(user_new)
        user_new["_id"] = user_added.inserted_id

        logger.debug(user_new)
        if user_added:
            return redirect(
                url_for("auth_login"),
                code=307
            )
        return abort(500, "Failed to create user.")


@api.route("/user/<userid>")
class User(Resource):
    @jwt_required
    @api.doc(parser=auth_parser)
    @api.marshal_with(user, mask="_id,username,email,avatar")
    def get(self, userid):
        """Get User by userID"""

        if not userid:
            return abort(400, "Bad request.")
        user_col = mongo.db.users
        target_user = user_col.find_one({"_id": ObjectId(userid)})
        if target_user:
            return target_user, 200
        else:
            return abort(404, "User Not Found.")


@api.route("/user/me")
class Me(Resource):
    @jwt_required
    @api.doc(parser=auth_parser)
    def get(self):
        current_user = get_jwt_identity()
        return {"_id": current_user}


if __name__ == "__main__":
    print(api.path)
    print(UserUtil.gravatar("john@gmail.com"))
    print(UserUtil.encrypt_password("abc"))
    print(UserUtil.encrypt_password("abc"))
