

/**
 * ============================================================
 *  FUNCIÓN PARA CARGAR DATOS AL ESCRIBIR NOMBRE (Autocompletado)
 * ============================================================
 */

document.getElementById('eventoTipo').addEventListener('blur', async (e) => {
    const tipo = e.target.value;
    if (tipo.length > 2) {
        const resp = await fetch(`http://localhost:8080/hotel/evento/buscar/${tipo}`);
        if (resp.ok) {
            const data = await resp.json();
            document.getElementById('eventoId').value = data.id;
            document.getElementById('eventoPrecio').value = data.precio_base;
            document.getElementById('eventoCapacidad').value = data.capacidad_maxima;
            document.getElementById('tituloModal').innerText = "Editar Evento: " + data.tipo;
        }
    }
});

/**
 * ============================================================
 *  FUNCIÓN PARA GUARDAR (DETECTA SI ES POST O PUT)
 * ============================================================
 */

async function guardarCambios() {
    const id = document.getElementById('eventoId').value;
    const evento = {
        tipo: document.getElementById('eventoTipo').value,
        precio_base: parseFloat(document.getElementById('eventoPrecio').value),
        capacidad_maxima: parseInt(document.getElementById('eventoCapacidad').value)
    };

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:8080/hotel/evento/${id}` : `http://localhost:8080/hotel/evento`;

    try {
        const resp = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
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

