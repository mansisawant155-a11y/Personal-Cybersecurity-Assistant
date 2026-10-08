import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URL = os.getenv("MONGO_URL")
    SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key")