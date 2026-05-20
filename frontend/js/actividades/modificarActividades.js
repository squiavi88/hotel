// Identificamos el modal para el Listener de limpieza
const modalActividadElement = document.getElementById('modalGestionActividad');

modalActividadElement.addEventListener('hidden.bs.modal', function () {
    // Resetea el formulario completo de actividades
    document.getElementById('formActividad').reset();

    // Limpieza manual de campos si no están dentro del form o son "autofill"
    document.getElementById('actividadIdSelect').value = "";
    document.getElementById('actividadNombre').value = "";
    document.getElementById('actividadPrecio').value = "";
    document.getElementById('actividadCapacidad').value = "";

    // Restaurar título del modal
    document.getElementById('tituloModalActividad').innerText = "Gestionar Actividad";

    console.log("Formulario de actividad reseteado automáticamente.");
});

document.getElementById('btnGuardarActividad').addEventListener('click', async () => {
    // Ejecutamos la función de guardado al hacer clic
    await guardarActividad();
});

//  FUNCIÓN PARA GUARDAR (CREAR O ACTUALIZAR)
async function guardarActividad() {
    const id = document.getElementById('actividadIdSelect').value;
    
    const actividadData = {
        nombre: document.getElementById('actividadNombre').value,
        precioBase: parseFloat(document.getElementById('actividadPrecio').value),
        capacidadPersonas: parseInt(document.getElementById('actividadCapacidad').value)
    };

    // Definimos método y ruta directamente
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${window.location.protocol}//${window.location.hostname}:8080/hotel/actividad/${id}` : `${window.location.protocol}//${window.location.hostname}:8080/hotel/actividad`;

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify(actividadData)
        });

        if (response.ok) {
            alert("Actividad guardada correctamente");
            location.reload(); // Refrescar para ver cambios
        } else {
            alert("Error al procesar la solicitud");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

