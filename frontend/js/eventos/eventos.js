/**
 * ============================================================
 * VARIABLES GLOBALES Y CONFIGURACIÓN INICIAL
 * ============================================================
 */

let listaEventos = [];
let participantesActuales = 0;

// Configuración del calendario Flatpickr
flatpickr("#fechaEvento", {
    minDate: "today",
    dateFormat: "Y-m-d",
    disableMobile: true,
    // ESTO VALIDA EL BOTÓN AL ELEGIR FECHA
    onChange: function (selectedDates, dateStr, instance) {
        probarDisponibilidad(dateStr);
    }
});

/**
 * ============================================================
 * CARGA DE DATOS (FETCH INICIAL)
 * ============================================================
 */

async function cargarEventos() {
    // Petición al backend para obtener el catálogo de actividades
    const respuesta = await fetch(`${window.location.protocol}//${window.location.hostname}:8080/hotel/evento`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include" // Permite enviar cookies de sesión
    })

    const datos = await respuesta.json();
    listaActividades = datos;

    const select = document.getElementById("tipoEvento");
    select.innerHTML = '<option value="">Selecciona</option>';

    // Llenamos el select dinámicamente
    datos.forEach(evento => {
        const option = document.createElement("option");
        option.value = evento.id;
        option.textContent = evento.nombre;

        // Guardamos precio y capacidad técnica en el dataset de la etiqueta <option>
        option.dataset.capacidad = evento.capacidadPersonas;
        option.dataset.precio = evento.precioBase;
        select.appendChild(option);
        // Evento para resetear el contador de personas al cambiar de Event
    });

    select.addEventListener("change", function () {
        const inputPars = document.getElementById("participantesEvento");
        if (this.value !== "") {
            inputPars.value = 1; // Volver a 1 siempre
            actualizarPrecio();//actualizarPrecioEvento();
        }
        inputPars.value = "Selecciona";
    });

    const selectId = document.getElementById("eventoIdSelect");

    selectId.innerHTML = '<option value="">Seleccionar ID</option>';

    // llenar select con IDs
    datos.forEach(evento => {
        const option = document.createElement("option");

        option.value = evento.id;
        option.textContent = evento.id;

        selectId.appendChild(option);
    });

    // autofill
    selectId.addEventListener("change", function () {

        const eventoSeleccionada = datos.find(
            e => e.id == this.value
        );

        if (!eventoSeleccionada) {

            document.getElementById("eventoTipo").value = "";
            document.getElementById("eventoPrecio").value = "";
            document.getElementById("eventoCapacidad").value = "";

            return;
        }

        document.getElementById("eventoTipo").value =
            eventoSeleccionada.nombre || "";

        document.getElementById("eventoPrecio").value =
            eventoSeleccionada.precioBase || "";

        document.getElementById("eventoCapacidad").value =
            eventoSeleccionada.capacidadPersonas || "";
    });
}
// Llamada inmediata para cargar los datos al abrir la página
cargarEventos()

/**
 * ============================================================
 * LÓGICA DE INTERFAZ (Contador y Precios)
 * ============================================================
 */

function cambiarParticipantesEvento(valor) {

    const select = document.getElementById("tipoEvento");

    if (!select.value || select.value === "Selecciona") {
        mostrarAvisoActividad("Selecciona un Evento primero.");
        return;
    }

    const capacidad = parseInt(select.options[select.selectedIndex].dataset.capacidad) || 999;

    const nuevo = participantesActuales + valor;

    if (nuevo >= 1 && nuevo <= capacidad) {
        participantesActuales = nuevo;

        document.getElementById("participantesEvento").value = participantesActuales;

        actualizarPrecio();
    }
}


