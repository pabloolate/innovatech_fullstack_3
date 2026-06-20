package cl.duoc.ms_recursos.service;

import cl.duoc.ms_recursos.dto.CrearAsignacionDto;
import cl.duoc.ms_recursos.model.AsignacionRecurso;
import cl.duoc.ms_recursos.model.EstadoAsignacion;
import cl.duoc.ms_recursos.model.Recurso;
import cl.duoc.ms_recursos.repository.AsignacionRecursoRepository;
import cl.duoc.ms_recursos.repository.DisponibilidadRecursoRepository;
import cl.duoc.ms_recursos.repository.RecursoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AsignacionServiceTest {

    @Mock
    private RecursoRepository recursoRepository;

    @Mock
    private AsignacionRecursoRepository asignacionRecursoRepository;

    @Mock
    private DisponibilidadRecursoRepository disponibilidadRecursoRepository;

    @InjectMocks
    private RecursoService recursoService;

    @Test
    void deberiaCrearAsignacionSiRecursoExisteYLanzarErrorSiNo() {
        Recurso recurso = Recurso.builder().id(1L).nombres("Pedro").apellidos("Soto").build();
        when(recursoRepository.findById(1L)).thenReturn(Optional.of(recurso));
        when(recursoRepository.findById(999L)).thenReturn(Optional.empty());
        when(asignacionRecursoRepository.save(any(AsignacionRecurso.class))).thenAnswer(inv -> {
            AsignacionRecurso a = inv.getArgument(0);
            a.setId(1L);
            return a;
        });

        CrearAsignacionDto dto = new CrearAsignacionDto();
        dto.setIdRecurso(1L);
        dto.setIdProyecto(5L);
        dto.setPorcentajeAsignacion(50);
        dto.setHorasAsignadasSemanales(20);
        dto.setFechaInicio(LocalDate.of(2026, 1, 15));
        dto.setEstado(EstadoAsignacion.ACTIVA);
        dto.setActivo(true);

        var resultado = recursoService.crearAsignacion(dto);
        assertEquals(5L, resultado.getIdProyecto());
        assertEquals(20, resultado.getHorasAsignadasSemanales());
        assertEquals(EstadoAsignacion.ACTIVA, resultado.getEstado());
        verify(asignacionRecursoRepository).save(any(AsignacionRecurso.class));

        CrearAsignacionDto dtoError = new CrearAsignacionDto();
        dtoError.setIdRecurso(999L);

        Exception ex = assertThrows(RuntimeException.class, () -> recursoService.crearAsignacion(dtoError));
        assertTrue(ex.getMessage().contains("no encontrado"));
    }
}
