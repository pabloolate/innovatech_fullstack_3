package cl.duoc.ms_calendario.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vinculos_calendario", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VinculoCalendario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entidad_tipo", nullable = false, length = 20)
    private String entidadTipo;

    @Column(name = "entidad_id", nullable = false)
    private Long entidadId;

    @Column(name = "id_evento_google", nullable = false, length = 500)
    private String idEventoGoogle;

    @Column(name = "calendar_id", nullable = false, length = 200)
    private String calendarId;

    @Column(name = "ultima_sincronizacion", nullable = false)
    private LocalDateTime ultimaSincronizacion;

    @PrePersist
    public void prePersist() {
        this.ultimaSincronizacion = LocalDateTime.now();
    }
}
