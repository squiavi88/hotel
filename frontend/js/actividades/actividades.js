/**
 * ============================================================
 * VARIABLES GLOBALES Y CONFIGURACIÓN INICIAL
 * ============================================================
 */

let listaActividades = []; // Almacena las actividades traídas del servidor

// Configuración del calendario Flatpickr
flatpickr("#fechaActividad", {
    minDate: "today",    // No permite fechas pasadas
    dateFormat: "Y-m-d", // Formato compatible con Java LocalDate
    disableMobile: true,
    // Esto asegura que la validación corra en cuanto el usuario elija una fecha
    onChange: function (selectedDates, dateStr, instance) {
        validarReservaActividades();
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
        option.dataset.capacidad = actividad.capacidad;
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
}

// Llamada inmediata para cargar los datos al abrir la página
cargarActividades();

/**
 * ============================================================
 * LÓGICA DE INTERFAZ (Contador y Precios)
 * ============================================================
 */

function cambiarParticipantes(valorRecibido) {
    const inputPars = document.getElementById("participantesActividad");
    const select = document.getElementById("actividadSeleccionada");

    // CAMBIO AQUÍ: Debe ser mostrarAvisoActividad
    if (select.value === "" || select.value === "Selecciona") {
        mostrarAvisoActividad("Selecciona una actividad para poder ajustar los participantes.");
        return;
    }

    const opcionElegida = select.options[select.selectedIndex];
    // Agregamos un || 0 por seguridad si el dataset está vacío
    const limiteReal = parseInt(opcionElegida.dataset.capacidad) || 0;
    let nuevaCantidad = (parseInt(inputPars.value) || 0) + valorRecibido;

    if (nuevaCantidad >= 1 && nuevaCantidad <= limiteReal) {
        inputPars.value = nuevaCantidad;
        actualizarPrecio();
    }
}

/**
 * ============================================================
 * DISPONIBILIDAD EN TIEMPO REAL
 * ============================================================
 */

function actualizarDisponibilidadVisual() {
    // Capturamos los 3 datos necesarios para identificar un turno único
    const id = document.getElementById("actividadSeleccionada").value;
    const fecha = document.getElementById("fechaActividad").value;
    const turno = document.getElementById("turnoActividad").value;

    // Solo disparamos la consulta si el usuario ya llenó los tres campos
    if (id && fecha && turno) {
        probarDisponibilidad(id, fecha, turno);
    }
}

// Listeners para que la disponibilidad se actualice automáticamente al cambiar inputs
document.getElementById("actividadSeleccionada").addEventListener("change", actualizarDisponibilidadVisual);
document.getElementById("fechaActividad").addEventListener("change", actualizarDisponibilidadVisual);
document.getElementById("turnoActividad").addEventListener("change", actualizarDisponibilidadVisual);

async function probarDisponibilidad(idActividad, fecha, turno) {
    try {
        // Consultamos al endpoint de disponibilidad
        const response = await fetch(`http://localhost:8080/hotel/${idActividad}/disponibilidad?fecha=${fecha}&turno=${turno}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const data = await response.json();
        const select = document.getElementById("actividadSeleccionada");
        const opcionElegida = select.options[select.selectedIndex];

        // SOBREESCRIBIMOS el dataset con los cupos reales que quedan en la DB para ese turno
        opcionElegida.dataset.capacidad = data.cuposDisponibles;

    } catch (error) {
        console.error("Hubo un fallo al conectar con el Controller:", error);
    }
}

/**
 * ============================================================
 * PROCESO DE RESERVA (POST)
 * ============================================================
 */

async function reservarActividad() {
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

        if (res2.ok) {
            alert("¡Reserva completada!");
            // Refrescamos disponibilidad para que el dataset se actualice tras la reserva
            probarDisponibilidad(idActividad, fecha, turno);
            resetearFormularioActividades();
        };

    } catch (error) {
        console.error("Mensaje de error:", error.message);
    }
}

// Vinculamos la función de reserva al botón principal
document.getElementById("btnActividad").addEventListener("click", reservarActividad);

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