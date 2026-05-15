package com.luxury.hotel.dto;

/**
 * Este DTO se utiliza para enviar la información de disponibilidad
 * de una actividad específica al Frontend tras consultar la base de datos.
 */
public class DisponibilidadActividadDTO {

    // Cupos que quedan libres (Capacidad Total - Reservas ya hechas)
    private Integer cuposDisponibles;

    // Capacidad máxima permitida para esa actividad y turno
    private Integer capacidadTotal;

    // Flag booleano para que el Front sepa rápidamente si debe mostrar "Agotado"
    private boolean agotado;

    /**
     * Constructor principal: Calcula automáticamente si la actividad está agotada
     * al momento de crear el objeto en el Service.
     */
    public DisponibilidadActividadDTO(Integer disponibles, Integer totales) {
        this.cuposDisponibles = disponibles;
        this.capacidadTotal = totales;
        // Lógica de negocio simple: si los disponibles son 0 o menos, está agotado
        this.agotado = disponibles <= 0;
    }

    // --- GETTERS ---
    // El Frontend usará estos métodos (vía JSON) para leer los datos.

    public Integer getCuposDisponibles() {
        return cuposDisponibles;
    }

    public Integer getCapacidadTotal() {
        return capacidadTotal;
    }

    /**
     * Este método es el que el JS leerá para saber si deshabilita
     * el botón de reserva por completo.
     */
    public boolean isAgotado() {
        return agotado;
    }

    // --- SETTERS ---
    // Permiten modificar los datos manualmente si fuera necesario después de la creación.

    public void setCuposDisponibles(Integer cuposDisponibles) {
        this.cuposDisponibles = cuposDisponibles;
        // Importante: Si actualizamos los cupos, recalculamos el estado de 'agotado'
        this.agotado = cuposDisponibles <= 0;
    }

    public void setCapacidadTotal(Integer capacidadTotal) {
        this.capacidadTotal = capacidadTotal;
    }

    public void setAgotado(boolean agotado) {
        this.agotado = agotado;
    }
}