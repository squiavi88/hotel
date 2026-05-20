

// Identificamos el modal para el Listener de limpieza
const modalEventoElement = document.getElementById('modalGestionEvento');

modalEventoElement.addEventListener('hidden.bs.modal', function () {
    // Resetea el formulario completo de actividades
    document.getElementById('formEvento').reset();

    // Limpieza manual de campos si no están dentro del form o son "autofill"
    document.getElementById('eventoIdSelect').value = "";
    document.getElementById('eventoTipo').value = "";
    document.getElementById('eventoPrecio').value = "";
    document.getElementById('eventoCapacidad').value = "";

    // Restaurar título del modal
    document.getElementById('tituloModalEvento').innerText = "Gestionar Evento";

    console.log("Formulario de evento reseteado automáticamente.");
});

document.getElementById('btnGuardarEvento').addEventListener('click', async () => {
    // Ejecutamos la función de guardado al hacer clic
    await guardarEvento();
});

/**
 * ============================================================
 *  FUNCIÓN PARA GUARDAR (DETECTA SI ES POST O PUT)
 * ============================================================
 */

async function guardarEvento() {
    const id = document.getElementById('eventoIdSelect').value;

    const evento = {
        nombre: document.getElementById('eventoTipo').value,
        precioBase: parseFloat(document.getElementById('eventoPrecio').value),
        capacidadPersonas: parseInt(document.getElementById('eventoCapacidad').value)
    };

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${window.location.protocol}//${window.location.hostname}:8080/hotel/evento/${id}` : `${window.location.protocol}//${window.location.hostname}:8080/hotel/evento`;

    try {
        const resp = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(evento)
        });

        if (resp.ok) {
            alert("¡Operación realizada con éxito!");
            location.reload();
        }
    } catch (error) {
        alert("Error de conexión con el servidor");
    }
}

