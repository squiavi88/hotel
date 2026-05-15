/**
 * =====================================
 * VARIABLES GLOBALES
 * =====================================
 */
let misMesas = [];
let indiceActual = 0; // Controla la posición actual en el array de mesas

/**
 * =====================================
 * CARGAR MESAS (INICIO)
 * =====================================
 */
async function cargarMesas() {
    try {
        // Petición GET al servidor para traer todas las mesas disponibles
        const respuesta = await fetch('http://localhost:8080/hotel/mesas', {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

        // Guardamos el JSON recibido en nuestro array global 'misMesas'
        const datos = await respuesta.json();
        misMesas = datos;

        // Seteamos valores iniciales en la interfaz al cargar
        document.getElementById("mesaRestaurante").value = 1;
        document.getElementById("personasRestaurante").value = 1;

        cargarPrecio(); // Calculamos el precio inicial

    } catch (error) {
        console.error("Hubo un problema con la petición fetch:", error);
    }
}

// Ejecución automática al cargar el script
cargarMesas();

/**
 * =====================================
 * CARGAR PRECIO
 * =====================================
 */
function cargarPrecio() {
    const cantidad = parseInt(document.getElementById("personasRestaurante").value);
    const totalInput = document.getElementById("totalRestaurante");

    // Buscamos el objeto mesa dentro del array usando el índice actual
    const mesaActual = misMesas[indiceActual];

    // Multiplicamos personas por el precioBase de la mesa actual
    if (mesaActual && mesaActual.precioBase) {
        const total = cantidad * mesaActual.precioBase;
        totalInput.textContent = ` ${total} €`;
    }
}

/**
 * =====================================
 * ACTUALIZAR PRECIO INTERFAZ
 * =====================================
 */
function actualizarPrecioInterfaz() {
    const displayTotal = document.getElementById("totalRestaurante");
    const cantidadPersonas = parseInt(document.getElementById("personasRestaurante").value);

    // Obtenemos el precio directamente desde la memoria (array global)
    const precioBaseNuevaMesa = misMesas[indiceActual].precioBase;
    const total = cantidadPersonas * precioBaseNuevaMesa;

    // Detectamos si el destino es un INPUT o un elemento de texto (SPAN/DIV)
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
function cambiarMesa(valorRecibido) {
    // Sumamos o restamos al índice actual (0, 1, 2...)
    let nuevoIndice = indiceActual + valorRecibido;

    // Verificamos que el nuevo índice no se salga de los límites del array
    if (nuevoIndice >= 0 && nuevoIndice < misMesas.length) {
        indiceActual = nuevoIndice;

        // Actualizamos el número de mesa visualmente desde el array
        document.getElementById("mesaRestaurante").value = misMesas[indiceActual].numeroMesa;

        // Reseteamos personas a 1 para evitar errores de capacidad al cambiar de mesa
        document.getElementById("personasRestaurante").value = 1;
        actualizarPrecioInterfaz();
    }
    // Si ya hay una fecha seleccionada, debemos REFRESCAR los bloqueos
    // para la nueva mesa que acabamos de seleccionar.
    const fechaElegida = document.getElementById("fechaRestaurante").value;
    if (fechaElegida) {
        datosOcupados(null, fechaElegida);
    }
}

/**
 * =====================================
 * CAMBIAR PERSONAS
 * =====================================
 */
function cambiarPersona(valorRecibido) {
    let inputPersonas = document.getElementById("personasRestaurante");
    let personasActuales = parseInt(inputPersonas.value);
    let personasNuevas = personasActuales + valorRecibido;

    // Consultamos la capacidad máxima permitida de la mesa seleccionada actualmente
    let valorMaximo = misMesas[indiceActual].capacidad;

    // Validamos que no sea menor a 1 ni mayor a la capacidad de la mesa
    if (personasNuevas > 0 && personasNuevas <= valorMaximo) {
        inputPersonas.value = personasNuevas;
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
 * RESERVAR (ENVÍO AL BACKEND)
 * =====================================
 */
async function reservarMesa() {
    const fecha = document.getElementById("fechaRestaurante").value;
    const turno = document.getElementById("turnoRestaurante").value;
    const hora = document.getElementById("horaRestaurante").value + ":00";
    const personas = parseInt(document.getElementById("personasRestaurante").value);

    // Obtenemos el ID real de la base de datos desde nuestro array global
    const mesaIdReal = misMesas[indiceActual].id;
    const userId = localStorage.getItem("id");

    try {
        // PASO 1: Crear la reserva general (Cabecera)
        const res1 = await fetch("http://localhost:8080/hotel/reservas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ usuario: { id: userId } })
        });

        const reserva = await res1.json();

        // PASO 2: Crear el detalle de la reserva (Asignar mesa y horario)
        const datosMesa = {
            reservaID: reserva.id, // ID recibido del Paso 1
            mesaId: mesaIdReal,
            fecha: fecha,
            turno: turno,
            hora: hora,
            cantidadPersonas: personas
        };

        const res2 = await fetch("http://localhost:8080/hotel/reservas-mesas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(datosMesa)
        });

        if (res2.ok) {
            alert("¡Reserva completada!");
            resetearFormulario();
        };

    } catch (error) {
        console.log("error");
    }
}

document.getElementById("btnRestaurante").addEventListener("click", reservarMesa);

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
        const respuesta = await fetch(`http://localhost:8080/hotel/reservas-mesas/ocupadas/${idMesaActual}`, {
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
    const turnoActual = document.getElementById("turnoRestaurante").value;

    // Habilitamos todas las opciones primero para limpiar bloqueos anteriores
    for (const opcion of selector.options) {
        opcion.disabled = false;
    }

    // Recorremos las reservas ocupadas recibidas del servidor
    datosRecibidos.forEach(reserva => {
        // Si coinciden fecha y turno, deshabilitamos la opción de hora correspondiente
        if (reserva.fecha === dateStr && reserva.turno === turnoActual) {
            for (const opcion of selector.options) {
                if (reserva.hora.includes(opcion.value) && opcion.value !== "") {
                    opcion.disabled = true;
                }
            }
        }
    });
}

/**
 * =====================================
 * LÓGICA DE VALIDACIÓN (BOTÓN)
 * =====================================
 */
function validarReserva() {
    const fecha = document.getElementById("fechaRestaurante").value.trim();
    const turno = document.getElementById("turnoRestaurante").value;
    const hora = document.getElementById("horaRestaurante").value;
    const boton = document.getElementById("btnRestaurante");

    // Comprobamos que todos los campos necesarios tengan valor
    const isFechaOk = fecha.length > 0;
    const isTurnoOk = (turno !== "" && turno !== "Selecciona");
    const isHoraOk = (hora !== "" && hora !== "Selecciona" && hora !== "Selecciona una hora");

    if (isFechaOk && isTurnoOk && isHoraOk) {
        // Habilitamos botón si todo está OK
        boton.disabled = false;
        boton.style.opacity = "1";
        boton.style.backgroundColor = "#212529";
    } else {
        // Mantenemos deshabilitado si falta algo
        boton.disabled = true;
        boton.style.opacity = "0.5";
    }
}

/**
 * =====================================
 * RESETEAR FORMULARIO
 * =====================================
 */
function resetearFormulario() {
    // Volvemos a la primera mesa del array
    indiceActual = 0;

    // Restauramos valores visuales por defecto
    document.getElementById("mesaRestaurante").value = misMesas[0].numeroMesa;
    document.getElementById("personasRestaurante").value = 1;

    // Limpiamos el calendario de Flatpickr
    const calendario = document.querySelector("#fechaRestaurante")._flatpickr;
    if (calendario) {
        calendario.clear();
    }

    // Reseteamos selectores a sus estados vacíos
    const turno = document.getElementById("turnoRestaurante");
    const hora = document.getElementById("horaRestaurante");

    turno.value = "";
    hora.innerHTML = '<option value="">Selecciona una hora</option>';

    actualizarPrecioInterfaz();

    // Bloqueamos el botón de reserva nuevamente
    const boton = document.getElementById("btnRestaurante");
    boton.disabled = true;
    boton.style.opacity = "0.5";
    //boton.style.cursor = "not-allowed";

    console.log("Formulario reseteado con éxito");
}

/**
 * =====================================
 * ANIMACIÓN BOTONES
 * =====================================
 */
document.addEventListener("DOMContentLoaded", () => {
    // Añade un efecto visual rápido al hacer click en botones de clase .btn-dark
    document.querySelectorAll(".btn-dark").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.add("btn-anim-active");
            setTimeout(() => btn.classList.remove("btn-anim-active"), 120);
        });
    });
});