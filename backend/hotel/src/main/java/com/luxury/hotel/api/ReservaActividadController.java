package com.luxury.hotel.api;


import com.luxury.hotel.dto.DisponibilidadActividadDTO;
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
            // 1. Buscamos las entidades relacionadas
            Reserva reserva = reservaService.findById(dto.getReservaId());

            Actividad actividad = actividadService.findById(dto.getActividadId());
            // 2. LÓGICA DE CÁLCULO EN EL BACKEND
            // Multiplicamos el precio base de la BD por los participantes del DTO
            BigDecimal precioCalculado = actividad.getPrecioBase().multiply(BigDecimal.valueOf(dto.getParticipantes()));

            ReservaActividad reservaActividad = new ReservaActividad();
            reservaActividad.setReserva(reserva);
            reservaActividad.setActividad(actividad);
            reservaActividad.setTurno(dto.getTurno());
            reservaActividad.setFecha(dto.getFecha());
            reservaActividad.setParticipantes(dto.getParticipantes());
            // CAMBIO CRÍTICO: Usamos 'precioCalculado' (del server) NO 'dto.getMonto()' (del front)
            reservaActividad.setMonto(precioCalculado);

            reservaActividadService.save(reservaActividad);

            BigDecimal pagoActual = reserva.getPagoFinal();
            if (pagoActual == null) {
                pagoActual = BigDecimal.ZERO; // Si es null, lo tratamos como 0
            }
            reserva.setPagoFinal(reserva.getPagoFinal().add(precioCalculado));
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

    @GetMapping("/{id}/disponibilidad")
    public ResponseEntity<DisponibilidadActividadDTO> obtenerDisponibilidad(
            @PathVariable Long id,
            @RequestParam String fecha,
            @RequestParam String turno) {

        // 1. Recepción de datos: El Front envía la fecha como String (formato YYYY-MM-DD).
        // Es necesario parsearlo a LocalDate para que JPA pueda realizar comparaciones
        // temporales correctas en la base de datos.
        java.time.LocalDate fechaParseada = java.time.LocalDate.parse(fecha);

        // 2. Consulta de lógica de negocio: Invocamos al Service.
        // Este método debe contar cuántas personas ya han reservado para ese 'id', 'fecha' y 'turno'
        // y restarlo de la capacidad total de la actividad.
        DisponibilidadActividadDTO disponibilidad = reservaActividadService.consultarDisponibilidad(id, fechaParseada, turno);

        // 3. Respuesta al Frontend: Enviamos el DTO que contiene 'cuposDisponibles'.
        // Esto es lo que permite que el JS en el navegador bloquee o permita
        // subir el contador de participantes según el límite real.
        return ResponseEntity.ok(disponibilidad);
    }
}
