/**
 * ============================================================
 * VARIABLES GLOBALES Y CONFIGURACIÓN INICIAL
 * ============================================================
 */

let listaActividades = []; // Almacena las actividades traídas del servidor
let participantesActuales = 1;

// Configuración del calendario Flatpickr
flatpickr("#fechaActividad", {
    minDate: "today",    // No permite fechas pasadas
    dateFormat: "Y-m-d", // Formato compatible con Java LocalDate
    disableMobile: true,
    // Esto asegura que la validación corra en cuanto el usuario elija una fecha
    onChange: function (selectedDates, dateStr, instance) {
        probarDisponibilidad(dateStr);
    }
});

/**
 * ============================================================
 * CARGA DE DATOS (FETCH INICIAL)
 * ============================================================
 */

async function cargarActividades() {
    // Petición al backend para obtener el catálogo de actividades
    const respuesta = await fetch('http://localhost:8080/hotel/actividad', {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include" // Permite enviar cookies de sesión
    })

    const datos = await respuesta.json();
    listaActividades = datos;

    const select = document.getElementById("actividadSeleccionada");
    select.innerHTML = '<option value="">Selecciona una actividad</option>';

    // Llenamos el select dinámicamente
    datos.forEach(actividad => {
        const option = document.createElement("option");
        option.value = actividad.id;
        option.textContent = actividad.nombre;

        // Guardamos precio y capacidad técnica en el dataset de la etiqueta <option>
        option.dataset.capacidad = actividad.capacidadPersonas;
        option.dataset.precio = actividad.precioBase;
        select.appendChild(option);
    });

    // Evento para resetear el contador de personas al cambiar de actividad
    select.addEventListener("change", function () {
        const inputPars = document.getElementById("participantesActividad");
        if (this.value !== "" && this.value !== "Selecciona") {
            inputPars.value = 1; // Valor inicial por defecto
            actualizarPrecio();
        } else {
            inputPars.value = "Selecciona";
        }
    });

    const selectId = document.getElementById("actividadIdSelect");

    selectId.innerHTML = '<option value="">Seleccionar ID</option>';

// llenar select con IDs
    datos.forEach(actividad => {
        const option = document.createElement("option");

        option.value = actividad.id;
        option.textContent = actividad.id;

        selectId.appendChild(option);
    });

// autofill
    selectId.addEventListener("change", function () {

        const actividadSeleccionada = datos.find(
            a => a.id == this.value
        );

        if (!actividadSeleccionada) {

            document.getElementById("actividadNombre").value = "";
            document.getElementById("actividadPrecio").value = "";
            document.getElementById("actividadCapacidad").value = "";

            return;
        }

        document.getElementById("actividadNombre").value =
            actividadSeleccionada.nombre || "";

        document.getElementById("actividadPrecio").value =
            actividadSeleccionada.precioBase || "";

        document.getElementById("actividadCapacidad").value =
            actividadSeleccionada.capacidadPersonas || "";
    });
}

// Llamada inmediata para cargar los datos al abrir la página
cargarActividades();

/**
 * ============================================================
 * LÓGICA DE INTERFAZ (Contador y Precios)
 * ============================================================
 */

function cambiarParticipantes(valor) {

    const select = document.getElementById("actividadSeleccionada");

    if (!select.value || select.value === "Selecciona") {
        mostrarAvisoActividad("Selecciona una actividad primero.");
        return;
    }

    const capacidad = parseInt(select.options[select.selectedIndex].dataset.capacidad) || 999;

    const nuevo = participantesActuales + valor;

    if (nuevo >= 1 && nuevo <= capacidad) {
        participantesActuales = nuevo;

        document.getElementById("participantesActividad").value = participantesActuales;

        actualizarPrecio();
    }
}


