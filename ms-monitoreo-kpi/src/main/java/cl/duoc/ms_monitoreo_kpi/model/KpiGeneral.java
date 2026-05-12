package cl.duoc.ms_monitoreo_kpi.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "kpi_general", schema = "public")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KpiGeneral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "periodo", nullable = false, length = 50)
    private String periodo;

    @Column(name = "cantidad_proyectos_activos", nullable = false)
    private Integer cantidadProyectosActivos;

    @Column(name = "cantidad_proyectos_finalizados", nullable = false)
    private Integer cantidadProyectosFinalizados;

    @Column(name = "cantidad_recursos_activos", nullable = false)
    private Integer cantidadRecursosActivos;

    @Column(name = "promedio_avance_proyectos", nullable = false, precision = 5, scale = 2)
    private BigDecimal promedioAvanceProyectos;

    @Column(name = "promedio_ocupacion_recursos", nullable = false, precision = 5, scale = 2)
    private BigDecimal promedioOcupacionRecursos;

    @Column(name = "cantidad_incidencias_abiertas", nullable = false)
    private Integer cantidadIncidenciasAbiertas;

    @Column(name = "fecha_calculo", nullable = false)
    private LocalDateTime fechaCalculo;
}
