package cl.duoc.ms_proyectos.service;

import cl.duoc.ms_proyectos.dto.ProyectoRequestDto;
import cl.duoc.ms_proyectos.dto.ProyectoResponseDto;
import cl.duoc.ms_proyectos.model.Proyecto;
import cl.duoc.ms_proyectos.repository.ProyectoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProyectoService {

    private final ProyectoRepository proyectoRepository;

    public ProyectoService(ProyectoRepository proyectoRepository) {
        this.proyectoRepository = proyectoRepository;
    }

    public List<ProyectoResponseDto> listarTodos() {
        return proyectoRepository.findAll().stream().map(this::mapearAResponse).toList();
    }

    public ProyectoResponseDto buscarPorId(Long id) {
        Proyecto proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con id: " + id));
        return mapearAResponse(proyecto);
    }

    public ProyectoResponseDto crear(ProyectoRequestDto dto) {
        Proyecto proyecto = Proyecto.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .estado(dto.getEstado())
                .porcentajeAvance(dto.getPorcentajeAvance())
                .fechaInicio(dto.getFechaInicio())
                .fechaFinEstimada(dto.getFechaFinEstimada())
                .fechaFinReal(dto.getFechaFinReal())
                .idLiderProyecto(dto.getIdLiderProyecto())
                .activo(dto.getActivo())
                .build();

        proyecto = proyectoRepository.save(proyecto);
        return mapearAResponse(proyecto);
    }

    public ProyectoResponseDto actualizar(Long id, ProyectoRequestDto dto) {
        Proyecto proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con id: " + id));

        proyecto.setNombre(dto.getNombre());
        proyecto.setDescripcion(dto.getDescripcion());
        proyecto.setEstado(dto.getEstado());
        proyecto.setPorcentajeAvance(dto.getPorcentajeAvance());
        proyecto.setFechaInicio(dto.getFechaInicio());
        proyecto.setFechaFinEstimada(dto.getFechaFinEstimada());
        proyecto.setFechaFinReal(dto.getFechaFinReal());
        proyecto.setIdLiderProyecto(dto.getIdLiderProyecto());
        proyecto.setActivo(dto.getActivo());

        proyecto = proyectoRepository.save(proyecto);
        return mapearAResponse(proyecto);
    }

    public ProyectoResponseDto activar(Long id) {
        Proyecto proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con id: " + id));
        proyecto.setActivo(true);
        proyecto = proyectoRepository.save(proyecto);
        return mapearAResponse(proyecto);
    }

    public ProyectoResponseDto desactivar(Long id) {
        Proyecto proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con id: " + id));
        proyecto.setActivo(false);
        proyecto = proyectoRepository.save(proyecto);
        return mapearAResponse(proyecto);
    }

    public void eliminar(Long id) {
        if (!proyectoRepository.existsById(id)) {
            throw new RuntimeException("Proyecto no encontrado con id: " + id);
        }
        proyectoRepository.deleteById(id);
    }

    private ProyectoResponseDto mapearAResponse(Proyecto proyecto) {
        return ProyectoResponseDto.builder()
                .id(proyecto.getId())
                .nombre(proyecto.getNombre())
                .descripcion(proyecto.getDescripcion())
                .estado(proyecto.getEstado())
                .porcentajeAvance(proyecto.getPorcentajeAvance())
                .fechaInicio(proyecto.getFechaInicio())
                .fechaFinEstimada(proyecto.getFechaFinEstimada())
                .fechaFinReal(proyecto.getFechaFinReal())
                .idLiderProyecto(proyecto.getIdLiderProyecto())
                .activo(proyecto.getActivo())
                .fechaCreacion(proyecto.getFechaCreacion())
                .fechaActualizacion(proyecto.getFechaActualizacion())
                .build();
    }
}
