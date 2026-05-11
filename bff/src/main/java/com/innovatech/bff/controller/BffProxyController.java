package com.innovatech.bff.controller;

import com.innovatech.bff.service.ProxyBffServicio;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class BffProxyController {

    private final ProxyBffServicio proxyBffServicio;

    public BffProxyController(ProxyBffServicio proxyBffServicio) {
        this.proxyBffServicio = proxyBffServicio;
    }

    @RequestMapping("/api/**")
    public ResponseEntity<byte[]> reenviarApi(HttpServletRequest request, @RequestBody(required = false) byte[] cuerpo) {
        try {
            return proxyBffServicio.reenviar(request, cuerpo);
        } catch (IllegalArgumentException error) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error.getMessage().getBytes());
        } catch (IOException error) {
            String mensaje = "No fue posible conectar con el microservicio destino: " + error.getMessage();
            return ResponseEntity
                    .status(HttpStatus.BAD_GATEWAY)
                    .body(mensaje.getBytes());
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
            String mensaje = "La solicitud al microservicio destino fue interrumpida.";
            return ResponseEntity
                    .status(HttpStatus.GATEWAY_TIMEOUT)
                    .body(mensaje.getBytes());
        } catch (Exception error) {
            String mensaje = "Error interno del BFF: " + error.getMessage();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(mensaje.getBytes());
        }
    }
}
