package com.luxury.hotel.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface ReservasHistorial {

    Integer getId();
    String getTipo();
    String getDetalles();
    LocalDate getFecha();
    BigDecimal getTotal();
    Integer getUsuarioId();
}