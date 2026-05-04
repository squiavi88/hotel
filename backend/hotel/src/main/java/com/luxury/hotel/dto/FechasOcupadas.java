package com.luxury.hotel.dto;

import java.time.LocalDate;

public class FechasOcupadas {

    private LocalDate fechaEntrada;
    private LocalDate fechaSalida;

    public FechasOcupadas() {
    }

    public FechasOcupadas(LocalDate fechaEntrada, LocalDate fechaSalida) {
        this.fechaEntrada = fechaEntrada;
        this.fechaSalida = fechaSalida;
    }

    public LocalDate getFechaEntrada() {

        return fechaEntrada;
    }

    public void setFechaEntrada(LocalDate fechaEntrada) {
        this.fechaEntrada = fechaEntrada;
    }

    public LocalDate getFechaSalida() {

        return fechaSalida;
    }

    public void setFechaSalida(LocalDate fechaSalida) {
        this.fechaSalida = fechaSalida;
    }
}
