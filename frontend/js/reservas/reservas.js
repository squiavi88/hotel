// ===============================
// PRECIOS POR HABITACIÓN
// ===============================
const precios = {};

// ===============================
// MOSTRAR MENSAJE DE RESERVA
// ===============================
function mostrarMensajeReserva(texto, tipo = "success") {
    const msg = document.getElementById("msg-reserva");

    msg.innerText = texto;
    msg.className = `alert alert-${tipo} text-center`;
    msg.classList.remove("d-none");

    setTimeout(() => msg.classList.add("d-none"), 3000);
}

// ===============================
// CALCULAR NOCHES
// ===============================
function calcularNoches(entrada, salida) {
    if (!entrada || !salida) return 0;

    const e = new Date(entrada);
    const s = new Date(salida);

    if (s <= e) return -2;
    return (s - e) / (1000 * 60 * 60 * 24);
}

// ===============================
// FLATPICKR + BLOQUEO DE FECHAS
// ===============================
async function cargarFechasOcupadas(id) {
    try {
        const res = await fetch(`http://localhost:8080/hotel/reservas-habitaciones/ocupadas/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        const data = await res.json();

        return data.map(rango => ({
            from: rango.fechaEntrada,
            to: rango.fechaSalida
        }));

    } catch (e) {
        console.error("Error cargando fechas ocupadas:", e);
        return [];
    }
}

async function inicializarCalendarios() {
    const entradas = document.querySelectorAll(".entrada");
    const salidas = document.querySelectorAll(".salida");

    entradas.forEach(async (entradaInput) => {
        const id = entradaInput.id.replace("entrada", "");
        const salidaInput = document.getElementById(`salida${id}`);

        const fechasOcupadas = await cargarFechasOcupadas(id);

        const entradaPicker = flatpickr(entradaInput, {
            minDate: "today",
            disable: fechasOcupadas,
            dateFormat: "Y-m-d",
            onChange: () => salidaPicker.set("minDate", entradaInput.value)
        });

        const salidaPicker = flatpickr(salidaInput, {
            minDate: "today",
            disable: fechasOcupadas,
            dateFormat: "Y-m-d",
            onChange: () => actualizarTotal(id)
        });
    });
}
document.addEventListener("DOMContentLoaded", () => {
    cargarHabitaciones();
});

// ===============================
// ACTUALIZAR TOTAL
// ===============================
function actualizarTotal(id) {
    const entrada = document.getElementById(`entrada${id}`).value;
    const salida = document.getElementById(`salida${id}`).value;

    const noches = calcularNoches(entrada, salida);

    const card = document.querySelector(`#btn-reservar-${id}`).closest(".card");
    const precioText = card.querySelector("p.fw-bold").innerText;
    const precio = parseFloat(precioText.replace(/[^0-9]/g, ""));

    const totalSpan = document.getElementById(`total${id}`);
    const boton = document.getElementById(`btn-reservar-${id}`);

    if (noches > 0) {
        totalSpan.innerText = noches * precio + " €";
        boton.disabled = false;
    } else {
        totalSpan.innerText = "0 €";
        boton.disabled = true;
    }
}

// ===============================
// MODAL DE PAGO PREMIUM
// ===============================
let habitacionSeleccionada = null;

function reservarHabitacion(id) {
    habitacionSeleccionada = id;

    const entrada = document.getElementById(`entrada${id}`).value;
    const salida = document.getElementById(`salida${id}`).value;
    const noches = calcularNoches(entrada, salida);
    const total = noches * precios[id];

    const resumen = document.getElementById("resumenPago");
    resumen.textContent = `Habitación ${id} · ${noches} noche(s) · Total: ${total} €`;

    // limpiar campos
    ["pagoNombre", "pagoNumero", "pagoExpiracion", "pagoCVV"].forEach(id => {
        document.getElementById(id).value = "";
    });
    ["msgNombre", "msgNumero", "msgExp", "msgCVV"].forEach(id => {
        document.getElementById(id).textContent = "";
    });

    document.getElementById("btnConfirmarPago").disabled = true;

    const modal = new bootstrap.Modal(document.getElementById("modalPago"));
    modal.show();
    validarCamposPago();
}

// ===============================
// FORMATEO DEL NÚMERO DE TARJETA
// ===============================
function formatearNumeroTarjeta(valor) {
    return valor.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
}

// ===============================
// VALIDACIÓN PREMIUM DE PAGO
// ===============================
function validarCamposPago() {
    const nombre = document.getElementById("pagoNombre").value.trim();
    const numeroRaw = document.getElementById("pagoNumero").value;
    const numero = numeroRaw.replace(/\s/g, "");
    const exp = document.getElementById("pagoExpiracion").value.trim();
    const cvv = document.getElementById("pagoCVV").value.trim();

    const msgNombre = document.getElementById("msgNombre");
    const msgNumero = document.getElementById("msgNumero");
    const msgExp = document.getElementById("msgExp");
    const msgCVV = document.getElementById("msgCVV");

    msgNombre.textContent = nombre.length < 4 ? "Debe contener al menos 4 caracteres." : "";
    msgNumero.textContent = numero.length !== 16 ? "La tarjeta debe tener 16 dígitos." : "";
    msgExp.textContent = exp === "" ? "Selecciona una fecha de expiración." : "";
    msgCVV.textContent = cvv.length !== 3 ? "El código de seguridad son 3 dígitos." : "";

    const valido =
        nombre.length >= 4 &&
        numero.length === 16 &&
        /^\d+$/.test(numero) &&
        exp !== "" &&
        cvv.length === 3 &&
        /^\d+$/.test(cvv);

    document.getElementById("btnConfirmarPago").disabled = !valido;
}

// ===============================
// LISTENERS DE CAMPOS
// ===============================
["pagoNombre", "pagoNumero", "pagoExpiracion", "pagoCVV"].forEach(id => {
    document.getElementById(id).addEventListener("input", (e) => {

        if (id === "pagoNumero") {
            e.target.value = formatearNumeroTarjeta(e.target.value);
        }

        validarCamposPago();
    });
});

// ===============================
// CONFIRMAR PAGO → RESERVA REAL
// ===============================
document.getElementById("btnConfirmarPago").addEventListener("click", async () => {

    const id = habitacionSeleccionada;

    const entrada = document.getElementById(`entrada${id}`).value;
    const salida = document.getElementById(`salida${id}`).value;

    const noches = calcularNoches(entrada, salida);
    const precio = precios[id];
    const total = noches * precio;

    const userId = localStorage.getItem("id");

    try {
        // 1. Crear reserva
        const res1 = await fetch("http://localhost:8080/hotel/reservas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ usuario: { id: userId } })
        });

        const reserva = await res1.json();

        // 2. Asignar habitación
        const res2 = await fetch("http://localhost:8080/hotel/reservas-habitaciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                reservaId: reserva.id,
                habitacionId: id,
                fechaEntrada: entrada,
                fechaSalida: salida
            })
        });

        if (!res2.ok) {
            return mostrarMensajeReserva("Error al asignar habitación.", "danger");
        }

        mostrarMensajeReserva(`Reserva realizada correctamente. Total: ${total} €`, "success");

        // Cerrar modal
        bootstrap.Modal.getInstance(document.getElementById("modalPago")).hide();

    } catch (error) {
        console.error(error);
        mostrarMensajeReserva("Error al conectar con el servidor.", "danger");
    }
});

