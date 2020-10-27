from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    MONGO_URI = "mongodb+srv://" + \
        "vivian:123456a@alumniconnect.usbk3.mongodb.net" + \
        "/db?retryWrites=true&w=majority"


mongo = PyMongo(connect=False)
