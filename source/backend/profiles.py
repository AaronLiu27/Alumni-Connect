from flask import request, abort
from flask_restx import Namespace, Resource, fields

from flask_jwt_extended import jwt_required, get_jwt_identity
from source.backend.auth import auth_parser

import source.backend.db as db
from bson.objectid import ObjectId

import logging

logger = logging.getLogger(__name__)
mongo = db.mongo


api = Namespace(
    "profiles", description="Profile related routes",
    path="/api/profiles"
)

profile = api.model(
    "Profile",
    {
        "_id": fields.String(description="Profile ID"),
        "user": fields.String(required=True, description="Belong to user"),
        "firstname": fields.String(),
        "lastname": fields.String(),
        "age": fields.Integer(),
        "email": fields.String(),
        "discipline": fields.String(),
    },
)

PROFILES = []


@api.route("/profile/user/<userid>", endpoint="profile")
class Profile(Resource):
    @jwt_required
    @api.doc(parser=auth_parser)
    @api.marshal_with(profile)
    def get(self, userid):
        """Get profile by userid
        """
        profile_col = mongo.db.profiles
        target_profile = profile_col.find_one({"user": ObjectId(userid)})
        logger.debug(target_profile)
        if not target_profile:
            abort(404, "Profile not found.")
        else:
            return target_profile, 200

    @jwt_required
    @api.doc(parser=auth_parser, body=profile)
    @api.marshal_with(profile)
    def post(self, userid):
        """Create a new profile for the user identified by userid
        """
        current_userid = get_jwt_identity()
        if current_userid != userid:
            abort(401, "Not authorized.")

        profile_col = mongo.db.profiles

        target_profile = profile_col.find_one({"user": ObjectId(userid)})
        if target_profile:
            abort(400, "Profile already exists.")

        profile_new = {}
        profile_new["user"] = ObjectId(userid)
        profile_new["firstname"] = request.json.get("firstname")
        profile_new["lastname"] = request.json.get("lastname")
        profile_new["age"] = request.json.get("age")
        profile_new["email"] = request.json.get("email")
        profile_new["discipline"] = request.json.get("discipline")

        profile_added = profile_col.insert_one(profile_new)
        profile_new["_id"] = profile_added.inserted_id

        if profile_added:
            return profile_new, 200
        else:
            abort(500, "Failed to create profile.")

    @jwt_required
    @api.doc(parser=auth_parser, body=profile)
    @api.marshal_with(profile)
    def put(self, userid):
        """Update a profile for the user identified by userid
        """
        current_userid = get_jwt_identity()
        if current_userid != userid:
            abort(401, "Not authorized.")

        profile_col = mongo.db.profiles

        target_profile = profile_col.find_one({"user": ObjectId(userid)})
        if not target_profile:
            abort(404, "Profile not found.")

        myquery = {"user": ObjectId(userid)}
        profile_update = {}
        profile_update["_id"] = target_profile["_id"]
        profile_update["user"] = ObjectId(userid)
        profile_update["firstname"] = request.json.get("firstname")
        profile_update["lastname"] = request.json.get("lastname")
        profile_update["age"] = request.json.get("age")
        profile_update["email"] = request.json.get("email")
        profile_update["discipline"] = request.json.get("discipline")

        result = profile_col.update_one(myquery, {"$set": profile_update})

        if result:
            return profile_update, 200
        else:
            abort(500, "Failed to update profile.")

    @jwt_required
    @api.doc(parser=auth_parser)
    @api.marshal_with(profile)
    def delete(self, userid):
        """Delete the profile for the user identified by userid
        """
        current_userid = get_jwt_identity()
        if current_userid != userid:
            abort(401, "Not authorized.")

        profile_col = mongo.db.profiles

        profilequery = {"user": ObjectId(userid)}

        target_profile = profile_col.find_one(profilequery)
        logger.debug(target_profile)
        if not target_profile:
            abort(404, "Profile not found.")

        result = profile_col.delete_one(profilequery)
        logger.debug(result)
        if result:
            return {"success": "Profile deleted."}, 200
        else:
            abort(500, "Failed to delete profile.")
