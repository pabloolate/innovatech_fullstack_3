package com.innovatech.bff.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.http.HttpClient;
import java.time.Duration;

@Configuration
public class HttpClientConfig {

    @Bean
    public HttpClient httpClient(@Value("${bff.http.timeout-segundos:20}") int timeoutSegundos) {
        return HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(timeoutSegundos))
                .version(HttpClient.Version.HTTP_1_1)
                .build();
    }
}
