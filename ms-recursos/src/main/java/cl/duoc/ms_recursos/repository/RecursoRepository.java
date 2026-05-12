package cl.duoc.ms_recursos.repository;

import cl.duoc.ms_recursos.model.Recurso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecursoRepository extends JpaRepository<Recurso, Long> {
    Optional<Recurso> findByIdUsuario(Long idUsuario);
    boolean existsByIdUsuario(Long idUsuario);
    boolean existsByCorreo(String correo);
}
