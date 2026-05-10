package cl.duoc.ms_proyectos.dto;

import cl.duoc.ms_proyectos.model.EstadoProyecto;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ProyectoRequestDto {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    private EstadoProyecto estado;

    @Min(value = 0, message = "El porcentaje de avance mínimo es 0")
    @Max(value = 100, message = "El porcentaje de avance máximo es 100")
    private Integer porcentajeAvance;

    private LocalDate fechaInicio;
    private LocalDate fechaFinEstimada;
    private LocalDate fechaFinReal;
    private Long idLiderProyecto;
    private Boolean activo;
}
