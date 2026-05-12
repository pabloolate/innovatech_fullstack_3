package cl.duoc.ms_recursos.repository;

import cl.duoc.ms_recursos.model.DisponibilidadRecurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DisponibilidadRecursoRepository extends JpaRepository<DisponibilidadRecurso, Long> {

    @Query("select d from DisponibilidadRecurso d join fetch d.recurso order by d.id")
    List<DisponibilidadRecurso> findAllWithRecurso();

    @Query("select d from DisponibilidadRecurso d join fetch d.recurso where d.recurso.id = :idRecurso order by d.id")
    List<DisponibilidadRecurso> findByRecursoIdWithRecurso(@Param("idRecurso") Long idRecurso);

    List<DisponibilidadRecurso> findByRecursoId(Long idRecurso);
}
