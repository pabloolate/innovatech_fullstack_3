# BFF - Innovatech Fullstack III

Backend For Frontend liviano para centralizar las llamadas del frontend hacia los microservicios Java.

## Rol arquitectónico

El BFF funciona como puerta de entrada única para el frontend. No contiene lógica de negocio ni acceso directo a la base de datos. Su responsabilidad es recibir solicitudes HTTP, reenviarlas al microservicio correspondiente y devolver la respuesta original al frontend.

## Arquitectura

```text
frontend React
  ↓
bff :8080
  ├── ms-usuarios-autenticacion :8081
  ├── ms-proyectos              :8082
  ├── ms-recursos               :8083
  └── ms-monitoreo-kpi          :8084
       ↓
RDS PostgreSQL AWS
```

## Rutas reenviadas

```text
/api/auth/**                     -> ms-usuarios-autenticacion
/api/usuarios/**                 -> ms-usuarios-autenticacion
/api/proyectos/**                -> ms-proyectos
/api/tareas/**                   -> ms-proyectos
/api/participantes-proyecto/**   -> ms-proyectos
/api/recursos/**                 -> ms-recursos
/api/asignaciones-recurso/**     -> ms-recursos
/api/disponibilidades-recurso/** -> ms-recursos
/api/kpi-general/**              -> ms-monitoreo-kpi
/api/kpi-proyecto/**             -> ms-monitoreo-kpi
/api/kpi-recurso/**              -> ms-monitoreo-kpi
/api/reportes-generados/**       -> ms-monitoreo-kpi
```

## Configuración

Archivo:

```text
src/main/resources/application.properties
```

Valores principales:

```properties
server.port=8080
servicios.usuarios.url=http://localhost:8081
servicios.proyectos.url=http://localhost:8082
servicios.recursos.url=http://localhost:8083
servicios.monitoreo.url=http://localhost:8084
```

## Ejecución

Levantar primero los microservicios y luego el BFF:

```bash
./mvnw spring-boot:run
```

En Windows:

```bat
mvnw.cmd spring-boot:run
```

## Pruebas manuales mínimas

```text
POST http://localhost:8080/api/auth/login
GET  http://localhost:8080/api/auth/me
GET  http://localhost:8080/api/usuarios
GET  http://localhost:8080/api/proyectos
GET  http://localhost:8080/api/recursos
GET  http://localhost:8080/api/kpi-general
```

Para endpoints protegidos, enviar el header:

```text
Authorization: Bearer <token>
```
