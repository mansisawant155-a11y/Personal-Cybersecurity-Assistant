from datetime import datetime
from database.connection import get_database
from pymongo.errors import DuplicateKeyError


# =========================
# USERS COLLECTION
# =========================

def get_users_collection():

    db = get_database()

    users = db["users"]

    # Make email unique
    users.create_index(
        "email",
        unique=True
    )

    return users


# =========================
# SCAN HISTORY COLLECTION
# =========================

def get_scan_history_collection():

    db = get_database()

    return db["scan_history"]


# =========================
# CREATE USER
# =========================

def create_user(
    name,
    email,
    password_hash
):

    users = get_users_collection()

    user = {
        "name": name,
        "email": email,
        "password_hash": password_hash,
        "created_at": datetime.utcnow()
    }

    try:

        result = users.insert_one(user)

        return str(result.inserted_id)

    except DuplicateKeyError:

        # Email already exists
        return None


# =========================
# FIND USER BY EMAIL
# =========================

def find_user_by_email(email):

    users = get_users_collection()

    return users.find_one({
        "email": email
    })


# =========================
# SAVE SCAN HISTORY
# =========================

def save_scan_history(
    user_id,
    tool_name,
    target,
    result
):

    scan_history = get_scan_history_collection()

    history = {
        "user_id": user_id,
        "tool_name": tool_name,
        "target": target,
        "result": result,
        "created_at": datetime.utcnow()
    }

    inserted = scan_history.insert_one(history)

    return str(inserted.inserted_id)


# =========================
# GET USER SCAN HISTORY
# =========================

def get_user_scan_history(user_id):

    scan_history = get_scan_history_collection()

    history = scan_history.find(
        {
            "user_id": user_id
        }
    ).sort(
        "created_at",
        -1
    )

    return list(history)