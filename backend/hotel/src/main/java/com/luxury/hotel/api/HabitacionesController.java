package com.luxury.hotel.api;

import com.luxury.hotel.model.Habitacion;
import com.luxury.hotel.servicies.HabitacionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hotel")
public class HabitacionesController {

    private final HabitacionService habitacionService;

    public HabitacionesController(HabitacionService habitacionService) {
        this.habitacionService = habitacionService;
    }

    @GetMapping("/habitaciones")
// Quitamos el prefijo ROLE_ porque en tu BD no existe
    public List<Habitacion> getAllHabitaciones() {
        return habitacionService.findAll();
    }

    @PostMapping("/habitaciones")
    public List<Habitacion> saveHabitaciones(@RequestBody List<Habitacion> habitaciones) {
        return habitacionService.saveAll(habitaciones);
    }


}