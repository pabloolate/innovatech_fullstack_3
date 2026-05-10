package cl.duoc.ms_proyectos.service;

import cl.duoc.ms_proyectos.dto.TareaRequestDto;
import cl.duoc.ms_proyectos.dto.TareaResponseDto;
import cl.duoc.ms_proyectos.model.Tarea;
import cl.duoc.ms_proyectos.repository.ProyectoRepository;
import cl.duoc.ms_proyectos.repository.TareaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;
    private final ProyectoRepository proyectoRepository;

    public TareaService(TareaRepository tareaRepository, ProyectoRepository proyectoRepository) {
        this.tareaRepository = tareaRepository;
        this.proyectoRepository = proyectoRepository;
    }

    public List<TareaResponseDto> listarTodas() {
        return tareaRepository.findAll().stream().map(this::mapearAResponse).toList();
    }

    public List<TareaResponseDto> listarPorProyecto(Long idProyecto) {
        return tareaRepository.findByIdProyecto(idProyecto).stream().map(this::mapearAResponse).toList();
    }

    public TareaResponseDto buscarPorId(Long id) {
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con id: " + id));
        return mapearAResponse(tarea);
    }

    public TareaResponseDto crear(TareaRequestDto dto) {
        if (!proyectoRepository.existsById(dto.getIdProyecto())) {
            throw new RuntimeException("No existe el proyecto indicado para la tarea");
        }

        Tarea tarea = Tarea.builder()
                .idProyecto(dto.getIdProyecto())
                .titulo(dto.getTitulo())
                .descripcion(dto.getDescripcion())
                .estado(dto.getEstado())
                .prioridad(dto.getPrioridad())
                .porcentajeAvance(dto.getPorcentajeAvance())
                .idResponsableUsuario(dto.getIdResponsableUsuario())
                .fechaInicio(dto.getFechaInicio())
                .fechaFinEstimada(dto.getFechaFinEstimada())
                .fechaFinReal(dto.getFechaFinReal())
                .activo(dto.getActivo())
                .build();

        tarea = tareaRepository.save(tarea);
        return mapearAResponse(tarea);
    }

    public TareaResponseDto actualizar(Long id, TareaRequestDto dto) {
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con id: " + id));

        if (!proyectoRepository.existsById(dto.getIdProyecto())) {
            throw new RuntimeException("No existe el proyecto indicado para la tarea");
        }

        tarea.setIdProyecto(dto.getIdProyecto());
        tarea.setTitulo(dto.getTitulo());
        tarea.setDescripcion(dto.getDescripcion());
        tarea.setEstado(dto.getEstado());
        tarea.setPrioridad(dto.getPrioridad());
        tarea.setPorcentajeAvance(dto.getPorcentajeAvance());
        tarea.setIdResponsableUsuario(dto.getIdResponsableUsuario());
        tarea.setFechaInicio(dto.getFechaInicio());
        tarea.setFechaFinEstimada(dto.getFechaFinEstimada());
        tarea.setFechaFinReal(dto.getFechaFinReal());
        tarea.setActivo(dto.getActivo());

        tarea = tareaRepository.save(tarea);
        return mapearAResponse(tarea);
    }

    public TareaResponseDto activar(Long id) {
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con id: " + id));
        tarea.setActivo(true);
        tarea = tareaRepository.save(tarea);
        return mapearAResponse(tarea);
    }

    public TareaResponseDto desactivar(Long id) {
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con id: " + id));
        tarea.setActivo(false);
        tarea = tareaRepository.save(tarea);
        return mapearAResponse(tarea);
    }

    public void eliminar(Long id) {
        if (!tareaRepository.existsById(id)) {
            throw new RuntimeException("Tarea no encontrada con id: " + id);
        }
        tareaRepository.deleteById(id);
    }

    private TareaResponseDto mapearAResponse(Tarea tarea) {
        return TareaResponseDto.builder()
                .id(tarea.getId())
                .idProyecto(tarea.getIdProyecto())
                .titulo(tarea.getTitulo())
                .descripcion(tarea.getDescripcion())
                .estado(tarea.getEstado())
                .prioridad(tarea.getPrioridad())
                .porcentajeAvance(tarea.getPorcentajeAvance())
                .idResponsableUsuario(tarea.getIdResponsableUsuario())
                .fechaInicio(tarea.getFechaInicio())
                .fechaFinEstimada(tarea.getFechaFinEstimada())
                .fechaFinReal(tarea.getFechaFinReal())
                .activo(tarea.getActivo())
                .fechaCreacion(tarea.getFechaCreacion())
                .fechaActualizacion(tarea.getFechaActualizacion())
                .build();
    }
}
