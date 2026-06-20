package cl.duoc.ms_recursos.service;

import cl.duoc.ms_recursos.dto.CrearRecursoDto;
import cl.duoc.ms_recursos.model.Recurso;
import cl.duoc.ms_recursos.repository.AsignacionRecursoRepository;
import cl.duoc.ms_recursos.repository.DisponibilidadRecursoRepository;
import cl.duoc.ms_recursos.repository.RecursoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecursoServiceTest {

    @Mock
    private RecursoRepository recursoRepository;

    @Mock
    private AsignacionRecursoRepository asignacionRecursoRepository;

    @Mock
    private DisponibilidadRecursoRepository disponibilidadRecursoRepository;

    @InjectMocks
    private RecursoService recursoService;

    @Test
    void deberiaCrearRecursoConDatosUnicosYLanzarErrorSiDuplicado() {
        when(recursoRepository.existsByIdUsuario(10L)).thenReturn(false);
        when(recursoRepository.existsByCorreo("pedro@mail.com")).thenReturn(false);
        when(recursoRepository.save(any(Recurso.class))).thenAnswer(inv -> {
            Recurso r = inv.getArgument(0);
            r.setId(1L);
            return r;
        });

        CrearRecursoDto dto = new CrearRecursoDto();
        dto.setIdUsuario(10L);
        dto.setNombres("Pedro");
        dto.setApellidos("Soto");
        dto.setCorreo("pedro@mail.com");
        dto.setPerfil("DESARROLLADOR");
        dto.setEspecialidad("Java");
        dto.setCapacidadHorasSemanales(40);
        dto.setActivo(true);

        var resultado = recursoService.crearRecurso(dto);
        assertEquals("Pedro", resultado.getNombres());
        assertEquals("Soto", resultado.getApellidos());
        assertEquals(40, resultado.getCapacidadHorasSemanales());
        verify(recursoRepository).save(any(Recurso.class));

        when(recursoRepository.existsByIdUsuario(99L)).thenReturn(true);
        CrearRecursoDto dtoError = new CrearRecursoDto();
        dtoError.setIdUsuario(99L);

        Exception ex = assertThrows(RuntimeException.class, () -> recursoService.crearRecurso(dtoError));
        assertTrue(ex.getMessage().contains("Ya existe un recurso para el idUsuario"));
    }
}
