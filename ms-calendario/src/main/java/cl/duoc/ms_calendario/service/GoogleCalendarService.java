package cl.duoc.ms_calendario.service;

import cl.duoc.ms_calendario.dto.EventoCalendarioDto;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.TimeZone;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GoogleCalendarService {

    private final Calendar calendarService;
    private final String calendarId;
    private final TimeZone timezone;

    public GoogleCalendarService(
            Calendar calendarService,
            @Value("${app.calendar.id}") String calendarId,
            @Value("${app.calendar.timezone}") String timezoneId) {
        this.calendarService = calendarService;
        this.calendarId = calendarId;
        this.timezone = TimeZone.getTimeZone(timezoneId);
    }

    public String crearEvento(String titulo, String descripcion,
                              LocalDate fechaInicio, LocalDate fechaFin,
                              String ubicacion) throws IOException {

        Event event = new Event()
                .setSummary(titulo)
                .setDescription(descripcion)
                .setLocation(ubicacion);

        ZonedDateTime inicio = fechaInicio.atStartOfDay(ZoneId.of(timezone.getID()));
        ZonedDateTime fin = fechaFin != null
                ? fechaFin.atStartOfDay(ZoneId.of(timezone.getID()))
                : inicio.plusHours(1);

        event.setStart(new EventDateTime()
                .setDateTime(new DateTime(inicio.toInstant().toEpochMilli()))
                .setTimeZone(timezone.getID()));
        event.setEnd(new EventDateTime()
                .setDateTime(new DateTime(fin.toInstant().toEpochMilli()))
                .setTimeZone(timezone.getID()));

        Event creado = calendarService.events().insert(calendarId, event).execute();
        return creado.getId();
    }

    public void actualizarEvento(String idEventoGoogle, String titulo, String descripcion,
                                 LocalDate fechaInicio, LocalDate fechaFin,
                                 String ubicacion) throws IOException {

        Event event = calendarService.events().get(calendarId, idEventoGoogle).execute();
        event.setSummary(titulo);
        event.setDescription(descripcion);
        event.setLocation(ubicacion);

        ZonedDateTime inicio = fechaInicio.atStartOfDay(ZoneId.of(timezone.getID()));
        ZonedDateTime fin = fechaFin != null
                ? fechaFin.atStartOfDay(ZoneId.of(timezone.getID()))
                : inicio.plusHours(1);

        event.setStart(new EventDateTime()
                .setDateTime(new DateTime(inicio.toInstant().toEpochMilli()))
                .setTimeZone(timezone.getID()));
        event.setEnd(new EventDateTime()
                .setDateTime(new DateTime(fin.toInstant().toEpochMilli()))
                .setTimeZone(timezone.getID()));

        calendarService.events().update(calendarId, idEventoGoogle, event).execute();
    }

    public void eliminarEvento(String idEventoGoogle) throws IOException {
        calendarService.events().delete(calendarId, idEventoGoogle).execute();
    }

    public List<EventoCalendarioDto> listarEventos() throws IOException {
        var events = calendarService.events().list(calendarId)
                .setMaxResults(100)
                .setOrderBy("startTime")
                .setSingleEvents(true)
                .execute();

        return events.getItems().stream()
                .map(e -> EventoCalendarioDto.builder()
                        .id(e.getId())
                        .titulo(e.getSummary())
                        .descripcion(e.getDescription())
                        .fechaInicio(formatearFecha(e.getStart()))
                        .fechaFin(formatearFecha(e.getEnd()))
                        .link(e.getHtmlLink())
                        .build())
                .toList();
    }

    private String formatearFecha(EventDateTime eventDateTime) {
        if (eventDateTime == null) return null;
        if (eventDateTime.getDateTime() != null) {
            return eventDateTime.getDateTime().toString();
        }
        if (eventDateTime.getDate() != null) {
            return eventDateTime.getDate().toString();
        }
        return null;
    }
}
