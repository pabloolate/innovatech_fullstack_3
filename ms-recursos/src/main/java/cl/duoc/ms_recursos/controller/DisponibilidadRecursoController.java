package cl.duoc.ms_recursos.controller;

import cl.duoc.ms_recursos.dto.ActualizarDisponibilidadDto;
import cl.duoc.ms_recursos.dto.CrearDisponibilidadDto;
import cl.duoc.ms_recursos.dto.DisponibilidadRespuestaDto;
import cl.duoc.ms_recursos.service.RecursoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disponibilidades-recurso")
@PreAuthorize("hasRole('ADMIN') or hasAuthority('PERFIL_GESTOR') or hasAuthority('PERFIL_JEFE_PROYECTO')")
public class DisponibilidadRecursoController {

    private final RecursoService recursoService;

    public DisponibilidadRecursoController(RecursoService recursoService) {
        this.recursoService = recursoService;
    }

    @GetMapping
    public ResponseEntity<List<DisponibilidadRespuestaDto>> listarDisponibilidades() {
        return ResponseEntity.ok(recursoService.listarDisponibilidades());
    }

    @GetMapping("/recurso/{idRecurso}")
    public ResponseEntity<List<DisponibilidadRespuestaDto>> listarDisponibilidadesPorRecurso(@PathVariable Long idRecurso) {
        return ResponseEntity.ok(recursoService.listarDisponibilidadesPorRecurso(idRecurso));
    }

    @PostMapping
    public ResponseEntity<DisponibilidadRespuestaDto> crearDisponibilidad(@Valid @RequestBody CrearDisponibilidadDto dto) {
        return ResponseEntity.ok(recursoService.crearDisponibilidad(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisponibilidadRespuestaDto> actualizarDisponibilidad(@PathVariable Long id,
                                                                               @Valid @RequestBody ActualizarDisponibilidadDto dto) {
        return ResponseEntity.ok(recursoService.actualizarDisponibilidad(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDisponibilidad(@PathVariable Long id) {
        recursoService.eliminarDisponibilidad(id);
        return ResponseEntity.noContent().build();
    }
}
