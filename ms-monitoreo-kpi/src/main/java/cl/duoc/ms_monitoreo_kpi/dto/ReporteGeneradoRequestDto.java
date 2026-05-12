package cl.duoc.ms_monitoreo_kpi.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class ReporteGeneradoRequestDto {
    @NotBlank private String tipoReporte;
    @NotBlank private String periodo;
    @NotNull private Long generadoPorUsuario;
    @NotBlank private String formato;
    @NotBlank private String rutaArchivo;
    @NotNull private LocalDateTime fechaGeneracion;
}
