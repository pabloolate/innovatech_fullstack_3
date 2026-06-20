package cl.duoc.ms_usuarios_autenticacion.service;

import cl.duoc.ms_usuarios_autenticacion.model.PerfilUsuario;
import cl.duoc.ms_usuarios_autenticacion.model.RolUsuario;
import cl.duoc.ms_usuarios_autenticacion.model.Usuario;
import cl.duoc.ms_usuarios_autenticacion.security.UsuarioPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "jwtSecret", "K9m@T2x#P8v$R4q!W7z^F1n&L5y*H3u_B6c%D9e");
        ReflectionTestUtils.setField(jwtService, "jwtExpirationMs", 86400000L);
        jwtService.inicializar();
    }

    @Test
    void deberiaGenerarTokenValidoYRechazarInvalido() {
        Usuario usuario = Usuario.builder()
                .id(1L).correo("admin@mail.com").contrasenaHash("hash")
                .rol(RolUsuario.ADMIN).perfil(PerfilUsuario.ADMINISTRADOR)
                .nombres("Admin").apellidos("Sistema").activo(true)
                .build();

        UsuarioPrincipal principal = new UsuarioPrincipal(usuario);
        String token = jwtService.generarToken(principal);

        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(jwtService.tokenValido(token));
        assertEquals("admin@mail.com", jwtService.extraerCorreo(token));
        assertFalse(jwtService.tokenValido("token.falso.invalido"));
    }
}
