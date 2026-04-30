package com.luxury.hotel.api;


import com.luxury.hotel.dto.ReservaActividadDTO;
import com.luxury.hotel.dto.ReservaHabitacionDTO;
import com.luxury.hotel.model.*;
import com.luxury.hotel.repositories.ReservaRepository;
import com.luxury.hotel.servicies.ActividadService;
import com.luxury.hotel.servicies.ReservaActividadService;
import com.luxury.hotel.servicies.ReservaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/hotel")
public class ReservaActividadController {

    private final ReservaActividadService reservaActividadService;
    private final ReservaService reservaService;
    private final ActividadService actividadService;

    public ReservaActividadController(ReservaActividadService reservaActividadService, ReservaService reservaService, ActividadService actividadService) {
        this.reservaActividadService = reservaActividadService;
        this.reservaService = reservaService;
        this.actividadService = actividadService;
    }

    @GetMapping("/reservas-actividades")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public List<ReservaActividad> getAllReservaActividades() { return reservaActividadService.findAll(); }

    @GetMapping("/reservas-actividades/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<ReservaActividad> getReservaActividadById(@PathVariable Long id) { return ResponseEntity.ok(reservaActividadService.findById(id)); }

    @PostMapping("/reservas-actividades")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createReservaActividad(@RequestBody ReservaActividadDTO dto) {

        try {
            Reserva reserva = reservaService.findById(dto.getReservaId());

            Actividad actividad = actividadService.findById(dto.getActividadId());

            BigDecimal precioTotal = actividad.getPrecioBase().multiply(BigDecimal.valueOf(dto.getParticipantes()));

            ReservaActividad reservaActividad = new ReservaActividad();
            reservaActividad.setReserva(reserva);
            reservaActividad.setActividad(actividad);
            reservaActividad.setTurno(dto.getTurno());
            reservaActividad.setFecha(dto.getFecha());
            reservaActividad.setParticipantes(dto.getParticipantes());
            reservaActividad.setMonto(dto.getMonto());

            reservaActividadService.save(reservaActividad);

            reserva.setPagoFinal(reserva.getPagoFinal().add(precioTotal));
            reservaService.update(reserva.getId(), reserva);

            return ResponseEntity.ok(reservaActividad);
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/reservas-actividades/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ReservaActividad> updateReservaActividad(@PathVariable Long id, @RequestBody ReservaActividad reservaActividad) {
        return ResponseEntity.ok(reservaActividadService.update(id, reservaActividad));
    }

    @DeleteMapping("/reservas-actividades/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteReservaActividad(@PathVariable Long id) {
        reservaActividadService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
