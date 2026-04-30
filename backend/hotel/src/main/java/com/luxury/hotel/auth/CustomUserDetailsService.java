package com.luxury.hotel.auth;

import com.luxury.hotel.model.Usuario;
import com.luxury.hotel.repositories.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository repo;

    public CustomUserDetailsService(UsuarioRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario u = repo.findByEmail(email);

        if (u == null) {
            throw new UsernameNotFoundException("Usuario no encontrado: " + email);
        }

        // Como en la BD ya dice "ROLE_ADMIN", lo usamos directamente
        String nombreAutoridad = u.getRol().getNombre();

        return new org.springframework.security.core.userdetails.User(
                u.getEmail(),
                u.getContrasena(),
                List.of(new SimpleGrantedAuthority(nombreAutoridad))
        );
    }
}