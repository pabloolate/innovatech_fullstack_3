package cl.duoc.ms_proyectos.controller;

import cl.duoc.ms_proyectos.dto.TareaRequestDto;
import cl.duoc.ms_proyectos.dto.TareaResponseDto;
import cl.duoc.ms_proyectos.service.TareaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    private final TareaService tareaService;

    public TareaController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<List<TareaResponseDto>> listarTodas() {
        return ResponseEntity.ok(tareaService.listarTodas());
    }

    @GetMapping("/proyecto/{idProyecto}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<List<TareaResponseDto>> listarPorProyecto(@PathVariable Long idProyecto) {
        return ResponseEntity.ok(tareaService.listarPorProyecto(idProyecto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<TareaResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tareaService.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<TareaResponseDto> crear(@Valid @RequestBody TareaRequestDto dto) {
        return ResponseEntity.ok(tareaService.crear(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<TareaResponseDto> actualizar(@PathVariable Long id, @Valid @RequestBody TareaRequestDto dto) {
        return ResponseEntity.ok(tareaService.actualizar(id, dto));
    }

    @PatchMapping("/{id}/activar")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<TareaResponseDto> activar(@PathVariable Long id) {
        return ResponseEntity.ok(tareaService.activar(id));
    }

    @PatchMapping("/{id}/desactivar")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<TareaResponseDto> desactivar(@PathVariable Long id) {
        return ResponseEntity.ok(tareaService.desactivar(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and authentication.principal.perfil == 'GESTOR')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tareaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
