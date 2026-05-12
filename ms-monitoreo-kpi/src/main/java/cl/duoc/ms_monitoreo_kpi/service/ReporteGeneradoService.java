package cl.duoc.ms_monitoreo_kpi.service;

import cl.duoc.ms_monitoreo_kpi.dto.ReporteGeneradoRequestDto;
import cl.duoc.ms_monitoreo_kpi.model.ReporteGenerado;
import cl.duoc.ms_monitoreo_kpi.repository.ReporteGeneradoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReporteGeneradoService {

    private final ReporteGeneradoRepository reporteGeneradoRepository;

    public ReporteGeneradoService(ReporteGeneradoRepository reporteGeneradoRepository) {
        this.reporteGeneradoRepository = reporteGeneradoRepository;
    }

    public List<ReporteGenerado> listarTodos() {
        return reporteGeneradoRepository.findAll();
    }

    public ReporteGenerado buscarPorId(Long id) {
        return reporteGeneradoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReporteGenerado no encontrado con id: " + id));
    }

    public ReporteGenerado crear(ReporteGeneradoRequestDto dto) {
        ReporteGenerado entidad = mapearDesdeDto(new ReporteGenerado(), dto);
        return reporteGeneradoRepository.save(entidad);
    }

    public ReporteGenerado actualizar(Long id, ReporteGeneradoRequestDto dto) {
        ReporteGenerado entidad = buscarPorId(id);
        entidad = mapearDesdeDto(entidad, dto);
        return reporteGeneradoRepository.save(entidad);
    }

    public void eliminar(Long id) {
        if (!reporteGeneradoRepository.existsById(id)) {
            throw new RuntimeException("ReporteGenerado no encontrado con id: " + id);
        }
        reporteGeneradoRepository.deleteById(id);
    }

    private ReporteGenerado mapearDesdeDto(ReporteGenerado entidad, ReporteGeneradoRequestDto dto) {

entidad.setTipoReporte(dto.getTipoReporte());
entidad.setPeriodo(dto.getPeriodo());
entidad.setGeneradoPorUsuario(dto.getGeneradoPorUsuario());
entidad.setFormato(dto.getFormato());
entidad.setRutaArchivo(dto.getRutaArchivo());
entidad.setFechaGeneracion(dto.getFechaGeneracion());

        return entidad;
    }
}
