package com.innovatech.bff.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;

import com.innovatech.bff.service.ProxyBffServicio;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class BffProxyControllerTest {

    @Test
    void reenviarApi_excepciones_retornaCodigoHttpCorrecto() throws Exception {
        var mockServicio = mock(ProxyBffServicio.class);
        var controller = new BffProxyController(mockServicio);
        var request = mock(HttpServletRequest.class);

        doThrow(new IllegalArgumentException("No existe microservicio"))
                .when(mockServicio).reenviar(any(), any());
        assertEquals(HttpStatus.NOT_FOUND,
                controller.reenviarApi(request, null).getStatusCode());

        doThrow(new IOException("Connection refused"))
                .when(mockServicio).reenviar(any(), any());
        assertEquals(HttpStatus.BAD_GATEWAY,
                controller.reenviarApi(request, null).getStatusCode());

        doThrow(new InterruptedException("Timeout"))
                .when(mockServicio).reenviar(any(), any());
        assertEquals(HttpStatus.GATEWAY_TIMEOUT,
                controller.reenviarApi(request, null).getStatusCode());
    }
}
