from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    MONGO_URI = os.environ.get("MONGO_URI")


mongo = PyMongo(connect=False)
