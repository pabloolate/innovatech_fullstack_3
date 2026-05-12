package cl.duoc.ms_monitoreo_kpi.controller;

import cl.duoc.ms_monitoreo_kpi.dto.ReporteGeneradoRequestDto;
import cl.duoc.ms_monitoreo_kpi.model.ReporteGenerado;
import cl.duoc.ms_monitoreo_kpi.service.ReporteGeneradoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes-generados")
public class ReporteGeneradoController {

    private final ReporteGeneradoService reporteGeneradoService;

    public ReporteGeneradoController(ReporteGeneradoService reporteGeneradoService) {
        this.reporteGeneradoService = reporteGeneradoService;
    }

    @GetMapping
    public ResponseEntity<List<ReporteGenerado>> listarTodos() {
        return ResponseEntity.ok(reporteGeneradoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReporteGenerado> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(reporteGeneradoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ReporteGenerado> crear(@Valid @RequestBody ReporteGeneradoRequestDto dto) {
        return ResponseEntity.ok(reporteGeneradoService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReporteGenerado> actualizar(@PathVariable Long id, @Valid @RequestBody ReporteGeneradoRequestDto dto) {
        return ResponseEntity.ok(reporteGeneradoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        reporteGeneradoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
