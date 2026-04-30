package com.luxury.hotel.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ReservaEventoDTO {
    private Long reservaId;
    private Long eventoId;
    private LocalDate fecha;
    private String sala;
    private Integer participantes;
    private String catering;
    private BigDecimal monto;

    public ReservaEventoDTO() {
    }

    public ReservaEventoDTO(Long reservaId, Long eventoId, LocalDate fecha, String sala, Integer participantes, String catering, BigDecimal monto) {
        this.reservaId = reservaId;
        this.eventoId = eventoId;
        this.fecha = fecha;
        this.sala = sala;
        this.participantes = participantes;
        this.catering = catering;
        this.monto = monto;
    }

    public Long getReservaId() {
        return reservaId;
    }

    public void setReservaId(Long reservaId) {
        this.reservaId = reservaId;
    }

    public Long getEventoId() {
        return eventoId;
    }

    public void setEventoId(Long eventoId) {
        this.eventoId = eventoId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getSala() {
        return sala;
    }

    public void setSala(String sala) {
        this.sala = sala;
    }

    public Integer getParticipantes() {
        return participantes;
    }

    public void setParticipantes(Integer participantes) {
        this.participantes = participantes;
    }

    public String getCatering() {
        return catering;
    }

    public void setCatering(String catering) {
        this.catering = catering;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }
}
