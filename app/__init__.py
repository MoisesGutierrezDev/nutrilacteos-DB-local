import os
from flask import Flask
from app.config import Config


def create_app():
    # Obtener la ruta absoluta del directorio 'app'
    app_dir = os.path.abspath(os.path.dirname(__file__))


    # Indicar a Flask dónde están templates y static explícitamente
    app = Flask(
        __name__,
        template_folder=os.path.join(app_dir, 'templates'),
        static_folder=os.path.join(app_dir, 'static')
    )


    app.config.from_object(Config)


    # Registrar Blueprints
    from app.routes.main_routes import main_bp
    app.register_blueprint(main_bp)


    from app.routes.productos_routes import productos_bp
    app.register_blueprint(productos_bp)


    from app.routes.contacto_routes import contacto_bp
    app.register_blueprint(contacto_bp)


    # === REGISTRO DEL CHATBOT ===
    from app.routes.chatbot_routes import chatbot_bp
    app.register_blueprint(chatbot_bp)


    return app
