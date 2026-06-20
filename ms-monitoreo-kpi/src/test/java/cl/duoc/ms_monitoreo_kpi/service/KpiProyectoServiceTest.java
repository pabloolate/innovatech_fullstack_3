package cl.duoc.ms_monitoreo_kpi.service;

import cl.duoc.ms_monitoreo_kpi.dto.KpiProyectoRequestDto;
import cl.duoc.ms_monitoreo_kpi.model.KpiProyecto;
import cl.duoc.ms_monitoreo_kpi.repository.KpiProyectoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KpiProyectoServiceTest {

    @Mock
    private KpiProyectoRepository kpiProyectoRepository;

    @InjectMocks
    private KpiProyectoService kpiProyectoService;

    @Test
    void deberiaCrearYEliminarKpiProyectoYLanzarErrorSiNoExiste() {
        when(kpiProyectoRepository.save(any(KpiProyecto.class))).thenAnswer(inv -> {
            KpiProyecto k = inv.getArgument(0);
            k.setId(1L);
            return k;
        });

        KpiProyectoRequestDto dto = new KpiProyectoRequestDto();
        dto.setIdProyecto(1L);
        dto.setPeriodo("2026-Q1");
        dto.setPorcentajeAvance(new BigDecimal("80.00"));
        dto.setCantidadTareas(10);
        dto.setCantidadTareasCompletadas(8);
        dto.setCantidadHitos(5);
        dto.setCantidadHitosCumplidos(4);
        dto.setCantidadIncidenciasAbiertas(1);
        dto.setFechaCalculo(LocalDateTime.of(2026, 3, 15, 10, 0));

        var creado = kpiProyectoService.crear(dto);
        assertEquals(1L, creado.getIdProyecto());
        assertEquals(new BigDecimal("80.00"), creado.getPorcentajeAvance());
        assertEquals(8, creado.getCantidadTareasCompletadas());
        verify(kpiProyectoRepository).save(any(KpiProyecto.class));

        when(kpiProyectoRepository.existsById(1L)).thenReturn(true);

        kpiProyectoService.eliminar(1L);
        verify(kpiProyectoRepository).deleteById(1L);

        when(kpiProyectoRepository.findById(999L)).thenReturn(Optional.empty());

        Exception ex = assertThrows(RuntimeException.class, () -> kpiProyectoService.buscarPorId(999L));
        assertTrue(ex.getMessage().contains("no encontrado"));
    }
}
