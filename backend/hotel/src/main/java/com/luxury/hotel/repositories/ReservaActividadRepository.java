package com.luxury.hotel.repositories;


import com.luxury.hotel.model.ReservaActividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservaActividadRepository extends JpaRepository<ReservaActividad, Long> {
}
