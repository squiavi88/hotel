package com.luxury.hotel.servicies;

import com.luxury.hotel.model.ReservaEvento;
import com.luxury.hotel.repositories.ReservaEventoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservaEventoService implements ServiceInterface<ReservaEvento, Long> {
    private final ReservaEventoRepository reservaEventoRepository;

    public ReservaEventoService(ReservaEventoRepository reservaEventoRepository) {
        this.reservaEventoRepository = reservaEventoRepository;
    }

    @Override
    public ReservaEvento save(ReservaEvento reservaEvento) {
        return reservaEventoRepository.save(reservaEvento);
    }

    @Override
    public List<ReservaEvento> findAll() {
        return reservaEventoRepository.findAll();
    }

    @Override
    public ReservaEvento findById(Long id) {
        return reservaEventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservaEvento no encontrado"));
    }

    @Override
    public void deleteById(Long id) {
        reservaEventoRepository.deleteById(id);
    }

    @Override
    public ReservaEvento update(Long id, ReservaEvento reservaEvento) {
        ReservaEvento modified = reservaEventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservaEvento no encontrado"));

        modified.setReserva(reservaEvento.getReserva());
        modified.setEvento(reservaEvento.getEvento());
        modified.setFecha(reservaEvento.getFecha());
        modified.setParticipantes(reservaEvento.getParticipantes());
        modified.setSala(reservaEvento.getSala());
        modified.setCatering(reservaEvento.getCatering());
        modified.setMonto(reservaEvento.getMonto());


        return reservaEventoRepository.save(modified);
    }
}
