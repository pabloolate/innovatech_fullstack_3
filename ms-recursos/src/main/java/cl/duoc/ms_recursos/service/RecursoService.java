package cl.duoc.ms_recursos.service;

import cl.duoc.ms_recursos.dto.*;
import cl.duoc.ms_recursos.model.*;
import cl.duoc.ms_recursos.repository.AsignacionRecursoRepository;
import cl.duoc.ms_recursos.repository.DisponibilidadRecursoRepository;
import cl.duoc.ms_recursos.repository.RecursoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecursoService {

    private final RecursoRepository recursoRepository;
    private final AsignacionRecursoRepository asignacionRecursoRepository;
    private final DisponibilidadRecursoRepository disponibilidadRecursoRepository;

    public RecursoService(RecursoRepository recursoRepository,
                          AsignacionRecursoRepository asignacionRecursoRepository,
                          DisponibilidadRecursoRepository disponibilidadRecursoRepository) {
        this.recursoRepository = recursoRepository;
        this.asignacionRecursoRepository = asignacionRecursoRepository;
        this.disponibilidadRecursoRepository = disponibilidadRecursoRepository;
    }

    public List<RecursoRespuestaDto> listarRecursos() {
        return recursoRepository.findAll().stream().map(this::mapearRecurso).toList();
    }

    public RecursoRespuestaDto buscarRecursoPorId(Long id) {
        return mapearRecurso(obtenerRecurso(id));
    }

    public RecursoRespuestaDto crearRecurso(CrearRecursoDto dto) {
        if (recursoRepository.existsByIdUsuario(dto.getIdUsuario())) {
            throw new RuntimeException("Ya existe un recurso para el idUsuario indicado");
        }
        if (recursoRepository.existsByCorreo(dto.getCorreo())) {
            throw new RuntimeException("Ya existe un recurso con ese correo");
        }

        Recurso recurso = Recurso.builder()
                .idUsuario(dto.getIdUsuario())
                .nombres(dto.getNombres())
                .apellidos(dto.getApellidos())
                .correo(dto.getCorreo())
                .perfil(dto.getPerfil())
                .especialidad(dto.getEspecialidad())
                .capacidadHorasSemanales(dto.getCapacidadHorasSemanales())
                .activo(dto.getActivo())
                .build();

        return mapearRecurso(recursoRepository.save(recurso));
    }

    public RecursoRespuestaDto actualizarRecurso(Long id, ActualizarRecursoDto dto) {
        Recurso recurso = obtenerRecurso(id);
        recurso.setNombres(dto.getNombres());
        recurso.setApellidos(dto.getApellidos());
        recurso.setCorreo(dto.getCorreo());
        recurso.setPerfil(dto.getPerfil());
        recurso.setEspecialidad(dto.getEspecialidad());
        recurso.setCapacidadHorasSemanales(dto.getCapacidadHorasSemanales());
        recurso.setActivo(dto.getActivo());
        return mapearRecurso(recursoRepository.save(recurso));
    }

    public RecursoRespuestaDto activarRecurso(Long id) {
        Recurso recurso = obtenerRecurso(id);
        recurso.setActivo(true);
        return mapearRecurso(recursoRepository.save(recurso));
    }

    public RecursoRespuestaDto desactivarRecurso(Long id) {
        Recurso recurso = obtenerRecurso(id);
        recurso.setActivo(false);
        return mapearRecurso(recursoRepository.save(recurso));
    }

    public void eliminarRecurso(Long id) {
        if (!recursoRepository.existsById(id)) {
            throw new RuntimeException("Recurso no encontrado con id: " + id);
        }
        recursoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<AsignacionRespuestaDto> listarAsignaciones() {
        return asignacionRecursoRepository.findAllWithRecurso().stream().map(this::mapearAsignacion).toList();
    }

    @Transactional(readOnly = true)
    public List<AsignacionRespuestaDto> listarAsignacionesPorRecurso(Long idRecurso) {
        return asignacionRecursoRepository.findByRecursoIdWithRecurso(idRecurso).stream().map(this::mapearAsignacion).toList();
    }

    public AsignacionRespuestaDto crearAsignacion(CrearAsignacionDto dto) {
        Recurso recurso = obtenerRecurso(dto.getIdRecurso());

        AsignacionRecurso asignacion = AsignacionRecurso.builder()
                .recurso(recurso)
                .idProyecto(dto.getIdProyecto())
                .idTarea(dto.getIdTarea())
                .porcentajeAsignacion(dto.getPorcentajeAsignacion())
                .horasAsignadasSemanales(dto.getHorasAsignadasSemanales())
                .fechaInicio(dto.getFechaInicio())
                .fechaFinEstimada(dto.getFechaFinEstimada())
                .fechaFinReal(dto.getFechaFinReal())
                .estado(dto.getEstado())
                .activo(dto.getActivo())
                .build();

        return mapearAsignacion(asignacionRecursoRepository.save(asignacion));
    }

    public AsignacionRespuestaDto actualizarAsignacion(Long id, ActualizarAsignacionDto dto) {
        AsignacionRecurso asignacion = obtenerAsignacion(id);
        asignacion.setIdProyecto(dto.getIdProyecto());
        asignacion.setIdTarea(dto.getIdTarea());
        asignacion.setPorcentajeAsignacion(dto.getPorcentajeAsignacion());
        asignacion.setHorasAsignadasSemanales(dto.getHorasAsignadasSemanales());
        asignacion.setFechaInicio(dto.getFechaInicio());
        asignacion.setFechaFinEstimada(dto.getFechaFinEstimada());
        asignacion.setFechaFinReal(dto.getFechaFinReal());
        asignacion.setEstado(dto.getEstado());
        asignacion.setActivo(dto.getActivo());
        return mapearAsignacion(asignacionRecursoRepository.save(asignacion));
    }

    public void eliminarAsignacion(Long id) {
        if (!asignacionRecursoRepository.existsById(id)) {
            throw new RuntimeException("Asignación no encontrada con id: " + id);
        }
        asignacionRecursoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<DisponibilidadRespuestaDto> listarDisponibilidades() {
        return disponibilidadRecursoRepository.findAllWithRecurso().stream().map(this::mapearDisponibilidad).toList();
    }

    @Transactional(readOnly = true)
    public List<DisponibilidadRespuestaDto> listarDisponibilidadesPorRecurso(Long idRecurso) {
        return disponibilidadRecursoRepository.findByRecursoIdWithRecurso(idRecurso).stream().map(this::mapearDisponibilidad).toList();
    }

    public DisponibilidadRespuestaDto crearDisponibilidad(CrearDisponibilidadDto dto) {
        Recurso recurso = obtenerRecurso(dto.getIdRecurso());

        DisponibilidadRecurso disponibilidad = DisponibilidadRecurso.builder()
                .recurso(recurso)
                .fechaDesde(dto.getFechaDesde())
                .fechaHasta(dto.getFechaHasta())
                .estadoDisponibilidad(dto.getEstadoDisponibilidad())
                .motivo(dto.getMotivo())
                .build();

        return mapearDisponibilidad(disponibilidadRecursoRepository.save(disponibilidad));
    }

    public DisponibilidadRespuestaDto actualizarDisponibilidad(Long id, ActualizarDisponibilidadDto dto) {
        DisponibilidadRecurso disponibilidad = obtenerDisponibilidad(id);
        disponibilidad.setFechaDesde(dto.getFechaDesde());
        disponibilidad.setFechaHasta(dto.getFechaHasta());
        disponibilidad.setEstadoDisponibilidad(dto.getEstadoDisponibilidad());
        disponibilidad.setMotivo(dto.getMotivo());
        return mapearDisponibilidad(disponibilidadRecursoRepository.save(disponibilidad));
    }

    public void eliminarDisponibilidad(Long id) {
        if (!disponibilidadRecursoRepository.existsById(id)) {
            throw new RuntimeException("Disponibilidad no encontrada con id: " + id);
        }
        disponibilidadRecursoRepository.deleteById(id);
    }

    public CargaLaboralRespuestaDto obtenerCargaLaboral(Long idRecurso) {
        Recurso recurso = obtenerRecurso(idRecurso);
        Integer horasAsignadasActivas = asignacionRecursoRepository.sumarHorasActivasPorRecurso(idRecurso);
        int capacidad = recurso.getCapacidadHorasSemanales();
        int porcentajeOcupacion = capacidad > 0 ? (horasAsignadasActivas * 100) / capacidad : 0;
        int horasDisponibles = capacidad - horasAsignadasActivas;

        return CargaLaboralRespuestaDto.builder()
                .idRecurso(recurso.getId())
                .nombreRecurso(recurso.getNombres() + " " + recurso.getApellidos())
                .capacidadHorasSemanales(capacidad)
                .horasAsignadasActivas(horasAsignadasActivas)
                .porcentajeOcupacion(Math.max(porcentajeOcupacion, 0))
                .horasDisponibles(horasDisponibles)
                .build();
    }

    private Recurso obtenerRecurso(Long id) {
        return recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con id: " + id));
    }

    private AsignacionRecurso obtenerAsignacion(Long id) {
        return asignacionRecursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con id: " + id));
    }

    private DisponibilidadRecurso obtenerDisponibilidad(Long id) {
        return disponibilidadRecursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disponibilidad no encontrada con id: " + id));
    }

    private RecursoRespuestaDto mapearRecurso(Recurso recurso) {
        return RecursoRespuestaDto.builder()
                .id(recurso.getId())
                .idUsuario(recurso.getIdUsuario())
                .nombres(recurso.getNombres())
                .apellidos(recurso.getApellidos())
                .correo(recurso.getCorreo())
                .perfil(recurso.getPerfil())
                .especialidad(recurso.getEspecialidad())
                .capacidadHorasSemanales(recurso.getCapacidadHorasSemanales())
                .activo(recurso.getActivo())
                .fechaCreacion(recurso.getFechaCreacion())
                .fechaActualizacion(recurso.getFechaActualizacion())
                .build();
    }

    private AsignacionRespuestaDto mapearAsignacion(AsignacionRecurso asignacion) {
        return AsignacionRespuestaDto.builder()
                .id(asignacion.getId())
                .idRecurso(asignacion.getRecurso().getId())
                .nombreRecurso(asignacion.getRecurso().getNombres() + " " + asignacion.getRecurso().getApellidos())
                .idProyecto(asignacion.getIdProyecto())
                .idTarea(asignacion.getIdTarea())
                .porcentajeAsignacion(asignacion.getPorcentajeAsignacion())
                .horasAsignadasSemanales(asignacion.getHorasAsignadasSemanales())
                .fechaInicio(asignacion.getFechaInicio())
                .fechaFinEstimada(asignacion.getFechaFinEstimada())
                .fechaFinReal(asignacion.getFechaFinReal())
                .estado(asignacion.getEstado())
                .activo(asignacion.getActivo())
                .fechaCreacion(asignacion.getFechaCreacion())
                .fechaActualizacion(asignacion.getFechaActualizacion())
                .build();
    }

    private DisponibilidadRespuestaDto mapearDisponibilidad(DisponibilidadRecurso disponibilidad) {
        return DisponibilidadRespuestaDto.builder()
                .id(disponibilidad.getId())
                .idRecurso(disponibilidad.getRecurso().getId())
                .nombreRecurso(disponibilidad.getRecurso().getNombres() + " " + disponibilidad.getRecurso().getApellidos())
                .fechaDesde(disponibilidad.getFechaDesde())
                .fechaHasta(disponibilidad.getFechaHasta())
                .estadoDisponibilidad(disponibilidad.getEstadoDisponibilidad())
                .motivo(disponibilidad.getMotivo())
                .fechaCreacion(disponibilidad.getFechaCreacion())
                .fechaActualizacion(disponibilidad.getFechaActualizacion())
                .build();
    }
}
