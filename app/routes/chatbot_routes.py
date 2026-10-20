from flask import Blueprint, request, jsonify
from app.services.chatbot_service import responder_chat


chatbot_bp = Blueprint("chatbot", __name__)


@chatbot_bp.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        data = {}

    mensaje_usuario = data.get("message", "")
    idioma = "en" if data.get("language") == "en" else "es"

    if not isinstance(mensaje_usuario, str):
        mensaje_usuario = ""

    mensaje_usuario = mensaje_usuario.strip()

    if not mensaje_usuario:
        error = (
            "The message cannot be empty"
            if idioma == "en"
            else "El mensaje no puede estar vacío"
        )
        return jsonify({"error": error}), 400

    respuesta = responder_chat(mensaje_usuario, idioma)
    return jsonify({"response": respuesta})