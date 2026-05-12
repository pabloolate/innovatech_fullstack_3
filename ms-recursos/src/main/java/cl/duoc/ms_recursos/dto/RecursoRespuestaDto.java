package cl.duoc.ms_recursos.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RecursoRespuestaDto {
    private Long id;
    private Long idUsuario;
    private String nombres;
    private String apellidos;
    private String correo;
    private String perfil;
    private String especialidad;
    private Integer capacidadHorasSemanales;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
