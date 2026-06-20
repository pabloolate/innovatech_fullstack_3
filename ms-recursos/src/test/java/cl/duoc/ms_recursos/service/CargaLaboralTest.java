package cl.duoc.ms_recursos.service;

import cl.duoc.ms_recursos.model.Recurso;
import cl.duoc.ms_recursos.repository.AsignacionRecursoRepository;
import cl.duoc.ms_recursos.repository.DisponibilidadRecursoRepository;
import cl.duoc.ms_recursos.repository.RecursoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CargaLaboralTest {

    @Mock
    private RecursoRepository recursoRepository;

    @Mock
    private AsignacionRecursoRepository asignacionRecursoRepository;

    @Mock
    private DisponibilidadRecursoRepository disponibilidadRecursoRepository;

    @InjectMocks
    private RecursoService recursoService;

    @Test
    void deberiaCalcularCargaLaboralCorrectamente() {
        Recurso recurso = Recurso.builder()
                .id(1L).nombres("Ana").apellidos("Lopez")
                .capacidadHorasSemanales(40).activo(true).build();

        when(recursoRepository.findById(1L)).thenReturn(Optional.of(recurso));
        when(asignacionRecursoRepository.sumarHorasActivasPorRecurso(1L)).thenReturn(30);

        var carga = recursoService.obtenerCargaLaboral(1L);

        assertEquals("Ana Lopez", carga.getNombreRecurso());
        assertEquals(40, carga.getCapacidadHorasSemanales());
        assertEquals(30, carga.getHorasAsignadasActivas());
        assertEquals(75, carga.getPorcentajeOcupacion());
        assertEquals(10, carga.getHorasDisponibles());
    }
}
