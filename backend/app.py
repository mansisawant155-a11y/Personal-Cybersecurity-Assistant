from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from database.connection import get_database

from routes.auth import auth_bp
from routes.dashboard import dashboard_bp
from routes.history import history_bp
from routes.tools import tools_bp


def create_app():
    app = Flask(__name__)

    # Configuration
    app.config.from_object(Config)

    # Allow frontend to communicate with backend
    CORS(app)

    # Test MongoDB connection
    try:
        db = get_database()
        db.command("ping")
        print("MongoDB Atlas connected successfully!")
    except Exception as e:
        print("MongoDB connection failed:", e)

    # Register routes
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(history_bp, url_prefix="/api/history")
    app.register_blueprint(tools_bp, url_prefix="/api/tools")

    @app.route("/")
    def home():
        return jsonify({
            "message": "Personal Cybersecurity Assistant API is running"
        })

    @app.route("/api/health")
    def health():
        return jsonify({
            "status": "success",
            "message": "Backend is working"
        })

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)