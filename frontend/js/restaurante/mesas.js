
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
        console.table(datos)
        misMesas = datos;

        // ACTUALIZAMOS EL HTML
        document.getElementById("mesaRestaurante").value = 1;
        document.getElementById("personasRestaurante").value = 1;

    } catch (error) {
        console.error("Hubo un problema con la petición fetch:", error);
    }

}

cargarMesas();

// =====================================
// CAMBIAR MESA
// =====================================

function cambiarMesa(valorRecibido) {
    let nuevoIndice = indiceActual + valorRecibido;

    // El límite inferior es 0 y el superior es la longitud - 1
    if (nuevoIndice >= 0 && nuevoIndice < misMesas.length) {
        indiceActual = nuevoIndice;

        // No pongas solo el índice, pon el NUMERO real de la mesa que viene del servidor
        document.getElementById("mesaRestaurante").value = misMesas[indiceActual].numeroMesa;


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

});

// =====================================
// RESERVAR (ENVÍO AL BACKEND)
// =====================================

function reservarMesa() {
    const fecha = document.getElementById("fechaRestaurante").value;
    const turno = document.getElementById("turnoRestaurante").value;
    const hora = document.getElementById("horaRestaurante").value + ":00";
    const personas = document.getElementById("personasRestaurante").value;
    const mesa = document.getElementById("mesaRestaurante").value;

    const boton = document.getElementById("btnRestaurante");

    // --- CONSULTA DE PRUEBA EN CONSOLA ---
    console.log("------- DATOS DE RESERVA -------");
    console.log("Fecha:", fecha);
    console.log("Turno:", turno);
    console.log("Hora:", hora);
    console.log("Personas:", personas);
    console.log("mesa:", mesa);

    console.log("--------------------------------");

}
