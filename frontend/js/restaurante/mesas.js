
/**
 * =====================================
 * VARIABLES GLOBALES
 * =====================================
 */
let misMesas = [];
let indiceActual = 0;
let mesaSeleccionada = null;

/**
 * =====================================
 * INICIALIZACIÓN GLOBAL
 * =====================================
 */
document.addEventListener("DOMContentLoaded", () => {

    cargarMesas();

    // BOTÓN RESERVAR → ABRIR MODAL
    const btn = document.getElementById("btnRestaurante");
    if (btn) {
        btn.addEventListener("click", abrirModalPagoMesa);
    }

    // CARGA DINÁMICA DEL MODAL
    fetch("./modalPago.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("modal-pago-container").innerHTML = html;

            setTimeout(() => {
                inicializarModalPago();
            }, 0);
        });
});

/**
 * =====================================
 * CARGAR MESAS
 * =====================================
 */
async function cargarMesas() {
    try {
        const respuesta = await fetch(`${window.location.protocol}//${window.location.hostname}:8080/hotel/mesas`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

        misMesas = await respuesta.json();

        const select =
            document.getElementById("mesaIdSelect");

        select.innerHTML =
            '<option value="">Seleccionar ID</option>';

        // llenar select con IDs
        misMesas.forEach(mesa => {

            const option = document.createElement("option");

            option.value = mesa.id;

            option.textContent = mesa.id;

            select.appendChild(option);
        });

        // autofill
        select.addEventListener("change", function () {

            const mesaSeleccionada =
                misMesas.find(
                    m => m.id == this.value
                );

            if (!mesaSeleccionada) {

                document.getElementById("mesaNumero").value = "";
                document.getElementById("mesaCapacidad").value = "";
                document.getElementById("mesaPrecio").value = "";

                return;
            }

            document.getElementById("mesaNumero").value =
                mesaSeleccionada.numeroMesa || "";

            document.getElementById("mesaCapacidad").value =
                mesaSeleccionada.capacidad || "";

            document.getElementById("mesaPrecio").value =
                mesaSeleccionada.precioBase || "";
        });

        document.getElementById("mesaRestaurante").value = 1;
        document.getElementById("personasRestaurante").value = 1;

        cargarPrecio();

    } catch (error) {
        console.error("Error cargando mesas:", error);
    }
}

/**
 * =====================================
 * PRECIO BASE
 * =====================================
 */
function cargarPrecio() {

    const mesa = misMesas[indiceActual];
    if (!mesa) return;

    const cantidad = parseInt(document.getElementById("personasRestaurante").value);
    const totalInput = document.getElementById("totalRestaurante");

    if (mesa.precioBase) {
        const total = cantidad * mesa.precioBase;
        totalInput.textContent = ` ${total} €`;
    }
}

/**
 * =====================================
 * ACTUALIZAR PRECIO UI
 * =====================================
 */
function actualizarPrecioInterfaz() {

    const displayTotal = document.getElementById("totalRestaurante");
    const cantidadPersonas = parseInt(document.getElementById("personasRestaurante").value);

    const mesa = misMesas[indiceActual];
    if (!mesa) return;

    const total = cantidadPersonas * mesa.precioBase;

    if (displayTotal.tagName === "INPUT") {
        displayTotal.value = total;
    } else {
        displayTotal.textContent = `${total} €`;
    }
}

/**
 * =====================================
 * CAMBIAR MESA
 * =====================================
 */
function cambiarMesa(valor) {

    const nuevo = indiceActual + valor;

    if (nuevo >= 0 && nuevo < misMesas.length) {
        indiceActual = nuevo;

        document.getElementById("mesaRestaurante").value =
            misMesas[indiceActual].numeroMesa;

        document.getElementById("personasRestaurante").value = 1;

        actualizarPrecioInterfaz();
    }

    const fecha = document.getElementById("fechaRestaurante").value;
    if (fecha) {
        datosOcupados(null, fecha);
    }
}

/**
 * =====================================
 * CAMBIAR PERSONAS
 * =====================================
 */
function cambiarPersonas(valor) {

    const input = document.getElementById("personasRestaurante");
    let actuales = parseInt(input.value);
    let nuevas = actuales + valor;

    const mesa = misMesas[indiceActual];
    if (!mesa) return;

    if (nuevas > 0 && nuevas <= mesa.capacidad) {
        input.value = nuevas;
        cargarPrecio();
        actualizarPrecioInterfaz();
    }
}

/**
 * =====================================
 * HORARIOS POR TURNO
 * =====================================
 */
const horasTurno = {
    desayuno: ["07:30", "08:30", "09:30", "10:30", "11:30"],
    comida: ["13:30", "14:30", "15:30"],
    cena: ["20:30", "21:30", "22:30"]
};

const turno = document.getElementById("turnoRestaurante");
const horas = document.getElementById("horaRestaurante");

turno.addEventListener("change", function () {
    const fechaElegida = document.getElementById("fechaRestaurante").value;

    // Si ya hay fecha, refrescamos los bloqueos de horas ocupadas
    if (fechaElegida) {
        datosOcupados(null, fechaElegida);
    }

    // Limpiamos el selector de horas para cargar las nuevas
    horas.innerHTML = '<option value="">Selecciona una hora</option>';

    let tipoTurno = turno.value;

    if (horasTurno[tipoTurno]) {
        horasTurno[tipoTurno].forEach(function (horario) {
            let hora = document.createElement("option");
            hora.value = horario;
            hora.textContent = horario;
            horas.appendChild(hora);
        })
    }
    validarReserva();
});

// Listener para validar cuando el usuario selecciona una hora
horas.addEventListener("change", function () {
    validarReserva();
});


/**
 * =====================================
 * ABRIR MODAL PAGO
 * =====================================
 */
function abrirModalPagoMesa() {

    if (!misMesas.length) return;

    mesaSeleccionada = misMesas[indiceActual];

    const fecha = document.getElementById("fechaRestaurante").value;
    const hora = document.getElementById("horaRestaurante").value;
    const personas = parseInt(document.getElementById("personasRestaurante").value);

    const total = personas * mesaSeleccionada.precioBase;

    const resumen = document.getElementById("resumenPago");

    if (!resumen) return;

    resumen.textContent =
        `Mesa ${mesaSeleccionada.numeroMesa} · ${personas} persona(s) · ${fecha} ${hora} · Total: ${total} €`;

    ["pagoNombre", "pagoNumero", "pagoExpiracion", "pagoCVV"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    ["msgNombre", "msgNumero", "msgExp", "msgCVV"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    });

    const btn = document.getElementById("btnConfirmarPago");
    if (btn) btn.disabled = true;

    const modalEl = document.getElementById("modalPago");
    if (!modalEl) return;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    validarCamposPago();
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
 * =====================================
 * MODAL PAYMENT LOGIC
 * =====================================
 */
function inicializarModalPago() {

    document.addEventListener("click", async (e) => {

        if (e.target && e.target.id === "btnConfirmarPago") {

            const fecha = document.getElementById("fechaRestaurante").value;
            const turno = document.getElementById("turnoRestaurante").value;
            const hora = document.getElementById("horaRestaurante").value + ":00";
            const personas = parseInt(document.getElementById("personasRestaurante").value);

            const mesaId = mesaSeleccionada.id;
            const userId = localStorage.getItem("id");

            try {
                const res1 = await fetch(`${window.location.protocol}//${window.location.hostname}:8080/hotel/reservas`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ usuario: { id: userId } })
                });

                const reserva = await res1.json();

                const datos = {
                    reservaId: reserva.id,
                    mesaId,
                    fecha,
                    turno,
                    hora,
                    numeroPersonas: personas
                };

                const res2 = await fetch(`${window.location.protocol}//${window.location.hostname}:8080/hotel/reservas-mesas`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(datos)
                });

                if (!res2.ok) {
                    mostrarAvisoMesa("❌ Error al realizar la reserva", "danger");
                }

                const modal = bootstrap.Modal.getInstance(
                    document.getElementById("modalPago")
                );

                modal.hide();

                setTimeout(() => {
                    mostrarAvisoMesa(` Pago realizado y reserva confirmada.
     Mesa ${mesaSeleccionada.numeroMesa}
     · ${personas} persona(s)
     · ${fecha}
     · ${hora.slice(0, 5)}`,
                        "success");
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

/**
 * =====================================
 * RESERVAS OCUPADAS (FLATPICKR)
 * =====================================
 */
flatpickr("#fechaRestaurante", {
    minDate: "today",
    dateFormat: "Y-m-d",
    disableMobile: true,
    onChange: function (selectedDates, dateStr) {
        datosOcupados(selectedDates, dateStr); // Al cambiar fecha, buscamos qué horas están llenas
        validarReserva();
    }
});

async function datosOcupados(selectDates, dateStr) {
    const idMesaActual = misMesas[indiceActual].id;

    try {
        // Consultamos al servidor qué horarios están ya pillados para esta mesa y fecha
        const respuesta = await fetch(`${window.location.protocol}//${window.location.hostname}:8080/hotel/reservas-mesas/ocupadas/${idMesaActual}`, {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: No se pudo obtener la ocupación`);
        }

        const datosRecibidos = await respuesta.json();
        datosBloqueados(datosRecibidos, dateStr); // Mandamos los datos a la función de bloqueo visual

    } catch (error) {
        console.error("Error en la conexión:", error);
    }
}

/**
 * =====================================
 * DATOS BLOQUEADOS (INTERFAZ)
 * =====================================
 */
async function datosBloqueados(datosRecibidos, dateStr) {
    const selector = document.getElementById("horaRestaurante");

    // Reset: enable everything first
    for (const opcion of selector.options) {
        opcion.disabled = false;
    }

    datosRecibidos.forEach(reserva => {
        // LocalDate → "YYYY-MM-DD"
        const fecha = reserva.fecha;

        // LocalTime → normalize to "HH:mm"
        const hora = reserva.hora?.slice(0, 5);

        if (fecha === dateStr && hora) {
            for (const opcion of selector.options) {
                if (opcion.value === hora) {
                    opcion.disabled = true;
                }
            }
        }
    });
}

/**
 * =====================================
 * VALIDACIÓN RESERVA
 * =====================================
 */
function validarReserva() {

    const fecha = document.getElementById("fechaRestaurante").value;
    const turno = document.getElementById("turnoRestaurante").value;
    const hora = document.getElementById("horaRestaurante").value;
    const btn = document.getElementById("btnRestaurante");

    const ok = fecha && turno && hora && hora !== "Selecciona";

    if (ok) {
        btn.disabled = false;
        btn.style.opacity = "1";
    } else {
        btn.disabled = true;
        btn.style.opacity = "0.5";
    }
}

/**
 * =====================================
 * RESET FORM
 * =====================================
 */
function resetearFormulario() {

    indiceActual = 0;

    if (!misMesas.length) return;

    document.getElementById("mesaRestaurante").value =
        misMesas[0].numeroMesa;

    document.getElementById("personasRestaurante").value = 1;

    const fp = document.querySelector("#fechaRestaurante")?._flatpickr;
    if (fp) fp.clear();

    document.getElementById("turnoRestaurante").value = "";
    document.getElementById("horaRestaurante").innerHTML =
        '<option value="">Selecciona una hora</option>';

    actualizarPrecioInterfaz();

    const btn = document.getElementById("btnRestaurante");
    if (btn) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
    }
}

function mostrarAvisoMesa(mensaje, tipo = "warning") {
    const contenedor = document.getElementById('mensajeAlertaMesa');
    contenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show small py-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> ${mensaje}
            <button type="button" class="btn-close py-2" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    // Autocerrado tras 4 segundos para no ensuciar la vista
    setTimeout(() => {
        const alerta = document.querySelector('#mensajeAlertaMesa .alert');
        if (alerta) {
            const bsAlert = new bootstrap.Alert(alerta);
            bsAlert.close();
        }
    }, 4000);
}