package cl.duoc.ms_calendario.service;

import cl.duoc.ms_calendario.dto.EventoCalendarioDto;
import cl.duoc.ms_calendario.dto.SincronizarRequestDto;
import cl.duoc.ms_calendario.model.VinculoCalendario;
import cl.duoc.ms_calendario.repository.VinculoCalendarioRepository;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SincronizacionService {

    private final GoogleCalendarService calendarService;
    private final VinculoCalendarioRepository vinculoRepository;
    private final String calendarId;

    public SincronizacionService(
            GoogleCalendarService calendarService,
            VinculoCalendarioRepository vinculoRepository,
            @Value("${app.calendar.id}") String calendarId) {
        this.calendarService = calendarService;
        this.vinculoRepository = vinculoRepository;
        this.calendarId = calendarId;
    }

    public EventoCalendarioDto sincronizarTarea(Long idTarea, SincronizarRequestDto dto)
            throws IOException {

        LocalDate fechaInicio = LocalDate.parse(dto.getFechaInicio());
        LocalDate fechaFin = dto.getFechaFin() != null ? LocalDate.parse(dto.getFechaFin()) : null;

        var vinculoOpt = vinculoRepository.findByEntidadTipoAndEntidadId("TAREA", idTarea);

        String idEventoGoogle;
        if (vinculoOpt.isPresent()) {
            idEventoGoogle = vinculoOpt.get().getIdEventoGoogle();
            calendarService.actualizarEvento(idEventoGoogle, dto.getTitulo(),
                    dto.getDescripcion(), fechaInicio, fechaFin, dto.getUbicacion());
        } else {
            idEventoGoogle = calendarService.crearEvento(dto.getTitulo(),
                    dto.getDescripcion(), fechaInicio, fechaFin, dto.getUbicacion());

            var vinculo = VinculoCalendario.builder()
                    .entidadTipo("TAREA")
                    .entidadId(idTarea)
                    .idEventoGoogle(idEventoGoogle)
                    .calendarId(calendarId)
                    .ultimaSincronizacion(LocalDateTime.now())
                    .build();
            vinculoRepository.save(vinculo);
        }

        return EventoCalendarioDto.builder()
                .id(idEventoGoogle)
                .titulo(dto.getTitulo())
                .descripcion(dto.getDescripcion())
                .fechaInicio(dto.getFechaInicio())
                .fechaFin(dto.getFechaFin())
                .entidadTipo("TAREA")
                .entidadId(idTarea)
                .build();
    }

    public EventoCalendarioDto sincronizarProyecto(Long idProyecto, SincronizarRequestDto dto)
            throws IOException {

        LocalDate fechaInicio = LocalDate.parse(dto.getFechaInicio());
        LocalDate fechaFin = dto.getFechaFin() != null ? LocalDate.parse(dto.getFechaFin()) : null;

        var vinculoOpt = vinculoRepository.findByEntidadTipoAndEntidadId("PROYECTO", idProyecto);

        String idEventoGoogle;
        if (vinculoOpt.isPresent()) {
            idEventoGoogle = vinculoOpt.get().getIdEventoGoogle();
            calendarService.actualizarEvento(idEventoGoogle, dto.getTitulo(),
                    dto.getDescripcion(), fechaInicio, fechaFin, dto.getUbicacion());
        } else {
            idEventoGoogle = calendarService.crearEvento(dto.getTitulo(),
                    dto.getDescripcion(), fechaInicio, fechaFin, dto.getUbicacion());

            var vinculo = VinculoCalendario.builder()
                    .entidadTipo("PROYECTO")
                    .entidadId(idProyecto)
                    .idEventoGoogle(idEventoGoogle)
                    .calendarId(calendarId)
                    .ultimaSincronizacion(LocalDateTime.now())
                    .build();
            vinculoRepository.save(vinculo);
        }

        return EventoCalendarioDto.builder()
                .id(idEventoGoogle)
                .titulo(dto.getTitulo())
                .descripcion(dto.getDescripcion())
                .fechaInicio(dto.getFechaInicio())
                .fechaFin(dto.getFechaFin())
                .entidadTipo("PROYECTO")
                .entidadId(idProyecto)
                .build();
    }

    public void eliminarSincronizacion(String entidadTipo, Long entidadId) throws IOException {
        var vinculoOpt = vinculoRepository.findByEntidadTipoAndEntidadId(entidadTipo, entidadId);
        if (vinculoOpt.isEmpty()) {
            throw new RuntimeException("No existe vinculacion para " + entidadTipo + " con id " + entidadId);
        }
        calendarService.eliminarEvento(vinculoOpt.get().getIdEventoGoogle());
        vinculoRepository.delete(vinculoOpt.get());
    }

    public List<EventoCalendarioDto> listarEventos() throws IOException {
        var eventos = calendarService.listarEventos();
        var vinculos = vinculoRepository.findAll();

        return eventos.stream().map(evento -> {
            var vinculo = vinculos.stream()
                    .filter(v -> v.getIdEventoGoogle().equals(evento.getId()))
                    .findFirst();
            return EventoCalendarioDto.builder()
                    .id(evento.getId())
                    .titulo(evento.getTitulo())
                    .descripcion(evento.getDescripcion())
                    .fechaInicio(evento.getFechaInicio())
                    .fechaFin(evento.getFechaFin())
                    .link(evento.getLink())
                    .entidadTipo(vinculo.map(VinculoCalendario::getEntidadTipo).orElse(null))
                    .entidadId(vinculo.map(VinculoCalendario::getEntidadId).orElse(null))
                    .build();
        }).toList();
    }

    public List<VinculoCalendario> listarVinculos() {
        return vinculoRepository.findAll();
    }
}
