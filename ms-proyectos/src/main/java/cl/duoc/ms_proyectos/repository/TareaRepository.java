package cl.duoc.ms_proyectos.repository;

import cl.duoc.ms_proyectos.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByIdProyecto(Long idProyecto);
}
