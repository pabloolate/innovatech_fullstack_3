package cl.duoc.ms_calendario.config;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

@Configuration
public class GoogleCalendarConfig {

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final List<String> SCOPES = List.of("https://www.googleapis.com/auth/calendar");

    private final ResourceLoader resourceLoader;

    public GoogleCalendarConfig(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Bean
    public JsonFactory jsonFactory() {
        return JSON_FACTORY;
    }

    @Bean
    public NetHttpTransport netHttpTransport() throws GeneralSecurityException, IOException {
        return GoogleNetHttpTransport.newTrustedTransport();
    }

    @Bean
    public GoogleCredentials googleCredentials(
            @Value("${app.calendar.service-account-key-location}") String keyLocation)
            throws IOException {

        Resource resource = resourceLoader.getResource(keyLocation);
        try (InputStream in = resource.getInputStream()) {
            return GoogleCredentials.fromStream(in).createScoped(SCOPES);
        }
    }

    @Bean
    public Calendar calendarService(
            NetHttpTransport transport,
            JsonFactory jsonFactory,
            GoogleCredentials credentials,
            @Value("${app.calendar.application-name}") String applicationName) {

        return new Calendar.Builder(transport, jsonFactory, new HttpCredentialsAdapter(credentials))
                .setApplicationName(applicationName)
                .build();
    }
}
