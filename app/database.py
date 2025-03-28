from env import MONGO_DB, MONGO_URI
from pymongo import MongoClient

client = MongoClient(MONGO_URI)

db = client[MONGO_DB]
