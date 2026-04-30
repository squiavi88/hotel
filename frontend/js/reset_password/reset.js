document.addEventListener("DOMContentLoaded", () => {

    const emailInput = document.getElementById("reset-email");
    const pass1 = document.getElementById("new-pass1");
    const pass2 = document.getElementById("new-pass2");
    const btnGuardar = document.getElementById("btn-guardar");

    const errores = {
        email: document.getElementById("error-email"),
        pass1: document.getElementById("error-pass1"),
        pass2: document.getElementById("error-pass2")
    };

    const msgGeneral = document.getElementById("msg-reset");

    // Mostrar error
    function mostrarError(campo, mensaje) {
        errores[campo].innerText = mensaje;
        errores[campo].classList.remove("d-none");

        const input = campo === "email" ? emailInput :
                      campo === "pass1" ? pass1 : pass2;

        input.classList.add("is-invalid");
    }

    // Limpiar error
    function limpiarError(campo) {
        errores[campo].innerText = "";
        errores[campo].classList.add("d-none");

        const input = campo === "email" ? emailInput :
                      campo === "pass1" ? pass1 : pass2;

        input.classList.remove("is-invalid");
    }

    // Validación de contraseñas iguales
    function validarCoincidencia() {
        limpiarError("pass2");

        if (pass1.value.trim() !== "" && pass2.value.trim() !== "" && pass1.value !== pass2.value) {
            mostrarError("pass2", "Las contraseñas no coinciden");
        }
    }

    pass1.addEventListener("input", validarCoincidencia);
    pass2.addEventListener("input", validarCoincidencia);

    // Enviar formulario
    document.getElementById("resetForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        msgGeneral.classList.add("d-none");

        const email = emailInput.value.trim();
        const nueva = pass1.value.trim();
        const repetir = pass2.value.trim();

        // Validación email
        if (email === "") {
            mostrarError("email", "El correo es obligatorio");
            return;
        }
        if (!email.includes("@") || !email.includes(".")) {
            mostrarError("email", "Correo inválido");
            return;
        }
        limpiarError("email");

        // Validación contraseña
        if (nueva.length < 6) {
            mostrarError("pass1", "La contraseña debe tener al menos 6 caracteres");
            return;
        }
        limpiarError("pass1");

        // Validación coincidencia
        if (nueva !== repetir) {
            mostrarError("pass2", "Las contraseñas no coinciden");
            return;
        }
        limpiarError("pass2");

        try {
            const response = await fetch("http://localhost:8080/hotel/recuperar-cuenta", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, nueva })
            });

            // Si el correo NO existe
            if (response.status === 404) {
                mostrarError("email", "Este correo no existe");
                return;
            }

            // Si hubo otro error
            if (!response.ok) {
                mostrarError("email", "No se pudo actualizar la contraseña");
                return;
            }

            // Éxito → recuadro verde elegante
            msgGeneral.innerText = "Cambio realizado correctamente";
            msgGeneral.classList.remove("d-none");

            msgGeneral.style.background = "#d4edda";
            msgGeneral.style.border = "1px solid #c3e6cb";
            msgGeneral.style.padding = "10px";
            msgGeneral.style.borderRadius = "5px";
            msgGeneral.style.display = "block";
            msgGeneral.style.marginTop = "10px";
            msgGeneral.style.color = "#155724";

            setTimeout(() => {
                window.location.href = "loggin.html";
            }, 1500);

        } catch (error) {
            mostrarError("email", "Error al conectar con el servidor");
        }
    });

});

