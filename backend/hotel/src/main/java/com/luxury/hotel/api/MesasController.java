package com.luxury.hotel.api;

import com.luxury.hotel.model.Actividad;
import com.luxury.hotel.model.Mesa;
import com.luxury.hotel.servicies.MesaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/hotel")
public class MesasController {
    private final MesaService mesaService;

    public MesasController(MesaService mesaService) {
        this.mesaService = mesaService;
    }

    @GetMapping("/mesas")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<List<Mesa>> getAllMesas() {
        return ResponseEntity.ok(mesaService.findAll());
    }

    @PostMapping("/mesas")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Mesa>> saveMesas(@RequestBody List<Mesa> mesas) {

        List<Mesa> changedMesas = new ArrayList<>();

        for (Mesa mesa : mesas) {
            mesaService.save(mesa);
            changedMesas.add(mesa);
        }
        return ResponseEntity.ok(changedMesas);
    }

    @GetMapping("/mesas/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Mesa> getMesaById(@PathVariable Long id) {
        return ResponseEntity.ok(mesaService.findById(id));
    }

    @PutMapping("/mesas/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Mesa> uptadeMesa(@PathVariable Long id, @RequestBody Mesa mesa) {
        return ResponseEntity.ok(mesaService.update(id, mesa));
    }

    @DeleteMapping("/mesas/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteMesa(@PathVariable Long id) {
        mesaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