async function cargarHabitaciones() {
    try {
        const response = await fetch("http://localhost:8080/hotel/habitaciones", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const habitaciones = await response.json();
        renderizarHabitaciones(habitaciones);

    } catch (error) {
        console.error("Error:", error);
    }
}


function renderizarHabitaciones(habitaciones) {
    const API_URL = "http://localhost:8080";
    const container = document.getElementById("habitaciones-container");

    container.innerHTML = habitaciones.map(h => {

        precios[h.id] = Number(h.precioNoche);

        const carouselId = `carousel-${h.id}`;

        const safeImages = (h.imagenes && h.imagenes.length > 0)
            ? h.imagenes
            : ["/imagenes/placeholder.jpg"];

        const images = (h.imagenes ?? []).map((img, index) => `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
                <img src="${API_URL + img}"
                     class="d-block w-100"
                     style="height:350px; object-fit:cover;">
            </div>
        `).join("");

        return `
        <div class="card mb-5 shadow">
            <div class="row g-0">

                <div class="col-md-6">
                    <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">

                        <div class="carousel-inner">
                            ${images}
                        </div>

                        <button class="carousel-control-prev" type="button"
                            data-bs-target="#${carouselId}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon"></span>
                        </button>

                        <button class="carousel-control-next" type="button"
                            data-bs-target="#${carouselId}" data-bs-slide="next">
                            <span class="carousel-control-next-icon"></span>
                        </button>

                    </div>
                </div>

                <div class="col-md-6 p-4">
                    <h3>${h.nombre}</h3>
                    <p>${h.descripcion}</p>
                    <p class="fw-bold">${h.precioNoche} €</p>

                    <div class="row mb-3">
                        <div class="col">
                            <label>Entrada</label>
                            <input type="text" class="form-control entrada" id="entrada${h.id}">
                        </div>
                        <div class="col">
                            <label>Salida</label>
                            <input type="text" class="form-control salida" id="salida${h.id}">
                        </div>
                    </div>

                    <p class="fw-bold">Total: <span id="total${h.id}">0 €</span></p>

                    <button class="btn btn-dark"
                            id="btn-reservar-${h.id}"
                            onclick="reservarHabitacion(${h.id})"
                            disabled>
                        Reservar
                    </button>
                </div>

            </div>
        </div>
        `;
    }).join("");

    inicializarCalendarios();
}