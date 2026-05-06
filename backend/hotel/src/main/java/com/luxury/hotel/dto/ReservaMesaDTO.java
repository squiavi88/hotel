package com.luxury.hotel.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class ReservaMesaDTO {

    private Long reservaId;
    private Integer mesaId;
    private LocalDate fecha;

    private String turno;           // <--- Agregar
    private LocalTime hora;
    private Integer cantidadPersonas; // <--- Agregar

    private BigDecimal montoPago;

    public ReservaMesaDTO() {
    }

    public ReservaMesaDTO(Long reservaID, Integer mesaId, LocalDate fecha, String turno, LocalTime hora,
                          Integer cantidadPersonas, BigDecimal montoPago) {
        this.reservaId = reservaID;
        this.mesaId = mesaId;
        this.turno = turno;
        this.fecha = fecha;
        this.cantidadPersonas = cantidadPersonas;
        this.hora = hora;
        this.montoPago = montoPago;
    }

    public Long getReservaID() {
        return reservaId;
    }

    public void setReservaID(Long reservaId) {
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

    public String getTurno() {return turno;}

    public void setTurno(String turno) {this.turno = turno;}

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public Integer getCantidadPersonas() {return cantidadPersonas;}

    public void setCantidadPersonas(Integer cantidadPersonas) {this.cantidadPersonas = cantidadPersonas;}

    public BigDecimal getMontoPago() {
        return montoPago;
    }

    public void setMontoPago(BigDecimal montoPago) {
        this.montoPago = montoPago;
    }
}
