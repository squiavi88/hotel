package com.luxury.hotel.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class ReservaMesaDTO {

    private Long reservaId;
    private Long mesaId;
    private LocalDate fecha;
    private LocalTime hora;
    private BigDecimal montoPago;

    public ReservaMesaDTO() {
    }

    public ReservaMesaDTO(Long reservaID, Long mesaId, LocalDate fecha, LocalTime hora, BigDecimal montoPago) {
        this.reservaId = reservaId;
        this.mesaId = mesaId;
        this.fecha = fecha;
        this.hora = hora;
        this.montoPago = montoPago;
    }

    public Long getReservaId() {
        return reservaId;
    }

    public void setReservaId(Long reservaId) {
        this.reservaId = reservaId;
    }

    public Long getMesaId() {
        return mesaId;
    }

    public void setMesaId(Long mesaId) {
        this.mesaId = mesaId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public BigDecimal getMontoPago() {
        return montoPago;
    }

    public void setMontoPago(BigDecimal montoPago) {
        this.montoPago = montoPago;
    }
}
