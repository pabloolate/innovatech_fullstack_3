package cl.duoc.ms_monitoreo_kpi.service;

import cl.duoc.ms_monitoreo_kpi.dto.KpiProyectoRequestDto;
import cl.duoc.ms_monitoreo_kpi.model.KpiProyecto;
import cl.duoc.ms_monitoreo_kpi.repository.KpiProyectoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KpiProyectoService {

    private final KpiProyectoRepository kpiProyectoRepository;

    public KpiProyectoService(KpiProyectoRepository kpiProyectoRepository) {
        this.kpiProyectoRepository = kpiProyectoRepository;
    }

    public List<KpiProyecto> listarTodos() {
        return kpiProyectoRepository.findAll();
    }

    public KpiProyecto buscarPorId(Long id) {
        return kpiProyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("KpiProyecto no encontrado con id: " + id));
    }

    public KpiProyecto crear(KpiProyectoRequestDto dto) {
        KpiProyecto entidad = mapearDesdeDto(new KpiProyecto(), dto);
        return kpiProyectoRepository.save(entidad);
    }

    public KpiProyecto actualizar(Long id, KpiProyectoRequestDto dto) {
        KpiProyecto entidad = buscarPorId(id);
        entidad = mapearDesdeDto(entidad, dto);
        return kpiProyectoRepository.save(entidad);
    }

    public void eliminar(Long id) {
        if (!kpiProyectoRepository.existsById(id)) {
            throw new RuntimeException("KpiProyecto no encontrado con id: " + id);
        }
        kpiProyectoRepository.deleteById(id);
    }

    private KpiProyecto mapearDesdeDto(KpiProyecto entidad, KpiProyectoRequestDto dto) {

entidad.setIdProyecto(dto.getIdProyecto());
entidad.setPeriodo(dto.getPeriodo());
entidad.setPorcentajeAvance(dto.getPorcentajeAvance());
entidad.setCantidadTareas(dto.getCantidadTareas());
entidad.setCantidadTareasCompletadas(dto.getCantidadTareasCompletadas());
entidad.setCantidadHitos(dto.getCantidadHitos());
entidad.setCantidadHitosCumplidos(dto.getCantidadHitosCumplidos());
entidad.setCantidadIncidenciasAbiertas(dto.getCantidadIncidenciasAbiertas());
entidad.setFechaCalculo(dto.getFechaCalculo());

        return entidad;
    }
}
