package com.luxury.hotel.api;

import com.luxury.hotel.model.Rol;
import com.luxury.hotel.model.Usuario;
import com.luxury.hotel.repositories.RolRepository;
import com.luxury.hotel.repositories.UsuarioRepository;
import com.luxury.hotel.servicies.RolService;
import com.luxury.hotel.servicies.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/hotel")
public class LoginController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final RolService rolService;
    private final UsuarioService usuarioService;

    public LoginController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, RolRepository rolRepository, RolService rolService, UsuarioService usuarioService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.rolService = rolService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        usuario.setRol(rolService.findById(1L));
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuario registrado correctamente");
    }

    // -----------------------------
    // LOGIN (SESSION BASED) storing full user object
    // -----------------------------
    @PostMapping("/login")
    public ResponseEntity<Usuario> login(
            @RequestBody Map<String, String> req,
            HttpServletRequest request
    ) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.get("email"),
                        req.get("password")
                )
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        HttpSession session = request.getSession(true);
        session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext()
        );


        return ResponseEntity.ok(usuarioRepository.findByEmail(req.get("email")));
    }

    // -----------------------------
    // LOGOUT
    // -----------------------------
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) {

        new SecurityContextLogoutHandler()
                .logout(request, response, authentication);

        return ResponseEntity.ok("Sesión cerrada correctamente");
    }

    // -----------------------------
    // Reset Password
    // -----------------------------
    @PutMapping("/recuperar-cuenta")
    public ResponseEntity<?> recuperarCuenta(@RequestBody Map<String, String> req) {
        Usuario modified = usuarioRepository.findByEmail(req.get("email"));
        modified.setContrasena(passwordEncoder.encode(req.get("nueva")));
        usuarioService.update(usuarioRepository.findByEmail(req.get("email")).getId(), modified);
        return ResponseEntity.ok("Cuenta recuperada");
    }
}
