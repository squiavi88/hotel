package com.luxury.hotel.model;


import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Reserva_Actividad")
public class ReservaActividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Reserva_Actividad", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Id_Reserva")
    private Reserva reserva;

    @ManyToOne
    @JoinColumn(name = "Id_Actividad")
    private Actividad actividad;

    @Column(name = "Turno", nullable = false)
    private String turno;

    @Column(name = "Fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "Participantes", nullable = false)
    private Integer participantes;

    @Column(name = "Monto", precision = 10, scale = 2, nullable = false)
    private BigDecimal monto;

    public ReservaActividad() {
    }

    public ReservaActividad(Long id, Reserva reserva, Actividad actividad, String turno, LocalDate fecha, Integer participantes, BigDecimal monto) {
        this.id = id;
        this.reserva = reserva;
        this.actividad = actividad;
        this.turno = turno;
        this.fecha = fecha;
        this.participantes = participantes;
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

    public Actividad getActividad() {
        return actividad;
    }

    public void setActividad(Actividad actividad) {
        this.actividad = actividad;
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
