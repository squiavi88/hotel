package com.luxury.hotel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Reserva", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Id_Usuario")
    private Usuario usuario;

    @Column(name = "Fecha_Registro", nullable = false)
    private LocalDate fechaRegistro;

    @Column(name = "Pago_Final", precision = 10, scale = 2)
    private BigDecimal pagoFinal = BigDecimal.ZERO;


    @OneToMany(mappedBy = "reserva")
    @JsonIgnore
    private List<ReservaHabitacion> reservaHabitacionList;

    @OneToMany(mappedBy = "reserva")
    @JsonIgnore
    private List<ReservaMesa> reservaMesaList;

    public Reserva() {
    }

    public Reserva(Long id, Usuario usuario, LocalDate fechaRegistro, BigDecimal pagoFinal, List<ReservaHabitacion> reservaHabitacionList, List<ReservaMesa> reservaMesaList) {
        this.id = id;
        this.usuario = usuario;
        this.fechaRegistro = fechaRegistro;
        this.pagoFinal = pagoFinal;
        this.reservaHabitacionList = reservaHabitacionList;
        this.reservaMesaList = reservaMesaList;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public BigDecimal getPagoFinal() {
        return pagoFinal;
    }

    public void setPagoFinal(BigDecimal pagoFinal) {
        this.pagoFinal = pagoFinal;
    }

    public List<ReservaHabitacion> getReservaHabitacionList() {
        return reservaHabitacionList;
    }

    public void setReservaHabitacionList(List<ReservaHabitacion> reservaHabitacionList) {
        this.reservaHabitacionList = reservaHabitacionList;
    }

    public List<ReservaMesa> getReservaMesaList() {
        return reservaMesaList;
    }

    public void setReservaMesaList(List<ReservaMesa> reservaMesaList) {
        this.reservaMesaList = reservaMesaList;
    }
}
