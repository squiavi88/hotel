package com.luxury.hotel.servicies;

import com.luxury.hotel.model.Reserva;
import com.luxury.hotel.repositories.ReservaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservaService implements ServiceInterface<Reserva, Long> {

    private final ReservaRepository reservaRepository;

    public ReservaService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    @Override
    public Reserva save(Reserva reserva) {
        return reservaRepository.save(reserva);
    }

    @Override
    public List<Reserva> findAll() {
        return reservaRepository.findAll();
    }

    @Override
    public Reserva findById(Long id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrado"));
    }

    @Override
    public void deleteById(Long id) {
        reservaRepository.deleteById(id);
    }

    @Override
    public Reserva update(Long id, Reserva reserva) {
        Reserva modified = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrado"));
        modified.setUsuario(reserva.getUsuario());
        modified.setFechaRegistro(reserva.getFechaRegistro());
        modified.setPagoFinal(reserva.getPagoFinal());
        return reservaRepository.save(modified);
    }
}
