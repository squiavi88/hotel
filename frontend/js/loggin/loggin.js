document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    const inputs = {
        email: document.getElementById("login-email"),
        password: document.getElementById("login-password")
    };

    const errores = {
        email: document.getElementById("error-email"),
        password: document.getElementById("error-password")
    };

    // Mostrar error debajo del input
    function mostrarError(campo, mensaje) {
        errores[campo].innerText = mensaje;
        errores[campo].classList.remove("d-none");
        inputs[campo].classList.add("is-invalid");
    }

    // Quitar error
    function limpiarError(campo) {
        errores[campo].innerText = "";
        errores[campo].classList.add("d-none");
        inputs[campo].classList.remove("is-invalid");
    }

    // Validación de cada campo
    function validarCampo(campo) {
        const valor = inputs[campo].value.trim();

        if (campo === "email") {
            if (valor === "") {
                mostrarError(campo, "El correo es obligatorio");
                return false;
            }
            if (!valor.includes("@") || !valor.includes(".")) {
                mostrarError(campo, "Correo electrónico inválido");
                return false;
            }
        }

        if (campo === "password") {
            if (valor === "") {
                mostrarError(campo, "La contraseña es obligatoria");
                return false;
            }
            if (valor.length < 3) {
                mostrarError(campo, "La contraseña debe tener al menos 3 caracteres");
                return false;
            }
        }

        limpiarError(campo);
        return true;
    }

    // Validación completa
    function validarFormulario() {
        const emailOK = validarCampo("email");
        const passOK = validarCampo("password");
        return emailOK && passOK;
    }

    // Validación al escribir
    Object.keys(inputs).forEach(campo => {
        inputs[campo].addEventListener("input", () => validarCampo(campo));
    });

    // Enviar formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get input values
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        console.log("Email:", email, "Password:", password); // debug

        try {
            const response = await fetch("http://localhost:8080/hotel/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const user = await response.json();

            localStorage.setItem("id", user.id)
            localStorage.setItem("nombre", user.nombre);
            localStorage.setItem("email", user.email);


            // Redirect after login
            window.location.href = "inicio.html";

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Error al iniciar sesión, revisa tus credenciales");
        }
    });

});

