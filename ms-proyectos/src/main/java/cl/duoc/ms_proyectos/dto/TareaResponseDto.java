package cl.duoc.ms_proyectos.dto;

import cl.duoc.ms_proyectos.model.EstadoTarea;
import cl.duoc.ms_proyectos.model.PrioridadTarea;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class TareaResponseDto {
    private Long id;
    private Long idProyecto;
    private String titulo;
    private String descripcion;
    private EstadoTarea estado;
    private PrioridadTarea prioridad;
    private Integer porcentajeAvance;
    private Long idResponsableUsuario;
    private LocalDate fechaInicio;
    private LocalDate fechaFinEstimada;
    private LocalDate fechaFinReal;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