async function probarDisponibilidad(fecha) {

    const selectEvento =
        document.getElementById("tipoEvento");

    const selectSala =
        document.getElementById("salaEvento");

    const selectCatering =
        document.getElementById("cateringEvento");

    try {

        const response = await fetch(
            `${window.location.protocol}//${window.location.hostname}:8080/hotel/reservas-eventos/ocupadas/${fecha}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Error obteniendo eventos");
        }

        const reservas = await response.json();

        // =====================================
        // RESET EVERYTHING
        // =====================================
        for (const option of selectEvento.options) {
            option.disabled = false;
        }

        for (const option of selectSala.options) {
            option.disabled = false;
        }

        for (const option of selectCatering.options) {
            option.disabled = false;
        }


        // =====================================
        // GROUP TURNOS BY ACTIVITY
        // =====================================
        const eventosReservadas = {};

        reservas.forEach(reserva => {

            const idEvento =
                reserva.evento.id;

            const sala =
                reserva.sala;

            const catering =
                reserva.catering;

            if (!eventosReservadas[idEvento]) {
                eventosReservadas[idEvento] = [];
            }

            eventosReservadas[idEvento]
                .push(sala);
        });

        // =====================================
        // DISABLE ACTIVITIES WITH BOTH TURNOS
        // =====================================
        for (const idEvento in eventosReservadas) {

            const salas =
                eventosReservadas[idEvento];

            if (salas.length >= 2) {

                for (const option of selectEvento.options) {

                    if (
                        parseInt(option.value) ===
                        parseInt(idEvento)
                    ) {
                        option.disabled = true;
                    }
                }
            }
        }

        // =====================================
        // WHEN USER CHOOSES ACTIVITY
        // DISABLE ONLY RESERVED TURNOS
        // =====================================
        selectEvento.addEventListener("change", () => {

            // Enable all turnos first
            for (const option of selectSala.options) {
                option.disabled = false;
            }

            const eventoSeleccionada =
                selectEvento.value;

            const salasReservados =
                eventosReservadas[
                eventoSeleccionada
                ] || [];

            for (const option of selectSala.options) {

                if (
                    salasReservados.includes(
                        option.value
                    )
                ) {
                    option.disabled = true;
                }
            }
        });

    } catch (error) {

        console.error(
            "Error al cargar actividades ocupadas:",
            error
        );
    }
}

document.getElementById("btnEvento")
    .addEventListener("click", () => {

        const modal =
            new bootstrap.Modal(
                document.getElementById("modalPago")
            );

        modal.show();
    });

/**
 * ============================================================
 * PROCESO DE RESERVA (POST)
 * ============================================================
 */

function inicializarModalPago() {

    document.addEventListener("click", async (e) => {

        if (e.target && e.target.id === "btnConfirmarPago") {
            const fecha = document.getElementById("fechaEvento").value;
            const selectElement = document.getElementById("tipoEvento");
            const idEvento = selectElement.value;
            const sala = document.getElementById("salaEvento").value;
            const catering = document.getElementById("cateringEvento").value;


            const personas = parseInt(document.getElementById("participantesEvento").value);
            const userId = localStorage.getItem("id"); // Recuperamos el ID del usuario logueado

            try {
                // PASO 1: Creamos la Reserva Maestra vinculada al usuario
                const res1 = await fetch(`${window.location.protocol}//${window.location.hostname}:8080/hotel/reservas`, {
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


                const res2 = await fetch(`${window.location.protocol}//${window.location.hostname}:8080/hotel/reservas-eventos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(datosEvento)
                });

                if (res2.ok) {
                    mostrarAvisoEvento("❌ Error al realizar la reserva", "danger");
                    // Refrescamos disponibilidad para que el dataset se actualice tras la reserva
                };

                const modal = bootstrap.Modal.getInstance(
                    document.getElementById("modalPago")
                );

                modal.hide();

                setTimeout(() => {
                    mostrarAvisoEvento("✅ Reserva realizada correctamente", "succes");
                    resetearFormulario();
                }, 300);

            } catch (error) {
                console.error("Mensaje de error:", error.message);
            }
        }
    });

    document.addEventListener("input", (e) => {

        if (!e.target) return;

        const id = e.target.id;

        if (id === "pagoNumero") {
            e.target.value = formatearNumeroTarjeta(e.target.value);
        }

        if (
            id === "pagoNombre" ||
            id === "pagoNumero" ||
            id === "pagoExpiracion" ||
            id === "pagoCVV"
        ) {
            validarCamposPago();
        }
    });
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

/**
 * ============================================================
 * LÓGICA DE VALIDACIÓN (Activar/Desactivar Botón)
 * ============================================================
 */

async function validarReservaEvento() {
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
    const contenedorAlerta = document.getElementById('mensajeAlertaEvento');
    if (contenedorAlerta) contenedorAlerta.innerHTML = "";
    const select = document.getElementById("tipoEvento");
    const inputPars = document.getElementById("participantesEvento");
    const displayTotal = document.getElementById("totalEvento");

    // 1. Obtenemos la opción seleccionada
    const opcionElegida = select.options[select.selectedIndex];

    // 2. Extraemos el precio del dataset (que guardaste al cargar los eventos)
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
    const selectEvento = document.getElementById("tipoEvento");
    const inputFecha = document.getElementById("fechaEvento");
    const selectSala = document.getElementById("salaEvento");
    const selectCatering = document.getElementById("cateringEvento");
    const inputParticipantes = document.getElementById("participantesEvento");
    const textoTotal = document.getElementById("totalEvento");

    if (selectEvento) {
        selectEvento.selectedIndex = 0;
        delete selectEvento.dataset.capacidad;
        delete selectEvento.dataset.precio;
    }

    if (selectSala) {
        selectSala.selectedIndex = 0;
    }

    if (selectCatering) {
        selectCatering.selectedIndex = 0;
    }

    if (inputFecha) {
        inputFecha.value = "";
    }

    if (inputParticipantes) {
        inputParticipantes.value = 1;
        inputParticipantes.max = "";
    }

    if (textoTotal) {
        textoTotal.textContent = "0.00 €";
    }

    console.log("Formulario de eventos limpiado y listo para nueva selección.");
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


/**
 * ============================================================
 * FUNCIÓN PARA MOSTRAR AVISOS DE BOOTSTRAP
 * ============================================================
 */
function mostrarAvisoEvento(mensaje, tipo = "warning") {
    const contenedor = document.getElementById('mensajeAlertaEvento');
    contenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show small py-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> ${mensaje}
            <button type="button" class="btn-close py-2" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    // Autocerrado tras 4 segundos para no ensuciar la vista
    setTimeout(() => {
        const alerta = document.querySelector('#mensajeAlertaEvento .alert');
        if (alerta) {
            const bsAlert = new bootstrap.Alert(alerta);
            bsAlert.close();
        }
    }, 4000);
}