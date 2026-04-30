package com.luxury.hotel.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Reserva_Habitacion")
public class ReservaHabitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Reserva_Habitacion", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Id_Reserva")
    private Reserva reserva;

    @ManyToOne
    @JoinColumn(name = "Id_Habitacion")
    private Habitacion habitacion;

    @Column(name = "Fecha_Entrada", nullable = false)
    private LocalDate fechaEntrada;

    @Column(name = "Fecha_Salida", nullable = false)
    private LocalDate fechaSalida;

    @Column(name = "Monto", precision = 10, scale = 2, nullable = false)
    private BigDecimal monto;

    public ReservaHabitacion() {
    }

    public ReservaHabitacion(Long id, Reserva reserva, Habitacion habitacion, LocalDate fechaEntrada, LocalDate fechaSalida, BigDecimal monto) {
        this.id = id;
        this.reserva = reserva;
        this.habitacion = habitacion;
        this.fechaEntrada = fechaEntrada;
        this.fechaSalida = fechaSalida;
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

    public Habitacion getHabitacion() {
        return habitacion;
    }

    public void setHabitacion(Habitacion habitacion) {
        this.habitacion = habitacion;
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
