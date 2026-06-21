package cl.duoc.ms_calendario.repository;

import cl.duoc.ms_calendario.model.VinculoCalendario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VinculoCalendarioRepository extends JpaRepository<VinculoCalendario, Long> {

    Optional<VinculoCalendario> findByEntidadTipoAndEntidadId(String entidadTipo, Long entidadId);

    void deleteByEntidadTipoAndEntidadId(String entidadTipo, Long entidadId);
}
