package com.luxury.hotel.servicies;

import com.luxury.hotel.model.ReservaActividad;
import com.luxury.hotel.repositories.ReservaActividadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservaActividadService implements ServiceInterface<ReservaActividad, Long>{
    private final ReservaActividadRepository reservaActividadRepository;

    public ReservaActividadService(ReservaActividadRepository reservaActividadRepository) {
        this.reservaActividadRepository = reservaActividadRepository;
    }

    @Override
    public ReservaActividad save(ReservaActividad reservaActividad) {
        return reservaActividadRepository.save(reservaActividad);
    }

    @Override
    public List<ReservaActividad> findAll() {
        return reservaActividadRepository.findAll();
    }

    @Override
    public ReservaActividad findById(Long id) {
        return reservaActividadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservaActividad no encontrado"));
    }

    @Override
    public void deleteById(Long id) {
        reservaActividadRepository.deleteById(id);
    }

    @Override
    public ReservaActividad update(Long id, ReservaActividad reservaActividad) {
        ReservaActividad modified = reservaActividadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservaActividad no encontrado"));

        modified.setReserva(reservaActividad.getReserva());
        modified.setActividad(reservaActividad.getActividad());
        modified.setTurno(reservaActividad.getTurno());
        modified.setFecha(reservaActividad.getFecha());
        modified.setParticipantes(reservaActividad.getParticipantes());
        modified.setMonto(reservaActividad.getMonto());

        return reservaActividadRepository.save(modified);
    }
}
