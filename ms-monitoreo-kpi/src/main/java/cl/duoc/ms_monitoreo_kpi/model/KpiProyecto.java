package cl.duoc.ms_monitoreo_kpi.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "kpi_proyecto", schema = "public")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KpiProyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_proyecto", nullable = false)
    private Long idProyecto;

    @Column(name = "periodo", nullable = false, length = 50)
    private String periodo;

    @Column(name = "porcentaje_avance", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentajeAvance;

    @Column(name = "cantidad_tareas", nullable = false)
    private Integer cantidadTareas;

    @Column(name = "cantidad_tareas_completadas", nullable = false)
    private Integer cantidadTareasCompletadas;

    @Column(name = "cantidad_hitos", nullable = false)
    private Integer cantidadHitos;

    @Column(name = "cantidad_hitos_cumplidos", nullable = false)
    private Integer cantidadHitosCumplidos;

    @Column(name = "cantidad_incidencias_abiertas", nullable = false)
    private Integer cantidadIncidenciasAbiertas;

    @Column(name = "fecha_calculo", nullable = false)
    private LocalDateTime fechaCalculo;
}
