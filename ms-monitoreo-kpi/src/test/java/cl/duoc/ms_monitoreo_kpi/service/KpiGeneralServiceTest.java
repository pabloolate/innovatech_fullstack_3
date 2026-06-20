package cl.duoc.ms_monitoreo_kpi.service;

import cl.duoc.ms_monitoreo_kpi.dto.KpiGeneralRequestDto;
import cl.duoc.ms_monitoreo_kpi.model.KpiGeneral;
import cl.duoc.ms_monitoreo_kpi.repository.KpiGeneralRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KpiGeneralServiceTest {

    @Mock
    private KpiGeneralRepository kpiGeneralRepository;

    @InjectMocks
    private KpiGeneralService kpiGeneralService;

    @Test
    void deberiaCrearKpiYActualizarYLanzarErrorSiNoExiste() {
        when(kpiGeneralRepository.save(any(KpiGeneral.class))).thenAnswer(inv -> {
            KpiGeneral k = inv.getArgument(0);
            k.setId(1L);
            return k;
        });

        KpiGeneralRequestDto dto = new KpiGeneralRequestDto();
        dto.setPeriodo("2026-Q1");
        dto.setCantidadProyectosActivos(5);
        dto.setCantidadProyectosFinalizados(3);
        dto.setCantidadRecursosActivos(12);
        dto.setPromedioAvanceProyectos(new BigDecimal("67.50"));
        dto.setPromedioOcupacionRecursos(new BigDecimal("82.30"));
        dto.setCantidadIncidenciasAbiertas(2);
        dto.setFechaCalculo(LocalDateTime.of(2026, 3, 15, 10, 30));

        KpiGeneral creado = kpiGeneralService.crear(dto);
        assertEquals("2026-Q1", creado.getPeriodo());
        assertEquals(5, creado.getCantidadProyectosActivos());
        assertEquals(new BigDecimal("67.50"), creado.getPromedioAvanceProyectos());
        verify(kpiGeneralRepository).save(any(KpiGeneral.class));

        when(kpiGeneralRepository.findById(1L)).thenReturn(Optional.of(creado));
        when(kpiGeneralRepository.findById(999L)).thenReturn(Optional.empty());

        KpiGeneralRequestDto actualizado = new KpiGeneralRequestDto();
        actualizado.setPeriodo("2026-Q2");
        actualizado.setCantidadProyectosActivos(8);
        actualizado.setCantidadProyectosFinalizados(5);
        actualizado.setCantidadRecursosActivos(15);
        actualizado.setPromedioAvanceProyectos(new BigDecimal("75.00"));
        actualizado.setPromedioOcupacionRecursos(new BigDecimal("90.00"));
        actualizado.setCantidadIncidenciasAbiertas(1);
        actualizado.setFechaCalculo(LocalDateTime.of(2026, 6, 15, 10, 30));

        when(kpiGeneralRepository.save(any(KpiGeneral.class))).thenAnswer(inv -> inv.getArgument(0));

        var resultado = kpiGeneralService.actualizar(1L, actualizado);
        assertEquals("2026-Q2", resultado.getPeriodo());
        assertEquals(8, resultado.getCantidadProyectosActivos());

        Exception ex = assertThrows(RuntimeException.class, () -> kpiGeneralService.actualizar(999L, actualizado));
        assertTrue(ex.getMessage().contains("no encontrado"));
    }
}
