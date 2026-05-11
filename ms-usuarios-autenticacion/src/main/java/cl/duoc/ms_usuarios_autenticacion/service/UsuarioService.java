package cl.duoc.ms_usuarios_autenticacion.service;

import cl.duoc.ms_usuarios_autenticacion.dto.ActualizarUsuarioDto;
import cl.duoc.ms_usuarios_autenticacion.dto.CrearUsuarioDto;
import cl.duoc.ms_usuarios_autenticacion.dto.UsuarioRespuestaDto;
import cl.duoc.ms_usuarios_autenticacion.model.Usuario;
import cl.duoc.ms_usuarios_autenticacion.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioRespuestaDto> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::mapearARespuesta)
                .toList();
    }

    public UsuarioRespuestaDto buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        return mapearARespuesta(usuario);
    }

    public UsuarioRespuestaDto crear(CrearUsuarioDto dto) {
        if (usuarioRepository.existsByCorreo(dto.getCorreo())) {
            throw new RuntimeException("Ya existe un usuario con el correo: " + dto.getCorreo());
        }

        Usuario usuario = Usuario.builder()
                .nombres(dto.getNombres())
                .apellidos(dto.getApellidos())
                .correo(dto.getCorreo())
                .contrasenaHash(passwordEncoder.encode(dto.getContrasena()))
                .rol(dto.getRol())
                .perfil(dto.getPerfil())
                .activo(dto.getActivo())
                .build();

        usuario = usuarioRepository.save(usuario);
        return mapearARespuesta(usuario);
    }

    public UsuarioRespuestaDto actualizar(Long id, ActualizarUsuarioDto dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        if (!usuario.getCorreo().equalsIgnoreCase(dto.getCorreo()) && usuarioRepository.existsByCorreo(dto.getCorreo())) {
            throw new RuntimeException("Ya existe un usuario con el correo: " + dto.getCorreo());
        }

        usuario.setNombres(dto.getNombres());
        usuario.setApellidos(dto.getApellidos());
        usuario.setCorreo(dto.getCorreo());
        usuario.setRol(dto.getRol());
        usuario.setPerfil(dto.getPerfil());
        usuario.setActivo(dto.getActivo());

        usuario = usuarioRepository.save(usuario);
        return mapearARespuesta(usuario);
    }

    public UsuarioRespuestaDto activar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        usuario.setActivo(true);
        usuario = usuarioRepository.save(usuario);
        return mapearARespuesta(usuario);
    }

    public UsuarioRespuestaDto desactivar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        usuario.setActivo(false);
        usuario = usuarioRepository.save(usuario);
        return mapearARespuesta(usuario);
    }

    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    private UsuarioRespuestaDto mapearARespuesta(Usuario usuario) {
        return UsuarioRespuestaDto.builder()
                .id(usuario.getId())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .correo(usuario.getCorreo())
                .rol(usuario.getRol())
                .perfil(usuario.getPerfil())
                .activo(usuario.getActivo())
                .fechaCreacion(usuario.getFechaCreacion())
                .fechaActualizacion(usuario.getFechaActualizacion())
                .build();
    }
}