import { useEffect, useMemo, useState } from 'react';
import { recursosApi } from '../services/api.js';

const estadoAsignacionOptions = ['PLANIFICADA', 'ACTIVA', 'FINALIZADA', 'CANCELADA'].map((value) => ({ value, label: value }));
const estadoDisponibilidadOptions = ['DISPONIBLE', 'PARCIAL', 'NO_DISPONIBLE', 'VACACIONES', 'LICENCIA'].map((value) => ({ value, label: value }));

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

function getEstadoAsignacionTone(estado) {
  const value = String(estado || '').toUpperCase();

  if (value === 'ACTIVA') return 'success';
  if (value === 'PLANIFICADA') return 'primary';
  if (value === 'FINALIZADA') return 'secondary';
  if (value === 'CANCELADA') return 'danger';

  return 'secondary';
}

function getEstadoDisponibilidadTone(estado) {
  const value = String(estado || '').toUpperCase();

  if (value === 'DISPONIBLE') return 'success';
  if (value === 'PARCIAL') return 'warning';
  if (value === 'NO_DISPONIBLE') return 'danger';
  if (value === 'VACACIONES') return 'info';
  if (value === 'LICENCIA') return 'secondary';

  return 'secondary';
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

function getNombreRecurso(recurso) {
  const nombre = [recurso?.nombres, recurso?.apellidos].filter(Boolean).join(' ').trim();
  return nombre || recurso?.nombreRecurso || `Recurso ${recurso?.id || recurso?.idRecurso || 'N/A'}`;
}

function getRecursoPorId(recursos, idRecurso) {
  return recursos.find((item) => toNumber(item.id) === toNumber(idRecurso)) || null;
}

function getNombreRecursoPorId(recursos, idRecurso, fallback) {
  const recurso = getRecursoPorId(recursos, idRecurso);
  return recurso ? getNombreRecurso(recurso) : fallback || `Recurso ${idRecurso || 'N/A'}`;
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
  action,
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
          {typeof percent === 'number' ? (
            <>
              <div className="d-flex align-items-center gap-2">
                <ProgressLine value={percent} tone={percentTone} height={9} />
                <span className="small fw-bold" style={{ minWidth: 48 }}>
                  {formatPercent(percent)}
                </span>
              </div>
              {meta ? <div className="small text-muted mt-1">{meta}</div> : null}
            </>
          ) : (
            <div className="small text-muted">{meta}</div>
          )}
        </div>

        <div className="col-6 col-xl-2 text-xl-end">
          <div className="small text-muted">{right}</div>
          {action ? <div className="mt-1">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

function ResourceSelectorTabs({ recursos, recursoSeleccionado, onChange }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-3">
      <div className="card-body py-2 px-3">
        <div className="d-flex gap-2 overflow-auto pb-1">
          <button
            type="button"
            className={`btn btn-sm rounded-pill flex-shrink-0 ${recursoSeleccionado === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onChange('todos')}
          >
            Todos
          </button>

          {recursos.map((recurso) => (
            <button
              type="button"
              key={recurso.id}
              className={`btn btn-sm rounded-pill flex-shrink-0 ${String(recursoSeleccionado) === String(recurso.id) ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => onChange(String(recurso.id))}
            >
              {getNombreRecurso(recurso)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourceSummaryList({ recursos, asignaciones, disponibilidades, onSelectResource, onCargaLaboral }) {
  return (
    <div className="border rounded-4 overflow-hidden bg-white">
      {recursos.map((recurso) => {
        const capacidad = toNumber(recurso.capacidadHorasSemanales);
        const tone = recurso.activo ? 'primary' : 'secondary';
        const asignacionesRecurso = asignaciones.filter((item) => toNumber(item.idRecurso) === toNumber(recurso.id));
        const asignacionesActivas = asignacionesRecurso.filter((item) => String(item.estado || '').toUpperCase() === 'ACTIVA');
        const horasAsignadas = asignacionesActivas.reduce((acc, item) => acc + toNumber(item.horasAsignadasSemanales), 0);
        const ocupacion = capacidad ? Math.min((horasAsignadas / capacidad) * 100, 100) : 0;
        const disponibilidadesRecurso = disponibilidades.filter((item) => toNumber(item.idRecurso) === toNumber(recurso.id));

        return (
          <div className="border-bottom px-3 py-2" key={recurso.id}>
            <div className="row g-2 align-items-center">
              <button
                type="button"
                className="col-12 col-xl-3 text-start border-0 bg-transparent p-0"
                onClick={() => onSelectResource(String(recurso.id))}
              >
                <div className="fw-semibold small">{getNombreRecurso(recurso)}</div>
                <div className="small text-muted">{recurso.correo || 'Sin correo'} · #{recurso.id}</div>
              </button>

              <div className="col-6 col-xl-2">
                <span className={`badge rounded-pill text-bg-${tone}`}>
                  {recurso.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="col-12 col-xl-3">
                <div className="d-flex align-items-center gap-2">
                  <ProgressLine value={ocupacion} tone={ocupacion >= 85 ? 'danger' : ocupacion >= 60 ? 'warning' : 'success'} height={9} />
                  <span className="small fw-bold" style={{ minWidth: 48 }}>{formatPercent(ocupacion)}</span>
                </div>
              </div>

              <div className="col-6 col-xl-2">
                <div className="small text-muted">
                  {formatNumber(horasAsignadas)} / {formatNumber(capacidad)} h · {formatNumber(disponibilidadesRecurso.length)} disp.
                </div>
              </div>

              <div className="col-12 col-xl-2 text-xl-end">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary rounded-pill px-2"
                  onClick={() => onCargaLaboral(recurso)}
                >
                  Carga
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ResourceDetailTimeline({ recurso, asignaciones, disponibilidades, cargaLaboral, onCargaLaboral }) {
  const asignacionesRecurso = asignaciones.filter((item) => toNumber(item.idRecurso) === toNumber(recurso.id));
  const disponibilidadesRecurso = disponibilidades.filter((item) => toNumber(item.idRecurso) === toNumber(recurso.id));
  const capacidad = toNumber(recurso.capacidadHorasSemanales);
  const asignacionesActivas = asignacionesRecurso.filter((item) => String(item.estado || '').toUpperCase() === 'ACTIVA');
  const horasAsignadas = asignacionesActivas.reduce((acc, item) => acc + toNumber(item.horasAsignadasSemanales), 0);
  const horasDisponibles = Math.max(capacidad - horasAsignadas, 0);
  const ocupacion = capacidad ? Math.min((horasAsignadas / capacidad) * 100, 100) : 0;
  const tone = ocupacion >= 85 ? 'danger' : ocupacion >= 60 ? 'warning' : 'success';

  return (
    <div>
      <div className={`border border-${tone} border-opacity-25 rounded-4 overflow-hidden mb-3`}>
        <div className={`bg-${tone} bg-opacity-10 px-3 py-2 border-bottom border-${tone} border-opacity-25`}>
          <div className="d-flex flex-column flex-xl-row justify-content-between gap-2">
            <div>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <h5 className="mb-0">{getNombreRecurso(recurso)}</h5>
                <span className={`badge rounded-pill text-bg-${recurso.activo ? 'success' : 'secondary'}`}>
                  {recurso.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="small text-muted mt-1">
                Recurso #{recurso.id} · Usuario ID {recurso.idUsuario || 'N/A'} · {recurso.correo || 'Sin correo'}
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <StatPill label="Asignaciones" value={formatNumber(asignacionesRecurso.length)} tone="primary" />
              <StatPill label="Disponibilidades" value={formatNumber(disponibilidadesRecurso.length)} tone="info" />
              <button
                type="button"
                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                onClick={() => onCargaLaboral(recurso)}
              >
                Ver carga laboral
              </button>
            </div>
          </div>
        </div>

        <div className="p-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-xl-4">
              <div className="small fw-semibold mb-1">Ocupación</div>
              <div className="d-flex align-items-center gap-2">
                <ProgressLine value={ocupacion} tone={tone} height={12} />
                <span className="fw-bold">{formatPercent(ocupacion)}</span>
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="small fw-semibold mb-1">Horas asignadas</div>
              <div className="d-flex align-items-center gap-2">
                <ProgressLine value={capacidad ? (horasAsignadas / capacidad) * 100 : 0} tone="warning" height={12} />
                <span className="fw-bold">{formatNumber(horasAsignadas)} h</span>
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="small fw-semibold mb-1">Horas disponibles</div>
              <div className="d-flex align-items-center gap-2">
                <ProgressLine value={capacidad ? (horasDisponibles / capacidad) * 100 : 0} tone="success" height={12} />
                <span className="fw-bold">{formatNumber(horasDisponibles)} h</span>
              </div>
            </div>

            <div className="col-12">
              <div className="d-flex flex-column flex-xl-row justify-content-between gap-2 small text-muted border rounded-3 bg-light px-3 py-2">
                <span>Perfil: {recurso.perfil || 'Sin perfil'}</span>
                <span>Especialidad: {recurso.especialidad || 'Sin especialidad'}</span>
                <span>Capacidad semanal: {formatNumber(capacidad)} h</span>
              </div>
            </div>

            {cargaLaboral && toNumber(cargaLaboral.idRecurso || recurso.id) === toNumber(recurso.id) ? (
              <div className="col-12">
                <div className="border rounded-3 bg-light px-3 py-2 small">
                  <strong>Carga seleccionada:</strong> {formatNumber(cargaLaboral.horasAsignadasActivas)} h asignadas · {formatNumber(cargaLaboral.horasDisponibles)} h disponibles · {formatNumber(cargaLaboral.porcentajeOcupacion)}% ocupación.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-3">
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h6 className="mb-0">Asignaciones del recurso</h6>
              <div className="small text-muted">Líneas de asignación asociadas al recurso seleccionado.</div>
            </div>
            <span className="badge rounded-pill text-bg-primary">{asignacionesRecurso.length}</span>
          </div>

          {asignacionesRecurso.length ? (
            asignacionesRecurso.map((asignacion) => {
              const estadoTone = getEstadoAsignacionTone(asignacion.estado);
              const porcentaje = toNumber(asignacion.porcentajeAsignacion);

              return (
                <TimelineRow
                  key={asignacion.id}
                  left={`Asignación #${asignacion.id}`}
                  title={`Proyecto ${asignacion.idProyecto || 'N/A'}`}
                  subtitle={`Tarea ${asignacion.idTarea || 'N/A'} · ${formatNumber(asignacion.horasAsignadasSemanales)} h semanales`}
                  badge={asignacion.estado || 'SIN_ESTADO'}
                  badgeTone={estadoTone}
                  percent={porcentaje}
                  percentTone={porcentaje >= 80 ? 'danger' : porcentaje >= 50 ? 'warning' : 'success'}
                  right={`${formatDate(asignacion.fechaInicio)} → ${formatDate(asignacion.fechaFinEstimada)}`}
                  meta={`${formatNumber(asignacion.horasAsignadasSemanales)} horas semanales`}
                />
              );
            })
          ) : (
            <div className="border rounded-3 bg-light p-3 text-center text-muted small">
              Este recurso no tiene asignaciones registradas.
            </div>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h6 className="mb-0">Disponibilidades del recurso</h6>
              <div className="small text-muted">Ventanas, licencias, vacaciones o bloqueos registrados.</div>
            </div>
            <span className="badge rounded-pill text-bg-info">{disponibilidadesRecurso.length}</span>
          </div>

          {disponibilidadesRecurso.length ? (
            disponibilidadesRecurso.map((disponibilidad) => {
              const estadoTone = getEstadoDisponibilidadTone(disponibilidad.estadoDisponibilidad);

              return (
                <div className="border-bottom py-2" key={disponibilidad.id}>
                  <div className="row g-2 align-items-center">
                    <div className="col-12 col-xl-2">
                      <div className="small text-muted">Disponibilidad #{disponibilidad.id}</div>
                    </div>

                    <div className="col-12 col-xl-3">
                      <div className="fw-semibold small">{disponibilidad.motivo || 'Sin motivo'}</div>
                      <div className="small text-muted">Recurso {disponibilidad.idRecurso}</div>
                    </div>

                    <div className="col-6 col-xl-2">
                      <span className={`badge rounded-pill text-bg-${estadoTone}`}>
                        {disponibilidad.estadoDisponibilidad || 'SIN_ESTADO'}
                      </span>
                    </div>

                    <div className="col-12 col-xl-5 text-xl-end">
                      <div className="small text-muted">
                        {formatDate(disponibilidad.fechaDesde)} → {formatDate(disponibilidad.fechaHasta)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="border rounded-3 bg-light p-3 text-center text-muted small">
              Este recurso no tiene disponibilidades registradas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GlobalAssignmentTimeline({ asignaciones, recursos }) {
  const asignacionesOrdenadas = [...asignaciones].sort((a, b) => {
    const estadoA = String(a.estado || '').toUpperCase();
    const estadoB = String(b.estado || '').toUpperCase();

    if (estadoA === 'ACTIVA' && estadoB !== 'ACTIVA') return -1;
    if (estadoB === 'ACTIVA' && estadoA !== 'ACTIVA') return 1;

    return toNumber(b.porcentajeAsignacion) - toNumber(a.porcentajeAsignacion);
  });

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h6 className="mb-0">Línea global de asignaciones</h6>
            <div className="small text-muted">Asignaciones ordenadas por estado activo y porcentaje de carga.</div>
          </div>
          <span className="badge rounded-pill text-bg-primary">{asignacionesOrdenadas.length}</span>
        </div>

        {asignacionesOrdenadas.length ? (
          asignacionesOrdenadas.map((asignacion) => {
            const estadoTone = getEstadoAsignacionTone(asignacion.estado);
            const porcentaje = toNumber(asignacion.porcentajeAsignacion);

            return (
              <TimelineRow
                key={asignacion.id}
                left={`Asignación #${asignacion.id}`}
                title={getNombreRecursoPorId(recursos, asignacion.idRecurso, asignacion.nombreRecurso)}
                subtitle={`Proyecto ${asignacion.idProyecto || 'N/A'} · Tarea ${asignacion.idTarea || 'N/A'}`}
                badge={asignacion.estado || 'SIN_ESTADO'}
                badgeTone={estadoTone}
                percent={porcentaje}
                percentTone={porcentaje >= 80 ? 'danger' : porcentaje >= 50 ? 'warning' : 'success'}
                right={`${formatDate(asignacion.fechaInicio)} → ${formatDate(asignacion.fechaFinEstimada)}`}
                meta={`${formatNumber(asignacion.horasAsignadasSemanales)} horas semanales`}
              />
            );
          })
        ) : (
          <div className="border rounded-3 bg-light p-3 text-center text-muted small">
            No hay asignaciones registradas.
          </div>
        )}
      </div>
    </div>
  );
}

function AvailabilityTimeline({ disponibilidades, recursos }) {
  const disponibilidadesOrdenadas = [...disponibilidades].sort((a, b) => {
    return new Date(a.fechaDesde || 0) - new Date(b.fechaDesde || 0);
  });

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h6 className="mb-0">Línea de disponibilidades</h6>
            <div className="small text-muted">Disponibilidad, vacaciones, licencias y bloqueos del equipo.</div>
          </div>
          <span className="badge rounded-pill text-bg-info">{disponibilidadesOrdenadas.length}</span>
        </div>

        {disponibilidadesOrdenadas.length ? (
          disponibilidadesOrdenadas.map((disponibilidad) => {
            const estadoTone = getEstadoDisponibilidadTone(disponibilidad.estadoDisponibilidad);

            return (
              <div className="border-bottom py-2" key={disponibilidad.id}>
                <div className="row g-2 align-items-center">
                  <div className="col-12 col-xl-2">
                    <div className="small text-muted">Disponibilidad #{disponibilidad.id}</div>
                  </div>

                  <div className="col-12 col-xl-3">
                    <div className="fw-semibold small">
                      {getNombreRecursoPorId(recursos, disponibilidad.idRecurso, disponibilidad.nombreRecurso)}
                    </div>
                    <div className="small text-muted">{disponibilidad.motivo || 'Sin motivo'}</div>
                  </div>

                  <div className="col-6 col-xl-2">
                    <span className={`badge rounded-pill text-bg-${estadoTone}`}>
                      {disponibilidad.estadoDisponibilidad || 'SIN_ESTADO'}
                    </span>
                  </div>

                  <div className="col-12 col-xl-5 text-xl-end">
                    <div className="small text-muted">
                      {formatDate(disponibilidad.fechaDesde)} → {formatDate(disponibilidad.fechaHasta)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="border rounded-3 bg-light p-3 text-center text-muted small">
            No hay disponibilidades registradas.
          </div>
        )}
      </div>
    </div>
  );
}

function AdminTabs({ active, onChange }) {
  const tabs = [
    { key: 'recursos', label: 'Recursos' },
    { key: 'asignaciones', label: 'Asignaciones' },
    { key: 'disponibilidades', label: 'Disponibilidades' },
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

function AdminActionButtons({ item, onEdit, onDelete, onActivate, onDeactivate, canToggle = true }) {
  return (
    <div className="d-flex justify-content-xl-end flex-wrap gap-1">
      <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-2" onClick={() => onEdit(item)}>
        Editar
      </button>

      <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-2" onClick={() => onDelete(item)}>
        Eliminar
      </button>

      {canToggle ? (
        item.activo ? (
          <button type="button" className="btn btn-sm btn-outline-warning rounded-pill px-2" onClick={() => onDeactivate(item)}>
            Desactivar
          </button>
        ) : (
          <button type="button" className="btn btn-sm btn-outline-success rounded-pill px-2" onClick={() => onActivate(item)}>
            Activar
          </button>
        )
      ) : null}
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

function AdminResourceLine({ recurso, asignaciones, disponibilidades, onEdit, onDelete, onActivate, onDeactivate, onCargaLaboral }) {
  const capacidad = toNumber(recurso.capacidadHorasSemanales);
  const asignacionesRecurso = asignaciones.filter((item) => toNumber(item.idRecurso) === toNumber(recurso.id));
  const asignacionesActivas = asignacionesRecurso.filter((item) => String(item.estado || '').toUpperCase() === 'ACTIVA');
  const horasAsignadas = asignacionesActivas.reduce((acc, item) => acc + toNumber(item.horasAsignadasSemanales), 0);
  const ocupacion = capacidad ? Math.min((horasAsignadas / capacidad) * 100, 100) : 0;
  const tone = ocupacion >= 85 ? 'danger' : ocupacion >= 60 ? 'warning' : 'success';
  const disponibilidadesRecurso = disponibilidades.filter((item) => toNumber(item.idRecurso) === toNumber(recurso.id));

  return (
    <div className="border-bottom px-3 py-2">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-xl-3">
          <div className="fw-semibold small">{getNombreRecurso(recurso)}</div>
          <div className="small text-muted">Recurso #{recurso.id} · Usuario {recurso.idUsuario || 'N/A'}</div>
        </div>

        <div className="col-6 col-xl-2">
          <span className={`badge rounded-pill text-bg-${recurso.activo ? 'success' : 'secondary'}`}>
            {recurso.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <div className="col-12 col-xl-3">
          <div className="d-flex align-items-center gap-2">
            <ProgressLine value={ocupacion} tone={tone} height={9} />
            <span className="small fw-bold" style={{ minWidth: 48 }}>{formatPercent(ocupacion)}</span>
          </div>
        </div>

        <div className="col-6 col-xl-2">
          <div className="small text-muted">
            {formatNumber(asignacionesRecurso.length)} asign. · {formatNumber(disponibilidadesRecurso.length)} disp.
          </div>
        </div>

        <div className="col-12 col-xl-2">
          <div className="d-flex justify-content-xl-end flex-wrap gap-1">
            <button type="button" className="btn btn-sm btn-outline-info rounded-pill px-2" onClick={() => onCargaLaboral(recurso)}>
              Carga
            </button>
            <AdminActionButtons
              item={recurso}
              onEdit={onEdit}
              onDelete={onDelete}
              onActivate={onActivate}
              onDeactivate={onDeactivate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminAssignmentLine({ asignacion, recursos, onEdit, onDelete }) {
  const estadoTone = getEstadoAsignacionTone(asignacion.estado);
  const porcentaje = toNumber(asignacion.porcentajeAsignacion);

  return (
    <div className="border-bottom px-3 py-2">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-xl-3">
          <div className="fw-semibold small">{getNombreRecursoPorId(recursos, asignacion.idRecurso, asignacion.nombreRecurso)}</div>
          <div className="small text-muted">Proyecto {asignacion.idProyecto || 'N/A'} · Tarea {asignacion.idTarea || 'N/A'}</div>
        </div>

        <div className="col-6 col-xl-2">
          <span className={`badge rounded-pill text-bg-${estadoTone}`}>
            {asignacion.estado || 'SIN_ESTADO'}
          </span>
        </div>

        <div className="col-12 col-xl-3">
          <div className="d-flex align-items-center gap-2">
            <ProgressLine value={porcentaje} tone={porcentaje >= 80 ? 'danger' : porcentaje >= 50 ? 'warning' : 'success'} height={9} />
            <span className="small fw-bold" style={{ minWidth: 48 }}>{formatPercent(porcentaje)}</span>
          </div>
        </div>

        <div className="col-6 col-xl-2">
          <div className="small text-muted">
            {formatNumber(asignacion.horasAsignadasSemanales)} h · {formatDate(asignacion.fechaInicio)}
          </div>
        </div>

        <div className="col-12 col-xl-2">
          <AdminActionButtons
            item={asignacion}
            onEdit={onEdit}
            onDelete={onDelete}
            canToggle={false}
          />
        </div>
      </div>
    </div>
  );
}

function AdminAvailabilityLine({ disponibilidad, recursos, onEdit, onDelete }) {
  const estadoTone = getEstadoDisponibilidadTone(disponibilidad.estadoDisponibilidad);

  return (
    <div className="border-bottom px-3 py-2">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-xl-3">
          <div className="fw-semibold small">{getNombreRecursoPorId(recursos, disponibilidad.idRecurso, disponibilidad.nombreRecurso)}</div>
          <div className="small text-muted">{disponibilidad.motivo || 'Sin motivo'}</div>
        </div>

        <div className="col-6 col-xl-2">
          <span className={`badge rounded-pill text-bg-${estadoTone}`}>
            {disponibilidad.estadoDisponibilidad || 'SIN_ESTADO'}
          </span>
        </div>

        <div className="col-12 col-xl-3">
          <div className="small text-muted">
            {formatDate(disponibilidad.fechaDesde)} → {formatDate(disponibilidad.fechaHasta)}
          </div>
        </div>

        <div className="col-6 col-xl-2">
          <div className="small text-muted">Disponibilidad #{disponibilidad.id}</div>
        </div>

        <div className="col-12 col-xl-2">
          <AdminActionButtons
            item={disponibilidad}
            onEdit={onEdit}
            onDelete={onDelete}
            canToggle={false}
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
        initial[field.name] = Boolean(item?.[field.name] ?? field.defaultValue ?? false);
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

  const handleChange = (field, target) => {
    setForm((prev) => ({
      ...prev,
      [field.name]: field.type === 'checkbox' ? target.checked : target.value,
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

export default function ResourcesPage({ session, token, onError }) {
  const [recursos, setRecursos] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [cargaLaboral, setCargaLaboral] = useState(null);
  const [tabActivo, setTabActivo] = useState('linea-recursos');
  const [adminActivo, setAdminActivo] = useState('recursos');
  const [recursoSeleccionado, setRecursoSeleccionado] = useState('todos');
  const [modalAdmin, setModalAdmin] = useState(null);

  const loadAll = async () => {
    try {
      const [recursosData, asignacionesData, disponibilidadesData] = await Promise.all([
        recursosApi.listarRecursos(token),
        recursosApi.listarAsignaciones(token),
        recursosApi.listarDisponibilidades(token),
      ]);

      setRecursos(recursosData);
      setAsignaciones(asignacionesData);
      setDisponibilidades(disponibilidadesData);
    } catch (error) {
      onError(error.message);
    }
  };

  useEffect(() => {
    loadAll();
  }, [token]);

  const nombreUsuario = [session?.nombres, session?.apellidos].filter(Boolean).join(' ') || 'Usuario';

  const resumen = useMemo(() => {
    const recursosActivos = recursos.filter((item) => item.activo).length;
    const capacidadTotal = recursos.reduce((acc, item) => acc + toNumber(item.capacidadHorasSemanales), 0);
    const asignacionesActivas = asignaciones.filter((item) => String(item.estado || '').toUpperCase() === 'ACTIVA').length;
    const horasActivas = asignaciones
      .filter((item) => String(item.estado || '').toUpperCase() === 'ACTIVA')
      .reduce((acc, item) => acc + toNumber(item.horasAsignadasSemanales), 0);

    return {
      recursosActivos,
      recursosTotales: recursos.length,
      capacidadTotal,
      asignacionesActivas,
      horasActivas,
      disponibilidadesTotales: disponibilidades.length,
    };
  }, [recursos, asignaciones, disponibilidades]);

  const recursoActual = useMemo(() => {
    if (recursoSeleccionado === 'todos') return null;
    return recursos.find((item) => String(item.id) === String(recursoSeleccionado)) || null;
  }, [recursos, recursoSeleccionado]);

  const recursoFields = [
    { name: 'idUsuario', label: 'ID usuario', type: 'number', required: true },
    { name: 'nombres', label: 'Nombres', required: true },
    { name: 'apellidos', label: 'Apellidos', required: true },
    { name: 'correo', label: 'Correo', type: 'email', required: true },
    { name: 'perfil', label: 'Perfil', required: true },
    { name: 'especialidad', label: 'Especialidad', required: true },
    { name: 'capacidadHorasSemanales', label: 'Capacidad horas semanales', type: 'number', min: 1, max: 80, required: true },
    { name: 'activo', label: 'Activo', type: 'checkbox', defaultValue: true },
  ];

  const asignacionFields = [
    { name: 'idRecurso', label: 'ID recurso', type: 'number', required: true },
    { name: 'idProyecto', label: 'ID proyecto', type: 'number', required: true },
    { name: 'idTarea', label: 'ID tarea', type: 'number' },
    { name: 'porcentajeAsignacion', label: 'Porcentaje asignación', type: 'number', min: 1, max: 100, required: true },
    { name: 'horasAsignadasSemanales', label: 'Horas asignadas semanales', type: 'number', min: 1, max: 80, required: true },
    { name: 'fechaInicio', label: 'Fecha inicio', type: 'date', required: true },
    { name: 'fechaFinEstimada', label: 'Fecha fin estimada', type: 'date' },
    { name: 'fechaFinReal', label: 'Fecha fin real', type: 'date' },
    { name: 'estado', label: 'Estado', type: 'select', options: estadoAsignacionOptions, required: true },
    { name: 'activo', label: 'Activo', type: 'checkbox', defaultValue: true },
  ];

  const disponibilidadFields = [
    { name: 'idRecurso', label: 'ID recurso', type: 'number', required: true },
    { name: 'fechaDesde', label: 'Fecha desde', type: 'date', required: true },
    { name: 'fechaHasta', label: 'Fecha hasta', type: 'date', required: true },
    { name: 'estadoDisponibilidad', label: 'Estado disponibilidad', type: 'select', options: estadoDisponibilidadOptions, required: true },
    { name: 'motivo', label: 'Motivo', required: true, col: 'col-12' },
  ];

  const tabs = [
    { key: 'linea-recursos', label: 'Línea por recurso' },
    { key: 'asignaciones-globales', label: 'Asignaciones globales' },
    { key: 'disponibilidades', label: 'Disponibilidades' },
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

  const handleCargaLaboral = async (recurso) => {
    try {
      const data = await recursosApi.obtenerCargaLaboral(recurso.id, token);
      setCargaLaboral({ ...data, idRecurso: recurso.id });
      setRecursoSeleccionado(String(recurso.id));
      setTabActivo('linea-recursos');
    } catch (error) {
      onError(error.message);
    }
  };

  const handleSubmitAdmin = async (payload) => {
    if (!modalAdmin) return;

    await runAction(async () => {
      if (modalAdmin.tipo === 'recurso') {
        const payloadFinal = { ...payload, activo: !!payload.activo };

        if (modalAdmin.item?.id) {
          await recursosApi.actualizarRecurso(modalAdmin.item.id, payloadFinal, token);
        } else {
          await recursosApi.crearRecurso(payloadFinal, token);
        }
      }

      if (modalAdmin.tipo === 'asignacion') {
        const payloadFinal = { ...payload, activo: !!payload.activo };

        if (modalAdmin.item?.id) {
          await recursosApi.actualizarAsignacion(modalAdmin.item.id, payloadFinal, token);
        } else {
          await recursosApi.crearAsignacion(payloadFinal, token);
        }
      }

      if (modalAdmin.tipo === 'disponibilidad') {
        if (modalAdmin.item?.id) {
          await recursosApi.actualizarDisponibilidad(modalAdmin.item.id, payload, token);
        } else {
          await recursosApi.crearDisponibilidad(payload, token);
        }
      }
    });

    setModalAdmin(null);
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
        <StatPill label="Recursos activos" value={`${formatNumber(resumen.recursosActivos)} / ${formatNumber(resumen.recursosTotales)}`} tone="primary" />
        <StatPill label="Capacidad total" value={`${formatNumber(resumen.capacidadTotal)} h`} tone="success" />
        <StatPill label="Asignaciones activas" value={formatNumber(resumen.asignacionesActivas)} tone="warning" />
        <StatPill label="Horas activas" value={`${formatNumber(resumen.horasActivas)} h`} tone="info" />
        <StatPill label="Disponibilidades" value={formatNumber(resumen.disponibilidadesTotales)} tone="secondary" />
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

      {tabActivo === 'linea-recursos' && (
        <>
          <ResourceSelectorTabs
            recursos={recursos}
            recursoSeleccionado={recursoSeleccionado}
            onChange={setRecursoSeleccionado}
          />

          {recursoSeleccionado === 'todos' ? (
            <ResourceSummaryList
              recursos={recursos}
              asignaciones={asignaciones}
              disponibilidades={disponibilidades}
              onSelectResource={setRecursoSeleccionado}
              onCargaLaboral={handleCargaLaboral}
            />
          ) : recursoActual ? (
            <ResourceDetailTimeline
              recurso={recursoActual}
              asignaciones={asignaciones}
              disponibilidades={disponibilidades}
              cargaLaboral={cargaLaboral}
              onCargaLaboral={handleCargaLaboral}
            />
          ) : (
            <div className="border rounded-3 bg-light p-3 text-center text-muted small">
              No se encontró el recurso seleccionado.
            </div>
          )}
        </>
      )}

      {tabActivo === 'asignaciones-globales' && (
        <GlobalAssignmentTimeline asignaciones={asignaciones} recursos={recursos} />
      )}

      {tabActivo === 'disponibilidades' && (
        <AvailabilityTimeline disponibilidades={disponibilidades} recursos={recursos} />
      )}

      {tabActivo === 'admin' && (
        <>
          <AdminTabs active={adminActivo} onChange={setAdminActivo} />

          {adminActivo === 'recursos' && (
            <AdminPanel
              title="Administración de recursos"
              description="Gestión visual de recursos en formato de línea operativa."
              createLabel="Crear recurso"
              onCreate={() => setModalAdmin({ tipo: 'recurso', item: null, fields: recursoFields, title: 'Crear recurso' })}
            >
              {recursos.map((recurso) => (
                <AdminResourceLine
                  key={recurso.id}
                  recurso={recurso}
                  asignaciones={asignaciones}
                  disponibilidades={disponibilidades}
                  onCargaLaboral={handleCargaLaboral}
                  onEdit={(item) => setModalAdmin({ tipo: 'recurso', item, fields: recursoFields, title: 'Editar recurso' })}
                  onDelete={(item) => runAction(() => recursosApi.eliminarRecurso(item.id, token))}
                  onActivate={(item) => runAction(() => recursosApi.activarRecurso(item.id, token))}
                  onDeactivate={(item) => runAction(() => recursosApi.desactivarRecurso(item.id, token))}
                />
              ))}
            </AdminPanel>
          )}

          {adminActivo === 'asignaciones' && (
            <AdminPanel
              title="Administración de asignaciones"
              description="Gestión visual de asignaciones con porcentaje y horas semanales."
              createLabel="Crear asignación"
              onCreate={() => setModalAdmin({ tipo: 'asignacion', item: null, fields: asignacionFields, title: 'Crear asignación' })}
            >
              {asignaciones.map((asignacion) => (
                <AdminAssignmentLine
                  key={asignacion.id}
                  asignacion={asignacion}
                  recursos={recursos}
                  onEdit={(item) => setModalAdmin({ tipo: 'asignacion', item, fields: asignacionFields, title: 'Editar asignación' })}
                  onDelete={(item) => runAction(() => recursosApi.eliminarAsignacion(item.id, token))}
                />
              ))}
            </AdminPanel>
          )}

          {adminActivo === 'disponibilidades' && (
            <AdminPanel
              title="Administración de disponibilidades"
              description="Gestión visual de disponibilidad, vacaciones, licencias y bloqueos."
              createLabel="Crear disponibilidad"
              onCreate={() => setModalAdmin({ tipo: 'disponibilidad', item: null, fields: disponibilidadFields, title: 'Crear disponibilidad' })}
            >
              {disponibilidades.map((disponibilidad) => (
                <AdminAvailabilityLine
                  key={disponibilidad.id}
                  disponibilidad={disponibilidad}
                  recursos={recursos}
                  onEdit={(item) => setModalAdmin({ tipo: 'disponibilidad', item, fields: disponibilidadFields, title: 'Editar disponibilidad' })}
                  onDelete={(item) => runAction(() => recursosApi.eliminarDisponibilidad(item.id, token))}
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
    </div>
  );
}