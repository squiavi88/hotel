package com.luxury.hotel.api;


import com.luxury.hotel.model.Habitacion;
import com.luxury.hotel.servicies.HabitacionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/hotel")
public class HabitacionesController {

    private final HabitacionService habitacionService;

    public HabitacionesController(HabitacionService habitacionService) {
        this.habitacionService = habitacionService;
    }

    @GetMapping("/habitaciones")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public List<Habitacion> getAllHabitaciones() { return habitacionService.findAll(); }

    @PostMapping("/habitaciones")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public List<Habitacion> saveHabitaciones(@RequestBody List<Habitacion> habitaciones) {

        List<Habitacion> changedHabitaciones = new ArrayList<>();

        for (Habitacion habitacion : habitaciones) {
            habitacionService.save(habitacion);
            changedHabitaciones.add(habitacion);
        }
        return changedHabitaciones;
    }
}
