package com.luxury.hotel.repositories;

import com.luxury.hotel.model.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcitvidadRepository extends JpaRepository<Actividad, Long> {
}
