package com.luxury.hotel.repositories;


import com.luxury.hotel.model.ReservaEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaEventoRepository extends JpaRepository<ReservaEvento, Long> {
    List<ReservaEvento> findByFecha(LocalDate fecha);
}
