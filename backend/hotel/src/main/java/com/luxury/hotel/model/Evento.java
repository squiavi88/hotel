package com.luxury.hotel.model;


import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "Eventos")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Evento", nullable = false)
    private Long id;

    @Column(name = "Tipo", length = 45, nullable = false)
    private String nombre;

    @Column(name = "Precio_Base", nullable = false)
    private BigDecimal precioBase;

    @Column(name = "Capacidad_Personas", nullable = false)
    private Integer capacidadPersonas;

    public Evento() {
    }

    public Evento(Long id, String nombre, BigDecimal precioBase, Integer capacidadPersonas) {
        this.id = id;
        this.nombre = nombre;
        this.precioBase = precioBase;
        this.capacidadPersonas = capacidadPersonas;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPrecioBase() {
        return precioBase;
    }

    public void setPrecioBase(BigDecimal precioBase) {
        this.precioBase = precioBase;
    }

    public Integer getCapacidadPersonas() {
        return capacidadPersonas;
    }

    public void setCapacidadPersonas(Integer capacidadPersonas) {
        this.capacidadPersonas = capacidadPersonas;
    }
}
