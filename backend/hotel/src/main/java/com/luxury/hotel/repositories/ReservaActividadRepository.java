package com.luxury.hotel.repositories;


import com.luxury.hotel.model.ReservaActividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface ReservaActividadRepository extends JpaRepository<ReservaActividad, Long> {
    List<ReservaActividad> findByFecha(LocalDate fecha);
}
