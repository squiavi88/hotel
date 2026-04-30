package com.luxury.hotel.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ReservaHabitacionDTO {
    private Long reservaId;
    private Long habitacionId;
    private LocalDate fechaEntrada;
    private LocalDate fechaSalida;
    private BigDecimal monto;

    public ReservaHabitacionDTO() {
    }

    public ReservaHabitacionDTO(Long reservaId, Long habitacionId, LocalDate fechaEntrada, LocalDate fechaSalida, BigDecimal monto) {
        this.reservaId = reservaId;
        this.habitacionId = habitacionId;
        this.fechaEntrada = fechaEntrada;
        this.fechaSalida = fechaSalida;
        this.monto = monto;
    }

    public Long getReservaId() {
        return reservaId;
    }

    public void setReservaId(Long reservaId) {
        this.reservaId = reservaId;
    }

    public Long getHabitacionId() {
        return habitacionId;
    }

    public void setHabitacionId(Long habitacionId) {
        this.habitacionId = habitacionId;
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

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }
}
