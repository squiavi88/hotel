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
 * FUNCIÓN PARA CARGAR DATOS AL ESCRIBIR NÚMERO (Autocompletado)
 * ============================================================
 */
document.getElementById('mesaNumero').addEventListener('blur', async (e) => {
    const numero = e.target.value;
    if (numero.length > 0) {
        try {
            // Ruta directa en el fetch para buscar por número
            const resp = await fetch(`http://localhost:8080/hotel/mesa/buscar/${numero}`);
            if (resp.ok) {
                const data = await resp.json();
                
                // Rellenamos los campos con los datos de la DB
                document.getElementById('mesaId').value = data.id_mesa;
                document.getElementById('mesaCapacidad').value = data.Capacidad;
                document.getElementById('mesaPrecio').value = data.precio_base;
                
                document.getElementById('tituloModalMesa').innerText = "Editar Mesa Nº: " + data.Numero_mesa;
            }
        } catch (error) {
            console.error("Error en el autocompletado de mesa:", error);
        }
    }
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
    const id = document.getElementById('mesaId').value;
    
    // Construimos el objeto con los campos de tu phpMyAdmin
    const mesa = {
        Numero_mesa: parseInt(document.getElementById('mesaNumero').value),
        Capacidad: parseInt(document.getElementById('mesaCapacidad').value),
        precio_base: parseFloat(document.getElementById('mesaPrecio').value)
    };

    // Definimos método y ruta directamente
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:8080/hotel/mesa/${id}` : `http://localhost:8080/hotel/mesa`;

    try {
        const resp = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
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