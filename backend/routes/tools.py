from flask import Blueprint, request, jsonify

from services.password_service import create_password
from services.vulnerability_service import scan_vulnerabilities
from services.message_service import analyze_message
from services.file_service import get_file_info
from services.QR_service import get_QR_info
from services.web_service import analyze_website


tools_bp = Blueprint("tools", __name__)


# =========================
# PASSWORD SECURITY
# =========================

@tools_bp.route("/password", methods=["POST"])
def password_tool():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request data is required."
        }), 400

    password = data.get("password", "")

    if not password:
        return jsonify({
            "success": False,
            "message": "Password is required."
        }), 400

    result = create_password(password)

    return jsonify(result), 200


# =========================
# VULNERABILITY SCANNER
# =========================

@tools_bp.route("/vulnerability", methods=["POST"])
def vulnerability_tool():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request data is required."
        }), 400

    target = data.get("target", "").strip()

    if not target:
        return jsonify({
            "success": False,
            "message": "Target is required."
        }), 400

    result = scan_vulnerabilities(target)

    return jsonify(result), 200


# =========================
# MESSAGE SECURITY SCANNER
# =========================

@tools_bp.route("/message", methods=["POST"])
def message_tool():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request data is required."
        }), 400

    text = data.get("text", "").strip()

    if not text:
        return jsonify({
            "success": False,
            "message": "Message text is required."
        }), 400

    result = analyze_message(text)

    return jsonify(result), 200


# =========================
# FILE SECURITY SCANNER
# =========================

@tools_bp.route("/file", methods=["POST"])
def file_tool():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request data is required."
        }), 400

    filename = data.get("filename", "").strip()

    if not filename:
        return jsonify({
            "success": False,
            "message": "Filename is required."
        }), 400

    result = get_file_info(filename)

    return jsonify(result), 200


# =========================
# QR SECURITY SCANNER
# =========================

@tools_bp.route("/qr", methods=["POST"])
def qr_tool():

    # =====================================
    # QR IMAGE
    # =====================================

    if "file" in request.files:

        file = request.files["file"]

        if not file or not file.filename:

            return jsonify({
                "success": False,
                "message": "QR image is required."
            }), 400

        try:

            import cv2
            import numpy as np

            image_bytes = file.read()

            if not image_bytes:

                return jsonify({
                    "success": False,
                    "message": "The uploaded image is empty."
                }), 400

            image_array = np.frombuffer(
                image_bytes,
                dtype=np.uint8
            )

            image = cv2.imdecode(
                image_array,
                cv2.IMREAD_COLOR
            )

            if image is None:

                return jsonify({
                    "success": False,
                    "message": "Unable to read the uploaded QR image."
                }), 400

            detector = cv2.QRCodeDetector()

            decoded_data, points, _ = detector.detectAndDecode(
                image
            )
            print("========================================")
            print("QR DECODED DATA:", repr(decoded_data))
            print("QR DETECTED POINTS:", points is not None)
            print("========================================")

            if not decoded_data:

                return jsonify({
                    "success": False,
                    "message": "No readable QR code was detected in the image."
                }), 400

            result = get_QR_info(
                decoded_data
            )

            result["decoded_from_image"] = True

            return jsonify(result), 200

        except ImportError:

            return jsonify({
                "success": False,
                "message": "QR image scanner dependency is not installed."
            }), 500

        except Exception as e:

            print("QR IMAGE ERROR:", e)

            return jsonify({
                "success": False,
                "message": "Unable to decode the QR image."
            }), 500

    # =====================================
    # QR TEXT / URL / UPI
    # =====================================

    data = request.get_json()

    if not data:

        return jsonify({
            "success": False,
            "message": "Request data is required."
        }), 400

    qr_data = data.get("data", "").strip()

    if not qr_data:

        return jsonify({
            "success": False,
            "message": "QR data is required."
        }), 400

    result = get_QR_info(qr_data)

    return jsonify(result), 200


# =========================
# WEB SECURITY SCANNER
# =========================

@tools_bp.route("/web", methods=["POST"])
def web_tool():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request data is required."
        }), 400

    url = data.get("url", "").strip()

    if not url:
        return jsonify({
            "success": False,
            "message": "URL is required."
        }), 400

    result = analyze_website(url)

    return jsonify(result), 200