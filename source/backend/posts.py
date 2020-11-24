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
    "posts", description="Posts related routes",
    path="/api/posts"
)

post = api.model(
    "Post",
    {
        "_id": fields.String(description="Post ID"),
        "user": fields.String(description="Belong to user"),
        "username": fields.String(),
        "title": fields.String(),
        "content": fields.String(),
        "createtime": fields.DateTime(),
        "updatetime": fields.DateTime(),
        "tags": fields.List(fields.String()),
    },
)

tag = api.model(
    "Tag",
    {
        "tag": fields.String(required=True, description="searching tag")
    },
)

POSTS = []


@api.route("/")
class Posts(Resource):
    @api.marshal_list_with(post)
    def get(self):
        """Get all posts"""
        post_col = mongo.db.posts
        target_posts = list(post_col.find())
        logger.debug(target_posts)
        if not target_posts:
            abort(404, "No post founded.")
        else:
            return target_posts, 200


@api.route("/user/<userid>")
class PostsByUser(Resource):
    @api.marshal_list_with(post)
    def get(self, userid):
        """Get post by userid
        """
        if not userid:
            abort(400, "Bad request.")

        post_col = mongo.db.posts
        target_posts = list(post_col.find({"user": ObjectId(userid)}))
        logger.debug(target_posts)
        if not target_posts:
            abort(404, "No post founded.")
        else:
            return target_posts, 200

    @jwt_required
    @api.doc(parser=auth_parser, body=post)
    @api.marshal_with(post)
    def post(self, userid):
        """Create a new post for the user identified by userid
        """
        if not userid:
            abort(400, "Bad request.")

        current_userid = get_jwt_identity()
        if current_userid != userid:
            abort(401, "Not authorized.")

        user_col = mongo.db.users
        post_col = mongo.db.posts

        target_user = user_col.find_one({"_id": ObjectId(userid)})
        if not target_user:
            abort(404, "User not found.")

        currenttime = datetime.datetime.now()

        post_new = {}
        post_new["user"] = ObjectId(userid)
        post_new["username"] = target_user["username"]
        post_new["title"] = request.json.get("title")
        post_new["content"] = request.json.get("content")
        post_new["createtime"] = currenttime
        post_new["updatetime"] = currenttime
        post_new["tags"] = request.json.get("tags")

        if not post_new["content"]:
            abort(400, "Content missing.")

        post_added = post_col.insert_one(post_new)
        post_new["_id"] = post_added.inserted_id

        if post_added:
            return post_new, 200
        else:
            abort(500, "Failed to create post.")


@api.route("/post/<postid>")
class Post(Resource):
    @api.marshal_with(post)
    def get(self, postid):
        """Get post by id"""
        post_col = mongo.db.posts
        postquery = {"_id": ObjectId(postid)}
        target_post = post_col.find_one(postquery)
        logger.debug(target_post)
        if not target_post:
            abort(404, "No post founded.")
        else:
            return target_post, 200

    @jwt_required
    @api.doc(parser=auth_parser, body=post)
    @api.marshal_with(post)
    def put(self, postid):
        """Update a post by postid
        """
        if not postid:
            abort(400, "Bad request.")

        post_col = mongo.db.posts

        postquery = {"_id": ObjectId(postid)}

        target_post = post_col.find_one(postquery)
        if not target_post:
            abort(404, "Post not found.")

        userid = str(target_post["user"])

        current_userid = get_jwt_identity()
        if current_userid != userid:
            abort(401, "Not authorized.")

        post_update = {}
        post_update["user"] = target_post["user"]
        post_update["username"] = target_post["username"]
        post_update["title"] = request.json.get("title")
        post_update["content"] = request.json.get("content")
        post_update["createtime"] = target_post["createtime"]
        post_update["updatetime"] = datetime.datetime.now()
        post_update["tags"] = request.json.get("tags")

        result = post_col.update_one(postquery, {"$set": post_update})

        if result:
            logger.debug(post_update)
            return post_update, 200
        else:
            abort(500, "Failed to create post.")

    @jwt_required
    @api.doc(parser=auth_parser)
    @api.marshal_with(post)
    def delete(self, postid):
        """Delete the post by postid
        """
        if not postid:
            abort(400, "Bad request.")

        post_col = mongo.db.posts

        postquery = {"_id": ObjectId(postid)}

        target_post = post_col.find_one(postquery)
        if not target_post:
            abort(404, "Post not found.")

        userid = str(target_post["user"])

        current_userid = get_jwt_identity()
        if current_userid != userid:
            abort(401, "Not authorized.")

        result = post_col.delete_one(postquery)
        logger.debug(result)
        if result:
            return {"success": "Post deleted."}, 200
        else:
            abort(500, "Failed to delete post.")


@api.route("/tag")
class PostsByTag(Resource):
    @api.doc(body=tag)
    @api.marshal_list_with(post)
    def get(self):
        """Get post by tag
        """
        if not request.is_json:
            abort(400, "Json not found")

        search_tag = request.json.get("tag")

        post_col = mongo.db.posts
        target_posts = list(post_col.find({"tags": search_tag}))
        logger.debug(target_posts)
        if not target_posts:
            abort(404, "No post founded.")
        else:
            return target_posts, 200
