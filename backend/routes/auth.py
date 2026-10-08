from flask import Blueprint, request, jsonify

from database.models import (
    create_user,
    find_user_by_email
)

from utils.security_utils import (
    validate_email,
    validate_password,
    password_contains_name,
    hash_password,
    verify_password
)

auth_bp = Blueprint("auth", __name__)


# =========================
# REGISTER
# =========================

@auth_bp.route("/register", methods=["POST"])
def register():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request data is required."
            }), 400

        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        # Required fields
        if not name or not email or not password:
            return jsonify({
                "success": False,
                "message": "Name, email and password are required."
            }), 400

        # Email validation
        if not validate_email(email):
            return jsonify({
                "success": False,
                "message": "Please enter a valid email address."
            }), 400

        # Password validation
        if not validate_password(password):
            return jsonify({
                "success": False,
                "message": "Password must be at least 6 characters long and contain at least one number and one special character."
            }), 400

        # Password must not contain name
        if password_contains_name(password, name):
            return jsonify({
                "success": False,
                "message": "Password must not contain your name."
            }), 400

        # =====================================
        # CHECK IF EMAIL ALREADY EXISTS
        # =====================================

        existing_user = find_user_by_email(email)

        if existing_user:
            return jsonify({
                "success": False,
                "message": "An account with this email already exists. Please log in."
            }), 409

        # =====================================
        # CREATE NEW USER
        # =====================================

        password_hash = hash_password(password)

        user_id = create_user(
            name=name,
            email=email,
            password_hash=password_hash
        )

        return jsonify({
            "success": True,
            "message": "Registration successful. Please log in.",
            "user_id": user_id
        }), 201

    except Exception as e:

        print("REGISTER ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Something went wrong during registration."
        }), 500


# =========================
# LOGIN
# =========================

@auth_bp.route("/login", methods=["POST"])
def login():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request data is required."
            }), 400

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        # Required fields
        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Email and password are required."
            }), 400

        # Email validation
        if not validate_email(email):
            return jsonify({
                "success": False,
                "message": "Please enter a valid email address."
            }), 400

        # Find user
        user = find_user_by_email(email)

        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401

        # Verify password
        if not verify_password(
            password,
            user["password_hash"]
        ):
            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401

        return jsonify({
            "success": True,
            "message": "Login successful.",
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"]
            }
        }), 200

    except Exception as e:

        print("LOGIN ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Something went wrong during login."
        }), 500