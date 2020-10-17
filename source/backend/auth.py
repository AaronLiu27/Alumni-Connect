from flask import request, abort, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
)
import db

api = Namespace("auth", description="Profile related routes", path="/api/auth")

mongo = db.mongo

auth_fields = api.model(
    "UserAuth",
    {
        "username": fields.String(required=True, description="User Name"),
        "passwd": fields.String(required=True, description="Password"),
    },
)


@api.route("/login")
class Login(Resource):
    @api.expect(auth_fields)
    def post(self):
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400

        username = request.json.get("username", None)
        password = request.json.get("passwd", None)
        if not username:
            return jsonify({"msg": "Missing username parameter", "status": 400})
        if not password:
            return jsonify({"msg": "Missing password parameter", "status": 400})

        # check username and password
        user_col = mongo.db.users
        target_user = user_col.find_one({"username": username, "passwd": password})
        if target_user:
            access_token = create_access_token(identity=username)
            return jsonify(access_token=access_token, status=200)
        else:
            return abort(404, "Wrong Username Or Password.")
        """
        if username != 'test' or password != 'test':
            return jsonify({"msg": "Bad username or password","status":401})
        """


parser = api.parser()
parser.add_argument(
    "Authorization",
    type=str,
    location="headers",
    help="Bearer Access Token",
    required=True,
)


@api.route("/protected")
class Protected(Resource):
    @jwt_required
    @api.doc(parser=parser)
    def get(self):
        current_user = get_jwt_identity()
        return {"success": current_user}

