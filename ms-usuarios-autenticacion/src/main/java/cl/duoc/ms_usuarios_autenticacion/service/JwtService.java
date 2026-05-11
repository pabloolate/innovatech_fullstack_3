package cl.duoc.ms_usuarios_autenticacion.service;

import cl.duoc.ms_usuarios_autenticacion.security.UsuarioPrincipal;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    @Value("${app.security.jwt.secret}")
    private String jwtSecret;

    @Value("${app.security.jwt.expiration-ms}")
    private Long jwtExpirationMs;

    private SecretKey secretKey;

    @PostConstruct
    public void inicializar() {
        byte[] keyBytes = Decoders.BASE64.decode(
                java.util.Base64.getEncoder().encodeToString(jwtSecret.getBytes())
        );
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generarToken(UsuarioPrincipal usuarioPrincipal) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(usuarioPrincipal.getUsername())
                .claim("id", usuarioPrincipal.getId())
                .claim("rol", usuarioPrincipal.getRol())
                .claim("perfil", usuarioPrincipal.getPerfil())
                .claim("nombres", usuarioPrincipal.getNombres())
                .claim("apellidos", usuarioPrincipal.getApellidos())
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(secretKey)
                .compact();
    }

    public String extraerCorreo(String token) {
        return extraerClaims(token).getSubject();
    }

    public boolean tokenValido(String token) {
        try {
            extraerClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    private Claims extraerClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}