async function probarDisponibilidad(fecha) {

    const selectActividad =
        document.getElementById("actividadSeleccionada");

    const selectTurno =
        document.getElementById("turnoActividad");

    try {

        const response = await fetch(
            `http://localhost:8080/hotel/reservas-actividades/ocupadas/${fecha}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Error obteniendo actividades");
        }

        const reservas = await response.json();

        // =====================================
        // RESET EVERYTHING
        // =====================================
        for (const option of selectActividad.options) {
            option.disabled = false;
        }

        for (const option of selectTurno.options) {
            option.disabled = false;
        }

        // =====================================
        // GROUP TURNOS BY ACTIVITY
        // =====================================
        const actividadesReservadas = {};

        reservas.forEach(reserva => {

            const idActividad =
                reserva.actividad.id;

            const turno =
                reserva.turno;

            if (!actividadesReservadas[idActividad]) {
                actividadesReservadas[idActividad] = [];
            }

            actividadesReservadas[idActividad]
                .push(turno);
        });

        // =====================================
        // DISABLE ACTIVITIES WITH BOTH TURNOS
        // =====================================
        for (const idActividad in actividadesReservadas) {

            const turnos =
                actividadesReservadas[idActividad];

            // If activity has 2 reserved turnos
            if (turnos.length >= 2) {

                for (const option of selectActividad.options) {

                    if (
                        parseInt(option.value) ===
                        parseInt(idActividad)
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
        selectActividad.addEventListener("change", () => {

            // Enable all turnos first
            for (const option of selectTurno.options) {
                option.disabled = false;
            }

            const actividadSeleccionada =
                selectActividad.value;

            const turnosReservados =
                actividadesReservadas[
                    actividadSeleccionada
                    ] || [];

            for (const option of selectTurno.options) {

                if (
                    turnosReservados.includes(
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

document.getElementById("btnActividad")
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
            const fecha = document.getElementById("fechaActividad").value;
            const selectElement = document.getElementById("actividadSeleccionada");
            const idActividad = selectElement.value;
            const turno = document.getElementById("turnoActividad").value;
            const personas = parseInt(document.getElementById("participantesActividad").value);
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
                const datosActividad = {
                    reservaId: reserva.id,
                    actividadId: idActividad,
                    fecha: fecha,
                    turno: turno,
                    participantes: personas,
                    monto: 0 // El backend calculará el precio final
                };

                const res2 = await fetch("http://localhost:8080/hotel/reservas-actividades", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(datosActividad)
                });

                if (!res2.ok) {
                    mostrarAvisoActividad("❌ Error al realizar la reserva", "danger");
                }

                const modal = bootstrap.Modal.getInstance(
                    document.getElementById("modalPago")
                );

                modal.hide();

                setTimeout(() => {
                    mostrarAvisoActividad("✅ Reserva realizada correctamente", "succes");
                    resetearFormulario();
                }, 300);

            } catch (err) {
                console.error(err);
                alert("Error de servidor.");
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

function validarReservaActividades() {
    // 1. Capturamos los valores
    const fecha = document.getElementById("fechaActividad").value;
    const actividad = document.getElementById("actividadSeleccionada").value;
    const turno = document.getElementById("turnoActividad").value;
    const boton = document.getElementById("btnActividad");

    // 2. Definimos las condiciones (Booleanos)
    // Lo que preguntabas: si la longitud es > 0, es que hay algo escrito
    const isFechaOk = fecha.length > 0;
    const isActividadOk = actividad !== "" && actividad !== "Selecciona";
    const isTurnoOk = turno !== "" && turno !== "Selecciona";

    // 3. Si todo es true, habilitamos el botón
    if (isFechaOk && isActividadOk && isTurnoOk) {
        boton.disabled = false;
        boton.style.opacity = "1"; // Se ve normal
        boton.style.backgroundColor = "#212529"; // Color oscuro del botón

        boton.style.cursor = "pointer";
    } else {
        // Si falta algo, lo bloqueamos
        boton.disabled = true;
        boton.style.opacity = "0.5"; // Se ve traslúcido
        // boton.style.cursor = "not-allowed";
    }
}
// Escuchadores para activar/desactivar el botón en tiempo real
document.getElementById("fechaActividad").addEventListener("change", validarReservaActividades);
document.getElementById("actividadSeleccionada").addEventListener("change", validarReservaActividades);
document.getElementById("turnoActividad").addEventListener("change", validarReservaActividades);
validarReservaActividades();


/**
 * ============================================================
 * CÁLCULO DE PRECIOS
 * ============================================================
 */

function actualizarPrecio() {
    // Limpia el contenedor de alertas cuando hay una acción válida
    const contenedorAlerta = document.getElementById('mensajeAlertaActividad');
    if (contenedorAlerta) contenedorAlerta.innerHTML = "";
    const select = document.getElementById("actividadSeleccionada");
    const inputPars = document.getElementById("participantesActividad");
    const displayTotal = document.getElementById("totalActividad");

    // 1. Obtenemos la opción seleccionada
    const opcionElegida = select.options[select.selectedIndex];

    // 2. Extraemos el precio del dataset (que guardaste al cargar las actividades)
    const precioBase = parseFloat(opcionElegida.dataset.precio) || 0;
    const cantidad = parseInt(inputPars.value) || 0;

    // 3. Calculamos y mostramos
    const total = precioBase * cantidad;
    displayTotal.textContent = total.toFixed(2) + " €";
}
/**
 * ============================================================
 * RESETEAR FORMULARIO
 * ============================================================
 */
function resetearFormularioActividades() {
    // Referencias a los elementos del DOM
    const selectActividad = document.getElementById("actividadSeleccionada");
    const selectTurno = document.getElementById("turnoActividad");
    const inputFecha = document.getElementById("fechaActividad");
    const inputParticipantes = document.getElementById("participantesActividad");
    const textoTotal = document.getElementById("totalActividad");

    // 1. Resetear Actividad: Vuelve a la primera opción ("Selecciona una actividad")
    if (selectActividad) {
        selectActividad.selectedIndex = 0;
        // Limpiamos los datos de capacidad guardados en el selector
        delete selectActividad.dataset.capacidad;
        delete selectActividad.dataset.precio;
    }

    // 2. Resetear Turno: Vuelve a la primera opción ("Selecciona un turno")
    if (selectTurno) {
        selectTurno.selectedIndex = 0;
    }

    // 3. Resetear Fecha: Limpia el valor seleccionado
    if (inputFecha) {
        inputFecha.value = "";
        // Si usas Flatpickr, es recomendable usar: inputFecha._flatpickr.clear();
    }

    // 4. Resetear Participantes: Lo dejamos en 1 por defecto (mínimo legal)
    if (inputParticipantes) {
        inputParticipantes.value = 1;
        // Importante: Si tenías un límite máximo previo, lo reseteamos
        inputParticipantes.max = "";
    }

    // 5. Resetear Precio: Volvemos al estado inicial informativo
    if (textoTotal) {
        textoTotal.textContent = "0.00 €";
    }

    console.log("Formulario de actividades limpiado y listo para nueva selección.");
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
function mostrarAvisoActividad(mensaje, tipo = "warning") {
    const contenedor = document.getElementById('mensajeAlertaActividad');
    contenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show small py-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> ${mensaje}
            <button type="button" class="btn-close py-2" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    // Autocerrado tras 4 segundos para no ensuciar la vista
    setTimeout(() => {
        const alerta = document.querySelector('#mensajeAlertaActividad .alert');
        if (alerta) {
            const bsAlert = new bootstrap.Alert(alerta);
            bsAlert.close();
        }
    }, 4000);
}