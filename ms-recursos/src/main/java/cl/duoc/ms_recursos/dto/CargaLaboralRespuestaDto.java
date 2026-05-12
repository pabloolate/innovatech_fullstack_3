package cl.duoc.ms_recursos.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CargaLaboralRespuestaDto {
    private Long idRecurso;
    private String nombreRecurso;
    private Integer capacidadHorasSemanales;
    private Integer horasAsignadasActivas;
    private Integer porcentajeOcupacion;
    private Integer horasDisponibles;
}
