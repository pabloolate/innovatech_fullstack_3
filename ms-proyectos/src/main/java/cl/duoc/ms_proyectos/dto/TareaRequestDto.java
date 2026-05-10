package cl.duoc.ms_proyectos.dto;

import cl.duoc.ms_proyectos.model.EstadoTarea;
import cl.duoc.ms_proyectos.model.PrioridadTarea;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TareaRequestDto {

    @NotNull(message = "El id del proyecto es obligatorio")
    private Long idProyecto;

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    private EstadoTarea estado;
    private PrioridadTarea prioridad;

    @Min(value = 0, message = "El porcentaje de avance mínimo es 0")
    @Max(value = 100, message = "El porcentaje de avance máximo es 100")
    private Integer porcentajeAvance;

    private Long idResponsableUsuario;
    private LocalDate fechaInicio;
    private LocalDate fechaFinEstimada;
    private LocalDate fechaFinReal;
    private Boolean activo;
}
