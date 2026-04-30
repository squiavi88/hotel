package com.luxury.hotel.api;

import com.luxury.hotel.model.Reserva;
import com.luxury.hotel.model.Usuario;
import com.luxury.hotel.repositories.UsuarioRepository;
import com.luxury.hotel.servicies.ReservaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/hotel")
public class ReservaController {

    private final ReservaService reservaService;
    private final UsuarioRepository usuarioRepository;

    public ReservaController(ReservaService reservaService, UsuarioRepository usuarioRepository) {
        this.reservaService = reservaService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/reservas")
    public List<Reserva> getAllReservas() { return reservaService.findAll(); }

    @GetMapping("/reservas/{id}")
    public ResponseEntity<Reserva> getReservaById(@PathVariable Long id) { return ResponseEntity.ok(reservaService.findById(id)); }

    @PostMapping("/reservas")
    public ResponseEntity<Reserva> createReserva(@RequestBody Reserva reserva) {

        
        reserva.setFechaRegistro(LocalDate.now());
        reserva.setPagoFinal(BigDecimal.ZERO);

        return ResponseEntity.ok(reservaService.save(reserva));
    }

    @PutMapping("/reservas/{id}")
    public ResponseEntity<Reserva> updateReserva(@PathVariable Long id, @RequestBody Reserva reserva) {
        return ResponseEntity.ok(reservaService.update(id, reserva));
    }

    @DeleteMapping("/reservas/{id}")
    public ResponseEntity<Void> deleteReserva(@PathVariable Long id) {
        reservaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
