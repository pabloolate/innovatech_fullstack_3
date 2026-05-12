package cl.duoc.ms_monitoreo_kpi.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
public class KpiGeneralRequestDto {
    @NotBlank private String periodo;
    @NotNull private Integer cantidadProyectosActivos;
    @NotNull private Integer cantidadProyectosFinalizados;
    @NotNull private Integer cantidadRecursosActivos;
    @NotNull private BigDecimal promedioAvanceProyectos;
    @NotNull private BigDecimal promedioOcupacionRecursos;
    @NotNull private Integer cantidadIncidenciasAbiertas;
    @NotNull private LocalDateTime fechaCalculo;
}
