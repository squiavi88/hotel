
let misMesas = [];
let indiceActual = 0; // Empezamos siempre en la posición 0

async function cargarMesas() {
    try {

        // 1. La ejecución se "pausa" aquí hasta que el servidor responde
        const respuesta = await fetch('http://localhost:8080/hotel/mesas', {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        // 2. Verificamos si la respuesta es correcta (status 200-299)
        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

        // 3. Convertimos la respuesta plana a un objeto JSON usable
        const datos = await respuesta.json();
        misMesas = datos;

        // ACTUALIZAMOS EL HTML
        document.getElementById("mesaRestaurante").value = 1;
        document.getElementById("personasRestaurante").value = 1;
        cargarPrecio(datos)


    } catch (error) {
        console.error("Hubo un problema con la petición fetch:", error);
    }

}

cargarMesas();

// =====================================
// CARGAR PRECIO
// =====================================

function cargarPrecio() {
    // 1. Obtenemos la cantidad de personas
    const cantidad = parseInt(document.getElementById("personasRestaurante").value);
    const totalInput = document.getElementById("totalRestaurante");

    // 2. Accedemos directamente a la mesa actual usando el índice que ya manejas
    const mesaActual = misMesas[indiceActual];

    // 3. Calculamos: Personas x Precio de esa mesa específica
    if (mesaActual && mesaActual.precioBase) {
        const total = cantidad * mesaActual.precioBase;
        // Si el elemento es un input usa .value, si es un span/div usa .textContent
        totalInput.textContent = ` ${total} €`;
    }
}

function actualizarPrecioInterfaz() {
    const displayTotal = document.getElementById("totalRestaurante");
    const cantidadPersonas = parseInt(document.getElementById("personasRestaurante").value);

    // Capturamos el precio base de la nueva mesa desde el array global
    const precioBaseNuevaMesa = misMesas[indiceActual].precioBase;

    // Calculamos el total
    const total = cantidadPersonas * precioBaseNuevaMesa;

    // Mostramos en el HTML (usamos textContent si es un span/div o value si es input)
    if (displayTotal.tagName === "INPUT") {
        displayTotal.value = total;
    } else {
        displayTotal.textContent = `${total} €`;
    }
}

// =====================================
// CAMBIAR MESA
// =====================================

function cambiarMesa(valorRecibido) {
    // Calculamos la posición que el usuario intenta ver
    let nuevoIndice = indiceActual + valorRecibido;

    // Validamos que la posición exista dentro de nuestro array de mesas
    if (nuevoIndice >= 0 && nuevoIndice < misMesas.length) {
        indiceActual = nuevoIndice; // Actualizamos el índice global

        // 1. Mostramos el número real de la mesa en el input correspondiente
        document.getElementById("mesaRestaurante").value = misMesas[indiceActual].numeroMesa;

        // 2. Reseteamos el valor de personas a 1 inmediatamente.
        // Esto garantiza que el usuario nunca empiece con un número de personas
        // mayor a la capacidad de la nueva mesa seleccionada.
        document.getElementById("personasRestaurante").value = 1;
        actualizarPrecioInterfaz();

    }
}

// =====================================
// CAMBIAR PERSONAS
// =====================================

function cambiarPersona(valorRecibido) {
    let inputPersonas = document.getElementById("personasRestaurante");
    let personasActuales = parseInt(inputPersonas.value);
    let personasNuevas = personasActuales + valorRecibido;

    // Usamos el índice actual para mirar la capacidad en el array
    let valorMaximo = misMesas[indiceActual].capacidad;

    // Validamos el rango (Mínimo 1, Máximo el de la mesa)
    if (personasNuevas > 0 && personasNuevas <= valorMaximo) {
        inputPersonas.value = personasNuevas;
        cargarPrecio();
        actualizarPrecioInterfaz();

    }
}



// =====================================
// HORARIOS POR TURNO
// =====================================
const horasTurno = {
    desayuno: ["07:30", "08:30", "09:30", "10:30", "11:30"],
    comida: ["13:30", "14:30", "15:30"],
    cena: ["20:30", "21:30", "22:30"]
};

const turno = document.getElementById("turnoRestaurante");
const horas = document.getElementById("horaRestaurante");

turno.addEventListener("change", function () {
    // NUEVO: Después de crear las horas, si ya hay una fecha elegida, bloqueamos
    const fechaElegida = document.getElementById("fechaRestaurante").value;
    if (fechaElegida) {
        // Llamamos a la función de ocupación para que refresque los bloqueos
        datosOcupados(null, fechaElegida);
    }
    // Esto borra las horas del turno anterior
    horas.innerHTML = '<option value="">Selecciona una hora</option>';

    let tipoTurno = turno.value;


    if (horasTurno[tipoTurno]) {

        horasTurno[tipoTurno].forEach(function (horario) {

            let hora = document.createElement("option");

            hora.value = horario;
            hora.textContent = horario; // Lo que ve el usuario
            horas.appendChild(hora);
        })
    }
    validarReserva();

});

// Listener de la Hora: se activa cuando el usuario elige una hora específica
horas.addEventListener("change", function () {
    validarReserva(); // Al elegir la hora, comprobamos si ya se puede activar el botón
});

// =====================================
// RESERVAR (ENVÍO AL BACKEND)
// =====================================

async function reservarMesa() {
    // 1. Capturamos los valores del formulario
    const fecha = document.getElementById("fechaRestaurante").value;
    const turno = document.getElementById("turnoRestaurante").value;
    const hora = document.getElementById("horaRestaurante").value + ":00";
    const personas = parseInt(document.getElementById("personasRestaurante").value);

    // 2. CORRECCIÓN CLAVE: Usamos el ID real del array, no el valor del input
    const mesaIdReal = misMesas[indiceActual].id;
    const userId = localStorage.getItem("id");

    // 1. Iniciamos una petición asíncrona (fetch) al servidor para crear la cabecera de la reserva.
    // El 'await' detiene la ejecución aquí hasta que el servidor responda.
    try {
        const res1 = await fetch("http://localhost:8080/hotel/reservas", {

            method: "POST",
            // Le decimos al servidor que el cuerpo de nuestra petición es un objeto JSON.
            headers: { "Content-Type": "application/json" },

            // Esto permite enviar las cookies de sesión (como el JSESSIONID de Spring Security) 
            // para que el servidor sepa quién eres.
            credentials: "include",

            // Convertimos el objeto de JavaScript a una cadena de texto JSON para el transporte.
            // Enviamos el 'id' del usuario para que la base de datos sepa a quién pertenece la reserva.
            body: JSON.stringify({ usuario: { id: userId } })
        });

        // Una vez que el servidor responde (res1), extraemos el contenido de la respuesta.
        // .json() también es asíncrono, por lo que usamos 'await'. 
        // Aquí es donde recibes el objeto completo desde Java, incluyendo el 'id' que la BD generó automáticamente.
        const reserva = await res1.json();

        // PASO 2: Asignar la mesa con el ID correcto
        const datosMesa = {
            reservaID: reserva.id, // ID autogenerado que acabamos de recibir
            mesaId: mesaIdReal,    //
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
            alert("¡Reserva completada!")
            resetearFormulario(); // <--- Limpia todo después del éxito

        };

    } catch (error) {

        console.log("error")
    }
}

document.getElementById("btnRestaurante").addEventListener("click", reservarMesa);


// =====================================
// Reservas Ocupadas
// =====================================

flatpickr("#fechaRestaurante", {
    minDate: "today",
    dateFormat: "Y-m-d",
    disableMobile: true,
    // La función onChange recibe automáticamente los parámetros (selectedDates, dateStr)
    onChange: function (selectedDates, dateStr) {
        datosOcupados(selectedDates, dateStr); // Ejecuta tu lógica de ocupación
        validarReserva();                      // Revisa si ya puede activar el botón
    }
});

// Ahora dateStr contiene la fecha elegida, por ejemplo: "2026-05-15"
async function datosOcupados(selectDates, dateStr) {

    // Sacamos el ID real de la mesa que está seleccionada actualmente
    const idMesaActual = misMesas[indiceActual].id;

    try {
        const respuesta = await fetch(`http://localhost:8080/hotel/reservas-mesas/ocupadas/${idMesaActual}`, {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: No se pudo obtener la ocupación`);
        }

        const datosRecibidos = await respuesta.json();


        // AQUÍ LLAMAS A LA FUNCIÓN DE BLOQUEO
        // Le pasas los datos del servidor y la fecha que viene de Flatpickr (dateStr)
        datosBloqueados(datosRecibidos, dateStr);
    } catch (error) {
        console.error("Error en la conexión:", error);
    }
}

async function datosBloqueados(datosRecibidos, dateStr) {

    const selector = document.getElementById("horaRestaurante");
    const turnoActual = document.getElementById("turnoRestaurante").value;

    // PASO 1: "Limpiar la mesa" (Habilitar todas las opciones)
    for (const opcion of selector.options) {
        opcion.disabled = false;
    }

    datosRecibidos.forEach(reserva => {

        if (reserva.fecha === dateStr && reserva.turno === turnoActual) {
            for (const opcion of selector.options) {
                // Comparamos si la hora de la reserva contiene la hora de la opción
                // (reserva.hora suele ser "14:30:00" y opcion.value es "14:30")
                if (reserva.hora.includes(opcion.value) && opcion.value !== "") {
                    opcion.disabled = true; // Solo bloqueamos, no desbloqueamos aquí
                }
            }
        }


    });

}
/**
 * ============================================================
 * LÓGICA DE VALIDACIÓN (Activar/Desactivar Botón)
 * ============================================================
 */
function validarReserva() {
    const fecha = document.getElementById("fechaRestaurante").value.trim();
    const turno = document.getElementById("turnoRestaurante").value;
    const hora = document.getElementById("horaRestaurante").value;
    const boton = document.getElementById("btnRestaurante");

    const isFechaOk = fecha.length > 0;
    const isTurnoOk = (turno !== "" && turno !== "Selecciona");
    const isHoraOk = (hora !== "" && hora !== "Selecciona" && hora !== "Selecciona una hora");

    if (isFechaOk && isTurnoOk && isHoraOk) {
        // ACTIVAR
        boton.disabled = false;
        boton.style.opacity = "1";
        boton.style.backgroundColor = "#212529"; // Color oscuro del botón
    } else {
        // DESACTIVAR
        boton.disabled = true;
        boton.style.opacity = "0.5";
    }
}
// =====================================
// RESETEAR FORMULARIO
// =====================================

function resetearFormulario() {
    // 1. Resetear el índice de mesas al principio
    indiceActual = 0;

    // 2. Valores visuales de Mesa y Personas
    // Suponiendo que la primera mesa siempre es la 1 y empieza con 1 persona
    document.getElementById("mesaRestaurante").value = misMesas[0].numeroMesa;
    document.getElementById("personasRestaurante").value = 1;

    // 3. Limpiar Fecha (Flatpickr)
    // Buscamos la instancia de flatpickr para limpiarla correctamente
    const calendario = document.querySelector("#fechaRestaurante")._flatpickr;
    if (calendario) {
        calendario.clear(); 
    }

    // 4. Resetear Selectores de Turno y Hora
    const turno = document.getElementById("turnoRestaurante");
    const hora = document.getElementById("horaRestaurante");
    
    turno.value = ""; // Vuelve a "Selecciona un turno"
    hora.innerHTML = '<option value="">Selecciona una hora</option>'; // Borra las horas cargadas

    // 5. Resetear el Total
    // Llamamos a la función de precio que ya tenemos para que ponga el base de la mesa 0
    actualizarPrecioInterfaz();

    // 6. Bloquear el botón de nuevo
    const boton = document.getElementById("btnRestaurante");
    boton.disabled = true;
    boton.style.opacity = "0.5";
    boton.style.cursor = "not-allowed";

    console.log("Formulario reseteado con éxito");
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