package cl.duoc.ms_proyectos.controller;

import cl.duoc.ms_proyectos.dto.ParticipanteProyectoRequestDto;
import cl.duoc.ms_proyectos.dto.ParticipanteProyectoResponseDto;
import cl.duoc.ms_proyectos.service.ParticipanteProyectoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participantes-proyecto")
public class ParticipanteProyectoController {

    private final ParticipanteProyectoService participanteProyectoService;

    public ParticipanteProyectoController(ParticipanteProyectoService participanteProyectoService) {
        this.participanteProyectoService = participanteProyectoService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<List<ParticipanteProyectoResponseDto>> listarTodos() {
        return ResponseEntity.ok(participanteProyectoService.listarTodos());
    }

    @GetMapping("/proyecto/{idProyecto}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<List<ParticipanteProyectoResponseDto>> listarPorProyecto(@PathVariable Long idProyecto) {
        return ResponseEntity.ok(participanteProyectoService.listarPorProyecto(idProyecto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<ParticipanteProyectoResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(participanteProyectoService.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<ParticipanteProyectoResponseDto> crear(@Valid @RequestBody ParticipanteProyectoRequestDto dto) {
        return ResponseEntity.ok(participanteProyectoService.crear(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<ParticipanteProyectoResponseDto> actualizar(@PathVariable Long id, @Valid @RequestBody ParticipanteProyectoRequestDto dto) {
        return ResponseEntity.ok(participanteProyectoService.actualizar(id, dto));
    }

    @PatchMapping("/{id}/activar")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<ParticipanteProyectoResponseDto> activar(@PathVariable Long id) {
        return ResponseEntity.ok(participanteProyectoService.activar(id));
    }

    @PatchMapping("/{id}/desactivar")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and (authentication.principal.perfil == 'GESTOR' or authentication.principal.perfil == 'LIDER_PROYECTO'))")
    public ResponseEntity<ParticipanteProyectoResponseDto> desactivar(@PathVariable Long id) {
        return ResponseEntity.ok(participanteProyectoService.desactivar(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and authentication.principal.perfil == 'GESTOR')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        participanteProyectoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
