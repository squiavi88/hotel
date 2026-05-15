package com.luxury.hotel.repositories;

import com.luxury.hotel.dto.ReservaEventoOcupadoDTO;
import com.luxury.hotel.model.Evento;
import com.luxury.hotel.model.ReservaEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaEventoRepository extends JpaRepository<ReservaEvento, Long> {
    // 1. Corregimos el nombre del DTO en la Query (debe ser el nombre exacto de la clase)
    // 2. El método debe devolver una lista de DTOs, no de Entidades
    @Query("SELECT new com.luxury.hotel.dto.ReservaEventoOcupadoDTO(r.sala, r.fecha) FROM ReservaEvento r")
    List<ReservaEventoOcupadoDTO> findTodasLasOcupadas();

    // Este lo puedes dejar si lo usas en otro sitio
    List<ReservaEvento> findByFecha(LocalDate fecha);


}
