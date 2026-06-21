package cl.duoc.ms_calendario.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EventoCalendarioDto {

    private String id;
    private String titulo;
    private String descripcion;
    private String fechaInicio;
    private String fechaFin;
    private String link;
    private String entidadTipo;
    private Long entidadId;
}
