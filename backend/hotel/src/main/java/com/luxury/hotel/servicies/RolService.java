package com.luxury.hotel.servicies;

import com.luxury.hotel.model.Rol;
import com.luxury.hotel.repositories.RolRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService implements ServiceInterface<Rol, Long> {
    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    @Override
    public Rol save(Rol rol) {
        return rolRepository.save(rol);
    }

    @Override
    public List<Rol> findAll() {
        return rolRepository.findAll();
    }

    @Override
    public Rol findById(Long id) {
        return rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
    }

    @Override
    public void deleteById(Long id) {
        rolRepository.deleteById(id);
    }

    @Override
    public Rol update(Long id, Rol rol) {
        Rol modified = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        modified.setNombre(rol.getNombre());
        return rolRepository.save(modified);
    }
}
