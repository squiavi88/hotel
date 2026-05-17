async function cargarMesasModal() {

    try {

        const respuesta = await fetch(
            "http://localhost:8080/hotel/mesas",
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            }
        );

        const datos = await respuesta.json();

        console.table(datos)
        const select = document.getElementById("mesaSeleccionadaModal");

        select.innerHTML =
            '<option value="">Selecciona una mesa</option>';

        datos.forEach(mesa => {

            const option = document.createElement("option");

            option.value = mesa.id;
            option.textContent =  mesa.numeroMesa;

            // 🔥 nombres EXACTOS del backend
            option.dataset.numero = mesa.numeroMesa;
            option.dataset.capacidad = mesa.capacidad;
            option.dataset.precio = mesa.precioBase;

            select.appendChild(option);
        });

        select.addEventListener("change", function () {

            const opcion = select.options[select.selectedIndex];

            document.getElementById("mesaId").value =
                opcion.value;


            document.getElementById("mesaCapacidad").value =
                opcion.dataset.capacidad;

            document.getElementById("mesaPrecio").value =
                opcion.dataset.precio;
        });

    } catch (error) {
        console.error(error);
    }
}
 cargarMesasModal()
async function guardarMesa() {

    try {

        const idMesa = document.getElementById("mesaId").value;

        if (!idMesa) {
            alert("Selecciona una mesa");
            return;
        }

        const datosMesa = {
            id: idMesa,
            numeroMesa: parseInt(
                document.getElementById("mesaNumero").value
            ),
            capacidad: parseInt(
                document.getElementById("mesaCapacidad").value
            ),
            precioBase: parseFloat(
                document.getElementById("mesaPrecio").value
            )
        };

        const respuesta = await fetch(
            `http://localhost:8080/hotel/mesa/${idMesa}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(datosMesa)
            }
        );

        if (respuesta.ok) {

            alert("Mesa actualizada correctamente");

            const modal =
                bootstrap.Modal.getInstance(
                    document.getElementById("modalGestionMesa")
                );

            modal.hide();

            cargarMesasModal();

        } else {
            alert("Error al actualizar mesa");
        }

    } catch (error) {
        console.error("Error PUT:", error);
    }
}