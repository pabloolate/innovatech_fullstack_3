package cl.duoc.ms_recursos.repository;

import cl.duoc.ms_recursos.model.AsignacionRecurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AsignacionRecursoRepository extends JpaRepository<AsignacionRecurso, Long> {

    @Query("select a from AsignacionRecurso a join fetch a.recurso order by a.id")
    List<AsignacionRecurso> findAllWithRecurso();

    @Query("select a from AsignacionRecurso a join fetch a.recurso where a.recurso.id = :idRecurso order by a.id")
    List<AsignacionRecurso> findByRecursoIdWithRecurso(@Param("idRecurso") Long idRecurso);

    List<AsignacionRecurso> findByRecursoId(Long idRecurso);
    List<AsignacionRecurso> findByIdProyecto(Long idProyecto);

    @Query("select coalesce(sum(a.horasAsignadasSemanales), 0) from AsignacionRecurso a where a.recurso.id = :idRecurso and a.activo = true and a.estado = cl.duoc.ms_recursos.model.EstadoAsignacion.ACTIVA")
    Integer sumarHorasActivasPorRecurso(@Param("idRecurso") Long idRecurso);
}
