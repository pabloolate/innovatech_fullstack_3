package cl.duoc.ms_recursos.dto;

import cl.duoc.ms_recursos.model.EstadoAsignacion;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ActualizarAsignacionDto {

    @NotNull(message = "El proyecto es obligatorio")
    private Long idProyecto;

    private Long idTarea;

    @NotNull(message = "El porcentaje de asignación es obligatorio")
    @Min(value = 1, message = "El porcentaje debe ser mayor a 0")
    @Max(value = 100, message = "El porcentaje no puede superar 100")
    private Integer porcentajeAsignacion;

    @NotNull(message = "Las horas semanales son obligatorias")
    @Min(value = 1, message = "Las horas asignadas deben ser mayor a 0")
    @Max(value = 80, message = "Las horas asignadas no pueden superar 80")
    private Integer horasAsignadasSemanales;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate fechaInicio;

    private LocalDate fechaFinEstimada;

    private LocalDate fechaFinReal;

    @NotNull(message = "El estado es obligatorio")
    private EstadoAsignacion estado;

    @NotNull(message = "El estado activo es obligatorio")
    private Boolean activo;
}
