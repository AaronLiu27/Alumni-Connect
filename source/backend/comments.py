from flask import request, abort
from flask_restx import Namespace, Resource, fields

from flask_jwt_extended import jwt_required, get_jwt_identity
from source.backend.auth import auth_parser

import source.backend.db as db
from bson.objectid import ObjectId

import logging
import datetime

logger = logging.getLogger(__name__)
mongo = db.mongo


api = Namespace(
    "comments", description="comments related routes",
    path="/api/comments"
)

comment = api.model(
    "Comment",
    {
        "_id": fields.String(description="comments ID"),
        "post": fields.String(description="related post ID"),
        "user": fields.String(description="user id"),
        "username": fields.String(),
        "content": fields.String(required=True),
        "createtime": fields.DateTime(),
        "updatetime": fields.DateTime(),
    },
)

COMMENTS = []


@api.route("/")
class Comments(Resource):
    @api.marshal_list_with(comment)
    def get(self):
        """Get all comments"""
        comment_col = mongo.db.comments
        target_comments = list(comment_col.find())
        logger.debug(target_comments)
        if not target_comments:
            abort(404, "No comments founded.")
        else:
            return target_comments, 200


@api.route("/post/<postid>")
class CommentsByPost(Resource):
    @api.marshal_list_with(comment)
    def get(self, postid):
        """Get comments by postid
        """
        if not postid:
            abort(400, "Bad request.")

        comment_col = mongo.db.comments
        target_comments = list(comment_col.find({"post": ObjectId(postid)}))
        logger.debug(target_comments)
        if not target_comments:
            abort(404, "No comments founded.")
        else:
            return target_comments, 200

    @jwt_required
    @api.doc(parser=auth_parser, body=comment)
    @api.marshal_with(comment)
    def post(self, postid):
        """Create a new comment for a post
        """
        if not postid:
            abort(400, "Bad request.")

        current_userid = get_jwt_identity()
        # if current_userid != userid:
        #    abort(401, "Not authorized.")

        user_col = mongo.db.users
        post_col = mongo.db.posts
        comment_col = mongo.db.comments

        target_post = post_col.find_one({"_id": ObjectId(postid)})
        if not target_post:
            abort(404, "post not found.")

        current_user = user_col.find_one({"_id": ObjectId(current_userid)})

        currenttime = datetime.datetime.now()

        comment_new = {}
        comment_new["post"] = ObjectId(postid)
        comment_new["user"] = ObjectId(current_userid)
        comment_new["username"] = current_user["username"]
        comment_new["content"] = request.json.get("content")
        comment_new["createtime"] = currenttime
        comment_new["updatetime"] = currenttime

        if not comment_new["content"]:
            abort(400, "Content missing.")

        comment_added = comment_col.insert_one(comment_new)
        comment_new["_id"] = comment_added.inserted_id

        if comment_added:
            return comment_new, 200
        else:
            abort(500, "Failed to create comment.")


@api.route("/comment/<commentid>")
class CommentById(Resource):
    # @jwt_required
    @api.marshal_list_with(comment)
    def get(self, commentid):
        comment_col = mongo.db.comments
        target_comments = list(comment_col.find({"_id": ObjectId(commentid)}))
        logger.debug(target_comments)
        if not target_comments:
            abort(404, "No comments founded.")
        else:
            return target_comments, 200

    @jwt_required
    @api.doc(parser=auth_parser, body=comment)
    @api.marshal_with(comment)
    def put(self, commentid):
        """Update a comment by id
        """
        if not commentid:
            abort(400, "Bad request.")

        comment_col = mongo.db.comments
        user_col = mongo.db.users

        commentquery = {"_id": ObjectId(commentid)}

        target_comment = comment_col.find_one(commentquery)
        if not target_comment:
            abort(404, "Comment not found.")

        creator_userid = str(target_comment["user"])
        current_userid = get_jwt_identity()
        current_user = user_col.find_one({"_id": ObjectId(current_userid)})

        if current_userid != creator_userid:
            abort(401, "You are not the creator of this comment.")

        currenttime = datetime.datetime.now()

        comment_update = {}
        comment_update["_id"] = target_comment["_id"]
        comment_update["post"] = target_comment["post"]
        comment_update["user"] = current_userid
        comment_update["username"] = current_user["username"]
        comment_update["content"] = request.json.get("content")
        comment_update["createtime"] = target_comment["createtime"]
        comment_update["updatetime"] = currenttime

        result = comment_col.update_one(commentquery, {"$set": comment_update})

        if result:
            logger.debug(comment_update)
            return comment_update, 200
        else:
            abort(500, "Failed to update.")

    @jwt_required
    @api.doc(parser=auth_parser)
    @api.marshal_with(comment)
    def delete(self, commentid):
        """Delete the post by postid
        """
        if not commentid:
            abort(400, "Bad request.")

        comment_col = mongo.db.comments

        commentquery = {"_id": ObjectId(commentid)}

        target_comment = comment_col.find_one(commentquery)
        if not target_comment:
            abort(404, "Comment not found.")

        creator_userid = str(target_comment["user"])
        current_userid = get_jwt_identity()
        if current_userid != creator_userid:
            abort(401, "You are not the creator of this comment.")

        result = comment_col.delete_one(commentquery)
        logger.debug(result)
        if result:
            return {"success": "Comment deleted."}, 200
        else:
            abort(500, "Failed to delete comment.")


@api.route("/user/<userid>")
class CommentsByUser(Resource):
    @api.marshal_list_with(comment)
    def get(self, userid):
        """Get comments by userid
        """
        if not userid:
            abort(400, "Bad request.")

        comment_col = mongo.db.comments
        target_comments = list(comment_col.find({"user": ObjectId(userid)}))
        logger.debug(target_comments)
        if not target_comments:
            abort(404, "No comments founded.")
        else:
            return target_comments, 200
