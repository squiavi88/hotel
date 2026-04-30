package com.luxury.hotel.api;


import com.luxury.hotel.model.Actividad;
import com.luxury.hotel.model.Habitacion;
import com.luxury.hotel.servicies.ActividadService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/hotel")
public class ActividadController {
    private final ActividadService actividadService;

    public ActividadController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }

    @GetMapping("/actividad")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public List<Actividad> getAllActividades() { return actividadService.findAll(); }

    @PostMapping("/actividad")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public List<Actividad> saveHabitaciones(@RequestBody List<Actividad> actividades) {

        List<Actividad> changedActividades = new ArrayList<>();

        for (Actividad actividad : actividades) {
            actividadService.save(actividad);
            changedActividades.add(actividad);
        }
        return changedActividades;
    }
}
