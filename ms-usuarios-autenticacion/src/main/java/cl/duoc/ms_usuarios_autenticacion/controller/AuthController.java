package cl.duoc.ms_usuarios_autenticacion.controller;

import cl.duoc.ms_usuarios_autenticacion.dto.LoginRequestDto;
import cl.duoc.ms_usuarios_autenticacion.dto.LoginResponseDto;
import cl.duoc.ms_usuarios_autenticacion.security.UsuarioPrincipal;
import cl.duoc.ms_usuarios_autenticacion.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getCorreo(),
                        request.getContrasena()
                )
        );

        UsuarioPrincipal usuarioPrincipal = (UsuarioPrincipal) authentication.getPrincipal();
        String token = jwtService.generarToken(usuarioPrincipal);

        LoginResponseDto response = LoginResponseDto.builder()
                .token(token)
                .id(usuarioPrincipal.getId())
                .correo(usuarioPrincipal.getCorreo())
                .nombres(usuarioPrincipal.getNombres())
                .apellidos(usuarioPrincipal.getApellidos())
                .rol(usuarioPrincipal.getRol())
                .perfil(usuarioPrincipal.getPerfil())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponseDto> me(Authentication authentication) {
        UsuarioPrincipal usuarioPrincipal = (UsuarioPrincipal) authentication.getPrincipal();

        LoginResponseDto response = LoginResponseDto.builder()
                .token(null)
                .id(usuarioPrincipal.getId())
                .correo(usuarioPrincipal.getCorreo())
                .nombres(usuarioPrincipal.getNombres())
                .apellidos(usuarioPrincipal.getApellidos())
                .rol(usuarioPrincipal.getRol())
                .perfil(usuarioPrincipal.getPerfil())
                .build();

        return ResponseEntity.ok(response);
    }
}