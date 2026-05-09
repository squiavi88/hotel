package com.luxury.hotel.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "Actividades")
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Actividad", nullable = false)
    private Long id;

    @Column(name = "Nombre", length = 45, nullable = false)
    private String nombre;

    @Column(name = "Precio_Base", nullable = false)
    private BigDecimal precioBase;
    @Column(name = "capacidad_Maxima", nullable = false)
    private Long capacidad;

    public Actividad() {
    }

    public Actividad(Long id, String nombre, BigDecimal precioBase, Long capacidad ) {
        this.id = id;
        this.nombre = nombre;
        this.precioBase = precioBase;
        this.capacidad = capacidad;
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

    public Long getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(Long capacidad) {
        this.capacidad = capacidad;
    }
}
