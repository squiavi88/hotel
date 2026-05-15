package com.luxury.hotel.repositories;

import com.luxury.hotel.model.ReservaMesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaMesaRepository extends JpaRepository<ReservaMesa, Long> {

    // Spring Data JPA genera automáticamente la consulta SQL filtrando por el ID de la mesa
    List<ReservaMesa> findByMesaId(Long mesaId);
}