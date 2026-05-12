package cl.duoc.ms_monitoreo_kpi.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
public class KpiRecursoRequestDto {
    @NotNull private Long idRecurso;
    @NotBlank private String periodo;
    @NotNull private BigDecimal horasAsignadas;
    @NotNull private BigDecimal horasDisponibles;
    @NotNull private BigDecimal porcentajeOcupacion;
    @NotNull private Integer cantidadProyectosAsignados;
    @NotNull private LocalDateTime fechaCalculo;
}
