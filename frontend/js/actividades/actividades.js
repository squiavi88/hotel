
let listaActividades = []; // Variable global para guardar los datos

async function cargarActividades() {

    const respuesta = await fetch('http://localhost:8080/hotel/actividad', {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    })


    const datos = await respuesta.json();
    console.table(datos)
    listaActividades = datos;

    // Limpiamos el select por si tenía algo

    const select = document.getElementById("actividadSeleccionada");

    select.innerHTML = '<option value="">Selecciona una actividad</option>';
    // 2. RECORREMOS el array para crear los options
    datos.forEach(actividad => {

        const option = document.createElement("option");
        option.value = actividad.id;      // El ID para la base de datos
        option.textContent = actividad.nombre; // Lo que el usuario lee
        option.dataset.capacidad = actividad.capacidad;
        option.dataset.precio = actividad.precioBase;
        select.appendChild(option)


    })

    select.addEventListener("change", function () {
        const inputPars = document.getElementById("participantesActividad");

        // Si el usuario elige una actividad real (id no vacío)
        if (this.value !== "" && this.value !== "Selecciona") {
            inputPars.value = 1; // Reseteamos a 1

            // Si ya tienes la función de actualizarPrecio, llámala aquí
            if (typeof actualizarPrecio === "function") {
                actualizarPrecio();
            }
        } else {
            // Si vuelve a poner "Selecciona una actividad", lo dejamos vacío o en 0
            inputPars.value = "";
        }
    });
}

cargarActividades();

function cambiarParticipantes(valorRecibido) {
    const select = document.getElementById("actividadSeleccionada");
    const inputPars = document.getElementById("participantesActividad");

    if (!select.value || select.value === "") {
        alert("Selecciona una actividad primero");
        return;
    }

    const opcionElegida = select.options[select.selectedIndex];
    const capacidadMax = parseInt(opcionElegida.dataset.capacidad);

    // SOLUCIÓN AL VACÍO: Si el input está vacío, asumimos 0
    let valorActual = parseInt(inputPars.value);
    if (isNaN(valorActual)) {
        valorActual = 0;
    }

    let nuevaCantidad = valorActual + valorRecibido;

    if (nuevaCantidad >= 1 && nuevaCantidad <= capacidadMax) {
        inputPars.value = nuevaCantidad;
    }

}

// =====================================
// RESERVAR (ENVÍO AL BACKEND)
// =====================================

async function reservarActividad() {
    // 1. Capturamos los valores del formulario
    const fecha = document.getElementById("fechaActividad").value;
    // IMPORTANTE: Primero capturamos el ELEMENTO (sin el .value al final)
    const selectElement = document.getElementById("actividadSeleccionada");
    // Ahora sí sacamos el ID (el valor) y el Nombre (el texto)
    const idActividad = selectElement.value;
    const nombreActividad = selectElement.options[selectElement.selectedIndex].textContent;
    const turno = document.getElementById("turnoActividad").value;
    const personas = parseInt(document.getElementById("participantesActividad").value);
    const userId = localStorage.getItem("id");
    if (!userId) {
        alert("Error: No se encontró el ID del usuario. Por favor, inicia sesión de nuevo.");
        return; // Detenemos la ejecución si no hay usuario
    }

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
        const datosActividad = {
            reservaId: reserva.id,     // 'reservaId' con I mayúscula
            actividadId: idActividad,  // 'actividadId' con I mayúscula
            fecha: fecha,
            turno: turno,
            participantes: personas,   // <--- ¡IMPORTANTE! Debe ser 'participantes'
            monto: 0                   // Lo enviamos en 0, Java lo calcula
        };

        const res2 = await fetch("http://localhost:8080/hotel/reservas-actividades", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(datosActividad)
        });

        if (res2.ok) {
            alert("¡Reserva completada!")

        };

    } catch (error) {

        // Esto te dirá exactamente en qué línea y qué error es
        console.error("Detalles del error detectado:");
        console.error("Mensaje:", error.message);
        console.error("Pila de error:", error.stack);
    }


}

document.getElementById("btnActividad").addEventListener("click", reservarActividad);
