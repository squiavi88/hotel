async function cargarHabitacionesModal() {

    try {

        const respuesta = await fetch(
            "http://localhost:8080/hotel/habitaciones",
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            }
        );

        const datos = await respuesta.json();

        console.table(datos);

        const select = document.getElementById("habitacionSeleccionadaModal");

        select.innerHTML =
            '<option value="">Selecciona una habitación</option>';

        datos.forEach(habitacion => {

            const option = document.createElement("option");

            option.value = habitacion.id;
            option.textContent = habitacion.nombre;

            // datos backend EXACTOS (según tu entidad)
            option.dataset.nombre = habitacion.nombre;
            option.dataset.numero = habitacion.numeroHabitacion;
            option.dataset.descripcion = habitacion.descripcion;
            option.dataset.tipo = habitacion.tipoHabitacion;
            option.dataset.precio = habitacion.precioNoche;

            select.appendChild(option);
        });

        select.addEventListener("change", function () {

            const opcion = select.options[select.selectedIndex];

            document.getElementById("habitacionId").value =
                opcion.value;

           

            document.getElementById("habNumero").value =
                opcion.dataset.numero;

            document.getElementById("habDescripcion").value =
                opcion.dataset.descripcion;

            document.getElementById("habTipo").value =
                opcion.dataset.tipo;

            document.getElementById("habPrecio").value =
                opcion.dataset.precio;
        });

    } catch (error) {
        console.error("Error cargando habitaciones:", error);
    }
}

cargarHabitacionesModal();

async function guardarHabitacion() {

    try {

        const idHabitacion = document.getElementById("habitacionId").value;

        if (!idHabitacion) {
            alert("Selecciona una habitación");
            return;
        }

        const datosHabitacion = {
            id: idHabitacion,
            nombre: document.getElementById("habNombre").value,
            numeroHabitacion: parseInt(
                document.getElementById("habNumero").value
            ),
            descripcion: document.getElementById("habDescripcion").value,
            tipoHabitacion: document.getElementById("habTipo").value,
            precioNoche: parseFloat(
                document.getElementById("habPrecio").value
            )
        };

        const respuesta = await fetch(
            `http://localhost:8080/hotel/habitacion/${idHabitacion}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(datosHabitacion)
            }
        );

        if (respuesta.ok) {

            alert("Habitación actualizada correctamente");

            const modal =
                bootstrap.Modal.getInstance(
                    document.getElementById("modalGestionHabitacion")
                );

            modal.hide();

            cargarHabitacionesModal();

        } else {
            alert("Error al actualizar habitación");
        }

    } catch (error) {
        console.error("Error PUT habitación:", error);
    }
}