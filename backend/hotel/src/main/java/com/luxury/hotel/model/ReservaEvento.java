package com.luxury.hotel.model;


import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Reserva_Evento")
public class ReservaEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Reserva_Evento", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Id_Reserva")
    private Reserva reserva;

    @ManyToOne
    @JoinColumn(name = "Id_Evento")
    private Evento evento;

    @Column(name = "Fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "Participantes", nullable = false)
    private Integer participantes;

    @Column(name = "Sala", nullable = false)
    private String sala;

    @Column(name = "Catering", nullable = false)
    private String catering;

    @Column(name = "Monto", precision = 10, scale = 2, nullable = false)
    private BigDecimal monto;

    public ReservaEvento() {
    }

    public ReservaEvento(Long id, Reserva reserva, Evento evento, LocalDate fecha, Integer participantes, String sala, String catering, BigDecimal monto) {
        this.id = id;
        this.reserva = reserva;
        this.evento = evento;
        this.fecha = fecha;
        this.participantes = participantes;
        this.sala = sala;
        this.catering = catering;
        this.monto = monto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Reserva getReserva() {
        return reserva;
    }

    public void setReserva(Reserva reserva) {
        this.reserva = reserva;
    }

    public Evento getEvento() {
        return evento;
    }

    public void setEvento(Evento evento) {
        this.evento = evento;
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

    public String getSala() {
        return sala;
    }

    public void setSala(String sala) {
        this.sala = sala;
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
