package cl.duoc.ms_proyectos.repository;

import cl.duoc.ms_proyectos.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
}
