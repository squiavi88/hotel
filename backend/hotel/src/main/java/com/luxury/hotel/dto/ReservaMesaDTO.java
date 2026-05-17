package com.luxury.hotel.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class ReservaMesaDTO {

    private Long reservaId;
    private Integer mesaId;
    private LocalDate fecha;
    private String turno;
    private LocalTime hora;
    private Integer numeroPersonas;
    private BigDecimal montoPago;

    public ReservaMesaDTO() {
    }

    public ReservaMesaDTO(Long reservaId, Integer mesaId, LocalDate fecha, String turno, LocalTime hora, Integer numeroPersonas, BigDecimal montoPago) {
        this.reservaId = reservaId;
        this.mesaId = mesaId;
        this.fecha = fecha;
        this.turno = turno;
        this.hora = hora;
        this.numeroPersonas = numeroPersonas;
        this.montoPago = montoPago;
    }

    public Long getReservaId() {
        return reservaId;
    }

    public void setReservaId(Long reservaId) {
        this.reservaId = reservaId;
    }

    public Integer getMesaId() {
        return mesaId;
    }

    public void setMesaId(Integer mesaId) {
        this.mesaId = mesaId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public Integer getCapacidadPersonas() {
        return numeroPersonas;
    }

    public void setCapacidadPersonas(Integer numeroPersonas) {
        this.numeroPersonas = numeroPersonas;
    }

    public BigDecimal getMontoPago() {
        return montoPago;
    }

    public void setMontoPago(BigDecimal montoPago) {
        this.montoPago = montoPago;
    }
}
