// ===============================
// GLOBAL.JS
// Funciones comunes a TODAS las páginas
// ===============================

// Páginas que NO requieren sesión
const paginasPublicas = [
    "loggin.html",
    "registro.html",
    "reset_password.html",
    "index.html"
];

// ===============================
// COMPROBAR SESIÓN
// ===============================
function comprobarSesion() {
    const userId = localStorage.getItem("userId");

    const paginaActual = window.location.pathname.split("/").pop();

    // Si la página es pública → permitir acceso
    if (paginasPublicas.includes(paginaActual)) {
        return;
    }

    // Si NO hay sesión → redirigir al login
    if (!userId) {
        window.location.href = "loggin.html";
    }
}

// ===============================
// CERRAR SESIÓN
// ===============================
async function cerrarSesion() {
    try {
        const res = await fetch("http://localhost:8080/logout", {
            method: "POST",
            credentials: "include"
        });

        localStorage.clear();
        window.location.href = "loggin.html";

    } catch (error) {
        console.error(error);
        localStorage.clear();
        window.location.href = "loggin.html";
    }
}

// ===============================
// MOSTRAR NOMBRE DEL USUARIO EN NAVBAR
// ===============================
function mostrarNombreUsuario() {
    const nombre = localStorage.getItem("nombre");

    const elemento = document.getElementById("nombre-usuario");

    if (elemento && nombre) {
        elemento.innerText = nombre;
    }
}

// ===============================
// CARGAR USUARIO (DEBUG O FUTURO USO)
// ===============================
function cargarUsuario() {
    const rol = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    console.log("Usuario logueado:", userId, "Rol:", rol);
}

// ===============================
// EJECUTAR AUTOMÁTICAMENTE
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    //comprobarSesion();        //***IMPORTANTE DESCOMENTAR ****/
    mostrarNombreUsuario();
    cargarUsuario();
});

