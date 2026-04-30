package com.luxury.hotel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "Mesa")
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Mesa", nullable = false)
    private Long id;

    @Column(name = "Numero_Mesa", nullable = false)
    private Integer numeroMesa;

    @Column(name = "Capacidad", nullable = false)
    private Integer capacidad;

    @Column(name = "Precio_Base", nullable = false)
    private BigDecimal precioBase;


    @OneToMany(mappedBy = "mesa")
    @JsonIgnore
    private List<ReservaMesa> reservaMesaList;

    public Mesa() {
    }

    public Mesa(Long id, Integer numeroMesa, Integer capacidad, BigDecimal precioBase, List<ReservaMesa> reservaMesaList) {
        this.id = id;
        this.numeroMesa = numeroMesa;
        this.capacidad = capacidad;
        this.precioBase = precioBase;
        this.reservaMesaList = reservaMesaList;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumeroMesa() {
        return numeroMesa;
    }

    public void setNumeroMesa(Integer numeroMesa) {
        this.numeroMesa = numeroMesa;
    }

    public Integer getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad;
    }

    public BigDecimal getPrecioBase() {
        return precioBase;
    }

    public void setPrecioBase(BigDecimal precioBase) {
        this.precioBase = precioBase;
    }

    public List<ReservaMesa> getReservaMesaList() {
        return reservaMesaList;
    }

    public void setReservaMesaList(List<ReservaMesa> reservaMesaList) {
        this.reservaMesaList = reservaMesaList;
    }
}
