package cl.duoc.ms_monitoreo_kpi.service;

import cl.duoc.ms_monitoreo_kpi.dto.ReporteGeneradoRequestDto;
import cl.duoc.ms_monitoreo_kpi.model.ReporteGenerado;
import cl.duoc.ms_monitoreo_kpi.repository.ReporteGeneradoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReporteGeneradoServiceTest {

    @Mock
    private ReporteGeneradoRepository reporteGeneradoRepository;

    @InjectMocks
    private ReporteGeneradoService reporteGeneradoService;

    @Test
    void deberiaCrearReporteConMetadatosYLanzarErrorSiNoExiste() {
        when(reporteGeneradoRepository.save(any(ReporteGenerado.class))).thenAnswer(inv -> {
            ReporteGenerado r = inv.getArgument(0);
            r.setId(1L);
            return r;
        });

        ReporteGeneradoRequestDto dto = new ReporteGeneradoRequestDto();
        dto.setTipoReporte("KPI General");
        dto.setPeriodo("2026-Q1");
        dto.setGeneradoPorUsuario(1L);
        dto.setFormato("PDF");
        dto.setRutaArchivo("/reportes/kpi_2026_q1.pdf");
        dto.setFechaGeneracion(LocalDateTime.of(2026, 3, 15, 14, 30));

        var resultado = reporteGeneradoService.crear(dto);
        assertEquals("KPI General", resultado.getTipoReporte());
        assertEquals("PDF", resultado.getFormato());
        assertEquals("/reportes/kpi_2026_q1.pdf", resultado.getRutaArchivo());
        assertEquals(1L, resultado.getGeneradoPorUsuario());
        verify(reporteGeneradoRepository).save(any(ReporteGenerado.class));

        when(reporteGeneradoRepository.findById(999L)).thenReturn(java.util.Optional.empty());

        Exception ex = assertThrows(RuntimeException.class, () -> reporteGeneradoService.buscarPorId(999L));
        assertTrue(ex.getMessage().contains("no encontrado"));
    }
}
