/**
 * ============================================================
 * FUNCIÓN PARA CARGAR DATOS AL ESCRIBIR NOMBRE (Autocompletado)
 * ============================================================
 */
document.getElementById('habNombre').addEventListener('blur', async (e) => {
    const nombre = e.target.value;
    if (nombre.length > 3) {
        const resp = await fetch(`http://localhost:8080/hotel/habitaciones/buscarPorNombre?nombre=${encodeURIComponent(nombre)}`);
        if (resp.ok) {
            const data = await resp.json();

            document.getElementById('habitacionId').value = data.id_habitacion;
            document.getElementById('habNumero').value = data.Numero_Habitacion;
            document.getElementById('habDescripcion').value = data.Descripcion;
            document.getElementById('habTipo').value = data.Tipo_Habitacion;
            document.getElementById('habPrecio').value = data.precio_noche;

            document.getElementById('tituloModalHabitacion').innerText = "Editar Habitación: " + data.Nombre;
        }
    }
});

/**
 * ============================================================
 * EVENT LISTENER PARA EL RESETEO AUTOMÁTICO DEL MODAL
 * ============================================================
 * Escucha cuando el modal se oculta (hidden.bs.modal) y limpia
 * todos los campos de una sola vez usando .reset()
 */

// 1. Obtenemos la referencia al modal
const modalHabitacion = document.getElementById('modalGestionHabitacion');

// 2. Creamos el escuchador de eventos de Bootstrap
modalHabitacion.addEventListener('hidden.bs.modal', function () {

    // Función mágica que resetea todos los inputs y selects del form
    document.getElementById('formHabitacion').reset();

    // Limpieza manual del ID oculto (el reset no siempre afecta a campos hidden)
    document.getElementById('habitacionId').value = "";

    // Restauramos el título del modal a su estado original
    document.getElementById('tituloModalHabitacion').innerText = "Gestionar Habitación";

    console.log("Formulario de habitación limpiado al cerrar el modal.");
});

/**
 * ============================================================
 * EVENT LISTENER PARA EL BOTÓN DE GUARDAR
 * ============================================================
 * Escucha el clic en el botón de guardar y ejecuta la función
 * para enviar los datos (POST o PUT) al servidor.
 */
document.getElementById('btnGuardarHabitacion').addEventListener('click', async () => {
    // Llamamos a la función principal de guardado
    await guardarHabitacion();
});

/**
 * ============================================================
 * FUNCIÓN PARA GUARDAR (DETECTA SI ES POST O PUT)
 * ============================================================
 */
async function guardarHabitacion() {
    const id = document.getElementById('habitacionId').value;

    const habitacion = {
        Nombre: document.getElementById('habNombre').value,
        Descripcion: document.getElementById('habDescripcion').value,
        Numero_Habitacion: parseInt(document.getElementById('habNumero').value),
        Tipo_Habitacion: document.getElementById('habTipo').value,
        precio_noche: parseFloat(document.getElementById('habPrecio').value)
    };

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:8080/hotel/habitaciones/${id}` : `http://localhost:8080/hotel/habitaciones`;

    try {
        const resp = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habitacion)
        });

        if (resp.ok) {
            alert("¡Operación realizada con éxito!");

            // Cerramos el modal usando Bootstrap para que el listener de 'hidden' limpie todo
            const modalElement = document.getElementById('modalGestionHabitacion');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();

            location.reload();
        } else {
            alert("Error al procesar la solicitud en el servidor");
        }
    } catch (error) {
        alert("Error de conexión con el servidor");
    }
}