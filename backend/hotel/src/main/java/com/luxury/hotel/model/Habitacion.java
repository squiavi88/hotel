package com.luxury.hotel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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

    @JsonIgnore
    @Column(name = "Imagenes", columnDefinition = "json")
    private String imagenes;

    // ✅ OUTPUT JSON FIELD
    @JsonProperty("imagenes")
    public List<String> getImagenes() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(imagenes, List.class);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    // ✅ INPUT (saving)
    public void setImagenes(List<String> imagenesList) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.imagenes = mapper.writeValueAsString(imagenesList);
        } catch (Exception e) {
            this.imagenes = "[]";
        }
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
