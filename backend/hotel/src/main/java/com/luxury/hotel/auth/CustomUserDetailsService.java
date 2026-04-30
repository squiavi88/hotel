package com.luxury.hotel.auth;

import com.luxury.hotel.model.Usuario;
import com.luxury.hotel.repositories.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository repo;

    public CustomUserDetailsService(UsuarioRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {

        Usuario u = repo.findByEmail(email);

        return new org.springframework.security.core.userdetails.User(
                u.getEmail(),
                u.getContrasena(),
                List.of(new SimpleGrantedAuthority(u.getRol().getNombre()))
        );
    }
}
