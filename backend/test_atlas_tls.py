import os
import ssl
import socket
import certifi

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv(
    os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        ".env"
    )
)

mongo_url = os.getenv("MONGO_URL")

print("========================================")
print("MONGODB ATLAS TLS DIAGNOSTIC TEST")
print("========================================")

print("\n1. Python SSL information")
print("----------------------------------------")
print("Python SSL version:", ssl.OPENSSL_VERSION)
print("TLS minimum version:", ssl.TLSVersion.TLSv1_2)
print("Certifi CA file:", certifi.where())


print("\n2. MongoDB URL check")
print("----------------------------------------")

if mongo_url:
    print("MONGO_URL loaded: YES")
else:
    print("MONGO_URL loaded: NO")
    raise SystemExit


print("\n3. DNS check")
print("----------------------------------------")

host = "ac-ali8i2o-shard-00-00.2lvnqye.mongodb.net"

try:

    ip_address = socket.gethostbyname(host)

    print("Hostname:", host)
    print("Resolved IP:", ip_address)
    print("DNS resolution: SUCCESS")

except Exception as error:

    print("DNS resolution: FAILED")
    print(error)


print("\n4. MongoDB TLS connection")
print("----------------------------------------")

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

    print("MongoDB Atlas connection: SUCCESS")
    print("TLS handshake: SUCCESS")
    print("MongoDB ping: SUCCESS")

except Exception as error:

    print("MongoDB Atlas connection: FAILED")
    print("\nExact error:")
    print(error)


print("\n========================================")
print("DIAGNOSTIC TEST COMPLETED")
print("========================================")