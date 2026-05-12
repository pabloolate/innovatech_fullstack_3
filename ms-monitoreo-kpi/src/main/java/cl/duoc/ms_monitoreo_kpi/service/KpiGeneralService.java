package cl.duoc.ms_monitoreo_kpi.service;

import cl.duoc.ms_monitoreo_kpi.dto.KpiGeneralRequestDto;
import cl.duoc.ms_monitoreo_kpi.model.KpiGeneral;
import cl.duoc.ms_monitoreo_kpi.repository.KpiGeneralRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KpiGeneralService {

    private final KpiGeneralRepository kpiGeneralRepository;

    public KpiGeneralService(KpiGeneralRepository kpiGeneralRepository) {
        this.kpiGeneralRepository = kpiGeneralRepository;
    }

    public List<KpiGeneral> listarTodos() {
        return kpiGeneralRepository.findAll();
    }

    public KpiGeneral buscarPorId(Long id) {
        return kpiGeneralRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("KpiGeneral no encontrado con id: " + id));
    }

    public KpiGeneral crear(KpiGeneralRequestDto dto) {
        KpiGeneral entidad = mapearDesdeDto(new KpiGeneral(), dto);
        return kpiGeneralRepository.save(entidad);
    }

    public KpiGeneral actualizar(Long id, KpiGeneralRequestDto dto) {
        KpiGeneral entidad = buscarPorId(id);
        entidad = mapearDesdeDto(entidad, dto);
        return kpiGeneralRepository.save(entidad);
    }

    public void eliminar(Long id) {
        if (!kpiGeneralRepository.existsById(id)) {
            throw new RuntimeException("KpiGeneral no encontrado con id: " + id);
        }
        kpiGeneralRepository.deleteById(id);
    }

    private KpiGeneral mapearDesdeDto(KpiGeneral entidad, KpiGeneralRequestDto dto) {

entidad.setPeriodo(dto.getPeriodo());
entidad.setCantidadProyectosActivos(dto.getCantidadProyectosActivos());
entidad.setCantidadProyectosFinalizados(dto.getCantidadProyectosFinalizados());
entidad.setCantidadRecursosActivos(dto.getCantidadRecursosActivos());
entidad.setPromedioAvanceProyectos(dto.getPromedioAvanceProyectos());
entidad.setPromedioOcupacionRecursos(dto.getPromedioOcupacionRecursos());
entidad.setCantidadIncidenciasAbiertas(dto.getCantidadIncidenciasAbiertas());
entidad.setFechaCalculo(dto.getFechaCalculo());

        return entidad;
    }
}
