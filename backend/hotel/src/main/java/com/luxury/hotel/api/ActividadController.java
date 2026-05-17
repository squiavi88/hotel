package com.luxury.hotel.api;


import com.luxury.hotel.model.Actividad;
import com.luxury.hotel.model.Habitacion;
import com.luxury.hotel.servicies.ActividadService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<Actividad>> getAllActividades() { return ResponseEntity.ok(actividadService.findAll()); }

    @PostMapping("/actividad")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Actividad>> saveActividadess(@RequestBody List<Actividad> actividades) {

        List<Actividad> changedActividades = new ArrayList<>();

        for (Actividad actividad : actividades) {
            actividadService.save(actividad);
            changedActividades.add(actividad);
        }
        return ResponseEntity.ok(changedActividades);
    }

    @GetMapping("/actividad/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Actividad> getActividadById(@PathVariable Long id) {
        return ResponseEntity.ok(actividadService.findById(id));
    }

    @PutMapping("/actividad/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Actividad> uptadeActividad(@PathVariable Long id, @RequestBody Actividad actividad) {
        return ResponseEntity.ok(actividadService.update(id, actividad));
    }

    @DeleteMapping("/actividad/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteActividad(@PathVariable Long id) {
        actividadService.deleteById(id);
        return ResponseEntity.noContent().build();
    }


}
