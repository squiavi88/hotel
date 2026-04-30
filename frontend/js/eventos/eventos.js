// =====================================
// CONFIGURACIÓN GENERAL
// =====================================

// Precio por persona
const precioPorPersona = 15;

// Precios por sala
const precioSala = {
    "Mediana": 75,
    "Grande": 150
};

// Precios por catering
const precioCatering = {
    "Clásico": 200,
    "Gourmet": 400
};

// Registro temporal de fechas reservadas (solo UX)
let fechasReservadas = {};


// =====================================
// FECHA MÍNIMA = HOY
// =====================================
document.addEventListener("DOMContentLoaded", () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const fechaHoy = `${yyyy}-${mm}-${dd}`;

    const inputFecha = document.getElementById("fechaEvento");
    if (inputFecha) inputFecha.min = fechaHoy;

    // Animación botones
    document.querySelectorAll(".btn-dark").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.add("btn-anim-active");
            setTimeout(() => btn.classList.remove("btn-anim-active"), 120);
        });
    });
});


// =====================================
// VALIDAR FORMULARIO
// =====================================
function validarEvento() {
    const tipo = document.getElementById("tipoEvento").value;
    const fecha = document.getElementById("fechaEvento").value;
    const sala = document.getElementById("salaEvento").value;
    const catering = document.getElementById("cateringEvento").value;
    const participantes = document.getElementById("participantesEvento").value;

    const boton = document.getElementById("btnEvento");

    // Validación de fecha pasada
    if (fecha) {
        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        const f = new Date(fecha);
        if (f < hoy) {
            boton.disabled = true;
            return;
        }
    }

    // Validación de campos
    if (
        tipo === "Selecciona" ||
        !fecha ||
        sala === "Selecciona" ||
        catering === "Selecciona" ||
        participantes === "Selecciona"
    ) {
        boton.disabled = true;
        return;
    }

    // Solapamiento (solo UX)
    if (fechasReservadas[fecha]) {
        boton.disabled = true;
        boton.style.opacity = "0.5";
        return;
    }

    boton.disabled = false;
    boton.style.opacity = "1";
}


// =====================================
// CAMBIAR PARTICIPANTES
// =====================================
function cambiarParticipantesEvento(cambio) {
    const id = "participantesEvento";
    let valorActual = document.getElementById(id).value;

    let participantes = valorActual === "Selecciona" ? 0 : parseInt(valorActual);
    if (isNaN(participantes)) participantes = 0;

    participantes += cambio;

    if (participantes < 0) participantes = 0;
    if (participantes > 80) participantes = 80;

    document.getElementById(id).value = participantes === 0 ? "Selecciona" : participantes;

    actualizarPrecioEvento();
    validarEvento();
}


// =====================================
// ACTUALIZAR PRECIO
// =====================================
function actualizarPrecioEvento() {
    const sala = document.getElementById("salaEvento").value;
    const catering = document.getElementById("cateringEvento").value;
    const participantesValor = document.getElementById("participantesEvento").value;

    const totalId = "totalEvento";

    if (
        sala === "Selecciona" ||
        catering === "Selecciona" ||
        participantesValor === "Selecciona"
    ) {
        document.getElementById(totalId).innerText = "0 €";
        return;
    }

    const participantes = parseInt(participantesValor);

    const total =
        precioSala[sala] +
        precioCatering[catering] +
        (participantes * precioPorPersona);

    document.getElementById(totalId).innerText = total + " €";
}


// =====================================
// RESERVAR EVENTO (ENVÍO AL BACKEND)
// =====================================
async function reservarEvento() {
    const tipo = document.getElementById("tipoEvento").value;
    const fecha = document.getElementById("fechaEvento").value;
    const sala = document.getElementById("salaEvento").value;
    const catering = document.getElementById("cateringEvento").value;
    const participantesValor = document.getElementById("participantesEvento").value;

    if (
        tipo === "Selecciona" ||
        !fecha ||
        sala === "Selecciona" ||
        catering === "Selecciona" ||
        participantesValor === "Selecciona"
    ) {
        alert("Debes completar todos los campos.");
        return;
    }

    // Solapamiento UX
    if (fechasReservadas[fecha]) {
        alert("Ya existe un evento reservado para la fecha " + fecha + ".");
        return;
    }

    const participantes = parseInt(participantesValor);

    const total =
        precioSala[sala] +
        precioCatering[catering] +
        (participantes * precioPorPersona);

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


        const response = await fetch("http://localhost:8080/hotel/reservas-eventos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                reservaId: reserva.id,
                eventoId: parseInt(tipo),
                fecha: fecha,
                sala: sala,
                participantes: participantes,
                catering: catering,
                monto: total
            })
        });

        if (!response.ok) {
            alert("Error al realizar la reserva.");
            return;
        }

        // Guardar solapamiento UX
        fechasReservadas[fecha] = true;

        alert("Reserva realizada correctamente.");

        validarEvento();

    } catch (error) {
        alert("Error al conectar con el servidor.");
    }
}


// =====================================
// EVENTOS DE CAMBIO
// =====================================
["tipoEvento", "fechaEvento", "salaEvento", "cateringEvento"].forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.addEventListener("change", () => {
            actualizarPrecioEvento();
            validarEvento();
        });
    }
});


function accederReservaEvento() {
    const modal = new bootstrap.Modal(document.getElementById("modalNormasEventos"));
    modal.show();
}



