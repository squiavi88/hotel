package com.luxury.hotel.servicies;

import com.luxury.hotel.model.ReservaHabitacion;
import com.luxury.hotel.repositories.ReservaHabitacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservaHabitacionService implements ServiceInterface<ReservaHabitacion, Long> {

    private final ReservaHabitacionRepository reservaHabitacionRepository;

    public ReservaHabitacionService(ReservaHabitacionRepository reservaHabitacionRepository) {
        this.reservaHabitacionRepository = reservaHabitacionRepository;
    }

    @Override
    public ReservaHabitacion save(ReservaHabitacion reservaHabitacion) {
        return reservaHabitacionRepository.save(reservaHabitacion);
    }

    @Override
    public List<ReservaHabitacion> findAll() {
        return reservaHabitacionRepository.findAll();
    }

    @Override
    public ReservaHabitacion findById(Long id) {
        return reservaHabitacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservaHabitacion no encontrado"));
    }

    @Override
    public void deleteById(Long id) {
        reservaHabitacionRepository.deleteById(id);
    }

    @Override
    public ReservaHabitacion update(Long id, ReservaHabitacion reservaHabitacion) {
        ReservaHabitacion modified = reservaHabitacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservaHabitacion no encontrado"));

        modified.setReserva(reservaHabitacion.getReserva());
        modified.setHabitacion(reservaHabitacion.getHabitacion());
        modified.setFechaEntrada(reservaHabitacion.getFechaEntrada());
        modified.setFechaSalida(reservaHabitacion.getFechaSalida());
        modified.setMonto(reservaHabitacion.getMonto());

        return reservaHabitacionRepository.save(modified);
    }

    // Método corregido: El nombre de la variable debe ser reservaHabitacionRepository
    public List<ReservaHabitacion> findByHabitacionId(Long habitacionId) {
        return reservaHabitacionRepository.findByHabitacionId(habitacionId);
    }
}