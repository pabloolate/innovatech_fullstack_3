package cl.duoc.ms_usuarios_autenticacion.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponseDto {
    private String token;
    private Long id;
    private String correo;
    private String nombres;
    private String apellidos;
    private String rol;
    private String perfil;
}