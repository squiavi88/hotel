/**
 * ============================================================
 * FUNCIÓN PARA CARGAR DATOS AL ESCRIBIR NÚMERO (Autocompletado)
 * ============================================================
 */
document.getElementById('mesaNumero').addEventListener('blur', async (e) => {
    const numero = e.target.value;
    if (numero.length > 0) {
        // Buscamos la mesa por su número de mesa
        const resp = await fetch(`http://localhost:8080/hotel/mesa/buscar/${numero}`);
        if (resp.ok) {
            const data = await resp.json();
            
            // Rellenamos los campos con los nombres exactos de tu DB
            document.getElementById('mesaId').value = data.id_mesa;
            document.getElementById('mesaCapacidad').value = data.Capacidad;
            document.getElementById('mesaPrecio').value = data.precio_base;
            
            // Cambiamos el título para saber que estamos editando
            document.getElementById('tituloModalMesa').innerText = "Editar Mesa Nº: " + data.Numero_mesa;
        }
    }
});

/**
 * ============================================================
 * FUNCIÓN PARA GUARDAR (DETECTA SI ES POST O PUT)
 * ============================================================
 */
async function guardarMesa() {
    const id = document.getElementById('mesaId').value;
    
    // Creamos el objeto con los nombres de campos de tu phpMyAdmin
    const mesa = {
        Numero_mesa: parseInt(document.getElementById('mesaNumero').value),
        Capacidad: parseInt(document.getElementById('mesaCapacidad').value),
        precio_base: parseFloat(document.getElementById('mesaPrecio').value)
    };

    // Si tiene ID usamos PUT para actualizar, si no tiene usamos POST para crear
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
            location.reload(); // Recarga la página para ver la mesa nueva o editada
        } else {
            alert("Error al procesar la solicitud en el servidor");
        }
    } catch (error) {
        alert("Error de conexión con el servidor");
    }
}