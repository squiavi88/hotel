package com.luxury.hotel.model;


import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Reserva_Mesa")
public class ReservaMesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Reserva_Mesa", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Id_Reserva")
    private Reserva reserva;

    @ManyToOne
    @JoinColumn(name = "Id_Mesa")
    private Mesa mesa;

    @Column(name = "Fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "Hora", nullable = false)
    private LocalTime hora;

    @Column(name = "Monto_Pago", precision = 10, scale = 2, nullable = false)
    private BigDecimal montoPago;

    public ReservaMesa() {
    }

    public ReservaMesa(Long id, Reserva reserva, Mesa mesa, LocalDate fecha, LocalTime hora, BigDecimal montoPago) {
        this.id = id;
        this.reserva = reserva;
        this.mesa = mesa;
        this.fecha = fecha;
        this.hora = hora;
        this.montoPago = montoPago;
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

    public Mesa getMesa() {
        return mesa;
    }

    public void setMesa(Mesa mesa) {
        this.mesa = mesa;
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
