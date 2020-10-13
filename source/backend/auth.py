from flask import request, abort, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
import db

api = Namespace("auth", description="Profile related routes", path="/api/auth")

mongo = db.mongo

@api.route('/login')
class Login(Resource):
    def post(self):
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        
        username = request.json.get('username', None)
        password = request.json.get('password', None)
        if not username:
            return jsonify({"msg": "Missing username parameter","status":400})
        if not password:
            return jsonify({"msg": "Missing password parameter","status":400})

        #check username and password
        user_col = mongo.db.users
        target_user = user_col.find_one({"username":username, "passwd":password})
        if target_user:
            access_token = create_access_token(identity=username)
            return jsonify(access_token=access_token, status = 200)    
        else:
            return abort(404,"Wrong Username Or Password.")
        '''
        if username != 'test' or password != 'test':
            return jsonify({"msg": "Bad username or password","status":401})
        '''
        

@api.route('/protected')
class Protected(Resource):
    @jwt_required
    def get(self):
        current_user = get_jwt_identity()
        return {'success':current_user}