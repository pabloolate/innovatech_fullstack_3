package cl.duoc.ms_recursos.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActualizarRecursoDto {

    @NotBlank(message = "Los nombres son obligatorios")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    private String apellidos;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe ser válido")
    private String correo;

    @NotBlank(message = "El perfil es obligatorio")
    private String perfil;

    @NotBlank(message = "La especialidad es obligatoria")
    private String especialidad;

    @NotNull(message = "La capacidad semanal es obligatoria")
    @Min(value = 1, message = "La capacidad semanal debe ser mayor a 0")
    @Max(value = 80, message = "La capacidad semanal no puede superar 80")
    private Integer capacidadHorasSemanales;

    @NotNull(message = "El estado activo es obligatorio")
    private Boolean activo;
}
