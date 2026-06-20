package cl.duoc.ms_proyectos.service;

import cl.duoc.ms_proyectos.dto.ProyectoRequestDto;
import cl.duoc.ms_proyectos.model.EstadoProyecto;
import cl.duoc.ms_proyectos.model.Proyecto;
import cl.duoc.ms_proyectos.repository.ProyectoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProyectoServiceTest {

    @Mock
    private ProyectoRepository proyectoRepository;

    @InjectMocks
    private ProyectoService proyectoService;

    @Test
    void deberiaDesactivarProyectoExistenteYLanzarErrorSiNoExiste() {
        Proyecto proyecto = Proyecto.builder()
                .id(1L).nombre("Innovatech").estado(EstadoProyecto.EN_EJECUCION)
                .porcentajeAvance(50).activo(true).build();

        when(proyectoRepository.findById(1L)).thenReturn(Optional.of(proyecto));
        when(proyectoRepository.findById(999L)).thenReturn(Optional.empty());
        when(proyectoRepository.save(any(Proyecto.class))).thenAnswer(inv -> inv.getArgument(0));

        var resultado = proyectoService.desactivar(1L);
        assertFalse(resultado.getActivo());
        assertEquals("Innovatech", resultado.getNombre());

        Exception ex = assertThrows(RuntimeException.class, () -> proyectoService.desactivar(999L));
        assertTrue(ex.getMessage().contains("no encontrado"));
    }
}
