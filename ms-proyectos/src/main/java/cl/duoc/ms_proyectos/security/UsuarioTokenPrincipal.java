package cl.duoc.ms_proyectos.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

@Getter
@AllArgsConstructor
public class UsuarioTokenPrincipal {
    private Long id;
    private String correo;
    private String rol;
    private String perfil;
    private Collection<? extends GrantedAuthority> authorities;

    public static UsuarioTokenPrincipal crear(Long id, String correo, String rol, String perfil) {
        return new UsuarioTokenPrincipal(
                id,
                correo,
                rol,
                perfil,
                List.of(new SimpleGrantedAuthority("ROLE_" + rol))
        );
    }
}
