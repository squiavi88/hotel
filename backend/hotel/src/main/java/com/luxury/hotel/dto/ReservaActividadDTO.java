package com.luxury.hotel.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ReservaActividadDTO {
    private Long reservaId;
    private Long actividadId;
    private String turno;
    private LocalDate fecha;
    private Integer participantes;
    private BigDecimal monto;

    public ReservaActividadDTO() {
    }

    public ReservaActividadDTO(Long reservaId, Long actividadId, String turno, LocalDate fecha, Integer participantes, BigDecimal monto) {
        this.reservaId = reservaId;
        this.actividadId = actividadId;
        this.turno = turno;
        this.fecha = fecha;
        this.participantes = participantes;
        this.monto = monto;
    }

    public Long getReservaId() {
        return reservaId;
    }

    public void setReservaId(Long reservaId) {
        this.reservaId = reservaId;
    }

    public Long getActividadId() {
        return actividadId;
    }

    public void setActividadId(Long actividadId) {
        this.actividadId = actividadId;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Integer getParticipantes() {
        return participantes;
    }

    public void setParticipantes(Integer participantes) {
        this.participantes = participantes;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }
}
