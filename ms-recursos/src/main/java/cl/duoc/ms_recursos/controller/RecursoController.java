package cl.duoc.ms_recursos.controller;

import cl.duoc.ms_recursos.dto.*;
import cl.duoc.ms_recursos.service.RecursoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recursos")
@PreAuthorize("hasRole('ADMIN') or hasAuthority('PERFIL_GESTOR') or hasAuthority('PERFIL_JEFE_PROYECTO')")
public class RecursoController {

    private final RecursoService recursoService;

    public RecursoController(RecursoService recursoService) {
        this.recursoService = recursoService;
    }

    @GetMapping
    public ResponseEntity<List<RecursoRespuestaDto>> listarRecursos() {
        return ResponseEntity.ok(recursoService.listarRecursos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecursoRespuestaDto> buscarRecursoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(recursoService.buscarRecursoPorId(id));
    }

    @PostMapping
    public ResponseEntity<RecursoRespuestaDto> crearRecurso(@Valid @RequestBody CrearRecursoDto dto) {
        return ResponseEntity.ok(recursoService.crearRecurso(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecursoRespuestaDto> actualizarRecurso(@PathVariable Long id,
                                                                 @Valid @RequestBody ActualizarRecursoDto dto) {
        return ResponseEntity.ok(recursoService.actualizarRecurso(id, dto));
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<RecursoRespuestaDto> activarRecurso(@PathVariable Long id) {
        return ResponseEntity.ok(recursoService.activarRecurso(id));
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<RecursoRespuestaDto> desactivarRecurso(@PathVariable Long id) {
        return ResponseEntity.ok(recursoService.desactivarRecurso(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRecurso(@PathVariable Long id) {
        recursoService.eliminarRecurso(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/carga-laboral")
    public ResponseEntity<CargaLaboralRespuestaDto> obtenerCargaLaboral(@PathVariable Long id) {
        return ResponseEntity.ok(recursoService.obtenerCargaLaboral(id));
    }
}
