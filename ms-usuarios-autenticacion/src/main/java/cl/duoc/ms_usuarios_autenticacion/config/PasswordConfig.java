package cl.duoc.ms_usuarios_autenticacion.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {

    @Value("${app.security.pepper}")
    private String pepper;

    @Bean
    public PasswordEncoder passwordEncoder() {
        BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                String contrasenaConPepper = rawPassword.toString() + pepper;
                return bcrypt.encode(contrasenaConPepper);
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                String contrasenaConPepper = rawPassword.toString() + pepper;
                return bcrypt.matches(contrasenaConPepper, encodedPassword);
            }
        };
    }
}