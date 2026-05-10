package cl.duoc.ms_proyectos.dto;

import cl.duoc.ms_proyectos.model.EstadoProyecto;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class ProyectoResponseDto {
    private Long id;
    private String nombre;
    private String descripcion;
    private EstadoProyecto estado;
    private Integer porcentajeAvance;
    private LocalDate fechaInicio;
    private LocalDate fechaFinEstimada;
    private LocalDate fechaFinReal;
    private Long idLiderProyecto;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
