package cl.duoc.ms_proyectos.dto;

import cl.duoc.ms_proyectos.model.RolProyecto;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ParticipanteProyectoResponseDto {
    private Long id;
    private Long idProyecto;
    private Long idUsuario;
    private RolProyecto rolEnProyecto;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
}
