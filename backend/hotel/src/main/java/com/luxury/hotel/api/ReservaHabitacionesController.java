package com.luxury.hotel.api;

import com.luxury.hotel.dto.FechasOcupadasDTO;
import com.luxury.hotel.dto.ReservaHabitacionDTO;
import com.luxury.hotel.model.Habitacion;
import com.luxury.hotel.model.Reserva;
import com.luxury.hotel.model.ReservaHabitacion;
import com.luxury.hotel.model.Usuario;
import com.luxury.hotel.repositories.HabitacionRepository;
import com.luxury.hotel.repositories.ReservaRepository;
import com.luxury.hotel.repositories.UsuarioRepository;
import com.luxury.hotel.servicies.ReservaHabitacionService;
import com.luxury.hotel.servicies.ReservaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/hotel")
public class ReservaHabitacionesController {

    private final ReservaHabitacionService reservaHabitacionService;
    private final ReservaRepository reservaRepository;
    private final HabitacionRepository habitacionRepository;
    private final ReservaService reservaService;

    public ReservaHabitacionesController(ReservaHabitacionService reservaHabitacionService, ReservaRepository reservaRepository, HabitacionRepository habitacionRepository, ReservaService reservaService) {
        this.reservaHabitacionService = reservaHabitacionService;
        this.reservaRepository = reservaRepository;
        this.habitacionRepository = habitacionRepository;
        this.reservaService = reservaService;
    }

    @GetMapping("/reservas-habitaciones")
    public List<ReservaHabitacion> getAllReservaHabitaciones() { return reservaHabitacionService.findAll(); }

    @GetMapping("/reservas-habitaciones/{id}")
    public ResponseEntity<ReservaHabitacion> getReservaHabitacionById(@PathVariable Long id) { return ResponseEntity.ok(reservaHabitacionService.findById(id)); }

    @PostMapping("/reservas-habitaciones")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createReservaHabitacion(@RequestBody ReservaHabitacionDTO dto) {

        try {
            Reserva reserva = reservaRepository.findById(dto.getReservaId())
                    .orElseThrow();

            Habitacion habitacion = habitacionRepository.findById(dto.getHabitacionId())
                    .orElseThrow();

            long dias = ChronoUnit.DAYS.between(dto.getFechaEntrada(), dto.getFechaSalida());

            if (dias <= 0) {
                return ResponseEntity
                        .badRequest()
                        .body("Fecha salida tiene que ser despues de Fecha entrada.");
            }

            BigDecimal precioTotal = habitacion.getPrecioNoche().multiply(BigDecimal.valueOf(dias));

            ReservaHabitacion reservaHabitacion = new ReservaHabitacion();
            reservaHabitacion.setReserva(reserva);
            reservaHabitacion.setHabitacion(habitacion);
            reservaHabitacion.setFechaEntrada(dto.getFechaEntrada());
            reservaHabitacion.setFechaSalida(dto.getFechaSalida());
            reservaHabitacion.setMonto(habitacion.getPrecioNoche());

            reservaHabitacionService.save(reservaHabitacion);

            reserva.setPagoFinal(reserva.getPagoFinal().add(precioTotal));
            reservaService.update(reserva.getId(), reserva);

            return ResponseEntity.ok(reservaHabitacion);
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/reservas-habitaciones/{id}")
    public ResponseEntity<ReservaHabitacion> updateReservaHabitacion(@PathVariable Long id, @RequestBody ReservaHabitacion reservaHabitacion) {
        return ResponseEntity.ok(reservaHabitacionService.update(id, reservaHabitacion));
    }

    @DeleteMapping("/reservas-habitaciones/{id}")
    public ResponseEntity<Void> deleteReservaHabitacion(@PathVariable Long id) {
        reservaHabitacionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // En ReservaHabitacionesController.java

    @GetMapping("/reservas-habitaciones/ocupadas/{habitacionId}")
    public ResponseEntity<List<FechasOcupadasDTO>> getFechasOcupadas(@PathVariable Long habitacionId) {
        List<ReservaHabitacion> reservas = reservaHabitacionService.findByHabitacionId(habitacionId);

        // Mapeamos a un DTO simple para enviar solo lo que el frontend necesita
        List<FechasOcupadasDTO> fechas = reservas.stream()
                .map(r -> new FechasOcupadasDTO(r.getFechaEntrada(), r.getFechaSalida()))
                .toList();

        return ResponseEntity.ok(fechas);
    }

}
