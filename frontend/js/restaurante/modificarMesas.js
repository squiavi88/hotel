/**
 * ============================================================
 * GESTIÓN DE MESAS - PANEL DE ADMINISTRACIÓN
 * ============================================================
 */

// Identificamos el modal para el Listener de limpieza
const modalMesaElement = document.getElementById('modalGestionMesa');

/**
 * ============================================================
 * EVENT LISTENER PARA EL RESETEO AUTOMÁTICO (hidden.bs.modal)
 * ============================================================
 */
modalMesaElement.addEventListener('hidden.bs.modal', function () {
    // Resetea todos los campos del formulario de una sola vez
    document.getElementById('formMesa').reset();

    // Limpiamos el ID oculto manualmente
    document.getElementById('mesaId').value = "";

    // Restauramos el título original
    document.getElementById('tituloModalMesa').innerText = "Gestionar Mesa";

    console.log("Formulario de mesa reseteado automáticamente.");
});


/**
 * ============================================================
 * EVENT LISTENER PARA EL BOTÓN DE GUARDAR
 * ============================================================
 */
document.getElementById('btnGuardarMesa').addEventListener('click', async () => {
    // Ejecutamos la función de guardado al hacer clic
    await guardarMesa();
});

/**
 * ============================================================
 * FUNCIÓN PARA GUARDAR (DETECTA SI ES POST O PUT)
 * ============================================================
 */
async function guardarMesa() {
    const id = document.getElementById('mesaIdSelect').value;

    // Construimos el objeto con los campos de tu phpMyAdmin
    const mesa = {
        numeroMesa: parseInt(document.getElementById('mesaNumero').value),
        capacidad: parseInt(document.getElementById('mesaCapacidad').value),
        precioBase: parseFloat(document.getElementById('mesaPrecio').value)
    };

    // Definimos método y ruta directamente
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:8080/hotel/mesas/${id}` : `http://localhost:8080/hotel/mesas`;

    try {
        const resp = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(mesa)
        });

        if (resp.ok) {
            alert("¡Operación realizada con éxito!");

            // Cerramos el modal (esto activa el reset automático del listener)
            const modalInstance = bootstrap.Modal.getInstance(modalMesaElement);
            modalInstance.hide();

            location.reload();
        } else {
            alert("Error al procesar la solicitud en el servidor");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión con el servidor");
    }
}