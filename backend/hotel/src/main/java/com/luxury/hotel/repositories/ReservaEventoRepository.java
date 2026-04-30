package com.luxury.hotel.repositories;

import com.luxury.hotel.model.Evento;
import com.luxury.hotel.model.ReservaEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservaEventoRepository extends JpaRepository<ReservaEvento, Long> {
}
