import os
import ssl
from dotenv import load_dotenv
from pymongo import MongoClient
import certifi

load_dotenv(
    os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        ".env"
    )
)

mongo_url = os.getenv("MONGO_URL")

print("========================================")
print("MONGODB ATLAS TLS TEST")
print("========================================")

print("Python SSL:", ssl.OPENSSL_VERSION)
print("TLS 1.2 supported:", ssl.TLSVersion.TLSv1_2)

print("\nMongoDB URL loaded:", bool(mongo_url))
print("Certifi:", certifi.where())

print("\nTesting MongoDB Atlas connection...")

try:
    client = MongoClient(
        mongo_url,
        tls=True,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000
    )

    client.admin.command("ping")

    print("\nMongoDB Atlas TLS connection: SUCCESS")
    print("MongoDB ping: SUCCESS")

except Exception as error:
    print("\nMongoDB Atlas TLS connection: FAILED")
    print("\nExact error:")
    print(error)

finally:
    try:
        client.close()
    except:
        pass

print("\n========================================")
print("TEST COMPLETED")
print("========================================")