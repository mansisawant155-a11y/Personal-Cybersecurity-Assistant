from flask import Blueprint, request, jsonify

from database.models import get_user_scan_history


dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/", methods=["GET"])
def dashboard():

    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({
            "success": False,
            "message": "User ID is required."
        }), 400

    try:
        history = get_user_scan_history(user_id)

        total_scans = len(history)

        tool_counts = {}

        for scan in history:
            tool_name = scan.get("tool_name", "unknown")

            if tool_name not in tool_counts:
                tool_counts[tool_name] = 0

            tool_counts[tool_name] += 1

        return jsonify({
            "success": True,
            "statistics": {
                "total_scans": total_scans,
                "tool_usage": tool_counts
            }
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Unable to load dashboard data.",
            "error": str(e)
        }), 500