package com.luxury.hotel.api;


import com.luxury.hotel.model.Evento;
import com.luxury.hotel.servicies.EventoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/hotel")
public class EventoController {
    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @GetMapping("/evento")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public List<Evento> getAllEventos() { return eventoService.findAll(); }

    @PostMapping("/evento")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<Evento> saveEventos(@RequestBody List<Evento> eventos) {

        List<Evento> changedEventos = new ArrayList<>();

        for (Evento actividad : eventos) {
            eventoService.save(actividad);
            changedEventos.add(actividad);
        }
        return changedEventos;
    }

    @GetMapping("/evento/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Evento> getEventoById(@PathVariable Long id) {
        return ResponseEntity.ok(eventoService.findById(id));
    }

    @PutMapping("/evento/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Evento> uptadeEvento(@PathVariable Long id, @RequestBody Evento evento) {
        return ResponseEntity.ok(eventoService.update(id, evento));
    }

    @DeleteMapping("/evento/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        eventoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
