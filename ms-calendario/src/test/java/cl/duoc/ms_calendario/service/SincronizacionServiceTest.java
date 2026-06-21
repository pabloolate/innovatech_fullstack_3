package cl.duoc.ms_calendario.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.duoc.ms_calendario.dto.SincronizarRequestDto;
import cl.duoc.ms_calendario.model.VinculoCalendario;
import cl.duoc.ms_calendario.repository.VinculoCalendarioRepository;
import java.io.IOException;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SincronizacionServiceTest {

    @Mock
    private GoogleCalendarService calendarService;

    @Mock
    private VinculoCalendarioRepository vinculoRepository;

    private SincronizacionService sincronizacionService;

    @BeforeEach
    void setUp() {
        sincronizacionService = new SincronizacionService(calendarService, vinculoRepository, "primary");
    }

    @Test
    void sincronizarTarea_sinVinculoPrevio_creaEventoYGuardaVinculo() throws IOException {
        when(vinculoRepository.findByEntidadTipoAndEntidadId("TAREA", 1L)).thenReturn(Optional.empty());
        when(calendarService.crearEvento(any(), any(), any(), any(), any()))
                .thenReturn("evento-google-123");

        var dto = new SincronizarRequestDto();
        dto.setTitulo("Mi tarea");
        dto.setDescripcion("Descripcion de la tarea");
        dto.setFechaInicio("2026-07-01");
        dto.setFechaFin("2026-07-05");

        var resultado = sincronizacionService.sincronizarTarea(1L, dto);

        assertEquals("evento-google-123", resultado.getId());
        assertEquals("Mi tarea", resultado.getTitulo());
        assertEquals("TAREA", resultado.getEntidadTipo());
        assertEquals(1L, resultado.getEntidadId());

        var captor = ArgumentCaptor.forClass(VinculoCalendario.class);
        verify(vinculoRepository).save(captor.capture());
        var vinculoGuardado = captor.getValue();
        assertEquals("TAREA", vinculoGuardado.getEntidadTipo());
        assertEquals(1L, vinculoGuardado.getEntidadId());
        assertEquals("evento-google-123", vinculoGuardado.getIdEventoGoogle());
    }

    @Test
    void sincronizarTarea_conVinculoPrevio_actualizaEvento() throws IOException {
        var vinculoExistente = VinculoCalendario.builder()
                .id(1L).entidadTipo("TAREA").entidadId(1L)
                .idEventoGoogle("evento-existente").calendarId("primary")
                .build();
        when(vinculoRepository.findByEntidadTipoAndEntidadId("TAREA", 1L))
                .thenReturn(Optional.of(vinculoExistente));

        var dto = new SincronizarRequestDto();
        dto.setTitulo("Tarea actualizada");
        dto.setFechaInicio("2026-08-01");

        var resultado = sincronizacionService.sincronizarTarea(1L, dto);

        assertEquals("evento-existente", resultado.getId());
        assertEquals("Tarea actualizada", resultado.getTitulo());
        verify(calendarService).actualizarEvento(eq("evento-existente"), any(), any(), any(), any(), any());
    }

    @Test
    void eliminarSincronizacion_sinVinculo_lanzaExcepcion() {
        when(vinculoRepository.findByEntidadTipoAndEntidadId("TAREA", 999L)).thenReturn(Optional.empty());

        var ex = assertThrows(RuntimeException.class,
                () -> sincronizacionService.eliminarSincronizacion("TAREA", 999L));
        assertTrue(ex.getMessage().contains("No existe vinculacion"));
    }

    @Test
    void sincronizarProyecto_sinVinculoPrevio_creaEvento() throws IOException {
        when(vinculoRepository.findByEntidadTipoAndEntidadId("PROYECTO", 5L)).thenReturn(Optional.empty());
        when(calendarService.crearEvento(any(), any(), any(), any(), any()))
                .thenReturn("evento-proyecto-456");

        var dto = new SincronizarRequestDto();
        dto.setTitulo("Proyecto Alpha");
        dto.setFechaInicio("2026-01-01");
        dto.setFechaFin("2026-12-31");

        var resultado = sincronizacionService.sincronizarProyecto(5L, dto);

        assertEquals("evento-proyecto-456", resultado.getId());
        assertEquals("PROYECTO", resultado.getEntidadTipo());
        assertEquals(5L, resultado.getEntidadId());
    }
}
