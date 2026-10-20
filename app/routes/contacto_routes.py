import re
from flask import Blueprint, render_template, request, redirect, url_for, flash
from app.database import obtener_conexion

contacto_bp = Blueprint('contacto', __name__)

# Diccionario con las reglas de validación del número telefónico por país
REGLAS_PAISES = {
    '+51': {'longitud': 9,  'inicio': '9', 'nombre': 'Perú'},
    '+54': {'longitud': 10, 'inicio': '',  'nombre': 'Argentina'},
    '+56': {'longitud': 9,  'inicio': '9', 'nombre': 'Chile'},
    '+57': {'longitud': 10, 'inicio': '3', 'nombre': 'Colombia'},
    '+52': {'longitud': 10, 'inicio': '',  'nombre': 'México'}
}


@contacto_bp.route('/contacto', methods=['GET', 'POST'])
def formulario():
    if request.method == 'POST':
        # Captura de datos del formulario HTML
        nombre_organizacion = request.form.get('nombre_organizacion', '').strip()
        tipo_doc = request.form.get('tipo_doc', '').strip()
        ruc_dni = request.form.get('ruc_dni', '').strip()
        codigo_pais = request.form.get('codigo_pais', '+51').strip()
        telefono = request.form.get('telefono', '').strip()
        direccion = request.form.get('direccion', '').strip()
        responsable = request.form.get('responsable', '').strip()
        email = request.form.get('email', '').strip()
        descripcion = request.form.get('descripcion', '').strip()

        # Validaciones de seguridad en el backend
        errores = []

        if not nombre_organizacion:
            errores.append("El nombre de la organización es obligatorio.")

        if not tipo_doc:
            errores.append("Debe seleccionar el tipo de identificación fiscal.")

        if not ruc_dni or len(ruc_dni) != 11 or not ruc_dni.isdigit():
            errores.append("La identificación fiscal debe ser numérica y tener exactamente 11 dígitos.")
        elif tipo_doc and not ruc_dni.startswith(tipo_doc):
            errores.append(f"La identificación fiscal debe comenzar con el prefijo seleccionado ({tipo_doc}).")

        # VALIDACIÓN DINÁMICA DE TELÉFONO SEGÚN EL PAÍS
        if not codigo_pais or codigo_pais not in REGLAS_PAISES:
            errores.append("Seleccione un código de país válido.")
        else:
            regla = REGLAS_PAISES[codigo_pais]
            
            if not telefono:
                errores.append("El número de teléfono es obligatorio.")
            elif not telefono.isdigit():
                errores.append("El teléfono solo debe contener números.")
            elif len(telefono) != regla['longitud']:
                errores.append(f"El teléfono para {regla['nombre']} debe tener exactamente {regla['longitud']} dígitos.")
            elif regla['inicio'] and not telefono.startswith(regla['inicio']):
                errores.append(f"El teléfono para {regla['nombre']} debe comenzar con el dígito {regla['inicio']}.")

        if not direccion:
            errores.append("La dirección es obligatoria.")

        if not responsable:
            errores.append("El nombre del responsable es obligatorio.")

        if not email or not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email):
            errores.append("Ingrese un correo electrónico válido.")

        # Si hay errores en las validaciones del backend, redirecciona mostrando mensajes de error
        if errores:
            for error in errores:
                flash(error, "error")
            return redirect(url_for('contacto.formulario'))

        # Formatear el teléfono completo para almacenamiento en BD (ejemplo: +51 987654321)
        telefono_completo = f"{codigo_pais} {telefono}"

        # Inserción en la base de datos
        conexion = obtener_conexion()

        if conexion:
            cursor = None
            try:
                cursor = conexion.cursor()

                sql = """
                    INSERT INTO consulta (
                        nombre_organizacion,
                        tipo_documento,
                        identificacion_fiscal,
                        telefono,
                        direccion_empresa,
                        nombre_responsable,
                        correo_electronico,
                        descripcion
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """

                valores = (
                    nombre_organizacion,
                    tipo_doc,
                    ruc_dni,
                    telefono_completo,
                    direccion,
                    responsable,
                    email,
                    descripcion
                )

                cursor.execute(sql, valores)
                conexion.commit()
                print("Consulta guardada correctamente.")
                flash("Tu mensaje ha sido enviado correctamente.", "exito")

            except Exception as e:
                conexion.rollback()
                print(f"Error al guardar la consulta: {e}")
                flash("Ocurrió un error al enviar el formulario. Intenta nuevamente.", "error")

            finally:
                if cursor:
                    cursor.close()
                conexion.close()

        return redirect(url_for('contacto.formulario'))

    return render_template('contacto/contacto.html')