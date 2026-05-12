package cl.duoc.ms_recursos.controller;

import cl.duoc.ms_recursos.dto.ActualizarAsignacionDto;
import cl.duoc.ms_recursos.dto.AsignacionRespuestaDto;
import cl.duoc.ms_recursos.dto.CrearAsignacionDto;
import cl.duoc.ms_recursos.service.RecursoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asignaciones-recurso")
@PreAuthorize("hasRole('ADMIN') or hasAuthority('PERFIL_GESTOR') or hasAuthority('PERFIL_JEFE_PROYECTO')")
public class AsignacionRecursoController {

    private final RecursoService recursoService;

    public AsignacionRecursoController(RecursoService recursoService) {
        this.recursoService = recursoService;
    }

    @GetMapping
    public ResponseEntity<List<AsignacionRespuestaDto>> listarAsignaciones() {
        return ResponseEntity.ok(recursoService.listarAsignaciones());
    }

    @GetMapping("/recurso/{idRecurso}")
    public ResponseEntity<List<AsignacionRespuestaDto>> listarAsignacionesPorRecurso(@PathVariable Long idRecurso) {
        return ResponseEntity.ok(recursoService.listarAsignacionesPorRecurso(idRecurso));
    }

    @PostMapping
    public ResponseEntity<AsignacionRespuestaDto> crearAsignacion(@Valid @RequestBody CrearAsignacionDto dto) {
        return ResponseEntity.ok(recursoService.crearAsignacion(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsignacionRespuestaDto> actualizarAsignacion(@PathVariable Long id,
                                                                       @Valid @RequestBody ActualizarAsignacionDto dto) {
        return ResponseEntity.ok(recursoService.actualizarAsignacion(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAsignacion(@PathVariable Long id) {
        recursoService.eliminarAsignacion(id);
        return ResponseEntity.noContent().build();
    }
}
