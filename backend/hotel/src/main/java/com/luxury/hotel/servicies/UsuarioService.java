package com.luxury.hotel.servicies;

import com.luxury.hotel.model.Usuario;
import com.luxury.hotel.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService implements ServiceInterface<Usuario, Long> {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    public void deleteById(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public Usuario update(Long id, Usuario usuario) {
        Usuario modified = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        modified.setNombre(usuario.getNombre());
        modified.setApellidos(usuario.getApellidos());
        modified.setContrasena(usuario.getContrasena());
        modified.setEmail(usuario.getEmail());
        modified.setFechaNacimiento(usuario.getFechaNacimiento());
        modified.setRol(usuario.getRol());
        modified.setReservaList(usuario.getReservaList());
        return usuarioRepository.save(modified);
    }
}
