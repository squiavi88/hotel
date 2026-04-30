package com.luxury.hotel.repositories;

import com.luxury.hotel.dto.ReservasHistorial;
import com.luxury.hotel.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    @Query(value = "SELECT * FROM v_reservas_usuario WHERE usuario_id = :id", nativeQuery = true)
    List<ReservasHistorial> findByUsuario(@Param("id") Long id);

}
