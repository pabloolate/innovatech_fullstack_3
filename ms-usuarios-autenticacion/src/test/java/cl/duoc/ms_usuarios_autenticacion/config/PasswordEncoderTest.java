package cl.duoc.ms_usuarios_autenticacion.service;

import cl.duoc.ms_usuarios_autenticacion.config.PasswordConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class PasswordEncoderTest {

    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        PasswordConfig config = new PasswordConfig();
        ReflectionTestUtils.setField(config, "pepper", "N7v$Q2m!L9x@P4r#T8k^W1z&F6y*H3u");
        passwordEncoder = config.passwordEncoder();
    }

    @Test
    void deberiaValidarContrasenaCorrectaYRechazarIncorrecta() {
        String password = "Segura123";
        String hash = passwordEncoder.encode(password);

        assertTrue(passwordEncoder.matches("Segura123", hash), "La contrasena correcta debe validar");
        assertFalse(passwordEncoder.matches("OtraPass", hash), "La contrasena incorrecta debe rechazar");
    }
}
