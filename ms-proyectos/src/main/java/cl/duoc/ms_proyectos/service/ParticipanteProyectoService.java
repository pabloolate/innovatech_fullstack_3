package cl.duoc.ms_proyectos.service;

import cl.duoc.ms_proyectos.dto.ParticipanteProyectoRequestDto;
import cl.duoc.ms_proyectos.dto.ParticipanteProyectoResponseDto;
import cl.duoc.ms_proyectos.model.ParticipanteProyecto;
import cl.duoc.ms_proyectos.repository.ParticipanteProyectoRepository;
import cl.duoc.ms_proyectos.repository.ProyectoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipanteProyectoService {

    private final ParticipanteProyectoRepository participanteProyectoRepository;
    private final ProyectoRepository proyectoRepository;

    public ParticipanteProyectoService(ParticipanteProyectoRepository participanteProyectoRepository,
                                       ProyectoRepository proyectoRepository) {
        this.participanteProyectoRepository = participanteProyectoRepository;
        this.proyectoRepository = proyectoRepository;
    }

    public List<ParticipanteProyectoResponseDto> listarTodos() {
        return participanteProyectoRepository.findAll().stream().map(this::mapearAResponse).toList();
    }

    public List<ParticipanteProyectoResponseDto> listarPorProyecto(Long idProyecto) {
        return participanteProyectoRepository.findByIdProyecto(idProyecto).stream().map(this::mapearAResponse).toList();
    }

    public ParticipanteProyectoResponseDto buscarPorId(Long id) {
        ParticipanteProyecto participante = participanteProyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participante no encontrado con id: " + id));
        return mapearAResponse(participante);
    }

    public ParticipanteProyectoResponseDto crear(ParticipanteProyectoRequestDto dto) {
        if (!proyectoRepository.existsById(dto.getIdProyecto())) {
            throw new RuntimeException("No existe el proyecto indicado para el participante");
        }

        ParticipanteProyecto participante = ParticipanteProyecto.builder()
                .idProyecto(dto.getIdProyecto())
                .idUsuario(dto.getIdUsuario())
                .rolEnProyecto(dto.getRolEnProyecto())
                .activo(dto.getActivo())
                .build();

        participante = participanteProyectoRepository.save(participante);
        return mapearAResponse(participante);
    }

    public ParticipanteProyectoResponseDto actualizar(Long id, ParticipanteProyectoRequestDto dto) {
        ParticipanteProyecto participante = participanteProyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participante no encontrado con id: " + id));

        if (!proyectoRepository.existsById(dto.getIdProyecto())) {
            throw new RuntimeException("No existe el proyecto indicado para el participante");
        }

        participante.setIdProyecto(dto.getIdProyecto());
        participante.setIdUsuario(dto.getIdUsuario());
        participante.setRolEnProyecto(dto.getRolEnProyecto());
        participante.setActivo(dto.getActivo());

        participante = participanteProyectoRepository.save(participante);
        return mapearAResponse(participante);
    }

    public ParticipanteProyectoResponseDto activar(Long id) {
        ParticipanteProyecto participante = participanteProyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participante no encontrado con id: " + id));
        participante.setActivo(true);
        participante = participanteProyectoRepository.save(participante);
        return mapearAResponse(participante);
    }

    public ParticipanteProyectoResponseDto desactivar(Long id) {
        ParticipanteProyecto participante = participanteProyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participante no encontrado con id: " + id));
        participante.setActivo(false);
        participante = participanteProyectoRepository.save(participante);
        return mapearAResponse(participante);
    }

    public void eliminar(Long id) {
        if (!participanteProyectoRepository.existsById(id)) {
            throw new RuntimeException("Participante no encontrado con id: " + id);
        }
        participanteProyectoRepository.deleteById(id);
    }

    private ParticipanteProyectoResponseDto mapearAResponse(ParticipanteProyecto participante) {
        return ParticipanteProyectoResponseDto.builder()
                .id(participante.getId())
                .idProyecto(participante.getIdProyecto())
                .idUsuario(participante.getIdUsuario())
                .rolEnProyecto(participante.getRolEnProyecto())
                .activo(participante.getActivo())
                .fechaCreacion(participante.getFechaCreacion())
                .build();
    }
}
