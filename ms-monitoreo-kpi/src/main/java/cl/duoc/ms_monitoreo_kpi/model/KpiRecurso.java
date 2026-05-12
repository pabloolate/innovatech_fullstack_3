package cl.duoc.ms_monitoreo_kpi.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "kpi_recurso", schema = "public")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KpiRecurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_recurso", nullable = false)
    private Long idRecurso;

    @Column(name = "periodo", nullable = false, length = 50)
    private String periodo;

    @Column(name = "horas_asignadas", nullable = false, precision = 10, scale = 2)
    private BigDecimal horasAsignadas;

    @Column(name = "horas_disponibles", nullable = false, precision = 10, scale = 2)
    private BigDecimal horasDisponibles;

    @Column(name = "porcentaje_ocupacion", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentajeOcupacion;

    @Column(name = "cantidad_proyectos_asignados", nullable = false)
    private Integer cantidadProyectosAsignados;

    @Column(name = "fecha_calculo", nullable = false)
    private LocalDateTime fechaCalculo;
}
