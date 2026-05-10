package cl.duoc.ms_proyectos.controller;

import cl.duoc.ms_proyectos.dto.ProyectoRequestDto;
import cl.duoc.ms_proyectos.dto.ProyectoResponseDto;
import cl.duoc.ms_proyectos.service.ProyectoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proyectos")
public class ProyectoController {

    private final ProyectoService proyectoService;

    public ProyectoController(ProyectoService proyectoService) {
        this.proyectoService = proyectoService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<List<ProyectoResponseDto>> listarTodos() {
        return ResponseEntity.ok(proyectoService.listarTodos());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<ProyectoResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(proyectoService.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<ProyectoResponseDto> crear(@Valid @RequestBody ProyectoRequestDto dto) {
        return ResponseEntity.ok(proyectoService.crear(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<ProyectoResponseDto> actualizar(@PathVariable Long id, @Valid @RequestBody ProyectoRequestDto dto) {
        return ResponseEntity.ok(proyectoService.actualizar(id, dto));
    }

    @PatchMapping("/{id}/activar")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<ProyectoResponseDto> activar(@PathVariable Long id) {
        return ResponseEntity.ok(proyectoService.activar(id));
    }

    @PatchMapping("/{id}/desactivar")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<ProyectoResponseDto> desactivar(@PathVariable Long id) {
        return ResponseEntity.ok(proyectoService.desactivar(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and authentication.principal.perfil == 'GESTOR')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        proyectoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
