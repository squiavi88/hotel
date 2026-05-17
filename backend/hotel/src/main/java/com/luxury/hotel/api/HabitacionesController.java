package com.luxury.hotel.api;


import com.luxury.hotel.model.Actividad;
import com.luxury.hotel.model.Habitacion;
import com.luxury.hotel.servicies.HabitacionService;
import org.springframework.http.ResponseEntity;
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
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<Habitacion> saveHabitaciones(@RequestBody List<Habitacion> habitaciones) {

        List<Habitacion> changedHabitaciones = new ArrayList<>();

        for (Habitacion habitacion : habitaciones) {
            habitacionService.save(habitacion);
            changedHabitaciones.add(habitacion);
        }
        return changedHabitaciones;
    }

    @GetMapping("/habitaciones/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Habitacion> getHabitacionById(@PathVariable Long id) {
        return ResponseEntity.ok(habitacionService.findById(id));
    }

    @PutMapping("/habitaciones/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Habitacion> uptadeHabitacion(@PathVariable Long id, @RequestBody Habitacion habitacion) {
        return ResponseEntity.ok(habitacionService.update(id, habitacion));
    }

    @DeleteMapping("/habitaciones/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteHabitacion(@PathVariable Long id) {
        habitacionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
