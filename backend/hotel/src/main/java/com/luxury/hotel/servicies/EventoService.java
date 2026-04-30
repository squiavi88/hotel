package com.luxury.hotel.servicies;

import com.luxury.hotel.model.Evento;
import com.luxury.hotel.repositories.EventoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventoService implements ServiceInterface<Evento, Long> {
    private final EventoRepository eventoRepository;

    public EventoService(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    @Override
    public Evento save(Evento evento) {
        return eventoRepository.save(evento);
    }

    @Override
    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    @Override
    public Evento findById(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
    }

    @Override
    public void deleteById(Long id) {
        eventoRepository.deleteById(id);
    }

    @Override
    public Evento update(Long id, Evento evento) {
        Evento modified = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        modified.setNombre(evento.getNombre());
        modified.setPrecioBase(evento.getPrecioBase());

        return eventoRepository.save(modified);
    }
}
