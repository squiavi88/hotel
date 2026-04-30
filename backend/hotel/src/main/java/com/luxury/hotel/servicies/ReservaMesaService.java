package com.luxury.hotel.servicies;

import com.luxury.hotel.model.ReservaMesa;
import com.luxury.hotel.repositories.ReservaMesaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservaMesaService implements ServiceInterface<ReservaMesa, Long> {
    private final ReservaMesaRepository reservaMesaRepository;

    public ReservaMesaService(ReservaMesaRepository reservaMesaRepository) {
        this.reservaMesaRepository = reservaMesaRepository;
    }

    @Override
    public ReservaMesa save(ReservaMesa reservaMesa) {
        return reservaMesaRepository.save(reservaMesa);
    }

    @Override
    public List<ReservaMesa> findAll() {
        return reservaMesaRepository.findAll();
    }

    @Override
    public ReservaMesa findById(Long id) {
        return reservaMesaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservaMesa no encontrado"));
    }

    @Override
    public void deleteById(Long id) {
        reservaMesaRepository.deleteById(id);
    }

    @Override
    public ReservaMesa update(Long id, ReservaMesa reservaMesa) {
        ReservaMesa modified = reservaMesaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservaMesa no encontrado"));
        modified.setReserva(reservaMesa.getReserva());
        modified.setMesa(reservaMesa.getMesa());
        modified.setFecha(reservaMesa.getFecha());
        modified.setMontoPago(reservaMesa.getMontoPago());
        return reservaMesaRepository.save(modified);
    }
}
