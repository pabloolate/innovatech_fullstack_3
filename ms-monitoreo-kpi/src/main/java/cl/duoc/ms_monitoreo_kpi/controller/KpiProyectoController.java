package cl.duoc.ms_monitoreo_kpi.controller;

import cl.duoc.ms_monitoreo_kpi.dto.KpiProyectoRequestDto;
import cl.duoc.ms_monitoreo_kpi.model.KpiProyecto;
import cl.duoc.ms_monitoreo_kpi.service.KpiProyectoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kpi-proyecto")
public class KpiProyectoController {

    private final KpiProyectoService kpiProyectoService;

    public KpiProyectoController(KpiProyectoService kpiProyectoService) {
        this.kpiProyectoService = kpiProyectoService;
    }

    @GetMapping
    public ResponseEntity<List<KpiProyecto>> listarTodos() {
        return ResponseEntity.ok(kpiProyectoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KpiProyecto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(kpiProyectoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<KpiProyecto> crear(@Valid @RequestBody KpiProyectoRequestDto dto) {
        return ResponseEntity.ok(kpiProyectoService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<KpiProyecto> actualizar(@PathVariable Long id, @Valid @RequestBody KpiProyectoRequestDto dto) {
        return ResponseEntity.ok(kpiProyectoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        kpiProyectoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
