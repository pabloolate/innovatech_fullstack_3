package com.innovatech.bff.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class RuteadorServicioTest {

    private final RuteadorServicio ruteador = new RuteadorServicio(
            "http://localhost:8081/",
            "http://localhost:8082/",
            "http://localhost:8083/",
            "http://localhost:8084/"
    );

    @Test
    void resolverUrlBase_rutasConocidas_retornaUrlCorrecta() {
        assertEquals("http://localhost:8081", ruteador.resolverUrlBase("/api/auth/login"));
        assertEquals("http://localhost:8081", ruteador.resolverUrlBase("/api/usuarios"));
        assertEquals("http://localhost:8082", ruteador.resolverUrlBase("/api/proyectos"));
        assertEquals("http://localhost:8082", ruteador.resolverUrlBase("/api/tareas"));
        assertEquals("http://localhost:8082", ruteador.resolverUrlBase("/api/participantes-proyecto"));
        assertEquals("http://localhost:8083", ruteador.resolverUrlBase("/api/recursos"));
        assertEquals("http://localhost:8083", ruteador.resolverUrlBase("/api/asignaciones-recurso"));
        assertEquals("http://localhost:8083", ruteador.resolverUrlBase("/api/disponibilidades-recurso"));
        assertEquals("http://localhost:8084", ruteador.resolverUrlBase("/api/kpi-general"));
        assertEquals("http://localhost:8084", ruteador.resolverUrlBase("/api/kpi-proyecto"));
        assertEquals("http://localhost:8084", ruteador.resolverUrlBase("/api/kpi-recurso"));
        assertEquals("http://localhost:8084", ruteador.resolverUrlBase("/api/reportes-generados"));
    }

    @Test
    void resolverUrlBase_rutaInvalida_lanzaExcepcion() {
        assertThrows(IllegalArgumentException.class,
                () -> ruteador.resolverUrlBase("/api/desconocido"));
        assertThrows(IllegalArgumentException.class,
                () -> ruteador.resolverUrlBase(""));
        assertThrows(IllegalArgumentException.class,
                () -> ruteador.resolverUrlBase(null));
    }

    @Test
    void constructor_urlBlanca_lanzaExcepcion() {
        assertThrows(IllegalArgumentException.class,
                () -> new RuteadorServicio("", "http://localhost:8082/",
                        "http://localhost:8083/", "http://localhost:8084/"));
    }
}
