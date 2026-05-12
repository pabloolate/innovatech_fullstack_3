package cl.duoc.ms_monitoreo_kpi.controller;

import cl.duoc.ms_monitoreo_kpi.dto.KpiGeneralRequestDto;
import cl.duoc.ms_monitoreo_kpi.model.KpiGeneral;
import cl.duoc.ms_monitoreo_kpi.service.KpiGeneralService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kpi-general")
public class KpiGeneralController {

    private final KpiGeneralService kpiGeneralService;

    public KpiGeneralController(KpiGeneralService kpiGeneralService) {
        this.kpiGeneralService = kpiGeneralService;
    }

    @GetMapping
    public ResponseEntity<List<KpiGeneral>> listarTodos() {
        return ResponseEntity.ok(kpiGeneralService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KpiGeneral> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(kpiGeneralService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<KpiGeneral> crear(@Valid @RequestBody KpiGeneralRequestDto dto) {
        return ResponseEntity.ok(kpiGeneralService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<KpiGeneral> actualizar(@PathVariable Long id, @Valid @RequestBody KpiGeneralRequestDto dto) {
        return ResponseEntity.ok(kpiGeneralService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        kpiGeneralService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
