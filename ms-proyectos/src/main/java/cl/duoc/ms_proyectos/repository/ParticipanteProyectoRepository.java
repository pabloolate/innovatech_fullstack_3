package cl.duoc.ms_proyectos.repository;

import cl.duoc.ms_proyectos.model.ParticipanteProyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipanteProyectoRepository extends JpaRepository<ParticipanteProyecto, Long> {
    List<ParticipanteProyecto> findByIdProyecto(Long idProyecto);
}
