from flask_pymongo import PyMongo

# from flask_mongoengine import MongoEngine

from dotenv import load_dotenv
import os

import json
from bson.objectid import ObjectId
import datetime

# Load private environment configuration
# You need your own .env file
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    MONGO_URI = "mongodb+srv://" + \
        "vivian:123456a@alumniconnect.usbk3.mongodb.net" + \
        "/db?retryWrites=true&w=majority"


class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, set):
            return list(obj)
        if isinstance(obj, datetime.datetime):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


mongo = PyMongo(connect=False)
