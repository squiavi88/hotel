package com.luxury.hotel.repositories;

import com.luxury.hotel.model.ReservaHabitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaHabitacionRepository extends JpaRepository<ReservaHabitacion, Long> {
    List<ReservaHabitacion> findByHabitacionId(Long habitacionId);
}
