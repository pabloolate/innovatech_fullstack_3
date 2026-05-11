package com.innovatech.bff.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Enumeration;
import java.util.Locale;
import java.util.Set;

@Service
public class ProxyBffServicio {

    private static final Set<String> HEADERS_NO_REENVIABLES = Set.of(
            "host",
            "connection",
            "content-length",
            "transfer-encoding",
            "upgrade",
            "proxy-authenticate",
            "proxy-authorization",
            "te",
            "trailer"
    );

    private static final Set<String> HEADERS_RESPUESTA_NO_REENVIABLES = Set.of(
            "connection",
            "content-length",
            "transfer-encoding",
            "upgrade",
            "proxy-authenticate",
            "proxy-authorization",
            "te",
            "trailer"
    );

    private final HttpClient httpClient;
    private final RuteadorServicio ruteadorServicio;

    public ProxyBffServicio(HttpClient httpClient, RuteadorServicio ruteadorServicio) {
        this.httpClient = httpClient;
        this.ruteadorServicio = ruteadorServicio;
    }

    public ResponseEntity<byte[]> reenviar(HttpServletRequest request, byte[] cuerpo)
            throws IOException, InterruptedException {

        String rutaOriginal = request.getRequestURI();
        String queryString = request.getQueryString();
        String urlBaseDestino = ruteadorServicio.resolverUrlBase(rutaOriginal);
        String urlDestino = construirUrlDestino(urlBaseDestino, rutaOriginal, queryString);

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(urlDestino))
                .timeout(Duration.ofSeconds(30));

        copiarHeadersEntrada(request, builder);
        builder.method(request.getMethod(), crearBodyPublisher(request.getMethod(), cuerpo));

        HttpResponse<byte[]> respuesta = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofByteArray());

        HttpHeaders headersRespuesta = new HttpHeaders();
        respuesta.headers().map().forEach((nombreHeader, valores) -> {
            if (!esHeaderRespuestaBloqueado(nombreHeader)) {
                valores.forEach(valor -> headersRespuesta.add(nombreHeader, valor));
            }
        });

        return ResponseEntity
                .status(HttpStatusCode.valueOf(respuesta.statusCode()))
                .headers(headersRespuesta)
                .body(respuesta.body());
    }

    private String construirUrlDestino(String urlBaseDestino, String rutaOriginal, String queryString) {
        StringBuilder url = new StringBuilder(urlBaseDestino).append(rutaOriginal);
        if (queryString != null && !queryString.isBlank()) {
            url.append('?').append(queryString);
        }
        return url.toString();
    }

    private void copiarHeadersEntrada(HttpServletRequest request, HttpRequest.Builder builder) {
        Enumeration<String> nombresHeaders = request.getHeaderNames();

        while (nombresHeaders.hasMoreElements()) {
            String nombreHeader = nombresHeaders.nextElement();

            if (esHeaderEntradaBloqueado(nombreHeader)) {
                continue;
            }

            Enumeration<String> valores = request.getHeaders(nombreHeader);
            while (valores.hasMoreElements()) {
                builder.header(nombreHeader, valores.nextElement());
            }
        }
    }

    private HttpRequest.BodyPublisher crearBodyPublisher(String metodo, byte[] cuerpo) {
        boolean metodoPermiteCuerpo = "POST".equalsIgnoreCase(metodo)
                || "PUT".equalsIgnoreCase(metodo)
                || "PATCH".equalsIgnoreCase(metodo);

        if (!metodoPermiteCuerpo) {
            return HttpRequest.BodyPublishers.noBody();
        }

        if (cuerpo == null || cuerpo.length == 0) {
            return HttpRequest.BodyPublishers.noBody();
        }

        return HttpRequest.BodyPublishers.ofByteArray(cuerpo);
    }

    private boolean esHeaderEntradaBloqueado(String nombreHeader) {
        return nombreHeader == null
                || HEADERS_NO_REENVIABLES.contains(nombreHeader.toLowerCase(Locale.ROOT));
    }

    private boolean esHeaderRespuestaBloqueado(String nombreHeader) {
        return nombreHeader == null
                || HEADERS_RESPUESTA_NO_REENVIABLES.contains(nombreHeader.toLowerCase(Locale.ROOT));
    }
}
