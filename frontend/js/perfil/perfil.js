// =====================================
// PERFIL – CARGA DE DATOS Y RESERVAS
// =====================================

// Cargar datos del usuario
document.addEventListener("DOMContentLoaded", () => {
    mostrarNombreUsuario();
    cargarDatosUsuario();
    cargarReservasUsuario();
});


// =====================================
// CARGAR DATOS DEL USUARIO
// =====================================
function cargarDatosUsuario() {
    const nombre = localStorage.getItem("nombre");
    const apellido = localStorage.getItem("apellido");
    const email = localStorage.getItem("email");
    const fechaNacimiento = localStorage.getItem("fechaNacimiento");
    const idUsuario = localStorage.getItem("userId");

    document.getElementById("nombreUsuario").innerText = nombre || "Desconocido";
    document.getElementById("apellidoUsuario").innerText = apellido || "Desconocido";
    document.getElementById("emailUsuario").innerText = email || "Desconocido";
    document.getElementById("fechaNacimientoUsuario").innerText = fechaNacimiento || "Desconocido";
    document.getElementById("idUsuario").innerText = idUsuario || "N/A";
}


// =====================================
// CARGAR RESERVAS DEL USUARIO
// =====================================
async function cargarReservasUsuario() {
    const userId = localStorage.getItem("userId");

    try {
        const response = await fetch(`http://localhost:8080/api/reservas/usuario/${userId}`);
        const reservas = await response.json();

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const actuales = [];
        const historial = [];

        reservas.forEach(r => {
            const fechaReserva = new Date(r.fecha);
            fechaReserva.setHours(0, 0, 0, 0);

            if (fechaReserva >= hoy) {
                actuales.push(r);
            } else {
                historial.push(r);
            }
        });

        mostrarReservasActuales(actuales);
        mostrarHistorial(historial);

    } catch (error) {
        console.error("Error cargando reservas:", error);
    }
}


// =====================================
// MOSTRAR RESERVAS ACTUALES
// =====================================
function mostrarReservasActuales(lista) {
    const tbody = document.querySelector("#tablaReservasActuales tbody");
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center">No tienes reservas actuales</td></tr>`;
        return;
    }

    lista.forEach(r => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${r.tipo}</td>
            <td>${r.fecha}</td>
            <td>${r.detalles}</td>
            <td>${r.total} €</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="confirmarEliminacion(${r.id})">
                    Eliminar
                </button>
            </td>
        `;

        tbody.appendChild(fila);
    });
}


// =====================================
// MOSTRAR HISTORIAL
// =====================================
function mostrarHistorial(lista) {
    const tbody = document.querySelector("#tablaHistorialReservas tbody");
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center">No hay reservas completadas</td></tr>`;
        return;
    }

    lista.forEach(r => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${r.tipo}</td>
            <td>${r.fecha}</td>
            <td>${r.detalles}</td>
            <td>${r.total} €</td>
        `;

        tbody.appendChild(fila);
    });
}


// =====================================
// CONFIRMAR ELIMINACIÓN
// =====================================
function confirmarEliminacion(idReserva) {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar esta reserva?");

    if (confirmar) {
        eliminarReserva(idReserva);
    }
}


// =====================================
// ELIMINAR RESERVA
// =====================================
async function eliminarReserva(idReserva) {
    try {
        const response = await fetch(`http://localhost:8080/api/reservas/${idReserva}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            alert("Error al eliminar la reserva.");
            return;
        }

        alert("Reserva eliminada");
        cargarReservasUsuario(); // Recargar tablas

    } catch (error) {
        console.error("Error eliminando reserva:", error);
        alert("Error al conectar con el servidor.");
    }
}


// =====================================
// INFORMACIÓN ADICIONAL
// =====================================
function mostrarInfoReembolsos() {
    alert(
        "Las reservas eliminadas tendrán el reembolso del coste inicial.\n\n" +
        "En caso de fallo, contacte llamando al número de atención al cliente o envíenos un mensaje al correo electrónico."
    );
}

