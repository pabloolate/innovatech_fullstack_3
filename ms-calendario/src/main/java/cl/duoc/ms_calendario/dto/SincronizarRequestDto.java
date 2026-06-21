package cl.duoc.ms_calendario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SincronizarRequestDto {

    @NotBlank(message = "El titulo del evento es obligatorio")
    private String titulo;

    private String descripcion;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private String fechaInicio;

    private String fechaFin;

    private String ubicacion;
}
