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
    const idRol = parseInt(localStorage.getItem("idRol"));
    const userId = localStorage.getItem("id");

    console.log("Usuario logueado:", userId, "Rol:", idRol);

    // Antes del switch, capturamos a todos los que tengan la clase 'solo-admin'
    const elementosAdmin = document.querySelectorAll(".admin");

    switch (idRol) { // Usa idRol (el número 1 o 2), no el userId
        case 1: // CASO ADMIN
            elementosAdmin.forEach(elemento => {
                elemento.classList.remove("d-none"); // Le quitamos el "invisible"
                elemento.classList.add("d-inline-block"); // Le ponemos el "visible"
            });
            console.log("Admin detectado: Botones mostrados");
            break;

        case 2: // CASO CLIENTE
            elementosAdmin.forEach(elemento => {
                elemento.classList.add("d-none"); // Por si acaso, nos aseguramos que estén ocultos
                // O mejor aún: el.remove(); (para que no existan en el HTML)
            });
            break;

        default:
            // Si no hay sesión, los borramos todos
            elementosAdmin.forEach(elemento => elemento.remove());
            break;
    }
}

// ===============================
// EJECUTAR AUTOMÁTICAMENTE
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    //comprobarSesion();        //***IMPORTANTE DESCOMENTAR ****/
    mostrarNombreUsuario();
    cargarUsuario();

});

