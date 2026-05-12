package cl.duoc.ms_monitoreo_kpi.controller;

import cl.duoc.ms_monitoreo_kpi.dto.KpiRecursoRequestDto;
import cl.duoc.ms_monitoreo_kpi.model.KpiRecurso;
import cl.duoc.ms_monitoreo_kpi.service.KpiRecursoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kpi-recurso")
public class KpiRecursoController {

    private final KpiRecursoService kpiRecursoService;

    public KpiRecursoController(KpiRecursoService kpiRecursoService) {
        this.kpiRecursoService = kpiRecursoService;
    }

    @GetMapping
    public ResponseEntity<List<KpiRecurso>> listarTodos() {
        return ResponseEntity.ok(kpiRecursoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KpiRecurso> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(kpiRecursoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<KpiRecurso> crear(@Valid @RequestBody KpiRecursoRequestDto dto) {
        return ResponseEntity.ok(kpiRecursoService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<KpiRecurso> actualizar(@PathVariable Long id, @Valid @RequestBody KpiRecursoRequestDto dto) {
        return ResponseEntity.ok(kpiRecursoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        kpiRecursoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
