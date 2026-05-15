package com.luxury.hotel.api;

import com.luxury.hotel.dto.ReservaEventoDTO;
import com.luxury.hotel.dto.ReservaEventoOcupadoDTO;
import com.luxury.hotel.model.ReservaEvento;
import com.luxury.hotel.repositories.ReservaEventoRepository;
import com.luxury.hotel.servicies.ReservaEventoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/hotel")
public class ReservasEventoController {

    private final ReservaEventoService reservaEventoService;
    private final ReservaEventoRepository reservaEventoRepository;

    // Constructor inyectando ambos para evitar el error rojo
    public ReservasEventoController(ReservaEventoService reservaEventoService, ReservaEventoRepository reservaEventoRepository) {
        this.reservaEventoService = reservaEventoService;
        this.reservaEventoRepository = reservaEventoRepository;
    }

    @PostMapping("/reservas-eventos")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> crearReserva(@RequestBody ReservaEventoDTO dto) {
        try {
            ReservaEvento nuevaReserva = reservaEventoService.procesarReservaEvento(dto);
            return ResponseEntity.ok(nuevaReserva);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // EL NUEVO ENDPOINT PARA EL JS
    @GetMapping("/eventos/ocupados")
    @PreAuthorize("isAuthenticated()")
    public List<ReservaEventoOcupadoDTO> obtenerOcupados() {
        return reservaEventoRepository.findTodasLasOcupadas();
    }

    @GetMapping("/reservas-eventos")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public List<ReservaEvento> listarTodas() {
        return reservaEventoService.findAll();
    }
}