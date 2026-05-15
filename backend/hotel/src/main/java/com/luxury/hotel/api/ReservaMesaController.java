package com.luxury.hotel.api;

import com.luxury.hotel.dto.ReservaMesaDTO;
import com.luxury.hotel.dto.ReservaMesaOcupadaDTO;
import com.luxury.hotel.model.ReservaMesa;
import com.luxury.hotel.servicies.ReservaMesaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hotel")
public class ReservaMesaController {

    // El controlador AHORA solo depende del Service
    private final ReservaMesaService reservaMesaService;

    public ReservaMesaController(ReservaMesaService reservaMesaService) {
        this.reservaMesaService = reservaMesaService;
    }

    @GetMapping("/reservas-mesas")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public List<ReservaMesa> getAllReservaMesaas() {
        return reservaMesaService.findAll();
    }

    @PostMapping("/reservas-mesas")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<?> createReservaMesa(@RequestBody ReservaMesaDTO dto) {
        try {
            // El controlador solo recibe el DTO y se lo pasa al Service
            // Toda la lógica de cálculo y actualización de pago se hace allá
            ReservaMesa resultado = reservaMesaService.guardarReservaCompleta(dto);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/reservas-mesas/ocupadas/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<List<ReservaMesaOcupadaDTO>> getOcupacionMesa(@PathVariable Long id) {
        // Ya no hay bucles "for" aquí. El Service devuelve la lista ya filtrada
        List<ReservaMesaOcupadaDTO> ocupadas = reservaMesaService.buscarOcupacionPorMesa(id);
        return ResponseEntity.ok(ocupadas);
    }

    @DeleteMapping("/reservas-mesas/ocupadas/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteReservaMesa(@PathVariable Long id) {
        reservaMesaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}