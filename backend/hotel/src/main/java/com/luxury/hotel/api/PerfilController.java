package com.luxury.hotel.api;

import com.luxury.hotel.dto.ReservasHistorial;
import com.luxury.hotel.repositories.ReservaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/hotel")
public class PerfilController {

    private final ReservaRepository reservaRepository;

    public PerfilController(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    @GetMapping("/reservas/usuario/{id}")
    public ResponseEntity<List<ReservasHistorial>> getReservasByUsuario(@PathVariable Long id) {

        if (id == null) {
            return ResponseEntity.badRequest().build();
        }

        List<ReservasHistorial> reservas = reservaRepository.findByUsuario(id);

        return ResponseEntity.ok(reservas);
    }
}
