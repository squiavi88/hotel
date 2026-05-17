
/**
 * ============================================================
 * CARGA DE DATOS (FETCH 
 * ============================================================
 */

async function cargarActividadesModal() {
    // Petición al backend para obtener el catálogo de actividades

    try {
        const respuesta = await fetch('http://localhost:8080/hotel/actividad', {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include" // Permite enviar cookies de sesión
        })

        const datos = await respuesta.json();
        listaActividades = datos;

        const select = document.getElementById("actividadSeleccionadaModal");
        select.innerHTML = '<option value="">Selecciona una actividad</option>';

        // Llenamos el select dinámicamente
        datos.forEach(actividad => {
            const option = document.createElement("option");
            option.value = actividad.id;
            option.textContent = actividad.nombre;

            // Guardamos precio y capacidad técnica en el dataset de la etiqueta <option>
            option.dataset.capacidad = actividad.capacidad;
            option.dataset.precio = actividad.precioBase;
            select.appendChild(option);
        });

        select.addEventListener("change", function () {

            const select = document.getElementById("actividadSeleccionadaModal");
            const opcionElegida = select.options[select.selectedIndex];
            document.getElementById('actividadPrecio').value = opcionElegida.dataset.precio;
            document.getElementById('actividadCapacidad').value = opcionElegida.dataset.capacidad;

        });

    } catch (error) {
        console.error(error);
    }


}

// Llamada inmediata para cargar los datos al abrir la página
cargarActividadesModal();
/**
 * ============================================================
 * GUARDAR DATOS
 * ============================================================
 */
async function guardarActividad() {

    try {

        const idActividad = document.getElementById("actividadSeleccionadaModal").value;

        const precio = document.getElementById("actividadPrecio").value;

        const capacidad = document.getElementById("actividadCapacidad").value;

        // Validación básica
        if (!idActividad) {
            alert("Selecciona una actividad");
            return;
        }

        // Objeto que viajará al backend
        const datosActividad = {
            id: idActividad,
            precioBase: parseFloat(precio),
            capacidad: parseInt(capacidad)
        };


        const respuesta = await fetch(`http://localhost:8080/hotel/actividad/${idActividad}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(datosActividad)
            }
        );

        if (respuesta.ok) {

            alert("Actividad actualizada correctamente");

            // cerrar modal Bootstrap
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalGestionActividad"));
            modal.hide();

            // refrescar datos
            cargarActividadesModal();

        } else {
            alert("Error al actualizar la actividad");
        }

    } catch (error) {
        console.error("Error PUT:", error);
    }
}


