package cl.duoc.ms_usuarios_autenticacion.dto;

import cl.duoc.ms_usuarios_autenticacion.model.PerfilUsuario;
import cl.duoc.ms_usuarios_autenticacion.model.RolUsuario;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UsuarioRespuestaDto {
    private Long id;
    private String nombres;
    private String apellidos;
    private String correo;
    private RolUsuario rol;
    private PerfilUsuario perfil;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}