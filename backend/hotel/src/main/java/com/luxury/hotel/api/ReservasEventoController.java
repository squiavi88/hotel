package com.luxury.hotel.api;


import com.luxury.hotel.dto.ReservaActividadDTO;
import com.luxury.hotel.dto.ReservaEventoDTO;
import com.luxury.hotel.model.*;
import com.luxury.hotel.servicies.EventoService;
import com.luxury.hotel.servicies.ReservaEventoService;
import com.luxury.hotel.servicies.ReservaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/hotel")
public class ReservasEventoController {
    private final ReservaEventoService reservaEventoService;
    private final ReservaService reservaService;
    private final EventoService eventoService;

    public ReservasEventoController(ReservaEventoService reservaEventoService, ReservaService reservaService, EventoService eventoService) {
        this.reservaEventoService = reservaEventoService;
        this.reservaService = reservaService;
        this.eventoService = eventoService;
    }

    @GetMapping("/reservas-eventos")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public List<ReservaEvento> getAllReservaEventos() { return reservaEventoService.findAll(); }

    @GetMapping("/reservas-eventos/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<ReservaEvento> getReservaEventoById(@PathVariable Long id) { return ResponseEntity.ok(reservaEventoService.findById(id)); }

    @PostMapping("/reservas-eventos")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createReservaEvento(@RequestBody ReservaEventoDTO dto) {

        try {
            Reserva reserva = reservaService.findById(dto.getReservaId());

            Evento evento = eventoService.findById(dto.getEventoId());

            BigDecimal precioTotal = dto.getMonto();

            ReservaEvento reservaEvento = new ReservaEvento();
            reservaEvento.setReserva(reserva);
            reservaEvento.setEvento(evento);
            reservaEvento.setFecha(dto.getFecha());
            reservaEvento.setParticipantes(dto.getParticipantes());
            reservaEvento.setSala(dto.getSala());
            reservaEvento.setCatering(dto.getCatering());
            reservaEvento.setMonto(dto.getMonto());

            reservaEventoService.save(reservaEvento);

            reserva.setPagoFinal(reserva.getPagoFinal().add(precioTotal));
            reservaService.update(reserva.getId(), reserva);

            return ResponseEntity.ok(reservaEvento);
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/reservas-eventos/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ReservaEvento> updateReservaEvento(@PathVariable Long id, @RequestBody ReservaEvento reservaEvento) {
        return ResponseEntity.ok(reservaEventoService.update(id, reservaEvento));
    }

    @DeleteMapping("/reservas-eventos/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteReservaEvento(@PathVariable Long id) {
        reservaEventoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
