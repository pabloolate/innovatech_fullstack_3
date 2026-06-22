import { useEffect, useMemo, useState } from 'react';
import { proyectosApi, calendarioApi } from '../services/api.js';

const estadoProyectoOptions = ['PLANIFICADO', 'EN_EJECUCION', 'PAUSADO', 'FINALIZADO', 'CANCELADO'].map((value) => ({ value, label: value }));
const estadoTareaOptions = ['PENDIENTE', 'EN_PROGRESO', 'BLOQUEADA', 'COMPLETADA', 'CANCELADA'].map((value) => ({ value, label: value }));
const prioridadOptions = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'].map((value) => ({ value, label: value }));
const rolProyectoOptions = ['LIDER_PROYECTO', 'PARTICIPANTE', 'COLABORADOR'].map((value) => ({ value, label: value }));

function toNumber(value) {
  const numero = Number(value);
  return Number.isFinite(numero) ? numero : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat('es-CL').format(toNumber(value));
}

function formatPercent(value) {
  return `${toNumber(value).toFixed(1)}%`;
}

function formatDate(value) {
  if (!value) return 'Sin fecha';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Sin fecha';

  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

function toInputDate(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  return date.toISOString().slice(0, 10);
}

function getEstadoProyectoTone(estado) {
  const value = String(estado || '').toUpperCase();

  if (value === 'PLANIFICADO') return 'primary';
  if (value === 'EN_EJECUCION') return 'success';
  if (value === 'PAUSADO') return 'warning';
  if (value === 'FINALIZADO') return 'secondary';
  if (value === 'CANCELADO') return 'danger';

  return 'secondary';
}

function getEstadoTareaTone(estado) {
  const value = String(estado || '').toUpperCase();

  if (value === 'PENDIENTE') return 'secondary';
  if (value === 'EN_PROGRESO') return 'primary';
  if (value === 'BLOQUEADA') return 'danger';
  if (value === 'COMPLETADA') return 'success';
  if (value === 'CANCELADA') return 'dark';

  return 'secondary';
}

function getPrioridadTone(prioridad) {
  const value = String(prioridad || '').toUpperCase();

  if (value === 'BAJA') return 'success';
  if (value === 'MEDIA') return 'primary';
  if (value === 'ALTA') return 'warning';
  if (value === 'CRITICA') return 'danger';

  return 'secondary';
}

function getRolTone(rol) {
  const value = String(rol || '').toUpperCase();

  if (value === 'LIDER_PROYECTO') return 'primary';
  if (value === 'PARTICIPANTE') return 'success';
  if (value === 'COLABORADOR') return 'info';

  return 'secondary';
}

function getPrioridadOrden(prioridad) {
  const value = String(prioridad || '').toUpperCase();

  if (value === 'CRITICA') return 4;
  if (value === 'ALTA') return 3;
  if (value === 'MEDIA') return 2;
  if (value === 'BAJA') return 1;

  return 0;
}

function getProyectoNombre(proyectos, idProyecto) {
  const proyecto = proyectos.find((item) => toNumber(item.id) === toNumber(idProyecto));
  return proyecto?.nombre || `Proyecto ${idProyecto || 'N/A'}`;
}

function formatCalendarValue(value, fallback = 'Sin registrar') {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
}

function formatCalendarBoolean(value) {
  return value ? 'Sí' : 'No';
}

function getSessionFullName(session) {
  return [session?.nombres, session?.apellidos].filter(Boolean).join(' ') || 'Usuario no identificado';
}

function buildProyectoCalendarDescription(proyecto, session, fechas) {
  return `Proyecto: ${formatCalendarValue(proyecto.nombre)}
ID proyecto: ${formatCalendarValue(proyecto.id)}
Estado: ${formatCalendarValue(proyecto.estado)}
Avance: ${formatCalendarValue(proyecto.porcentajeAvance, 0)}%
Fecha inicio: ${formatCalendarValue(fechas.fechaInicio)}
Fecha término estimada: ${formatCalendarValue(fechas.fechaFin)}
Fecha término real: ${formatCalendarValue(proyecto.fechaFinReal)}
Activo: ${formatCalendarBoolean(proyecto.activo)}
Líder: ${formatCalendarValue(proyecto.idLiderProyecto, 'Sin asignar')}

Sincronizado por:
Usuario: ${getSessionFullName(session)}
Correo: ${formatCalendarValue(session?.correo, 'Sin correo')}
Rol: ${formatCalendarValue(session?.rol, 'Sin rol')}
Perfil: ${formatCalendarValue(session?.perfil, 'Sin perfil')}

Descripción original:
${formatCalendarValue(proyecto.descripcion, 'Sin descripción')}`.trim();
}

function buildTareaCalendarDescription(tarea, session, proyectos, fechas) {
  return `Tarea: ${formatCalendarValue(tarea.titulo)}
ID tarea: ${formatCalendarValue(tarea.id)}
Proyecto asociado: ${getProyectoNombre(proyectos, tarea.idProyecto)}
ID proyecto: ${formatCalendarValue(tarea.idProyecto)}
Estado: ${formatCalendarValue(tarea.estado)}
Prioridad: ${formatCalendarValue(tarea.prioridad)}
Avance: ${formatCalendarValue(tarea.porcentajeAvance, 0)}%
Fecha inicio: ${formatCalendarValue(fechas.fechaInicio)}
Fecha término estimada: ${formatCalendarValue(fechas.fechaFin)}
Hora inicio calendario: ${formatCalendarValue(fechas.horaInicio, 'Sin hora')}
Hora fin calendario: ${formatCalendarValue(fechas.horaFin, 'Sin hora')}
Fecha término real: ${formatCalendarValue(tarea.fechaFinReal)}
Responsable: ${formatCalendarValue(tarea.idResponsableUsuario, 'Sin asignar')}
Activo: ${formatCalendarBoolean(tarea.activo)}

Sincronizado por:
Usuario: ${getSessionFullName(session)}
Correo: ${formatCalendarValue(session?.correo, 'Sin correo')}
Rol: ${formatCalendarValue(session?.rol, 'Sin rol')}
Perfil: ${formatCalendarValue(session?.perfil, 'Sin perfil')}

Descripción original:
${formatCalendarValue(tarea.descripcion, 'Sin descripción')}`.trim();
}

function StatPill({ label, value, tone = 'primary' }) {
  return (
    <div className={`border border-${tone} border-opacity-25 rounded-pill px-3 py-2 bg-${tone} bg-opacity-10`}>
      <span className={`small fw-semibold text-${tone}`}>{label}: </span>
      <span className="small fw-bold">{value}</span>
    </div>
  );
}

function ProgressLine({ value, tone = 'primary', height = 10 }) {
  const porcentajeSeguro = Math.min(Math.max(toNumber(value), 0), 100);

  return (
    <div className="w-100">
      <div className="progress rounded-pill bg-light" style={{ height }}>
        <div
          className={`progress-bar bg-${tone}`}
          role="progressbar"
          style={{ width: `${porcentajeSeguro}%` }}
          aria-valuenow={porcentajeSeguro}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
}

function TimelineRow({
  left,
  title,
  subtitle,
  badge,
  badgeTone = 'primary',
  percent,
  percentTone = 'primary',
  right,
  meta,
}) {
  return (
    <div className="border-bottom py-2">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-xl-2">
          <div className="small text-muted">{left}</div>
        </div>

        <div className="col-12 col-xl-3">
          <div className="fw-semibold small text-truncate">{title}</div>
          {subtitle ? <div className="small text-muted text-truncate">{subtitle}</div> : null}
        </div>

        <div className="col-6 col-xl-2">
          {badge ? (
            <span className={`badge rounded-pill text-bg-${badgeTone}`}>
              {badge}
            </span>
          ) : null}
        </div>

        <div className="col-12 col-xl-3">
          <div className="d-flex align-items-center gap-2">
            <ProgressLine value={percent} tone={percentTone} height={9} />
            <span className="small fw-bold" style={{ minWidth: 48 }}>
              {formatPercent(percent)}
            </span>
          </div>
          {meta ? <div className="small text-muted mt-1">{meta}</div> : null}
        </div>

        <div className="col-6 col-xl-2 text-xl-end">
          <div className="small text-muted">{right}</div>
        </div>
      </div>
    </div>
  );
}

function ProjectTimelineHeader({ proyecto, tareasProyecto, participantesProyecto }) {
  const avance = toNumber(proyecto.porcentajeAvance);
  const tone = getEstadoProyectoTone(proyecto.estado);
  const tareasCompletadas = tareasProyecto.filter((item) => String(item.estado || '').toUpperCase() === 'COMPLETADA').length;
  const porcentajeTareas = tareasProyecto.length ? (tareasCompletadas / tareasProyecto.length) * 100 : 0;

  return (
    <div className={`border border-${tone} border-opacity-25 rounded-4 overflow-hidden mb-3`}>
      <div className={`bg-${tone} bg-opacity-10 px-3 py-2 border-bottom border-${tone} border-opacity-25`}>
        <div className="d-flex flex-column flex-xl-row justify-content-between gap-2">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <h5 className="mb-0">{proyecto.nombre}</h5>
              <span className={`badge rounded-pill text-bg-${tone}`}>{proyecto.estado || 'SIN_ESTADO'}</span>
              <span className={`badge rounded-pill text-bg-${proyecto.activo ? 'success' : 'secondary'}`}>
                {proyecto.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="small text-muted mt-1">
              Proyecto #{proyecto.id} · Líder ID {proyecto.idLiderProyecto || 'N/A'}
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <StatPill label="Tareas" value={`${formatNumber(tareasCompletadas)} / ${formatNumber(tareasProyecto.length)}`} tone="primary" />
            <StatPill label="Participantes" value={formatNumber(participantesProyecto.length)} tone="info" />
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-xl-6">
            <div className="small fw-semibold mb-1">Avance del proyecto</div>
            <div className="d-flex align-items-center gap-2">
              <ProgressLine value={avance} tone={avance >= 80 ? 'success' : avance >= 45 ? 'warning' : 'primary'} height={12} />
              <span className="fw-bold">{formatPercent(avance)}</span>
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <div className="small fw-semibold mb-1">Tareas completadas</div>
            <div className="d-flex align-items-center gap-2">
              <ProgressLine value={porcentajeTareas} tone={porcentajeTareas >= 80 ? 'success' : porcentajeTareas >= 45 ? 'warning' : 'primary'} height={12} />
              <span className="fw-bold">{formatPercent(porcentajeTareas)}</span>
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex flex-column flex-xl-row justify-content-between gap-2 small text-muted border rounded-3 bg-light px-3 py-2">
              <span>Inicio: {formatDate(proyecto.fechaInicio)}</span>
              <span>Fin estimado: {formatDate(proyecto.fechaFinEstimada)}</span>
              <span>Fin real: {formatDate(proyecto.fechaFinReal)}</span>
            </div>
          </div>

          {proyecto.descripcion ? (
            <div className="col-12">
              <div className="small text-muted">Descripción</div>
              <div className="small">{proyecto.descripcion}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProjectSelectorTabs({ proyectos, proyectoSeleccionado, onChange }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-3">
      <div className="card-body py-2 px-3">
        <div className="d-flex gap-2 overflow-auto pb-1">
          <button
            type="button"
            className={`btn btn-sm rounded-pill flex-shrink-0 ${proyectoSeleccionado === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onChange('todos')}
          >
            Todos
          </button>

          {proyectos.map((proyecto) => (
            <button
              type="button"
              key={proyecto.id}
              className={`btn btn-sm rounded-pill flex-shrink-0 ${String(proyectoSeleccionado) === String(proyecto.id) ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => onChange(String(proyecto.id))}
            >
              {proyecto.nombre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectSummaryList({ proyectos, tareas, participantes, onSelectProject }) {
  return (
    <div className="border rounded-4 overflow-hidden bg-white">
      {proyectos.map((proyecto) => {
        const tone = getEstadoProyectoTone(proyecto.estado);
        const avance = toNumber(proyecto.porcentajeAvance);
        const tareasProyecto = tareas.filter((item) => toNumber(item.idProyecto) === toNumber(proyecto.id));
        const participantesProyecto = participantes.filter((item) => toNumber(item.idProyecto) === toNumber(proyecto.id));
        const tareasCompletadas = tareasProyecto.filter((item) => String(item.estado || '').toUpperCase() === 'COMPLETADA').length;

        return (
          <button
            type="button"
            key={proyecto.id}
            className="w-100 bg-white text-start border-0 border-bottom px-3 py-2"
            onClick={() => onSelectProject(String(proyecto.id))}
          >
            <div className="row g-2 align-items-center">
              <div className="col-12 col-xl-3">
                <div className="fw-semibold small">{proyecto.nombre}</div>
                <div className="small text-muted">Proyecto #{proyecto.id}</div>
              </div>

              <div className="col-6 col-xl-2">
                <span className={`badge rounded-pill text-bg-${tone}`}>{proyecto.estado || 'SIN_ESTADO'}</span>
              </div>

              <div className="col-12 col-xl-4">
                <div className="d-flex align-items-center gap-2">
                  <ProgressLine value={avance} tone={tone} height={9} />
                  <span className="small fw-bold" style={{ minWidth: 48 }}>{formatPercent(avance)}</span>
                </div>
              </div>

              <div className="col-6 col-xl-3 text-xl-end">
                <div className="small text-muted">
                  {formatNumber(tareasCompletadas)} / {formatNumber(tareasProyecto.length)} tareas · {formatNumber(participantesProyecto.length)} participantes
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ProjectDetailTimeline({ proyecto, tareas, participantes }) {
  const tareasProyecto = tareas
    .filter((item) => toNumber(item.idProyecto) === toNumber(proyecto.id))
    .sort((a, b) => getPrioridadOrden(b.prioridad) - getPrioridadOrden(a.prioridad));

  const participantesProyecto = participantes.filter((item) => toNumber(item.idProyecto) === toNumber(proyecto.id));

  return (
    <div>
      <ProjectTimelineHeader
        proyecto={proyecto}
        tareasProyecto={tareasProyecto}
        participantesProyecto={participantesProyecto}
      />

      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h6 className="mb-0">Tareas del proyecto</h6>
              <div className="small text-muted">Líneas de trabajo asociadas al proyecto seleccionado.</div>
            </div>
            <span className="badge rounded-pill text-bg-primary">{tareasProyecto.length}</span>
          </div>

          {tareasProyecto.length ? (
            tareasProyecto.map((tarea) => {
              const estadoTone = getEstadoTareaTone(tarea.estado);
              const prioridadTone = getPrioridadTone(tarea.prioridad);
              const avance = toNumber(tarea.porcentajeAvance);

              return (
                <TimelineRow
                  key={tarea.id}
                  left={`Tarea #${tarea.id}`}
                  title={tarea.titulo}
                  subtitle={`Responsable ID ${tarea.idResponsableUsuario || 'N/A'} · Prioridad ${tarea.prioridad || 'N/A'}`}
                  badge={tarea.estado || 'SIN_ESTADO'}
                  badgeTone={estadoTone}
                  percent={avance}
                  percentTone={avance >= 80 ? 'success' : avance >= 45 ? 'warning' : 'primary'}
                  right={`${formatDate(tarea.fechaInicio)} → ${formatDate(tarea.fechaFinEstimada)}`}
                  meta={<span className={`badge rounded-pill text-bg-${prioridadTone}`}>{tarea.prioridad || 'SIN_PRIORIDAD'}</span>}
                />
              );
            })
          ) : (
            <div className="border rounded-3 bg-light p-3 text-center text-muted small">
              Este proyecto no tiene tareas registradas.
            </div>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h6 className="mb-0">Participantes del proyecto</h6>
              <div className="small text-muted">Usuarios vinculados al proyecto seleccionado.</div>
            </div>
            <span className="badge rounded-pill text-bg-info">{participantesProyecto.length}</span>
          </div>

          {participantesProyecto.length ? (
            participantesProyecto.map((participante) => {
              const tone = getRolTone(participante.rolEnProyecto);

              return (
                <div className="border-bottom py-2" key={participante.id}>
                  <div className="row g-2 align-items-center">
                    <div className="col-12 col-xl-3">
                      <div className="fw-semibold small">Usuario {participante.idUsuario}</div>
                      <div className="small text-muted">Participante #{participante.id}</div>
                    </div>

                    <div className="col-6 col-xl-3">
                      <span className={`badge rounded-pill text-bg-${tone}`}>
                        {participante.rolEnProyecto || 'SIN_ROL'}
                      </span>
                    </div>

                    <div className="col-6 col-xl-3">
                      <span className={`badge rounded-pill text-bg-${participante.activo ? 'success' : 'secondary'}`}>
                        {participante.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <div className="col-12 col-xl-3 text-xl-end">
                      <div className="small text-muted">Proyecto {participante.idProyecto}</div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="border rounded-3 bg-light p-3 text-center text-muted small">
              Este proyecto no tiene participantes registrados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GlobalTaskTimeline({ tareas, proyectos }) {
  const tareasOrdenadas = [...tareas].sort((a, b) => {
    const estadoA = String(a.estado || '').toUpperCase();
    const estadoB = String(b.estado || '').toUpperCase();

    if (estadoA === 'BLOQUEADA' && estadoB !== 'BLOQUEADA') return -1;
    if (estadoB === 'BLOQUEADA' && estadoA !== 'BLOQUEADA') return 1;

    return getPrioridadOrden(b.prioridad) - getPrioridadOrden(a.prioridad);
  });

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h6 className="mb-0">Línea global de tareas</h6>
            <div className="small text-muted">Todas las tareas ordenadas por bloqueo y prioridad.</div>
          </div>
          <span className="badge rounded-pill text-bg-primary">{tareasOrdenadas.length}</span>
        </div>

        {tareasOrdenadas.length ? (
          tareasOrdenadas.map((tarea) => {
            const estadoTone = getEstadoTareaTone(tarea.estado);
            const prioridadTone = getPrioridadTone(tarea.prioridad);
            const avance = toNumber(tarea.porcentajeAvance);

            return (
              <TimelineRow
                key={tarea.id}
                left={`Tarea #${tarea.id}`}
                title={tarea.titulo}
                subtitle={getProyectoNombre(proyectos, tarea.idProyecto)}
                badge={tarea.estado || 'SIN_ESTADO'}
                badgeTone={estadoTone}
                percent={avance}
                percentTone={avance >= 80 ? 'success' : avance >= 45 ? 'warning' : 'primary'}
                right={`${formatDate(tarea.fechaInicio)} → ${formatDate(tarea.fechaFinEstimada)}`}
                meta={<span className={`badge rounded-pill text-bg-${prioridadTone}`}>{tarea.prioridad || 'SIN_PRIORIDAD'}</span>}
              />
            );
          })
        ) : (
          <div className="border rounded-3 bg-light p-3 text-center text-muted small">
            No hay tareas registradas.
          </div>
        )}
      </div>
    </div>
  );
}

function ParticipantTimeline({ participantes, proyectos }) {
  const participantesOrdenados = [...participantes].sort((a, b) => {
    return String(a.rolEnProyecto || '').localeCompare(String(b.rolEnProyecto || ''));
  });

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h6 className="mb-0">Línea de participantes</h6>
            <div className="small text-muted">Usuarios vinculados a proyectos, ordenados por rol.</div>
          </div>
          <span className="badge rounded-pill text-bg-info">{participantesOrdenados.length}</span>
        </div>

        {participantesOrdenados.length ? (
          participantesOrdenados.map((participante) => {
            const tone = getRolTone(participante.rolEnProyecto);

            return (
              <div className="border-bottom py-2" key={participante.id}>
                <div className="row g-2 align-items-center">
                  <div className="col-12 col-xl-2">
                    <div className="small text-muted">Usuario #{participante.idUsuario}</div>
                  </div>

                  <div className="col-12 col-xl-3">
                    <div className="fw-semibold small">{getProyectoNombre(proyectos, participante.idProyecto)}</div>
                    <div className="small text-muted">Proyecto {participante.idProyecto}</div>
                  </div>

                  <div className="col-6 col-xl-3">
                    <span className={`badge rounded-pill text-bg-${tone}`}>
                      {participante.rolEnProyecto || 'SIN_ROL'}
                    </span>
                  </div>

                  <div className="col-6 col-xl-2">
                    <span className={`badge rounded-pill text-bg-${participante.activo ? 'success' : 'secondary'}`}>
                      {participante.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="col-12 col-xl-2 text-xl-end">
                    <div className="small text-muted">Relación #{participante.id}</div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="border rounded-3 bg-light p-3 text-center text-muted small">
            No hay participantes registrados.
          </div>
        )}
      </div>
    </div>
  );
}

function SyncButton({ synced, onSync, onUnsync, loading }) {
  if (loading) {
    return <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill px-2" disabled>Sincronizando...</button>;
  }

  if (synced) {
    return (
      <button type="button" className="btn btn-sm btn-outline-success rounded-pill px-2" onClick={onUnsync}>
        <>&#x2713;</> Calendar
      </button>
    );
  }

  return (
    <button type="button" className="btn btn-sm btn-outline-info rounded-pill px-2" onClick={onSync}>
      <>&#x1F4C5;</> Sync
    </button>
  );
}

function AdminTabs({ active, onChange }) {
  const tabs = [
    { key: 'proyectos', label: 'Proyectos' },
    { key: 'tareas', label: 'Tareas' },
    { key: 'participantes', label: 'Participantes' },
  ];

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-3">
      <div className="card-body py-2 px-3">
        <div className="d-flex flex-column flex-xl-row justify-content-between gap-2">
          <div>
            <h6 className="mb-0">Administración</h6>
            <div className="small text-muted">Mismo estilo de líneas, pero con acciones de gestión.</div>
          </div>

          <div className="d-flex gap-2 overflow-auto pb-1">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.key}
                className={`btn btn-sm rounded-pill flex-shrink-0 ${active === tab.key ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => onChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminActionButtons({ item, onEdit, onDelete, onActivate, onDeactivate, onSync, onUnsync, synced, syncLoading }) {
  return (
    <div className="d-flex justify-content-xl-end flex-wrap gap-1">
      <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-2" onClick={() => onEdit(item)}>
        Editar
      </button>

      <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-2" onClick={() => onDelete(item)}>
        Eliminar
      </button>

      {item.activo ? (
        <button type="button" className="btn btn-sm btn-outline-warning rounded-pill px-2" onClick={() => onDeactivate(item)}>
          Desactivar
        </button>
      ) : (
        <button type="button" className="btn btn-sm btn-outline-success rounded-pill px-2" onClick={() => onActivate(item)}>
          Activar
        </button>
      )}

      <SyncButton synced={synced} onSync={onSync} onUnsync={onUnsync} loading={syncLoading} />
    </div>
  );
}

function AdminPanel({ title, description, createLabel, onCreate, children }) {
  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-3">
        <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-2 mb-2">
          <div>
            <h6 className="mb-0">{title}</h6>
            <div className="small text-muted">{description}</div>
          </div>

          <button type="button" className="btn btn-sm btn-primary rounded-pill px-3" onClick={onCreate}>
            {createLabel}
          </button>
        </div>

        <div className="border rounded-4 overflow-hidden bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

function AdminProjectLine({ proyecto, tareas, participantes, onEdit, onDelete, onActivate, onDeactivate, onSync, onUnsync, synced, syncLoading }) {
  const tone = getEstadoProyectoTone(proyecto.estado);
  const avance = toNumber(proyecto.porcentajeAvance);
  const tareasProyecto = tareas.filter((item) => toNumber(item.idProyecto) === toNumber(proyecto.id));
  const participantesProyecto = participantes.filter((item) => toNumber(item.idProyecto) === toNumber(proyecto.id));

  return (
    <div className="border-bottom px-3 py-2">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-xl-3">
          <div className="fw-semibold small">{proyecto.nombre}</div>
          <div className="small text-muted">Proyecto #{proyecto.id} · Líder {proyecto.idLiderProyecto || 'N/A'}</div>
        </div>

        <div className="col-6 col-xl-2">
          <span className={`badge rounded-pill text-bg-${tone}`}>{proyecto.estado || 'SIN_ESTADO'}</span>
        </div>

        <div className="col-12 col-xl-3">
          <div className="d-flex align-items-center gap-2">
            <ProgressLine value={avance} tone={tone} height={9} />
            <span className="small fw-bold" style={{ minWidth: 48 }}>{formatPercent(avance)}</span>
          </div>
        </div>

        <div className="col-6 col-xl-2">
          <div className="small text-muted">
            {formatNumber(tareasProyecto.length)} tareas · {formatNumber(participantesProyecto.length)} participantes
          </div>
        </div>

        <div className="col-12 col-xl-2">
          <AdminActionButtons
            item={proyecto}
            onEdit={onEdit}
            onDelete={onDelete}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            onSync={onSync}
            onUnsync={onUnsync}
            synced={synced}
            syncLoading={syncLoading}
          />
        </div>
      </div>
    </div>
  );
}

function AdminTaskLine({ tarea, proyectos, onEdit, onDelete, onActivate, onDeactivate, onSync, onUnsync, synced, syncLoading }) {
  const estadoTone = getEstadoTareaTone(tarea.estado);
  const prioridadTone = getPrioridadTone(tarea.prioridad);
  const avance = toNumber(tarea.porcentajeAvance);

  return (
    <div className="border-bottom px-3 py-2">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-xl-3">
          <div className="fw-semibold small">{tarea.titulo}</div>
          <div className="small text-muted">{getProyectoNombre(proyectos, tarea.idProyecto)} · Resp. {tarea.idResponsableUsuario || 'N/A'}</div>
        </div>

        <div className="col-6 col-xl-2">
          <div className="d-flex flex-wrap gap-1">
            <span className={`badge rounded-pill text-bg-${estadoTone}`}>{tarea.estado || 'SIN_ESTADO'}</span>
            <span className={`badge rounded-pill text-bg-${prioridadTone}`}>{tarea.prioridad || 'SIN_PRIORIDAD'}</span>
          </div>
        </div>

        <div className="col-12 col-xl-3">
          <div className="d-flex align-items-center gap-2">
            <ProgressLine value={avance} tone={avance >= 80 ? 'success' : avance >= 45 ? 'warning' : 'primary'} height={9} />
            <span className="small fw-bold" style={{ minWidth: 48 }}>{formatPercent(avance)}</span>
          </div>
        </div>

        <div className="col-6 col-xl-2">
          <div className="small text-muted">
            {formatDate(tarea.fechaInicio)} → {formatDate(tarea.fechaFinEstimada)}
          </div>
        </div>

        <div className="col-12 col-xl-2">
          <AdminActionButtons
            item={tarea}
            onEdit={onEdit}
            onDelete={onDelete}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            onSync={onSync}
            onUnsync={onUnsync}
            synced={synced}
            syncLoading={syncLoading}
          />
        </div>
      </div>
    </div>
  );
}

function AdminParticipantLine({ participante, proyectos, onEdit, onDelete, onActivate, onDeactivate }) {
  const tone = getRolTone(participante.rolEnProyecto);

  return (
    <div className="border-bottom px-3 py-2">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-xl-3">
          <div className="fw-semibold small">Usuario {participante.idUsuario}</div>
          <div className="small text-muted">{getProyectoNombre(proyectos, participante.idProyecto)}</div>
        </div>

        <div className="col-6 col-xl-2">
          <span className={`badge rounded-pill text-bg-${tone}`}>{participante.rolEnProyecto || 'SIN_ROL'}</span>
        </div>

        <div className="col-6 col-xl-2">
          <span className={`badge rounded-pill text-bg-${participante.activo ? 'success' : 'secondary'}`}>
            {participante.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <div className="col-12 col-xl-3">
          <div className="small text-muted">Relación #{participante.id} · Proyecto {participante.idProyecto}</div>
        </div>

        <div className="col-12 col-xl-2">
          <AdminActionButtons
            item={participante}
            onEdit={onEdit}
            onDelete={onDelete}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
          />
        </div>
      </div>
    </div>
  );
}

function AdminFormModal({ title, fields, item, onClose, onSubmit }) {
  const [form, setForm] = useState(() => {
    const initial = {};

    fields.forEach((field) => {
      if (field.type === 'checkbox') {
        initial[field.name] = Boolean(item?.[field.name]);
        return;
      }

      if (field.type === 'date') {
        initial[field.name] = toInputDate(item?.[field.name]);
        return;
      }

      initial[field.name] = item?.[field.name] ?? field.defaultValue ?? '';
    });

    return initial;
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field.name]: field.type === 'checkbox' ? value.checked : value.value,
    }));
  };

  const buildPayload = () => {
    const payload = {};

    fields.forEach((field) => {
      const value = form[field.name];

      if (field.type === 'checkbox') {
        payload[field.name] = Boolean(value);
        return;
      }

      if (field.type === 'number') {
        payload[field.name] = value === '' || value === null || value === undefined ? null : Number(value);
        return;
      }

      payload[field.name] = value === '' ? null : value;
    });

    return payload;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(buildPayload());
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(15, 23, 42, 0.45)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <form className="modal-content border-0 shadow rounded-4" onSubmit={handleSubmit}>
          <div className="modal-header">
            <div>
              <h5 className="modal-title">{title}</h5>
              <div className="small text-muted">Formulario compacto de administración.</div>
            </div>

            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <div className="row g-3">
              {fields.map((field) => (
                <div className={field.col || 'col-12 col-md-6'} key={field.name}>
                  <label className="form-label small fw-semibold">{field.label}</label>

                  {field.type === 'select' ? (
                    <select
                      className="form-select form-select-sm"
                      value={form[field.name] ?? ''}
                      required={field.required}
                      onChange={(event) => handleChange(field, event.target)}
                    >
                      <option value="">Seleccionar</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      className="form-control form-control-sm"
                      rows={3}
                      value={form[field.name] ?? ''}
                      required={field.required}
                      onChange={(event) => handleChange(field, event.target)}
                    />
                  ) : field.type === 'checkbox' ? (
                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={Boolean(form[field.name])}
                        onChange={(event) => handleChange(field, event.target)}
                      />
                      <span className="form-check-label small">Activo</span>
                    </div>
                  ) : (
                    <input
                      className="form-control form-control-sm"
                      type={field.type || 'text'}
                      min={field.min}
                      max={field.max}
                      value={form[field.name] ?? ''}
                      required={field.required}
                      onChange={(event) => handleChange(field, event.target)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" className="btn btn-sm btn-primary rounded-pill px-3">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SyncFormModal({ data, onClose, onSubmit }) {
  const [form, setForm] = useState({ ...data });
  const [submitting, setSubmitting] = useState(false);
  const esTarea = form.tipo === 'TAREA';

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit({
        titulo: form.titulo,
        descripcion: form.descripcion || '',
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin || null,
        horaInicio: esTarea ? (form.horaInicio || null) : null,
        horaFin: esTarea ? (form.horaFin || null) : null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(15, 23, 42, 0.45)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <form className="modal-content border-0 shadow rounded-4" onSubmit={handleSubmit}>
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Sincronizar con Google Calendar</h5>
              <div className="small text-muted">
                Actualiza fechas en la base de datos y envía el evento enriquecido a Google Calendar.
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label small fw-semibold">Título del evento</label>
                <input
                  className="form-control form-control-sm"
                  value={form.titulo ?? ''}
                  required
                  onChange={(e) => handleChange('titulo', e.target.value)}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold">Fecha inicio</label>
                <input
                  className="form-control form-control-sm"
                  type="date"
                  value={form.fechaInicio ?? ''}
                  required
                  onChange={(e) => handleChange('fechaInicio', e.target.value)}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold">Fecha fin</label>
                <input
                  className="form-control form-control-sm"
                  type="date"
                  value={form.fechaFin ?? ''}
                  onChange={(e) => handleChange('fechaFin', e.target.value)}
                />
              </div>

              {esTarea ? (
                <>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Hora inicio calendario</label>
                    <input
                      className="form-control form-control-sm"
                      type="time"
                      value={form.horaInicio ?? ''}
                      onChange={(e) => handleChange('horaInicio', e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Hora fin calendario</label>
                    <input
                      className="form-control form-control-sm"
                      type="time"
                      value={form.horaFin ?? ''}
                      onChange={(e) => handleChange('horaFin', e.target.value)}
                    />
                  </div>
                </>
              ) : null}

              <div className="col-12">
                <label className="form-label small fw-semibold">Descripción que irá al calendario</label>
                <textarea
                  className="form-control form-control-sm"
                  rows={12}
                  value={form.descripcion ?? ''}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                />
                <div className="form-text">
                  Esta descripción se arma automáticamente con la información del proyecto/tarea y del usuario autenticado.
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-sm btn-info rounded-pill px-3" disabled={submitting}>
              {submitting ? 'Sincronizando...' : 'Guardar fechas y sincronizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage({ session, token, onError }) {
  const [proyectos, setProyectos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [vinculos, setVinculos] = useState([]);
  const [tabActivo, setTabActivo] = useState('linea-proyectos');
  const [adminActivo, setAdminActivo] = useState('proyectos');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState('todos');
  const [modalAdmin, setModalAdmin] = useState(null);

  const loadAll = async () => {
    try {
      const [proyectosData, tareasData, participantesData, vinculosData] = await Promise.all([
        proyectosApi.listarProyectos(token),
        proyectosApi.listarTareas(token),
        proyectosApi.listarParticipantes(token),
        calendarioApi.listarVinculos(token),
      ]);

      setProyectos(proyectosData);
      setTareas(tareasData);
      setParticipantes(participantesData);
      setVinculos(vinculosData);
    } catch (error) {
      onError(error.message);
    }
  };

  useEffect(() => {
    loadAll();
  }, [token]);

  const nombreUsuario = [session?.nombres, session?.apellidos].filter(Boolean).join(' ') || 'Usuario';

  const resumen = useMemo(() => {
    const proyectosActivos = proyectos.filter((item) => item.activo).length;

    const avancePromedio = proyectos.length
      ? proyectos.reduce((acc, item) => acc + toNumber(item.porcentajeAvance), 0) / proyectos.length
      : 0;

    const tareasCompletadas = tareas.filter((item) => String(item.estado || '').toUpperCase() === 'COMPLETADA').length;
    const tareasBloqueadas = tareas.filter((item) => String(item.estado || '').toUpperCase() === 'BLOQUEADA').length;

    return {
      proyectosActivos,
      proyectosTotales: proyectos.length,
      avancePromedio,
      tareasTotales: tareas.length,
      tareasCompletadas,
      tareasBloqueadas,
      participantesTotales: participantes.length,
    };
  }, [proyectos, tareas, participantes]);

  const proyectoActual = useMemo(() => {
    if (proyectoSeleccionado === 'todos') return null;
    return proyectos.find((item) => String(item.id) === String(proyectoSeleccionado)) || null;
  }, [proyectos, proyectoSeleccionado]);

  const proyectoFields = [
    { name: 'nombre', label: 'Nombre', required: true, col: 'col-md-6' },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, col: 'col-12' },
    { name: 'estado', label: 'Estado', type: 'select', options: estadoProyectoOptions, required: true },
    { name: 'porcentajeAvance', label: 'Porcentaje de avance', type: 'number', min: 0, max: 100, defaultValue: 0 },
    { name: 'fechaInicio', label: 'Fecha inicio', type: 'date' },
    { name: 'fechaFinEstimada', label: 'Fecha fin estimada', type: 'date' },
    { name: 'fechaFinReal', label: 'Fecha fin real', type: 'date' },
    { name: 'idLiderProyecto', label: 'ID líder proyecto', type: 'number' },
    { name: 'activo', label: 'Activo', type: 'checkbox', defaultValue: true },
  ];

  const tareaFields = [
    { name: 'idProyecto', label: 'ID proyecto', type: 'number', required: true },
    { name: 'titulo', label: 'Título', required: true },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, col: 'col-12' },
    { name: 'estado', label: 'Estado', type: 'select', options: estadoTareaOptions, required: true },
    { name: 'prioridad', label: 'Prioridad', type: 'select', options: prioridadOptions, required: true },
    { name: 'porcentajeAvance', label: 'Porcentaje de avance', type: 'number', min: 0, max: 100, defaultValue: 0 },
    { name: 'idResponsableUsuario', label: 'ID responsable usuario', type: 'number' },
    { name: 'fechaInicio', label: 'Fecha inicio', type: 'date' },
    { name: 'fechaFinEstimada', label: 'Fecha fin estimada', type: 'date' },
    { name: 'fechaFinReal', label: 'Fecha fin real', type: 'date' },
    { name: 'activo', label: 'Activo', type: 'checkbox', defaultValue: true },
  ];

  const participanteFields = [
    { name: 'idProyecto', label: 'ID proyecto', type: 'number', required: true },
    { name: 'idUsuario', label: 'ID usuario', type: 'number', required: true },
    { name: 'rolEnProyecto', label: 'Rol en proyecto', type: 'select', options: rolProyectoOptions, required: true },
    { name: 'activo', label: 'Activo', type: 'checkbox', defaultValue: true },
  ];

  const tabs = [
    { key: 'linea-proyectos', label: 'Línea por proyecto' },
    { key: 'tareas-globales', label: 'Tareas globales' },
    { key: 'participantes', label: 'Participantes' },
    { key: 'admin', label: 'Administración' },
  ];

  const runAction = async (action) => {
    try {
      await action();
      await loadAll();
    } catch (error) {
      onError(error.message);
    }
  };

  const handleSubmitAdmin = async (payload) => {
    if (!modalAdmin) return;

    await runAction(async () => {
      if (modalAdmin.tipo === 'proyecto') {
        if (modalAdmin.item?.id) {
          await proyectosApi.actualizarProyecto(modalAdmin.item.id, payload, token);
        } else {
          await proyectosApi.crearProyecto(payload, token);
        }
      }

      if (modalAdmin.tipo === 'tarea') {
        if (modalAdmin.item?.id) {
          await proyectosApi.actualizarTarea(modalAdmin.item.id, payload, token);
        } else {
          await proyectosApi.crearTarea(payload, token);
        }
      }

      if (modalAdmin.tipo === 'participante') {
        if (modalAdmin.item?.id) {
          await proyectosApi.actualizarParticipante(modalAdmin.item.id, payload, token);
        } else {
          await proyectosApi.crearParticipante(payload, token);
        }
      }
    });

    setModalAdmin(null);
  };

  const [syncLoadingId, setSyncLoadingId] = useState(null);

  function isSynced(tipo, id) {
    return vinculos.some((v) => v.entidadTipo === tipo && String(v.entidadId) === String(id));
  }

  const [syncModal, setSyncModal] = useState(null);

  const handleSyncProyecto = (proyecto) => {
    const fechaInicio = toInputDate(proyecto.fechaInicio);
    const fechaFin = toInputDate(proyecto.fechaFinEstimada);

    setSyncModal({
      tipo: 'PROYECTO',
      id: proyecto.id,
      item: proyecto,
      titulo: `[Proyecto] ${proyecto.nombre}`,
      descripcion: buildProyectoCalendarDescription(proyecto, session, { fechaInicio, fechaFin }),
      fechaInicio,
      fechaFin,
    });
  };

  const handleUnsyncProyecto = async (proyecto) => {
    setSyncLoadingId(`proyecto-${proyecto.id}`);
    try {
      await calendarioApi.eliminarSincronizacionProyecto(proyecto.id, token);
      const vinculosActualizados = await calendarioApi.listarVinculos(token);
      setVinculos(vinculosActualizados);
    } catch (error) {
      onError(error.message);
    } finally {
      setSyncLoadingId(null);
    }
  };

  const handleSyncTarea = (tarea) => {
    const fechaInicio = toInputDate(tarea.fechaInicio);
    const fechaFin = toInputDate(tarea.fechaFinEstimada);

    setSyncModal({
      tipo: 'TAREA',
      id: tarea.id,
      item: tarea,
      titulo: `[Tarea] ${tarea.titulo}`,
      descripcion: buildTareaCalendarDescription(tarea, session, proyectos, {
        fechaInicio,
        fechaFin,
        horaInicio: '09:00',
        horaFin: '10:00',
      }),
      fechaInicio,
      fechaFin,
      horaInicio: '09:00',
      horaFin: '10:00',
    });
  };

  const handleUnsyncTarea = async (tarea) => {
    setSyncLoadingId(`tarea-${tarea.id}`);
    try {
      await calendarioApi.eliminarSincronizacionTarea(tarea.id, token);
      const vinculosActualizados = await calendarioApi.listarVinculos(token);
      setVinculos(vinculosActualizados);
    } catch (error) {
      onError(error.message);
    } finally {
      setSyncLoadingId(null);
    }
  };

  const handleSyncSubmit = async (data) => {
    if (!syncModal) return;
    setSyncLoadingId(`${syncModal.tipo.toLowerCase()}-${syncModal.id}`);

    try {
      if (syncModal.tipo === 'PROYECTO') {
        const proyectoActualizado = {
          ...syncModal.item,
          fechaInicio: data.fechaInicio,
          fechaFinEstimada: data.fechaFin,
        };

        await proyectosApi.actualizarProyecto(syncModal.id, proyectoActualizado, token);

        const descripcion = buildProyectoCalendarDescription(proyectoActualizado, session, {
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
        });

        await calendarioApi.sincronizarProyecto(syncModal.id, {
          ...data,
          titulo: data.titulo || `[Proyecto] ${proyectoActualizado.nombre}`,
          descripcion,
          horaInicio: null,
          horaFin: null,
        }, token);
      } else {
        const tareaActualizada = {
          ...syncModal.item,
          fechaInicio: data.fechaInicio,
          fechaFinEstimada: data.fechaFin,
        };

        await proyectosApi.actualizarTarea(syncModal.id, tareaActualizada, token);

        const descripcion = buildTareaCalendarDescription(tareaActualizada, session, proyectos, {
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
        });

        await calendarioApi.sincronizarTarea(syncModal.id, {
          ...data,
          titulo: data.titulo || `[Tarea] ${tareaActualizada.titulo}`,
          descripcion,
        }, token);
      }

      await loadAll();
      setSyncModal(null);
    } catch (error) {
      onError(error.message);
    } finally {
      setSyncLoadingId(null);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-2 mb-3">
        <div>
          <h2 className="mb-1">Bienvenido: {nombreUsuario}</h2>

          <div className="d-flex flex-wrap gap-2 mt-2">
            <span className="badge text-bg-primary">Rol: {session?.rol}</span>
            <span className="badge text-bg-secondary">Perfil: {session?.perfil}</span>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <StatPill label="Proyectos activos" value={`${formatNumber(resumen.proyectosActivos)} / ${formatNumber(resumen.proyectosTotales)}`} tone="primary" />
        <StatPill label="Avance promedio" value={formatPercent(resumen.avancePromedio)} tone="success" />
        <StatPill label="Tareas completadas" value={`${formatNumber(resumen.tareasCompletadas)} / ${formatNumber(resumen.tareasTotales)}`} tone="warning" />
        <StatPill label="Bloqueadas" value={formatNumber(resumen.tareasBloqueadas)} tone={resumen.tareasBloqueadas > 0 ? 'danger' : 'secondary'} />
        <StatPill label="Participantes" value={formatNumber(resumen.participantesTotales)} tone="info" />
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-body py-2 px-3">
          <div className="d-flex gap-2 overflow-auto pb-1">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.key}
                className={`btn btn-sm rounded-pill flex-shrink-0 ${tabActivo === tab.key ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTabActivo(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tabActivo === 'linea-proyectos' && (
        <>
          <ProjectSelectorTabs
            proyectos={proyectos}
            proyectoSeleccionado={proyectoSeleccionado}
            onChange={setProyectoSeleccionado}
          />

          {proyectoSeleccionado === 'todos' ? (
            <ProjectSummaryList
              proyectos={proyectos}
              tareas={tareas}
              participantes={participantes}
              onSelectProject={setProyectoSeleccionado}
            />
          ) : proyectoActual ? (
            <ProjectDetailTimeline
              proyecto={proyectoActual}
              tareas={tareas}
              participantes={participantes}
            />
          ) : (
            <div className="border rounded-3 bg-light p-3 text-center text-muted small">
              No se encontró el proyecto seleccionado.
            </div>
          )}
        </>
      )}

      {tabActivo === 'tareas-globales' && (
        <GlobalTaskTimeline tareas={tareas} proyectos={proyectos} />
      )}

      {tabActivo === 'participantes' && (
        <ParticipantTimeline participantes={participantes} proyectos={proyectos} />
      )}

      {tabActivo === 'admin' && (
        <>
          <AdminTabs active={adminActivo} onChange={setAdminActivo} />

          {adminActivo === 'proyectos' && (
            <AdminPanel
              title="Administración de proyectos"
              description="Gestión visual de proyectos en formato de línea operativa."
              createLabel="Crear proyecto"
              onCreate={() => setModalAdmin({ tipo: 'proyecto', item: null, fields: proyectoFields, title: 'Crear proyecto' })}
            >
              {proyectos.map((proyecto) => (
                <AdminProjectLine
                  key={proyecto.id}
                  proyecto={proyecto}
                  tareas={tareas}
                  participantes={participantes}
                  onEdit={(item) => setModalAdmin({ tipo: 'proyecto', item, fields: proyectoFields, title: 'Editar proyecto' })}
                  onDelete={(item) => runAction(() => proyectosApi.eliminarProyecto(item.id, token))}
                  onActivate={(item) => runAction(() => proyectosApi.activarProyecto(item.id, token))}
                  onDeactivate={(item) => runAction(() => proyectosApi.desactivarProyecto(item.id, token))}
                  onSync={() => handleSyncProyecto(proyecto)}
                  onUnsync={() => handleUnsyncProyecto(proyecto)}
                  synced={isSynced('PROYECTO', proyecto.id)}
                  syncLoading={syncLoadingId === `proyecto-${proyecto.id}`}
                />
              ))}
            </AdminPanel>
          )}

          {adminActivo === 'tareas' && (
            <AdminPanel
              title="Administración de tareas"
              description="Gestión visual de tareas con estado, prioridad y avance."
              createLabel="Crear tarea"
              onCreate={() => setModalAdmin({ tipo: 'tarea', item: null, fields: tareaFields, title: 'Crear tarea' })}
            >
              {tareas.map((tarea) => (
                <AdminTaskLine
                  key={tarea.id}
                  tarea={tarea}
                  proyectos={proyectos}
                  onEdit={(item) => setModalAdmin({ tipo: 'tarea', item, fields: tareaFields, title: 'Editar tarea' })}
                  onDelete={(item) => runAction(() => proyectosApi.eliminarTarea(item.id, token))}
                  onActivate={(item) => runAction(() => proyectosApi.activarTarea(item.id, token))}
                  onDeactivate={(item) => runAction(() => proyectosApi.desactivarTarea(item.id, token))}
                  onSync={() => handleSyncTarea(tarea)}
                  onUnsync={() => handleUnsyncTarea(tarea)}
                  synced={isSynced('TAREA', tarea.id)}
                  syncLoading={syncLoadingId === `tarea-${tarea.id}`}
                />
              ))}
            </AdminPanel>
          )}

          {adminActivo === 'participantes' && (
            <AdminPanel
              title="Administración de participantes"
              description="Gestión visual de usuarios vinculados a proyectos."
              createLabel="Crear participante"
              onCreate={() => setModalAdmin({ tipo: 'participante', item: null, fields: participanteFields, title: 'Crear participante' })}
            >
              {participantes.map((participante) => (
                <AdminParticipantLine
                  key={participante.id}
                  participante={participante}
                  proyectos={proyectos}
                  onEdit={(item) => setModalAdmin({ tipo: 'participante', item, fields: participanteFields, title: 'Editar participante' })}
                  onDelete={(item) => runAction(() => proyectosApi.eliminarParticipante(item.id, token))}
                  onActivate={(item) => runAction(() => proyectosApi.activarParticipante(item.id, token))}
                  onDeactivate={(item) => runAction(() => proyectosApi.desactivarParticipante(item.id, token))}
                />
              ))}
            </AdminPanel>
          )}
        </>
      )}

      {modalAdmin ? (
        <AdminFormModal
          title={modalAdmin.title}
          fields={modalAdmin.fields}
          item={modalAdmin.item}
          onClose={() => setModalAdmin(null)}
          onSubmit={handleSubmitAdmin}
        />
      ) : null}

      {syncModal ? (
        <SyncFormModal
          data={syncModal}
          onClose={() => setSyncModal(null)}
          onSubmit={handleSyncSubmit}
        />
      ) : null}
    </div>
  );
}