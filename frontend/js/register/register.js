document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    const inputs = {
        nombre: document.getElementById("reg-nombre"),
        apellidos: document.getElementById("reg-apellidos"),
        email: document.getElementById("reg-correo"),
        fecha: document.getElementById("reg-fecha"),
        password: document.getElementById("reg-password")
    };

    const errores = {
        nombre: document.getElementById("error-nombre"),
        apellidos: document.getElementById("error-apellidos"),
        email: document.getElementById("error-correo"),
        fecha: document.getElementById("error-fecha"),
        password: document.getElementById("error-password")
    };

    // ===============================
    // MENSAJE GENERAL (verde o rojo)
    // ===============================
    function mostrarMensaje(texto, tipo = "success") {
        const msg = document.getElementById("msg-registro");
        msg.innerText = texto;
        msg.className = `alert alert-${tipo}`;
        msg.classList.remove("d-none");

        setTimeout(() => msg.classList.add("d-none"), 3000);
    }

    // ===============================
    // ERRORES DE INPUT
    // ===============================
    function mostrarError(campo, mensaje) {
        errores[campo].innerText = mensaje;
        errores[campo].classList.remove("d-none");
        inputs[campo].classList.add("is-invalid");
    }

    function limpiarError(campo) {
        errores[campo].innerText = "";
        errores[campo].classList.add("d-none");
        inputs[campo].classList.remove("is-invalid");
    }

    // ===============================
    // VALIDACIÓN INDIVIDUAL
    // ===============================
    function validarCampo(campo) {
        const valor = inputs[campo].value.trim();

        switch (campo) {
            case "nombre":
                if (valor === "") return mostrarError(campo, "El nombre es obligatorio"), false;
                break;

            case "apellidos":
                if (valor === "") return mostrarError(campo, "Los apellidos son obligatorios"), false;
                break;

            case "email":
                if (valor === "") return mostrarError(campo, "El correo es obligatorio"), false;
                if (!valor.includes("@") || !valor.includes(".")) {
                    return mostrarError(campo, "Correo electrónico inválido"), false;
                }
                break;

            case "fecha":
                if (valor === "") return mostrarError(campo, "La fecha es obligatoria"), false;
                if (!esMayorDeEdad(valor)) {
                    return mostrarError(campo, "Debes tener al menos 18 años"), false;
                }
                break;

            case "password":
                if (valor === "") return mostrarError(campo, "La contraseña es obligatoria"), false;
                if (valor.length < 6) {
                    return mostrarError(campo, "La contraseña debe tener al menos 6 caracteres"), false;
                }
                break;
        }

        limpiarError(campo);
        return true;
    }

    // Validación completa
    function validarFormulario() {
        let valido = true;
        Object.keys(inputs).forEach(campo => {
            if (!validarCampo(campo)) valido = false;
        });
        return valido;
    }

    // Validación al escribir
    Object.keys(inputs).forEach(campo => {
        inputs[campo].addEventListener("input", () => validarCampo(campo));
    });

    // ===============================
    // ENVÍO DEL FORMULARIO
    // ===============================
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validarFormulario()) return;

        // Limpiar sesión previa
        localStorage.clear();

        const data = {
            nombre: inputs.nombre.value.trim(),
            apellidos: inputs.apellidos.value.trim(),
            email: inputs.email.value.trim(),
            fechaNacimiento: inputs.fecha.value,
            contrasena: inputs.password.value.trim()
        };

        try {
            const response = await fetch("http://localhost:8080/hotel/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (response.status === 409) {
                mostrarError("email", "Este correo ya está registrado");
                return;
            }

            if (!response.ok) {
                mostrarMensaje("Error al registrar usuario", "danger");
                return;
            }

            mostrarMensaje("Usuario registrado correctamente", "success");

            setTimeout(() => {
                window.location.href = "loggin.html";
            }, 1500);

        } catch (error) {
            mostrarMensaje("Error al conectar con el servidor", "danger");
        }
    });

});

// ===============================
// FUNCIÓN: Validar edad mínima
// ===============================
function esMayorDeEdad(fechaNacimiento) {
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - cumple.getFullYear();
    const mes = hoy.getMonth() - cumple.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < cumple.getDate())) {
        edad--;
    }

    return edad >= 18;
}




