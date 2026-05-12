package cl.duoc.ms_recursos.dto;

import cl.duoc.ms_recursos.model.EstadoAsignacion;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class AsignacionRespuestaDto {
    private Long id;
    private Long idRecurso;
    private String nombreRecurso;
    private Long idProyecto;
    private Long idTarea;
    private Integer porcentajeAsignacion;
    private Integer horasAsignadasSemanales;
    private LocalDate fechaInicio;
    private LocalDate fechaFinEstimada;
    private LocalDate fechaFinReal;
    private EstadoAsignacion estado;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
