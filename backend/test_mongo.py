import os
from dotenv import load_dotenv
from pymongo import MongoClient
import certifi

# Load .env from project root
load_dotenv(
    os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        ".env"
    )
)

mongo_url = os.getenv("MONGO_URL")

print("MONGO_URL loaded:", bool(mongo_url))

try:

    client = MongoClient(
        mongo_url,
        tls=True,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=10000
    )

    client.admin.command("ping")

    print("MongoDB connection successful!")
    print("Ping successful!")

except Exception as e:

    print("MongoDB connection failed:")
    print(e)