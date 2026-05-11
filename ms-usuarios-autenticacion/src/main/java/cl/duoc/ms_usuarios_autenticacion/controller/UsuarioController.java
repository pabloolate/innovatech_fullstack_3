package cl.duoc.ms_usuarios_autenticacion.controller;

import cl.duoc.ms_usuarios_autenticacion.dto.ActualizarUsuarioDto;
import cl.duoc.ms_usuarios_autenticacion.dto.CrearUsuarioDto;
import cl.duoc.ms_usuarios_autenticacion.dto.UsuarioRespuestaDto;
import cl.duoc.ms_usuarios_autenticacion.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioRespuestaDto>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioRespuestaDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioRespuestaDto> crear(@Valid @RequestBody CrearUsuarioDto dto) {
        return ResponseEntity.ok(usuarioService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioRespuestaDto> actualizar(@PathVariable Long id,
                                                          @Valid @RequestBody ActualizarUsuarioDto dto) {
        return ResponseEntity.ok(usuarioService.actualizar(id, dto));
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<UsuarioRespuestaDto> activar(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.activar(id));
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<UsuarioRespuestaDto> desactivar(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.desactivar(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}