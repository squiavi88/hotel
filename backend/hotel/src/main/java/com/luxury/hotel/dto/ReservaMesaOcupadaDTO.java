package com.luxury.hotel.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservaMesaOcupadaDTO {

    private Long mesaId;
    private String turno;
    @JsonFormat(pattern = "HH:mm:ss") // Asegura que el JSON sea "14:30:00"
    private LocalTime hora;
    private LocalDate fecha;

    public ReservaMesaOcupadaDTO(Long mesaId, String turno, LocalTime hora, LocalDate fecha  ){
         this.mesaId = mesaId;
         this.turno = turno;
         this.hora = hora;
         this.fecha= fecha;

    }

    public Long getMesaId(){ return mesaId;}

    public String getTurno() { return turno; }
    public LocalTime getHora() { return hora; }
    public LocalDate getFecha() { return fecha; }

}
