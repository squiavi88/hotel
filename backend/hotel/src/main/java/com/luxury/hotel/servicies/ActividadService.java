package com.luxury.hotel.servicies;

import com.luxury.hotel.model.Actividad;
import com.luxury.hotel.repositories.AcitvidadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActividadService implements ServiceInterface<Actividad, Long> {
    private final AcitvidadRepository acitvidadRepository;

    public ActividadService(AcitvidadRepository acitvidadRepository) {
        this.acitvidadRepository = acitvidadRepository;
    }

    @Override
    public Actividad save(Actividad actividad) {
        return acitvidadRepository.save(actividad);
    }

    @Override
    public List<Actividad> findAll() {
        return acitvidadRepository.findAll();
    }

    @Override
    public Actividad findById(Long id) {
        return acitvidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrado"));
    }

    @Override
    public void deleteById(Long id) {
        acitvidadRepository.deleteById(id);
    }

    @Override
    public Actividad update(Long id, Actividad actividad) {
        Actividad modified = acitvidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrado"));

        modified.setNombre(actividad.getNombre());
        modified.setPrecioBase(actividad.getPrecioBase());


        return acitvidadRepository.save(modified);
    }
}
