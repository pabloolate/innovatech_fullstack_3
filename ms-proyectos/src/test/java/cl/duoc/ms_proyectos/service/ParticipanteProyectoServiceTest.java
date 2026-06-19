package cl.duoc.ms_proyectos.service;

import cl.duoc.ms_proyectos.dto.ParticipanteProyectoRequestDto;
import cl.duoc.ms_proyectos.model.ParticipanteProyecto;
import cl.duoc.ms_proyectos.model.RolProyecto;
import cl.duoc.ms_proyectos.repository.ParticipanteProyectoRepository;
import cl.duoc.ms_proyectos.repository.ProyectoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ParticipanteProyectoServiceTest {

    @Mock
    private ParticipanteProyectoRepository participanteProyectoRepository;

    @Mock
    private ProyectoRepository proyectoRepository;

    @InjectMocks
    private ParticipanteProyectoService participanteProyectoService;

    @Test
    void deberiaCrearParticipanteSiProyectoExisteYLanzarErrorSiNo() {
        when(proyectoRepository.existsById(1L)).thenReturn(true);
        when(proyectoRepository.existsById(999L)).thenReturn(false);
        when(participanteProyectoRepository.save(any(ParticipanteProyecto.class))).thenAnswer(inv -> {
            ParticipanteProyecto p = inv.getArgument(0);
            p.setId(1L);
            return p;
        });

        ParticipanteProyectoRequestDto dto = new ParticipanteProyectoRequestDto();
        dto.setIdProyecto(1L);
        dto.setIdUsuario(10L);
        dto.setRolEnProyecto(RolProyecto.PARTICIPANTE);
        dto.setActivo(true);

        var resultado = participanteProyectoService.crear(dto);
        assertEquals(1L, resultado.getIdProyecto());
        assertEquals(10L, resultado.getIdUsuario());
        assertTrue(resultado.getActivo());
        verify(participanteProyectoRepository).save(any(ParticipanteProyecto.class));

        ParticipanteProyectoRequestDto dtoError = new ParticipanteProyectoRequestDto();
        dtoError.setIdProyecto(999L);

        Exception ex = assertThrows(RuntimeException.class, () -> participanteProyectoService.crear(dtoError));
        assertTrue(ex.getMessage().contains("No existe el proyecto"));
    }
}
