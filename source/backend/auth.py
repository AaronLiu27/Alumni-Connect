from flask import request, abort, jsonify, redirect, url_for
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import (
    jwt_required,
    # fresh_jwt_required,
    jwt_refresh_token_required,
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
)
from source.backend.db import mongo
import datetime

RESTX_VALIDATE = True

api = Namespace("auth", description="auth related routes", path="/api/auth")

auth_fields = api.model(
    "UserAuth",
    {
        "username": fields.String(required=True, description="User Name"),
        "passwd": fields.String(required=True, description="Password"),
    },
)

register_fields = api.model(
    "UserRegister",
    {
        "username": fields.String(required=True, description="User Name"),
        "passwd": fields.String(required=True, description="Password"),
        "email": fields.String(description="Email")
    }
)

auth_parser = api.parser()
auth_parser.add_argument(
    "Authorization",
    type=str,
    location="headers",
    help="Bearer Access Token",
    required=True,
)

expires_access = datetime.timedelta(days=1)
expires_refresh = datetime.timedelta(days=2)


@api.route("/login")
class Login(Resource):
    @api.expect(auth_fields)
    def post(self):
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400

        username = request.json.get("username", None)
        password = request.json.get("passwd", None)
        if not username:
            return jsonify({
                "msg": "Missing username parameter",
                "status": 400
            })
        if not password:
            return jsonify({
                "msg": "Missing password parameter",
                "status": 400
            })

        # check username and password
        user_col = mongo.db.users
        target_user = user_col.find_one(
            {"username": username, "passwd": password})
        if target_user:
            access_token = create_access_token(
                identity=str(target_user["_id"]),
                expires_delta=expires_access)
            refresh_token = create_refresh_token(
                identity=str(target_user["_id"]),
                expires_delta=expires_refresh)
            return {
                "user_id": str(target_user["_id"]),
                "access_token": access_token,
                "refresh_token": refresh_token
            }, 200
        else:
            return abort(401, "Wrong Username Or Password.")
        """
        if username != 'test' or password != 'test':
            return jsonify({"msg": "Bad username or password","status":401})
        """


@ api.route("/register")
class Register(Resource):
    @ api.expect(register_fields)
    def post(self):
        return redirect(
            url_for("users_users"),
            code=307
        )


@ api.route("/refresh")
class TokenRefresh(Resource):
    @ jwt_refresh_token_required
    def post(self):
        # retrive the user's identity from the refresh token
        # using a Flask-JWT-Extended built-in method
        current_user = get_jwt_identity()
        # return a non-fresh token for the user
        new_token = create_access_token(identity=current_user, fresh=False)
        return {"access_token": new_token}, 200


@ api.route("/protected")
class Protected(Resource):
    @ jwt_required
    @ api.doc(parser=auth_parser)
    def get(self):
        current_user = get_jwt_identity()
        return {"userId": current_user}
