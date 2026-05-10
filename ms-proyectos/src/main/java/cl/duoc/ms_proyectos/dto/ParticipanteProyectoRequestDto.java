package cl.duoc.ms_proyectos.dto;

import cl.duoc.ms_proyectos.model.RolProyecto;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ParticipanteProyectoRequestDto {

    @NotNull(message = "El id del proyecto es obligatorio")
    private Long idProyecto;

    @NotNull(message = "El id del usuario es obligatorio")
    private Long idUsuario;

    private RolProyecto rolEnProyecto;
    private Boolean activo;
}
