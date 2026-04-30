// =====================================
// AÑADIDO: almacenamos precios por id
// =====================================
const precios = {};


// =====================================
// HACEMOS LA CARGA DE LAS HABITACIONES
// =====================================
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


// ==============================================
// CARGAMOS LOS CALENDARIOS DE ENTRADA Y SALIDA
// ==============================================
async function iniciarCalendarios(idhabitaciones) {

    try {
        const response = await fetch(
            `http://localhost:8080/hotel/reservas-habitaciones/ocupadas/${idhabitaciones}`,
            {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            }
        );

        const fechasBD = await response.json();

        console.log(`--- Datos RAW habitación ${idhabitaciones} ---`);
        console.table(fechasBD);

        const fechasDeshabilitadas = fechasBD.map(f => ({
            from: f.fechaEntrada,
            to: f.fechaSalida
        }));


        // ⭐ AÑADIDO: onChange para actualizar total y botón
        flatpickr(`#fecha-${idhabitaciones}`, {
            dateFormat: "Y-m-d",
            minDate: "today",
            disableMobile: true,
            showMonths: 1,
            disable: fechasDeshabilitadas,
            onChange: () => actualizarReserva(idhabitaciones)
        });

        // AÑADIDO: onChange también aquí
        flatpickr(`#salida-${idhabitaciones}`, {
            dateFormat: "Y-m-d",
            minDate: "today",
            disableMobile: true,
            showMonths: 1,
            disable: fechasDeshabilitadas,
            onChange: () => actualizarReserva(idhabitaciones)
        });

    } catch (error) {
        console.error("Error al cargar fechas ocupadas:", error);
    }
}


// =====================================
// AÑADIDO: ACTUALIZA TOTAL Y BOTÓN
// =====================================
function actualizarReserva(id) {

    const entrada = document.getElementById(`fecha-${id}`).value;
    const salida = document.getElementById(`salida-${id}`).value;

    if (!entrada || !salida) return;

    const noches = calcularNoches(entrada, salida);

    if (noches <= 0) return;

    const precio = precios[id];
    const total = noches * precio;

    document.getElementById(`total-${id}`).textContent = `${total} €`;

    // AÑADIDO: activar botón
    document.getElementById(`btn-reservar-${id}`).disabled = false;
}


// =====================================
// CREAR RESERVA
// =====================================
async function crearReserva(userId) {

    try {
        const response = await fetch("http://localhost:8080/hotel/reservas", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: { id: userId }
            })
        });

        return await response.json();

    } catch (error) {
        console.error("Error creando reserva:", error);
        throw error;
    }
}


// =====================================
// ASIGNAR HABITACION A RESERVA
// =====================================
async function asignarHabitacion(reservaId, habitacionId, entrada, salida) {

    try {
        const response = await fetch(
            "http://localhost:8080/hotel/reservas-habitaciones",
            {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reservaId,
                    habitacionId,
                    fechaEntrada: entrada,
                    fechaSalida: salida
                })
            }
        );

        if (!response.ok) {
            throw new Error("No se pudo asignar habitación");
        }

        return true;

    } catch (error) {
        console.error("Error asignando habitación:", error);
        throw error;
    }
}


// =====================================
// RESERVAR HABITACION
// =====================================
async function reservarHabitacion(id) {

    const entrada = document.getElementById(`fecha-${id}`).value;
    const salida = document.getElementById(`salida-${id}`).value;

    if (!entrada || !salida) {
        mostrarMensajeReserva("Selecciona fechas", "danger");
        return;
    }

    const noches = calcularNoches(entrada, salida);
    const precio = precios[id];
    const total = noches * precio;

    const userId = localStorage.getItem("id");

    try {

        const reserva = await crearReserva(userId);

        await asignarHabitacion(
            reserva.id,
            id,
            entrada,
            salida
        );

        mostrarMensajeReserva(
            `Reserva realizada correctamente. Total: ${total} €`,
            "success"
        );

    } catch (error) {
        mostrarMensajeReserva("Error al realizar la reserva", "danger");
    }
}


// =====================================
// CALCULAR NUMERO DE NOCHES
// =====================================
// AÑADIDO: validación anti-errores
function calcularNoches(fechaEntrada, fechaSalida) {

    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);

    const diferencia = salida - entrada;

    const noches = diferencia / (1000 * 60 * 60 * 24);

    return noches > 0 ? noches : 0;
}


// ===============================
// RENDERIZAMOS LAS HABITACIONES
// ===============================
function renderizarHabitaciones(habitaciones) {

    const contenedor = document.getElementById("contenedor-habitaciones");
    contenedor.innerHTML = "";

    habitaciones.forEach(hab => {

        // AÑADIDO: guardamos precio por id
        precios[hab.id] = hab.precioNoche;

        contenedor.innerHTML += `
        <div class="card mb-5 shadow">
            <div class="row g-0">
                <div class="col-md-6">
                    <div id="carousel-${hab.id}" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src="imagenes/ROOMS/DOS/room_2.1.png" class="d-block w-100">
                            </div>
                            <div class="carousel-item">
                                <img src="imagenes/ROOMS/DOS/room_2.2.png" class="d-block w-100">
                            </div>
                        </div>
                        <button class="carousel-control-prev" type="button"
                            data-bs-target="#carousel-${hab.id}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon"></span>
                        </button>
                        <button class="carousel-control-next" type="button"
                            data-bs-target="#carousel-${hab.id}" data-bs-slide="next">
                            <span class="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </div>

                <div class="col-md-6 p-4">
                    <h3>${hab.nombre}</h3>
                    <p>${hab.descripcion}</p>
                    <p class="fw-bold">Precio por noche: ${hab.precioNoche} €</p>

                    <div class="row mb-3">
                        <div class="col">
                            <label>Entrada</label>
                            <input type="text" class="form-control"
                                   id="fecha-${hab.id}">
                        </div>
                        <div class="col">
                            <label>Salida</label>
                            <input type="text" class="form-control"
                                   id="salida-${hab.id}">
                        </div>
                    </div>

                    <p class="fw-bold">
                        Total: <span id="total-${hab.id}">0 €</span>
                    </p>

                    <button id="btn-reservar-${hab.id}"
                        class="btn btn-dark"
                        onclick="reservarHabitacion(${hab.id})"
                        disabled>
                        Reservar
                    </button>
                </div>
            </div>
        </div>
        `;

        iniciarCalendarios(hab.id);
    });
}


// =====================================
// INICIO
// =====================================
document.addEventListener("DOMContentLoaded", cargarHabitaciones);