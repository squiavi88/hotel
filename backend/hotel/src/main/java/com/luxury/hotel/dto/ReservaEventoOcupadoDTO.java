package com.luxury.hotel.dto;

import java.time.LocalDate;

public class ReservaEventoOcupadoDTO {
    private String sala;
    private LocalDate fecha;

    // Constructor vacío (para Spring)
    public ReservaEventoOcupadoDTO() {}

    // [IMPORTANTE] Constructor con campos para la @Query del Repository
    public ReservaEventoOcupadoDTO(String sala, LocalDate fecha) {
        this.sala = sala;
        this.fecha = fecha;
    }

    // Getters y Setters
    public String getSala() { return sala; }
    public void setSala(String sala) { this.sala = sala; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
}