package cl.duoc.ms_calendario.controller;

import cl.duoc.ms_calendario.dto.EventoCalendarioDto;
import cl.duoc.ms_calendario.dto.SincronizarRequestDto;
import cl.duoc.ms_calendario.model.VinculoCalendario;
import cl.duoc.ms_calendario.service.SincronizacionService;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/calendario")
public class CalendarioController {

    private final SincronizacionService sincronizacionService;

    public CalendarioController(SincronizacionService sincronizacionService) {
        this.sincronizacionService = sincronizacionService;
    }

    @PostMapping("/tareas/{idTarea}/sync")
    public ResponseEntity<EventoCalendarioDto> sincronizarTarea(
            @PathVariable Long idTarea,
            @Valid @RequestBody SincronizarRequestDto dto) {
        try {
            return ResponseEntity.ok(sincronizacionService.sincronizarTarea(idTarea, dto));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/proyectos/{idProyecto}/sync")
    public ResponseEntity<EventoCalendarioDto> sincronizarProyecto(
            @PathVariable Long idProyecto,
            @Valid @RequestBody SincronizarRequestDto dto) {
        try {
            return ResponseEntity.ok(sincronizacionService.sincronizarProyecto(idProyecto, dto));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/tareas/{idTarea}/unsync")
    public ResponseEntity<Void> eliminarSincronizacionTarea(@PathVariable Long idTarea) {
        try {
            sincronizacionService.eliminarSincronizacion("TAREA", idTarea);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/proyectos/{idProyecto}/unsync")
    public ResponseEntity<Void> eliminarSincronizacionProyecto(@PathVariable Long idProyecto) {
        try {
            sincronizacionService.eliminarSincronizacion("PROYECTO", idProyecto);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/eventos")
    public ResponseEntity<List<EventoCalendarioDto>> listarEventos() {
        try {
            return ResponseEntity.ok(sincronizacionService.listarEventos());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/vinculos")
    public ResponseEntity<List<VinculoCalendario>> listarVinculos() {
        return ResponseEntity.ok(sincronizacionService.listarVinculos());
    }
}
