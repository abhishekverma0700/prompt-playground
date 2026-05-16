import os
from flask import Flask
from flask_cors import CORS
from config import Config
from models.database import init_db
from routes.generate import generate_bp
from routes.prompts import prompts_bp
from routes.templates import templates_bp
from routes.history import history_bp

def create_app():
    app = Flask(__name__)
    
    app.config.from_object(Config)
    
    CORS(app)
    
    init_db(app)
    
    app.register_blueprint(generate_bp)
    app.register_blueprint(prompts_bp)
    app.register_blueprint(templates_bp)
    app.register_blueprint(history_bp)
    
    return app


if __name__ == '__main__':
    app = create_app()
    # Render ka PORT environment variable use karo
    port = int(os.environ.get('PORT', 5000))
    print("🚀 Prompt Playground Backend Starting...")
    print(f"📍 URL: http://localhost:{port}")
    app.run(
        debug=False,
        port=port,
        host='0.0.0.0'
    )