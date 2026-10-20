import re
import unicodedata


def normalizar_texto(texto):
    texto = texto.strip().lower()
    texto = unicodedata.normalize("NFD", texto)

    return "".join(
        caracter
        for caracter in texto
        if unicodedata.category(caracter) != "Mn"
    )


def responder_chat(mensaje, idioma="es"):
    mensaje_normalizado = normalizar_texto(mensaje)
    palabras = set(re.findall(r"[a-z0-9]+", mensaje_normalizado))
    ingles = idioma == "en"

    saludos = {
        "hola",
        "buenas",
        "hello",
        "hi",
        "hey",
    }

    if palabras & saludos or {"buenos", "dias"} <= palabras or {"good", "morning"} <= palabras:
        if ingles:
            return "Hello! 🥛 Welcome to Nutrilácteos. How can I help you today?"

        return "¡Hola! 🥛 Bienvenido a Nutrilácteos. ¿En qué puedo ayudarte hoy?"

    palabras_productos = {
        "producto",
        "productos",
        "queso",
        "quesos",
        "yogur",
        "yogurt",
        "cheese",
        "cheeses",
        "dairy",
        "butter",
    }

    if palabras & palabras_productos:
        if ingles:
            return (
                "We offer cheese, yogurt, and butter made in the Puno highlands. "
                "Visit our Products section to learn more."
            )

        return (
            "Ofrecemos quesos, yogures y mantequilla elaborados en el altiplano "
            "de Puno. Revisa nuestra sección de Productos."
        )

    palabras_contacto = {
        "contacto",
        "contact",
        "telefono",
        "phone",
        "ubicacion",
        "location",
        "direccion",
        "address",
    }

    if palabras & palabras_contacto:
        if ingles:
            return "You can reach us at +51 972 474 929 or visit us in Mañazo, Puno."

        return "Puedes contactarnos al +51 972 474 929 o visitarnos en Mañazo, Puno."

    if ingles:
        return (
            "Thank you for your message. One of our team members "
            "will get back to you shortly."
        )

    return "Gracias por tu mensaje. Un asesor te responderá a la brevedad."