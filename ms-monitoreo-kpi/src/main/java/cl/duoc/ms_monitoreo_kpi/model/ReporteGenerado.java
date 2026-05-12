package cl.duoc.ms_monitoreo_kpi.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reportes_generados", schema = "public")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReporteGenerado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo_reporte", nullable = false, length = 100)
    private String tipoReporte;

    @Column(name = "periodo", nullable = false, length = 50)
    private String periodo;

    @Column(name = "generado_por_usuario", nullable = false)
    private Long generadoPorUsuario;

    @Column(name = "formato", nullable = false, length = 20)
    private String formato;

    @Column(name = "ruta_archivo", nullable = false, length = 255)
    private String rutaArchivo;

    @Column(name = "fecha_generacion", nullable = false)
    private LocalDateTime fechaGeneracion;
}
