/**
 * ============================================================
 * VARIABLES GLOBALES Y CONFIGURACIÓN INICIAL
 * ============================================================
 */

let listaActividades = []; // Almacena las actividades traídas del servidor
let reservasOcupadas = [];
// Configuración del calendario Flatpickr
const calendarioEvento = flatpickr("#fechaEvento", {
    minDate: "today",
    dateFormat: "Y-m-d",
    disableMobile: true,
    // BLOQUEO DE FECHAS SEGÚN SALA
    disable: [
        function (date) {
            const sala = document.getElementById("salaEvento").value;
            if (!sala || sala === "Selecciona") return false;

            const d = date.getDate().toString().padStart(2, '0');
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const y = date.getFullYear();
            const fechaFormateada = `${y}-${m}-${d}`;

            return reservasOcupadas.some(r => r.sala === sala && r.fecha === fechaFormateada);
        }
    ],
    // ESTO VALIDA EL BOTÓN AL ELEGIR FECHA
    onChange: function (selectedDates, dateStr, instance) {
        validarReservaEvento();
    }
});

/**
 * ============================================================
 * CARGA DE DATOS (FETCH INICIAL)
 * ============================================================
 */

async function cargarEventos() {
    // Petición al backend para obtener el catálogo de actividades
    const respuesta = await fetch('http://localhost:8080/hotel/evento', {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include" // Permite enviar cookies de sesión
    })

    const datos = await respuesta.json();
    listaActividades = datos;

    const select = document.getElementById("tipoEvento");
    select.innerHTML = '<option value="">Selecciona una actividad</option>';

    // Llenamos el select dinámicamente
    datos.forEach(actividad => {
        const option = document.createElement("option");
        option.value = actividad.id;
        option.textContent = actividad.nombre;

        // Guardamos precio y capacidad técnica en el dataset de la etiqueta <option>
        option.dataset.capacidad = actividad.capacidad;
        option.dataset.precio = actividad.precioBase;
        select.appendChild(option);
        // Evento para resetear el contador de personas al cambiar de Evento

        select.addEventListener("change", function () {
            const inputPars = document.getElementById("participantesEvento");
            if (this.value !== "") {
                inputPars.value = 1; // Volver a 1 siempre
                //actualizarPrecioEvento();
            }
            inputPars.value = " ";
        });
    });
}
// Llamada inmediata para cargar los datos al abrir la página
cargarEventos()

/**
 * ============================================================
 * LÓGICA DE INTERFAZ (Contador y Precios)
 * ============================================================
 */

function cambiarParticipantesEvento(valorRecibido) {
    const inputPars = document.getElementById("participantesEvento");
    const select = document.getElementById("tipoEvento");
    // Si no han elegido evento, no dejes sumar personas
    if (select.value === "") return;
    const opcionElegida = select.options[select.selectedIndex];

    // Extraemos el límite actual (puede ser la capacidad total o los cupos reales del servidor)
    const limiteReal = parseInt(opcionElegida.dataset.capacidad);

    // Calculamos la nueva cantidad sumando el paso (1 o -1)
    let nuevaCantidad = (parseInt(inputPars.value) || 0) + valorRecibido;

    // Solo actualizamos el input si el número está entre 1 y el límite permitido
    if (nuevaCantidad >= 1 && nuevaCantidad <= limiteReal) {
        inputPars.value = nuevaCantidad;
        actualizarPrecio();
    }
}

/**
 * ============================================================
 * FECHAS OCUPADAS
 * ============================================================
 */

async function cargarFechasOcupadas() {
    try {
        const res = await fetch("http://localhost:8080/hotel/eventos/ocupados", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"

        });
        reservasOcupadas = await res.json();
        calendarioEvento.redraw();
    } catch (error) {
        console.error("Error cargando fechas ocupadas:", error);
    }
}

// Ejecución inicial
cargarEventos();
cargarFechasOcupadas();

// Al cambiar sala, refresca el bloqueo de fechas en el calendario
document.getElementById("salaEvento").addEventListener("change", () => {
    calendarioEvento.redraw();
    validarReservaEvento();
});

/**
 * ============================================================
 * PROCESO DE RESERVA (POST)
 * ============================================================
 */

async function reservarEvento() {
    const fecha = document.getElementById("fechaEvento").value;
    const selectElement = document.getElementById("tipoEvento");
    const idEvento = selectElement.value;
    const sala = document.getElementById("salaEvento").value;
    const catering = document.getElementById("cateringEvento").value;


    const personas = parseInt(document.getElementById("participantesEvento").value);
    const userId = localStorage.getItem("id"); // Recuperamos el ID del usuario logueado

    try {
        // PASO 1: Creamos la Reserva Maestra vinculada al usuario
        const res1 = await fetch("http://localhost:8080/hotel/reservas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ usuario: { id: userId } })
        });

        const reserva = await res1.json(); // Obtenemos el ID de reserva generado por la BD

        // PASO 2: Vinculamos la actividad específica a esa reserva maestra
        const datosEvento = {
            reservaId: reserva.id,
            eventoId: idEvento,
            fecha: fecha,
            participantes: personas,
            sala: sala,
            catering: catering,
        };


        const res2 = await fetch("http://localhost:8080/hotel/reservas-eventos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(datosEvento)
        });

        if (res2.ok) {
            alert("¡Reserva completada!");
            // Refrescamos disponibilidad para que el dataset se actualice tras la reserva
        };

    } catch (error) {
        console.error("Mensaje de error:", error.message);
    }
}

// Vinculamos la función de reserva al botón principal

document.getElementById("btnEvento").addEventListener("click", reservarEvento);

/**
 * ============================================================
 * LÓGICA DE VALIDACIÓN (Activar/Desactivar Botón)
 * ============================================================
 */

function validarReservaEvento() {
    const fecha = document.getElementById("fechaEvento").value;
    const tipo = document.getElementById("tipoEvento").value;
    const sala = document.getElementById("salaEvento").value;
    const catering = document.getElementById("cateringEvento").value;

    const boton = document.getElementById("btnEvento");

    if (fecha && tipo && sala && catering !== "Selecciona") {
        boton.disabled = false;
        boton.style.opacity = "1";
        boton.style.cursor = "pointer";
    } else {
        boton.disabled = true;
        boton.style.opacity = "0.5";
        // boton.style.cursor = "not-allowed";
    }
}
document.getElementById("tipoEvento").addEventListener("change", validarReservaEvento);
document.getElementById("salaEvento").addEventListener("change", validarReservaEvento);
document.getElementById("cateringEvento").addEventListener("change", validarReservaEvento);
validarReservaEvento();


/**
 * ============================================================
 * CÁLCULO DE PRECIOS
 * ============================================================
 */

function actualizarPrecio() {
    const select = document.getElementById("tipoEvento");
    const inputPars = document.getElementById("participantesEvento");
    const displayTotal = document.getElementById("totalEvento");

    // 1. Obtenemos la opción seleccionada
    const opcionElegida = select.options[select.selectedIndex];

    // 2. Extraemos el precio del dataset (que guardaste al cargar las actividades)
    const precioBase = parseFloat(opcionElegida.dataset.precio) || 0;
    const cantidad = parseInt(inputPars.value) || 0;

    // 3. Calculamos y mostramos
    const total = precioBase * cantidad;
    displayTotal.textContent = total + " €";
}

/**
 * ============================================================
 * RESETEAR FORMULARIO
 * ============================================================
 */

function resetearFormularioEventos() {
    location.reload(); // La forma más segura de limpiar todo
}