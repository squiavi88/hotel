/**
 * ============================================================
 * CARGAR EVENTOS EN MODAL
 * ============================================================
 */

async function cargarEventosModal() {

    try {

        const respuesta = await fetch(
            "http://localhost:8080/hotel/evento",
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            }
        );

        const datos = await respuesta.json();

        console.log(datos); // DEBUG

        const select = document.getElementById("eventoSeleccionadoModal");



        select.innerHTML =
            '<option value="">Selecciona un evento</option>';

        datos.forEach(evento => {

            const option = document.createElement("option");

            option.value = evento.id;

            // ✅ CAMBIO IMPORTANTE
            option.textContent = evento.nombre;

            option.dataset.precio = evento.precioBase;
            option.dataset.capacidad = evento.capacidad;

            select.appendChild(option);
        });

        /**
         * AUTORELLENAR CAMPOS
         */
        select.addEventListener("change", function () {

            const opcion =
                this.options[this.selectedIndex];

            document.getElementById("eventoPrecio").value =
                opcion.dataset.precio || "";

            document.getElementById("eventoCapacidad").value =
                opcion.dataset.capacidad || "";
        });

    } catch (error) {
        console.error("Error cargando eventos:", error);
    }
}

/**
 * ============================================================
 * GUARDAR EVENTO
 * ============================================================
 */

async function guardarEvento() {

    try {

        const idEvento =
            document.getElementById("eventoTipo").value;

        const precio =
            document.getElementById("eventoPrecio").value;

        const capacidad =
            document.getElementById("eventoCapacidad").value;

        if (!idEvento) {
            alert("Selecciona un evento");
            return;
        }

        const datosEvento = {
            id: idEvento,
            precioBase: parseFloat(precio),
            capacidad: parseInt(capacidad)
        };

        const respuesta = await fetch(
            `http://localhost:8080/hotel/evento/${idEvento}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(datosEvento)
            }
        );

        if (respuesta.ok) {

            alert("Evento actualizado correctamente");

            const modal =
                bootstrap.Modal.getInstance(
                    document.getElementById("modalGestionEvento")
                );

            modal.hide();

            cargarEventosModal();

        } else {
            alert("Error al actualizar");
        }

    } catch (error) {
        console.error("Error PUT:", error);
    }
}

/**
 * ============================================================
 * INICIALIZACIÓN SEGURA
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    cargarEventosModal();

    document
        .getElementById("btnAccionEvento")
        ?.addEventListener("click", guardarEvento);
});