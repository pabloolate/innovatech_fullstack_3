package cl.duoc.ms_recursos.security;

import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Getter
@Builder
public class UsuarioAutenticado implements UserDetails {
    private Long id;
    private String correo;
    private String rol;
    private String perfil;
    private Collection<? extends GrantedAuthority> authorities;

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return correo;
    }
}
