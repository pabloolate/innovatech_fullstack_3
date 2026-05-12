package cl.duoc.ms_recursos.dto;

import cl.duoc.ms_recursos.model.EstadoDisponibilidad;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CrearDisponibilidadDto {

    @NotNull(message = "El recurso es obligatorio")
    private Long idRecurso;

    @NotNull(message = "La fecha desde es obligatoria")
    private LocalDate fechaDesde;

    @NotNull(message = "La fecha hasta es obligatoria")
    private LocalDate fechaHasta;

    @NotNull(message = "El estado de disponibilidad es obligatorio")
    private EstadoDisponibilidad estadoDisponibilidad;

    @NotBlank(message = "El motivo es obligatorio")
    private String motivo;
}
