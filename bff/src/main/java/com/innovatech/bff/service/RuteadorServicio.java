package com.innovatech.bff.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RuteadorServicio {

    private final String urlUsuarios;
    private final String urlProyectos;
    private final String urlRecursos;
    private final String urlMonitoreo;
    private final String urlCalendario;

    public RuteadorServicio(
            @Value("${servicios.usuarios.url}") String urlUsuarios,
            @Value("${servicios.proyectos.url}") String urlProyectos,
            @Value("${servicios.recursos.url}") String urlRecursos,
            @Value("${servicios.monitoreo.url}") String urlMonitoreo,
            @Value("${servicios.calendario.url}") String urlCalendario
    ) {
        this.urlUsuarios = limpiarUrlBase(urlUsuarios);
        this.urlProyectos = limpiarUrlBase(urlProyectos);
        this.urlRecursos = limpiarUrlBase(urlRecursos);
        this.urlMonitoreo = limpiarUrlBase(urlMonitoreo);
        this.urlCalendario = limpiarUrlBase(urlCalendario);
    }

    public String resolverUrlBase(String ruta) {
        if (ruta == null || ruta.isBlank()) {
            throw new IllegalArgumentException("Ruta vacía para resolver microservicio destino.");
        }

        if (ruta.startsWith("/api/auth") || ruta.startsWith("/api/usuarios")) {
            return urlUsuarios;
        }

        if (ruta.startsWith("/api/proyectos")
                || ruta.startsWith("/api/tareas")
                || ruta.startsWith("/api/participantes-proyecto")) {
            return urlProyectos;
        }

        if (ruta.startsWith("/api/recursos")
                || ruta.startsWith("/api/asignaciones-recurso")
                || ruta.startsWith("/api/disponibilidades-recurso")) {
            return urlRecursos;
        }

        if (ruta.startsWith("/api/kpi-general")
                || ruta.startsWith("/api/kpi-proyecto")
                || ruta.startsWith("/api/kpi-recurso")
                || ruta.startsWith("/api/reportes-generados")) {
            return urlMonitoreo;
        }

        if (ruta.startsWith("/api/calendario")) {
            return urlCalendario;
        }

        throw new IllegalArgumentException("No existe microservicio configurado para la ruta: " + ruta);
    }

    private String limpiarUrlBase(String urlBase) {
        if (urlBase == null || urlBase.isBlank()) {
            throw new IllegalArgumentException("URL base de microservicio no configurada.");
        }

        String limpia = urlBase.trim();
        while (limpia.endsWith("/")) {
            limpia = limpia.substring(0, limpia.length() - 1);
        }
        return limpia;
    }
}
