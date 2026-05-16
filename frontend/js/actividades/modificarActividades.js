// URL base de tu API (ajusta según tu backend)
const API_URL_ACT = "http://localhost:8080/hotel/actividad";

// 1. AUTOCOMPLETAR AL ESCRIBIR EL NOMBRE
// Cuando el admin sale del campo 'Nombre', busca si ya existe para cargar sus datos
document.getElementById('actividadNombre').addEventListener('blur', async (e) => {
    const nombre = e.target.value;
    if (nombre.length > 2) {
        try {
            const resp = await fetch(`${API_URL_ACT}/buscar/${nombre}`);
            if (resp.ok) {
                const data = await resp.json();
                // Rellenamos el formulario con los datos de la DB
                document.getElementById('actividadId').value = data.id_actividad;
                document.getElementById('actividadPrecio').value = data.precio_base;
                document.getElementById('actividadCapacidad').value = data.capacidad_maxima;
                document.getElementById('tituloModalActividad').innerText = "Editar: " + data.Nombre;
            }
        } catch (err) { console.log("Nueva actividad detectada"); }
    }
});

// 2. FUNCIÓN PARA GUARDAR (CREAR O ACTUALIZAR)
async function guardarActividad() {
    const id = document.getElementById('actividadId').value;
    
    const actividadData = {
        nombre: document.getElementById('actividadNombre').value,
        precio_base: parseFloat(document.getElementById('actividadPrecio').value),
        capacidad_maxima: parseInt(document.getElementById('actividadCapacidad').value)
    };

    // Si hay ID usamos PUT (actualizar), si no POST (crear)
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL_ACT}/${id}` : API_URL_ACT;

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
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

