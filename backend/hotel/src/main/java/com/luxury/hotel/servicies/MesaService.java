package com.luxury.hotel.servicies;

import com.luxury.hotel.model.Mesa;
import com.luxury.hotel.repositories.MesaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MesaService implements ServiceInterface<Mesa, Long> {
    private final MesaRepository mesaRepository;

    public MesaService(MesaRepository mesaRepository) {
        this.mesaRepository = mesaRepository;
    }

    @Override
    public Mesa save(Mesa mesa) {
        return mesaRepository.save(mesa);
    }

    @Override
    public List<Mesa> findAll() {
        return mesaRepository.findAll();
    }

    @Override
    public Mesa findById(Long id) {
        return mesaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrado"));
    }

    @Override
    public void deleteById(Long id) {
        mesaRepository.deleteById(id);
    }

    @Override
    public Mesa update(Long id, Mesa mesa) {
        Mesa modified = mesaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrado"));
        modified.setNumeroMesa(mesa.getNumeroMesa());
        modified.setCapacidad(mesa.getCapacidad());
        modified.setPrecioBase(mesa.getPrecioBase());
        return mesaRepository.save(modified);
    }
}
