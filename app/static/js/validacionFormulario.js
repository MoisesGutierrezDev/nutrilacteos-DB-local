document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("form");
    const nombreOrganizacion = document.querySelector("[name='nombre_organizacion']");
    const tipoDoc = document.querySelector("[name='tipo_doc']");
    const rucDni = document.querySelector("[name='ruc_dni']");
    const codigoPais = document.querySelector("[name='codigo_pais']");
    const telefono = document.querySelector("[name='telefono']");
    const direccion = document.querySelector("[name='direccion']");
    const responsable = document.querySelector("[name='responsable']");
    const email = document.querySelector("[name='email']");
    const descripcion = document.querySelector("[name='descripcion']");

    // REGLAS DE VALIDACIÓN POR PAÍS
    const reglasPaises = {
        "+51": { longitud: 9, inicio: "9", ejemplo: "987654321", nombre: "Perú" },
        "+54": { longitud: 10, inicio: "", ejemplo: "1123456789", nombre: "Argentina" },
        "+56": { longitud: 9, inicio: "9", ejemplo: "912345678", nombre: "Chile" },
        "+57": { longitud: 10, inicio: "3", ejemplo: "3001234567", nombre: "Colombia" },
        "+52": { longitud: 10, inicio: "", ejemplo: "5512345678", nombre: "México" }
    };

    // MOSTRAR ERROR
    function mostrarError(campo, mensaje) {
        if (!campo) return;
        limpiarError(campo);
        const error = document.querySelector(`#error-${campo.name}`);
        if (error) {
            error.textContent = mensaje;
        }
        campo.classList.add("ring-2", "ring-red-500");
    }

    // LIMPIAR ERROR
    function limpiarError(campo) {
        if (!campo) return;
        const error = document.querySelector(`#error-${campo.name}`);
        if (error) {
            error.textContent = "";
        }
        campo.classList.remove("ring-2", "ring-red-500");
    }

    // ACTUALIZAR PROPIEDADES DEL TELÉFONO
    function actualizarPropiedadesTelefono() {
        if (!telefono || !codigoPais) return;
        const codigo = codigoPais.value;
        const regla = reglasPaises[codigo] || reglasPaises["+51"];
        telefono.maxLength = regla.longitud;
        telefono.placeholder = regla.ejemplo;
    }

    // VALIDAR NOMBRE DE ORGANIZACIÓN
    function validarNombreOrganizacion() {
        if (!nombreOrganizacion) return true;
        limpiarError(nombreOrganizacion);
        const valor = nombreOrganizacion.value.trim();
        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if (valor === "") {
            mostrarError(nombreOrganizacion, "El nombre de la organización es obligatorio.");
            return false;
        }
        if (!regexLetras.test(valor)) {
            mostrarError(nombreOrganizacion, "Solo se permiten letras y espacios (sin números ni símbolos).");
            return false;
        }
        return true;
    }

    // VALIDAR TIPO DE DOCUMENTO
    function validarTipoDoc() {
        if (!tipoDoc) return true;
        limpiarError(tipoDoc);
        if (tipoDoc.value === "") {
            mostrarError(tipoDoc, "Selecciona el tipo de identificación fiscal.");
            return false;
        }
        return true;
    }

    // VALIDAR RUC / DNI
    function validarRucDni() {
        if (!rucDni) return true;
        limpiarError(rucDni);
        const valor = rucDni.value.trim();
        const valorTipoDoc = tipoDoc ? tipoDoc.value : "";
        const regexNumeros11 = /^\d{11}$/;

        if (valor === "") {
            mostrarError(rucDni, "La identificación fiscal es obligatoria.");
            return false;
        }
        if (!regexNumeros11.test(valor)) {
            mostrarError(rucDni, "Debe contener exactamente 11 dígitos numéricos.");
            return false;
        }
        if (valorTipoDoc && !valor.startsWith(valorTipoDoc)) {
            mostrarError(rucDni, `El número debe comenzar con el prefijo seleccionado (${valorTipoDoc}).`);
            return false;
        }
        return true;
    }

    // VALIDAR TELÉFONO DINÁMICO POR PAÍS
    function validarTelefono() {
        if (!telefono) return true;
        limpiarError(telefono);
        const valor = telefono.value.trim();
        const codigo = codigoPais ? codigoPais.value : "+51";
        const regla = reglasPaises[codigo] || reglasPaises["+51"];

        if (valor === "") {
            mostrarError(telefono, "El número de teléfono es obligatorio.");
            return false;
        }
        if (!/^\d+$/.test(valor)) {
            mostrarError(telefono, "El teléfono solo debe contener dígitos numéricos.");
            return false;
        }
        if (valor.length !== regla.longitud) {
            mostrarError(telefono, `Para ${regla.nombre} se requieren exactamente ${regla.longitud} dígitos.`);
            return false;
        }
        if (regla.inicio && !valor.startsWith(regla.inicio)) {
            mostrarError(telefono, `Para ${regla.nombre} el número debe comenzar con el dígito ${regla.inicio}.`);
            return false;
        }
        return true;
    }

    // VALIDAR DIRECCIÓN
    function validarDireccion() {
        if (!direccion) return true;
        limpiarError(direccion);
        const valor = direccion.value.trim();
        const guiones = (valor.match(/-/g) || []).length;
        const puntos = (valor.match(/\./g) || []).length;
        const regexDir = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.-]+$/;

        if (valor === "") {
            mostrarError(direccion, "La dirección de la empresa es obligatoria.");
            return false;
        }
        if (!regexDir.test(valor)) {
            mostrarError(direccion, "Solo se permiten letras, números, espacios, puntos y guiones.");
            return false;
        }
        if (guiones > 3) {
            mostrarError(direccion, "Máximo 3 guiones (-) permitidos en la dirección.");
            return false;
        }
        if (puntos > 5) {
            mostrarError(direccion, "Máximo 5 puntos (.) permitidos en la dirección.");
            return false;
        }
        return true;
    }

    // VALIDAR RESPONSABLE
    function validarResponsable() {
        if (!responsable) return true;
        limpiarError(responsable);
        const valor = responsable.value.trim();
        const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if (valor === "") {
            mostrarError(responsable, "El nombre del responsable es obligatorio.");
            return false;
        }
        if (!regexLetras.test(valor)) {
            mostrarError(responsable, "El nombre solo puede contener letras y espacios.");
            return false;
        }
        return true;
    }

    // VALIDAR EMAIL
    function validarEmail() {
        if (!email) return true;
        limpiarError(email);
        const valor = email.value.trim();

        if (valor === "") {
            mostrarError(email, "El correo electrónico es obligatorio.");
            return false;
        }
        if (/\s/.test(valor)) {
            mostrarError(email, "El correo electrónico no debe contener espacios.");
            return false;
        }
        const arrobas = (valor.match(/@/g) || []).length;
        if (arrobas !== 1) {
            mostrarError(email, "El correo debe contener un único carácter '@'.");
            return false;
        }
        const patronEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!patronEmail.test(valor)) {
            mostrarError(email, "Ingrese un correo válido con un dominio adecuado (ejemplo@dominio.com).");
            return false;
        }
        return true;
    }

    // CAMBIO DE PAÍS
    if (codigoPais) {
        codigoPais.addEventListener("change", () => {
            actualizarPropiedadesTelefono();
            if (telefono && telefono.value.trim() !== "") {
                validarTelefono();
            } else if (telefono) {
                limpiarError(telefono);
            }
        });
        actualizarPropiedadesTelefono();
    }

    // TELÉFONO: SOLO NÚMEROS
    if (telefono) {
        telefono.addEventListener("input", () => {
            telefono.value = telefono.value.replace(/\D/g, "");
            limpiarError(telefono);
        });
    }

    // LIMPIAR ERRORES AL ESCRIBIR
    const campos = [nombreOrganizacion, tipoDoc, rucDni, direccion, responsable, email, descripcion];
    campos.forEach(campo => {
        if (campo) {
            campo.addEventListener("input", () => limpiarError(campo));
            campo.addEventListener("change", () => limpiarError(campo));
        }
    });

    // SUBMIT UNIFICADO CON VALIDACIONES Y SWEETALERT2
    if (formulario) {
        formulario.addEventListener("submit", (evento) => {
            let formularioValido = true;

            if (!validarNombreOrganizacion()) formularioValido = false;
            if (!validarTipoDoc()) formularioValido = false;
            if (!validarRucDni()) formularioValido = false;
            if (!validarTelefono()) formularioValido = false;
            if (!validarDireccion()) formularioValido = false;
            if (!validarResponsable()) formularioValido = false;
            if (!validarEmail()) formularioValido = false;

            evento.preventDefault();

            if (!formularioValido) {
                return;
            }

            Swal.fire({
                title: "¡Formulario Enviado!",
                text: "Nos pondremos en contacto contigo pronto.",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#1b4d3e"
            }).then((result) => {
                if (result.isConfirmed) {
                    formulario.submit();
                }
            });
        });
    }
});