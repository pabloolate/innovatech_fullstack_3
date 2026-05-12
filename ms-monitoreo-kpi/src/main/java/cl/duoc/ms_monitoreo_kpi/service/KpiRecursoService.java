package cl.duoc.ms_monitoreo_kpi.service;

import cl.duoc.ms_monitoreo_kpi.dto.KpiRecursoRequestDto;
import cl.duoc.ms_monitoreo_kpi.model.KpiRecurso;
import cl.duoc.ms_monitoreo_kpi.repository.KpiRecursoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KpiRecursoService {

    private final KpiRecursoRepository kpiRecursoRepository;

    public KpiRecursoService(KpiRecursoRepository kpiRecursoRepository) {
        this.kpiRecursoRepository = kpiRecursoRepository;
    }

    public List<KpiRecurso> listarTodos() {
        return kpiRecursoRepository.findAll();
    }

    public KpiRecurso buscarPorId(Long id) {
        return kpiRecursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("KpiRecurso no encontrado con id: " + id));
    }

    public KpiRecurso crear(KpiRecursoRequestDto dto) {
        KpiRecurso entidad = mapearDesdeDto(new KpiRecurso(), dto);
        return kpiRecursoRepository.save(entidad);
    }

    public KpiRecurso actualizar(Long id, KpiRecursoRequestDto dto) {
        KpiRecurso entidad = buscarPorId(id);
        entidad = mapearDesdeDto(entidad, dto);
        return kpiRecursoRepository.save(entidad);
    }

    public void eliminar(Long id) {
        if (!kpiRecursoRepository.existsById(id)) {
            throw new RuntimeException("KpiRecurso no encontrado con id: " + id);
        }
        kpiRecursoRepository.deleteById(id);
    }

    private KpiRecurso mapearDesdeDto(KpiRecurso entidad, KpiRecursoRequestDto dto) {

entidad.setIdRecurso(dto.getIdRecurso());
entidad.setPeriodo(dto.getPeriodo());
entidad.setHorasAsignadas(dto.getHorasAsignadas());
entidad.setHorasDisponibles(dto.getHorasDisponibles());
entidad.setPorcentajeOcupacion(dto.getPorcentajeOcupacion());
entidad.setCantidadProyectosAsignados(dto.getCantidadProyectosAsignados());
entidad.setFechaCalculo(dto.getFechaCalculo());

        return entidad;
    }
}
