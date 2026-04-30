package com.luxury.hotel.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "Habitacion")
public class Habitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Habitacion", nullable = false)
    private Long id;

    @Column(name = "Nombre", length = 45, nullable = false)
    private String nombre;

    @Column(name = "Descripcion", nullable = false)
    private String descripcion;

    @Column(name = "Numero_Habitacion", nullable = false)
    private Integer numeroHabitacion;

    @Column(name = "Tipo_Habitacion", length = 45, nullable = false)
    private String tipoHabitacion;

    @Column(name = "Precio_Noche", nullable = false)
    private BigDecimal precioNoche;

    public Habitacion() {
    }

    public Habitacion(Long id, String nombre, String descripcion, Integer numeroHabitacion, String tipoHabitacion, BigDecimal precioNoche) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.numeroHabitacion = numeroHabitacion;
        this.tipoHabitacion = tipoHabitacion;
        this.precioNoche = precioNoche;
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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getNumeroHabitacion() {
        return numeroHabitacion;
    }

    public void setNumeroHabitacion(Integer numeroHabitacion) {
        this.numeroHabitacion = numeroHabitacion;
    }

    public String getTipoHabitacion() {
        return tipoHabitacion;
    }

    public void setTipoHabitacion(String tipoHabitacion) {
        this.tipoHabitacion = tipoHabitacion;
    }

    public BigDecimal getPrecioNoche() {
        return precioNoche;
    }

    public void setPrecioNoche(BigDecimal precioNoche) {
        this.precioNoche = precioNoche;
    }
}
