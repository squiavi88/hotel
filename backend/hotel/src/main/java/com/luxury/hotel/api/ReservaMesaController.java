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
    public List<ReservaMesa> getAllReservaMesaas() { return reservaMesaService.findAll(); }

    @GetMapping("/reservas-mesas/{id}")
    public ResponseEntity<ReservaMesa> getReservaMesaById(@PathVariable Long id) { return ResponseEntity.ok(reservaMesaService.findById(id)); }

    @PostMapping("/reservas-mesas")
    public ResponseEntity<?> createReservaMesa(@RequestBody ReservaMesaDTO dto) {
        try {
            Reserva reserva = reservaRepository.findById(dto.getReservaId())
                    .orElseThrow();

            Mesa mesa = mesaRepository.findById(dto.getMesaId())
                    .orElseThrow();

            BigDecimal precioTotal = dto.getMontoPago();

            ReservaMesa reservaMesa = new ReservaMesa();
            reservaMesa.setReserva(reserva);
            reservaMesa.setMesa(mesa);
            reservaMesa.setFecha(dto.getFecha());
            reservaMesa.setHora(dto.getHora());
            reservaMesa.setMontoPago(dto.getMontoPago());

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
    public ResponseEntity<ReservaMesa> updateReservaMesa(@PathVariable Long id, @RequestBody ReservaMesa reservaMesa) {
        return ResponseEntity.ok(reservaMesaService.update(id, reservaMesa));
    }

    @DeleteMapping("/reservas-mesas/{id}")
    public ResponseEntity<Void> deleteReservaMesa(@PathVariable Long id) {
        reservaMesaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
