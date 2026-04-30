// =====================================
// CONTACTO – VERSIÓN PROFESIONAL
// =====================================

// Validación de correo profesional
function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

// Mostrar mensajes visuales
function mostrarMensajeContacto(texto, tipo) {
    const msg = document.getElementById("msg-contacto");
    msg.className = "alert mt-3 alert-" + (tipo === "success" ? "success" : "danger");
    msg.innerText = texto;
    msg.classList.remove("d-none");
}

// Validar formulario en tiempo real
function validarFormularioContacto() {
    const nombre = document.getElementById("nombreContacto").value.trim();
    const correo = document.getElementById("correoContacto").value.trim();
    const mensaje = document.getElementById("mensajeContacto").value.trim();
    const boton = document.querySelector("button.btn-dark.w-100");

    if (!nombre || !correo || !mensaje || !validarCorreo(correo)) {
        boton.disabled = true;
        return;
    }

    boton.disabled = false;
}

// Enviar formulario
async function enviarFormularioContacto(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreContacto").value.trim();
    const correo = document.getElementById("correoContacto").value.trim();
    const mensaje = document.getElementById("mensajeContacto").value.trim();

    if (!nombre || !correo || !mensaje) {
        mostrarMensajeContacto("Todos los campos son obligatorios", "error");
        return;
    }

    if (!validarCorreo(correo)) {
        mostrarMensajeContacto("El correo electrónico no es válido", "error");
        return;
    }

    const datos = { nombre, correo, mensaje };

    try {
        const response = await fetch("http://localhost:8080/api/contacto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            mostrarMensajeContacto("Error al enviar el mensaje", "error");
            return;
        }

        mostrarMensajeContacto("Mensaje enviado correctamente", "success");

        // Limpiar formulario
        document.getElementById("nombreContacto").value = "";
        document.getElementById("correoContacto").value = "";
        document.getElementById("mensajeContacto").value = "";

        validarFormularioContacto();

    } catch (error) {
        mostrarMensajeContacto("Error al conectar con el servidor", "error");
    }
}

// Eventos de validación en tiempo real
document.addEventListener("DOMContentLoaded", () => {
    ["nombreContacto", "correoContacto", "mensajeContacto"].forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener("input", validarFormularioContacto);
        }
    });

    validarFormularioContacto();
});
