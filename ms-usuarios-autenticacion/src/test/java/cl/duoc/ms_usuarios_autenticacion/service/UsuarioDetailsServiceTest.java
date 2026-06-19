package cl.duoc.ms_usuarios_autenticacion.service;

import cl.duoc.ms_usuarios_autenticacion.model.PerfilUsuario;
import cl.duoc.ms_usuarios_autenticacion.model.RolUsuario;
import cl.duoc.ms_usuarios_autenticacion.model.Usuario;
import cl.duoc.ms_usuarios_autenticacion.repository.UsuarioRepository;
import cl.duoc.ms_usuarios_autenticacion.security.UsuarioPrincipal;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioDetailsServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioDetailsService usuarioDetailsService;

    @Test
    void deberiaCargarUsuarioExistenteYLanzarExcepcionSiNoExiste() {
        Usuario usuario = Usuario.builder()
                .id(1L).nombres("Maria").apellidos("Torres")
                .correo("maria@mail.com").contrasenaHash("hash")
                .rol(RolUsuario.USER).perfil(PerfilUsuario.GESTOR).activo(true)
                .build();

        when(usuarioRepository.findByCorreo("maria@mail.com")).thenReturn(Optional.of(usuario));
        when(usuarioRepository.findByCorreo("noexiste@mail.com")).thenReturn(Optional.empty());

        UsuarioPrincipal principal = (UsuarioPrincipal) usuarioDetailsService.loadUserByUsername("maria@mail.com");
        assertEquals("maria@mail.com", principal.getCorreo());
        assertEquals("GESTOR", principal.getPerfil());

        assertThrows(UsernameNotFoundException.class,
                () -> usuarioDetailsService.loadUserByUsername("noexiste@mail.com"));
    }
}
