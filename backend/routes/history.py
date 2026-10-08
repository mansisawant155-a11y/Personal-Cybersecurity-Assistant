from flask import Blueprint, request, jsonify

from database.models import (
    save_scan_history,
    get_user_scan_history
)


history_bp = Blueprint("history", __name__)


# =========================
# SAVE SCAN HISTORY
# =========================

@history_bp.route("/", methods=["POST"])
def save_history():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request data is required."
        }), 400

    user_id = data.get("user_id")
    tool_name = data.get("tool_name")
    target = data.get("target")
    result = data.get("result")

    if not user_id or not tool_name:
        return jsonify({
            "success": False,
            "message": "User ID and tool name are required."
        }), 400

    try:

        history_id = save_scan_history(
            user_id=user_id,
            tool_name=tool_name,
            target=target,
            result=result
        )

        return jsonify({
            "success": True,
            "message": "Scan history saved successfully.",
            "history_id": history_id
        }), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Unable to save scan history.",
            "error": str(e)
        }), 500


# =========================
# GET SCAN HISTORY
# =========================

@history_bp.route("/", methods=["GET"])
def get_history():

    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({
            "success": False,
            "message": "User ID is required."
        }), 400

    try:

        history = get_user_scan_history(user_id)

        history_list = []

        for scan in history:

            history_list.append({
                "id": str(scan["_id"]),
                "user_id": scan["user_id"],
                "tool_name": scan.get("tool_name"),
                "target": scan.get("target"),
                "result": scan.get("result"),
                "created_at": scan.get("created_at").isoformat()
                if scan.get("created_at")
                else None
            })

        return jsonify({
            "success": True,
            "history": history_list
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Unable to retrieve scan history.",
            "error": str(e)
        }), 500