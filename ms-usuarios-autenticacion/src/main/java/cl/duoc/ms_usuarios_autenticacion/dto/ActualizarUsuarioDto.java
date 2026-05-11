package cl.duoc.ms_usuarios_autenticacion.dto;

import cl.duoc.ms_usuarios_autenticacion.model.PerfilUsuario;
import cl.duoc.ms_usuarios_autenticacion.model.RolUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActualizarUsuarioDto {

    @NotBlank(message = "Los nombres son obligatorios")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    private String apellidos;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe tener formato válido")
    private String correo;

    @NotNull(message = "El rol es obligatorio")
    private RolUsuario rol;

    @NotNull(message = "El perfil es obligatorio")
    private PerfilUsuario perfil;

    @NotNull(message = "El estado activo es obligatorio")
    private Boolean activo;
}