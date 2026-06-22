package cl.duoc.ms_calendario.service;

import cl.duoc.ms_calendario.dto.EventoCalendarioDto;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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
                              String horaInicio, String horaFin,
                              String ubicacion) throws IOException {

        Event event = new Event()
                .setSummary(titulo)
                .setDescription(descripcion)
                .setLocation(ubicacion);

        aplicarFechas(event, fechaInicio, fechaFin, horaInicio, horaFin);

        Event creado = calendarService.events().insert(calendarId, event).execute();
        return creado.getId();
    }

    public void actualizarEvento(String idEventoGoogle, String titulo, String descripcion,
                                 LocalDate fechaInicio, LocalDate fechaFin,
                                 String horaInicio, String horaFin,
                                 String ubicacion) throws IOException {

        Event event = calendarService.events().get(calendarId, idEventoGoogle).execute();
        event.setSummary(titulo);
        event.setDescription(descripcion);
        event.setLocation(ubicacion);

        aplicarFechas(event, fechaInicio, fechaFin, horaInicio, horaFin);

        calendarService.events().update(calendarId, idEventoGoogle, event).execute();
    }

    private void aplicarFechas(Event event, LocalDate fechaInicio, LocalDate fechaFin,
                               String horaInicio, String horaFin) {
        ZoneId zoneId = ZoneId.of(timezone.getID());
        boolean tieneHoraInicio = horaInicio != null && !horaInicio.isBlank();

        if (tieneHoraInicio) {
            LocalTime horaInicioEvento = LocalTime.parse(horaInicio);
            LocalTime horaFinEvento = horaFin != null && !horaFin.isBlank()
                    ? LocalTime.parse(horaFin)
                    : horaInicioEvento.plusHours(1);

            LocalDate fechaFinEvento = fechaFin != null ? fechaFin : fechaInicio;

            ZonedDateTime inicio = ZonedDateTime.of(fechaInicio, horaInicioEvento, zoneId);
            ZonedDateTime fin = ZonedDateTime.of(fechaFinEvento, horaFinEvento, zoneId);

            if (!fin.isAfter(inicio)) {
                fin = inicio.plusHours(1);
            }

            event.setStart(new EventDateTime()
                    .setDateTime(new DateTime(inicio.toInstant().toEpochMilli()))
                    .setTimeZone(timezone.getID()));
            event.setEnd(new EventDateTime()
                    .setDateTime(new DateTime(fin.toInstant().toEpochMilli()))
                    .setTimeZone(timezone.getID()));

            return;
        }

        LocalDate fechaFinDiaCompleto = fechaFin != null ? fechaFin.plusDays(1) : fechaInicio.plusDays(1);

        event.setStart(new EventDateTime()
                .setDate(new DateTime(fechaInicio.toString()))
                .setTimeZone(timezone.getID()));
        event.setEnd(new EventDateTime()
                .setDate(new DateTime(fechaFinDiaCompleto.toString()))
                .setTimeZone(timezone.getID()));
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
