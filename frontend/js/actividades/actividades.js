// =====================================
// CONFIGURACIÓN GENERAL
// =====================================

// Precio único por actividad
const precioActividad = 10;

// Registro temporal de solapamientos (solo UX)
let reservas = {};


// =====================================
// FECHA MÍNIMA = HOY
// =====================================
document.addEventListener("DOMContentLoaded", () => {
    const hoy = new Date().toISOString().split("T")[0];
    document.getElementById("fechaActividad").min = hoy;

    document.getElementById("fechaActividad").addEventListener("change", validarActividad);
    document.getElementById("actividadSeleccionada").addEventListener("change", validarActividad);
    document.getElementById("turnoActividad").addEventListener("change", validarActividad);
});


// =====================================
// CAMBIAR PARTICIPANTES
// =====================================
function cambiarParticipantes(cambio) {
    const id = "participantesActividad";
    let valorActual = document.getElementById(id).value;

    let participantes = valorActual === "Selecciona" ? 0 : parseInt(valorActual);
    if (isNaN(participantes)) participantes = 0;

    participantes += cambio;

    if (participantes < 0) participantes = 0;
    if (participantes > 6) participantes = 6;

    document.getElementById(id).value = participantes === 0 ? "Selecciona" : participantes;

    actualizarPrecioActividad();
    validarActividad();
}


// =====================================
// VALIDAR RESERVA
// =====================================
function validarActividad() {
    const fecha = document.getElementById("fechaActividad").value;
    const actividad = document.getElementById("actividadSeleccionada").value;
    const turno = document.getElementById("turnoActividad").value;
    const participantes = document.getElementById("participantesActividad").value;

    const boton = document.getElementById("btnActividad");

    if (!fecha || actividad === "Selecciona" || turno === "Selecciona" || participantes === "Selecciona") {
        boton.disabled = true;
        return;
    }

    if (haySolapamiento(fecha, turno)) {
        boton.disabled = true;
        return;
    }

    boton.disabled = false;
}


// =====================================
// ACTUALIZAR PRECIO
// =====================================
function actualizarPrecioActividad() {
    const actividad = document.getElementById("actividadSeleccionada").value;
    const turno = document.getElementById("turnoActividad").value;
    const participantesValor = document.getElementById("participantesActividad").value;

    if (actividad === "Selecciona" || turno === "Selecciona" || participantesValor === "Selecciona") {
        document.getElementById("totalActividad").innerText = "0 €";
        return;
    }

    const participantes = parseInt(participantesValor);
    const precio = participantes * precioActividad;

    document.getElementById("totalActividad").innerText = precio + " €";
}


// =====================================
// SOLAPAMIENTO (UX)
// =====================================
function haySolapamiento(fecha, turno) {
    if (!reservas[fecha]) return false;
    return reservas[fecha][turno] === true;
}

function guardarReserva(fecha, turno) {
    if (!reservas[fecha]) reservas[fecha] = {};
    reservas[fecha][turno] = true;
}


// =====================================
// RESERVAR ACTIVIDAD (BACKEND)
// =====================================
async function reservarActividad() {
    const fecha = document.getElementById("fechaActividad").value;
    const actividad = document.getElementById("actividadSeleccionada").value;
    const turno = document.getElementById("turnoActividad").value;
    const participantesValor = document.getElementById("participantesActividad").value;

    if (!fecha || actividad === "Selecciona" || turno === "Selecciona" || participantesValor === "Selecciona") {
        alert("Debes completar todos los campos.");
        return;
    }

    if (haySolapamiento(fecha, turno)) {
        alert("Ya tienes una actividad reservada ese día en ese turno.");
        return;
    }

    const participantes = parseInt(participantesValor);
    const total = participantes * precioActividad;
    const userId = localStorage.getItem("id");


    try {
        // 1. Crear reserva
        const res1 = await fetch("http://localhost:8080/hotel/reservas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ usuario: { id: userId } })
        });

        if (!res1.ok) {
            alert("Error al crear la reserva.");
            return;
        }
        

        const reserva = await res1.json();


        const response = await fetch("http://localhost:8080/hotel/reservas-actividades", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                reservaId: reserva.id,
                actividadId: parseInt(actividad),
                turno: turno,
                fecha: fecha,
                participantes: participantes,
                monto: total
            })
        });

        if (!response.ok) {
            alert("Error al realizar la reserva.");
            return;
        }

        guardarReserva(fecha, turno);
        alert("Reserva realizada correctamente.");

    } catch (error) {
        alert("Error al conectar con el servidor.");
    }
}


// =====================================
// ANIMACIÓN BOTONES
// =====================================
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".btn-dark").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.add("btn-anim-active");
            setTimeout(() => btn.classList.remove("btn-anim-active"), 120);
        });
    });
});


function mostrarNormasActividades() {
    const modalElement = document.getElementById("modalNormas");

    if (!modalElement) {
        console.error("No se encontró el modal con ID 'modalNormas'");
        return;
    }

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

