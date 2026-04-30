// =====================================
// PRECIOS POR TURNO
// =====================================
const preciosTurno = {
    desayuno: 12,
    comida: 20,
    cena: 25
};

// =====================================
// HORARIOS POR TURNO
// =====================================
const horasPorTurno = {
    desayuno: ["07:30", "08:30", "09:30", "10:30", "11:30"],
    comida: ["13:30", "14:30", "15:30"],
    cena: ["20:30", "21:30", "22:30"]
};

// =====================================
// FECHA MÍNIMA = HOY
// =====================================
document.addEventListener("DOMContentLoaded", () => {
    const hoy = new Date().toISOString().split("T")[0];
    document.getElementById("fechaRestaurante").min = hoy;

    // EVENTO COMPLETO DEL TURNO (AQUÍ VA LO QUE PEDISTE)
    document.getElementById("turnoRestaurante").addEventListener("change", () => {
        actualizarHoras();
        actualizarImagenTurno();
        validarReserva();
    });

    // Otros eventos
    document.getElementById("fechaRestaurante").addEventListener("change", validarReserva);
    document.getElementById("horaRestaurante").addEventListener("change", validarReserva);

    validarReserva();
});

// =====================================
// ACTUALIZAR HORAS SEGÚN TURNO
// =====================================
function actualizarHoras() {
    const turno = document.getElementById("turnoRestaurante").value;
    const horaSelect = document.getElementById("horaRestaurante");

    horaSelect.innerHTML = `<option value="Selecciona">Selecciona</option>`;

    if (horasPorTurno[turno]) {
        horasPorTurno[turno].forEach(h => {
            const opt = document.createElement("option");
            opt.value = h;
            opt.textContent = h;
            horaSelect.appendChild(opt);
        });
    }

    actualizarPrecio();
    validarReserva();
}

// =====================================
// CAMBIAR IMAGEN SEGÚN TURNO
// =====================================
function actualizarImagenTurno() {
    const turno = document.getElementById("turnoRestaurante").value;
    const img = document.getElementById("imgTurno");

    const imagenes = {
        desayuno: "imagenes/RESTAURANT/desayuno.png",
        comida: "imagenes/RESTAURANT/cook_6.png",
        cena: "imagenes/RESTAURANT/cook_8.png"
    };

    if (imagenes[turno]) {
        img.src = imagenes[turno];
    } else {
        img.src = "imagenes/RESTAURANT/cook_4.png"; // opcional
    }
}

// =====================================
// CAMBIAR PERSONAS
// =====================================
function cambiarPersonas(cambio) {
    const id = "personasRestaurante";
    let valorActual = document.getElementById(id).value;

    let personas = valorActual === "Selecciona" ? 0 : parseInt(valorActual);
    if (isNaN(personas)) personas = 0;

    personas += cambio;

    if (personas < 0) personas = 0;
    if (personas > 6) personas = 6;

    document.getElementById(id).value = personas === 0 ? "Selecciona" : personas;

    actualizarPrecio();
    validarReserva();
}

// =====================================
// CAMBIAR MESA
// =====================================
function cambiarMesa(cambio) {
    const id = "mesaRestaurante";
    let valorActual = document.getElementById(id).value;

    let mesa = valorActual === "Selecciona" ? 0 : parseInt(valorActual);
    if (isNaN(mesa)) mesa = 0;

    mesa += cambio;

    if (mesa < 0) mesa = 0;
    if (mesa > 15) mesa = 15;

    document.getElementById(id).value = mesa === 0 ? "Selecciona" : mesa;

    actualizarPrecio();
    validarReserva();
}

// =====================================
// VALIDAR FECHA
// =====================================
function validarFecha(fecha) {
    if (!fecha) return false;

    const f = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return f >= hoy;
}

// =====================================
// VALIDAR RESERVA (ACTIVA/DESACTIVA BOTÓN)
// =====================================
function validarReserva() {
    const fecha = document.getElementById("fechaRestaurante").value;
    const turno = document.getElementById("turnoRestaurante").value;
    const hora = document.getElementById("horaRestaurante").value;
    const personas = document.getElementById("personasRestaurante").value;
    const mesa = document.getElementById("mesaRestaurante").value;

    const boton = document.getElementById("btnRestaurante");

    const fechaValida = validarFecha(fecha);
    const turnoValido = turno !== "Selecciona";
    const horaValida = hora !== "Selecciona";
    const personasValidas = personas !== "Selecciona";
    const mesaValida = mesa !== "Selecciona";

    if (fechaValida && turnoValido && horaValida && personasValidas && mesaValida) {
        boton.disabled = false;
    } else {
        boton.disabled = true;
    }
}

// =====================================
// ACTUALIZAR PRECIO
// =====================================
function actualizarPrecio() {
    const turno = document.getElementById("turnoRestaurante").value;
    const personasValor = document.getElementById("personasRestaurante").value;

    if (turno === "Selecciona" || personasValor === "Selecciona") {
        document.getElementById("totalRestaurante").innerText = "0 €";
        return;
    }

    const personas = parseInt(personasValor);
    const precio = preciosTurno[turno] * personas;

    document.getElementById("totalRestaurante").innerText = precio + " €";
}

// =====================================
// RESERVAR (ENVÍO AL BACKEND)
// =====================================
async function reservarMesa() {
    const fecha = document.getElementById("fechaRestaurante").value;
    const turno = document.getElementById("turnoRestaurante").value;
    const horaInput = document.getElementById("horaRestaurante").value;
    const personas = document.getElementById("personasRestaurante").value;
    const mesa = document.getElementById("mesaRestaurante").value;

    const total = preciosTurno[turno] * parseInt(personas);
    const userId = localStorage.getItem("id");

    const hora = horaInput.length === 5 ? horaInput + ":00" : horaInput;

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


        const response = await fetch("http://localhost:8080/hotel/reservas-mesas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                reservaId: reserva.id,
                mesaId: parseInt(mesa),
                fecha: fecha,
                hora: hora,
                montoPago: total
            })
        });

        if (!response.ok) {
            alert("Error al realizar la reserva.");
            return;
        }

        alert("Reserva realizada correctamente.");

    } catch (error) {
        alert("Error al conectar con el servidor.");
    }
}

// =====================================
// ANIMACIÓN EN BOTONES + Y –
// =====================================
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".btn-dark").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.add("btn-anim-active");
            setTimeout(() => btn.classList.remove("btn-anim-active"), 120);
        });
    });
});


