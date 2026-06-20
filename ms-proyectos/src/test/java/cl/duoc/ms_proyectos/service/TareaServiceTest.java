package cl.duoc.ms_proyectos.service;

import cl.duoc.ms_proyectos.dto.TareaRequestDto;
import cl.duoc.ms_proyectos.model.EstadoTarea;
import cl.duoc.ms_proyectos.model.PrioridadTarea;
import cl.duoc.ms_proyectos.model.Tarea;
import cl.duoc.ms_proyectos.repository.ProyectoRepository;
import cl.duoc.ms_proyectos.repository.TareaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TareaServiceTest {

    @Mock
    private TareaRepository tareaRepository;

    @Mock
    private ProyectoRepository proyectoRepository;

    @InjectMocks
    private TareaService tareaService;

    @Test
    void deberiaCrearTareaSiProyectoExisteYLanzarErrorSiNo() {
        when(proyectoRepository.existsById(1L)).thenReturn(true);
        when(proyectoRepository.existsById(999L)).thenReturn(false);
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(inv -> {
            Tarea t = inv.getArgument(0);
            t.setId(1L);
            return t;
        });

        TareaRequestDto dto = new TareaRequestDto();
        dto.setIdProyecto(1L);
        dto.setTitulo("Login");
        dto.setDescripcion("Implementar login");
        dto.setEstado(EstadoTarea.PENDIENTE);
        dto.setPrioridad(PrioridadTarea.ALTA);
        dto.setPorcentajeAvance(0);
        dto.setActivo(true);

        var resultado = tareaService.crear(dto);

        assertEquals("Login", resultado.getTitulo());
        assertEquals(EstadoTarea.PENDIENTE, resultado.getEstado());
        assertTrue(resultado.getActivo());
        verify(tareaRepository).save(any(Tarea.class));

        TareaRequestDto dtoError = new TareaRequestDto();
        dtoError.setIdProyecto(999L);
        dtoError.setTitulo("Error");

        Exception ex = assertThrows(RuntimeException.class, () -> tareaService.crear(dtoError));
        assertTrue(ex.getMessage().contains("No existe el proyecto"));
    }
}
