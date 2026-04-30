package com.luxury.hotel.repositories;

import com.luxury.hotel.model.ReservaMesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservaMesaRepository extends JpaRepository<ReservaMesa, Long> {
}
