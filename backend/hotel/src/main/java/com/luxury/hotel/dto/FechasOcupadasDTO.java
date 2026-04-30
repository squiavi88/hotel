package com.luxury.hotel.dto;


import java.time.LocalDate;

// En package com.luxury.hotel.dto;
public class FechasOcupadasDTO {
    private LocalDate fechaEntrada;
    private LocalDate fechaSalida;

    public FechasOcupadasDTO(LocalDate entrada, LocalDate salida) {
        this.fechaEntrada = entrada;
        this.fechaSalida = salida;
    }
    // Getters y Setters...
}