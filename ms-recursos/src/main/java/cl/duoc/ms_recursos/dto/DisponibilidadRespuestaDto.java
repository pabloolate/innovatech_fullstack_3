package cl.duoc.ms_recursos.dto;

import cl.duoc.ms_recursos.model.EstadoDisponibilidad;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class DisponibilidadRespuestaDto {
    private Long id;
    private Long idRecurso;
    private String nombreRecurso;
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
    private EstadoDisponibilidad estadoDisponibilidad;
    private String motivo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
