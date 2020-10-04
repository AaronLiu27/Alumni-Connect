# from flask import Flask
# from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

# import logging

# logging.basicConfig(
# level=logging.DEBUG, format="%(asctime)s : %(name)s : %(levelname)s - %(message)s"
# )

# Load private environment configuration
# You need your own .env file
load_dotenv()
uname = os.getenv("DB_USER")
passwd = os.getenv("DB_PASSWD")
dbname = "db"

MONGO_URI = f"mongodb+srv://{uname}:{passwd}@alumniconnect.usbk3.mongodb.net/{dbname}?retryWrites=true&w=majority"
