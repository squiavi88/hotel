package com.luxury.hotel.servicies;

import com.luxury.hotel.model.Habitacion;
import com.luxury.hotel.repositories.HabitacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HabitacionService implements ServiceInterface<Habitacion, Long> {
    private final HabitacionRepository habitacionRepository;

    public HabitacionService(HabitacionRepository habitacionRepository) {
        this.habitacionRepository = habitacionRepository;
    }

    @Override
    public Habitacion save(Habitacion habitacion) {
        return habitacionRepository.save(habitacion);
    }

    @Override
    public List<Habitacion> findAll() {
        return habitacionRepository.findAll();
    }

    @Override
    public Habitacion findById(Long id) {
        return habitacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habitacion no encontrado"));
    }

    @Override
    public void deleteById(Long id) {
        habitacionRepository.deleteById(id);
    }

    @Override
    public Habitacion update(Long id, Habitacion habitacion) {
        Habitacion modified = habitacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habitacion no encontrado"));
        modified.setNombre(habitacion.getNombre());
        modified.setDescripcion(habitacion.getDescripcion());
        modified.setNumeroHabitacion(habitacion.getNumeroHabitacion());
        modified.setTipoHabitacion(habitacion.getTipoHabitacion());
        modified.setPrecioNoche(habitacion.getPrecioNoche());
        return habitacionRepository.save(modified);
    }
}
