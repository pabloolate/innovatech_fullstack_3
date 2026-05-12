package cl.duoc.ms_monitoreo_kpi.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
public class KpiProyectoRequestDto {
    @NotNull private Long idProyecto;
    @NotBlank private String periodo;
    @NotNull private BigDecimal porcentajeAvance;
    @NotNull private Integer cantidadTareas;
    @NotNull private Integer cantidadTareasCompletadas;
    @NotNull private Integer cantidadHitos;
    @NotNull private Integer cantidadHitosCumplidos;
    @NotNull private Integer cantidadIncidenciasAbiertas;
    @NotNull private LocalDateTime fechaCalculo;
}
