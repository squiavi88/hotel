package com.luxury.hotel.api;

import com.luxury.hotel.dto.ReservaMesaDTO;
import com.luxury.hotel.model.*;
import com.luxury.hotel.repositories.MesaRepository;
import com.luxury.hotel.repositories.ReservaRepository;
import com.luxury.hotel.servicies.ReservaMesaService;
import com.luxury.hotel.servicies.ReservaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/hotel")
public class ReservaMesaController {

    private final ReservaMesaService reservaMesaService;
    private final ReservaRepository reservaRepository;
    private final MesaRepository mesaRepository;
    private final ReservaService reservaService;

    public ReservaMesaController(ReservaMesaService reservaMesaService, ReservaRepository reservaRepository, MesaRepository mesaRepository, ReservaService reservaService) {
        this.reservaMesaService = reservaMesaService;
        this.reservaRepository = reservaRepository;
        this.mesaRepository = mesaRepository;
        this.reservaService = reservaService;
    }

    @GetMapping("/reservas-mesas")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public List<ReservaMesa> getAllReservaMesaas() { return reservaMesaService.findAll(); }

    @GetMapping("/reservas-mesas/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<ReservaMesa> getReservaMesaById(@PathVariable Long id) { return ResponseEntity.ok(reservaMesaService.findById(id)); }

    @PostMapping("/reservas-mesas")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createReservaMesa(@RequestBody ReservaMesaDTO dto) {
        try {
            Reserva reserva = reservaRepository.findById(dto.getReservaID())
                    .orElseThrow();

            Mesa mesa = mesaRepository.findById(dto.getMesaId().longValue())
                    .orElseThrow();

            // --- LÓGICA DE CÁLCULO ---
            // Usamos la cantidad de personas del DTO y el precio de la mesa
            BigDecimal precioTotal = mesa.getPrecioBase().multiply(new BigDecimal(dto.getCantidadPersonas()));

            ReservaMesa reservaMesa = new ReservaMesa();
            reservaMesa.setReserva(reserva);
            reservaMesa.setMesa(mesa);
            reservaMesa.setFecha(dto.getFecha());
            reservaMesa.setHora(dto.getHora());
            reservaMesa.setTurno(dto.getTurno());                       // NUEVO: Pasa el turno del DTO al Modelo
            reservaMesa.setCantidadPersonas(dto.getCantidadPersonas()); // NUEVO: Pasa las personas del DTO al Modelo
            reservaMesa.setMontoPago(precioTotal);                      // Usamos el total calculado automáticamente
            reservaMesaService.save(reservaMesa);

            reserva.setPagoFinal(reserva.getPagoFinal().add(precioTotal));
            reservaService.update(reserva.getId(), reserva);

            return ResponseEntity.ok(reservaMesa);
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/reservas-mesas/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ReservaMesa> updateReservaMesa(@PathVariable Long id, @RequestBody ReservaMesa reservaMesa) {
        return ResponseEntity.ok(reservaMesaService.update(id, reservaMesa));
    }

    @DeleteMapping("/reservas-mesas/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteReservaMesa(@PathVariable Long id) {
        reservaMesaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
