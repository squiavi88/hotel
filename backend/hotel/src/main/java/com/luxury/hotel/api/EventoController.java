package com.luxury.hotel.api;


import com.luxury.hotel.model.Actividad;
import com.luxury.hotel.model.Evento;
import com.luxury.hotel.servicies.EventoService;
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
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public List<Evento> saveEventos(@RequestBody List<Evento> eventos) {

        List<Evento> changedEventos = new ArrayList<>();

        for (Evento actividad : eventos) {
            eventoService.save(actividad);
            changedEventos.add(actividad);
        }
        return changedEventos;
    }
}
