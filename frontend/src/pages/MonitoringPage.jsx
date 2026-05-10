import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { monitoreoApi } from '../services/api.js';

function toNumber(value) {
  const numero = Number(value);
  return Number.isFinite(numero) ? numero : 0;
}

function average(items, key) {
  if (!Array.isArray(items) || !items.length) return 0;
  const total = items.reduce((acc, item) => acc + toNumber(item[key]), 0);
  return total / items.length;
}

function latestByDate(items, dateKey = 'fechaCalculo') {
  if (!Array.isArray(items) || items.length === 0) return null;

  return [...items].sort((a, b) => {
    const da = new Date(a?.[dateKey] || 0).getTime();
    const db = new Date(b?.[dateKey] || 0).getTime();
    return db - da;
  })[0];
}

function formatPercent(value) {
  return `${toNumber(value).toFixed(1)}%`;
}

function formatNumber(value) {
  return new Intl.NumberFormat('es-CL').format(toNumber(value));
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

function toInputDateTime(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  return date.toISOString().slice(0, 16);
}

function getPercentTone(value) {
  const numero = toNumber(value);

  if (numero >= 85) return 'success';
  if (numero >= 55) return 'warning';

  return 'danger';
}

function getRiskTone(value) {
  const numero = toNumber(value);

  if (numero <= 0) return 'success';
  if (numero <= 2) return 'warning';

  return 'danger';
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

function FilledMetric({ label, value, percent, tone = 'primary', helper }) {
  const tienePorcentaje = typeof percent === 'number';
  const porcentajeSeguro = Math.min(Math.max(toNumber(percent), 0), 100);

  const estiloRelleno = tienePorcentaje
    ? {
        background: `linear-gradient(
          90deg,
          rgba(13, 110, 253, 0.16) 0%,
          rgba(13, 110, 253, 0.16) ${porcentajeSeguro}%,
          rgba(248, 249, 250, 0.96) ${porcentajeSeguro}%,
          rgba(248, 249, 250, 0.96) 100%
        )`,
      }
    : {};

  return (
    <div
      className={`border border-${tone} border-opacity-25 rounded-4 px-3 py-2 overflow-hidden h-100`}
      style={estiloRelleno}
    >
      <div className={`small fw-semibold text-${tone}`}>{label}</div>
      <div className="h5 fw-bold mb-0">{value}</div>
      {helper ? <div className="small text-muted mt-1">{helper}</div> : null}
    </div>
  );
}

function ChartPanel({ title, subtitle, children, height = 300 }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
          <div>
            <h6 className="mb-0">{title}</h6>
            {subtitle ? <div className="small text-muted">{subtitle}</div> : null}
          </div>
        </div>

        <div style={{ width: '100%', height }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message = 'Sin datos suficientes.' }) {
  return (
    <div className="h-100 d-flex align-items-center justify-content-center border rounded-4 bg-light text-muted small p-3">
      {message}
    </div>
  );
}

function MetricLine({
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
        </div>
      </div>
    </div>
  );
}

function MetricPanel({ title, subtitle, count, tone = 'primary', children }) {
  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h6 className="mb-0">{title}</h6>
            {subtitle ? <div className="small text-muted">{subtitle}</div> : null}
          </div>

          <span className={`badge rounded-pill text-bg-${tone}`}>{count}</span>
        </div>

        <div className="border rounded-4 overflow-hidden bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

function AdminTabs({ active, onChange }) {
  const tabs = [
    { key: 'general', label: 'General' },
    { key: 'proyectos', label: 'Proyectos' },
    { key: 'recursos', label: 'Recursos' },
    { key: 'reportes', label: 'Reportes' },
  ];

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-3">
      <div className="card-body py-2 px-3">
        <div className="d-flex flex-column flex-xl-row justify-content-between gap-2">
          <div>
            <h6 className="mb-0">Administración KPI</h6>
            <div className="small text-muted">Gestión visual de métricas y reportes en formato de líneas.</div>
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

function AdminActionButtons({ item, onEdit, onDelete }) {
  return (
    <div className="d-flex justify-content-xl-end flex-wrap gap-1">
      <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-2" onClick={() => onEdit(item)}>
        Editar
      </button>

      <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-2" onClick={() => onDelete(item)}>
        Eliminar
      </button>
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

function AdminGeneralLine({ item, onEdit, onDelete }) {
  const avance = toNumber(item.promedioAvanceProyectos);
  const ocupacion = toNumber(item.promedioOcupacionRecursos);
  const riesgo = toNumber(item.cantidadIncidenciasAbiertas);

  return (
    <div className="border-bottom px-3 py-2">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-xl-3">
          <div className="fw-semibold small">{item.periodo || `KPI #${item.id}`}</div>
          <div className="small text-muted">Cálculo {formatDate(item.fechaCalculo)}</div>
        </div>

        <div className="col-6 col-xl-2">
          <span className={`badge rounded-pill text-bg-${getRiskTone(riesgo)}`}>
            {formatNumber(riesgo)} incidencias
          </span>
        </div>

        <div className="col-12 col-xl-3">
          <div className="d-flex align-items-center gap-2">
            <ProgressLine value={avance} tone={getPercentTone(avance)} height={9} />
            <span className="small fw-bold" style={{ minWidth: 48 }}>{formatPercent(avance)}</span>
          </div>
          <div className="small text-muted mt-1">Ocupación {formatPercent(ocupacion)}</div>
        </div>

        <div className="col-6 col-xl-2">
          <div className="small text-muted">
            {formatNumber(item.cantidadProyectosActivos)} activos · {formatNumber(item.cantidadRecursosActivos)} recursos
          </div>
        </div>

        <div className="col-12 col-xl-2">
          <AdminActionButtons item={item} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}

function AdminProjectLine({ item, onEdit, onDelete }) {
  const avance = toNumber(item.porcentajeAvance);
  const tareas = toNumber(item.cantidadTareas);
  const completadas = toNumber(item.cantidadTareasCompletadas);
  const cumplimiento = tareas ? (completadas / tareas) * 100 : 0;
  const incidencias = toNumber(item.cantidadIncidenciasAbiertas);

  return (
    <div className="border-bottom px-3 py-2">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-xl-3">
          <div className="fw-semibold small">Proyecto {item.idProyecto}</div>
          <div className="small text-muted">{item.periodo || 'Sin período'} · {formatDate(item.fechaCalculo)}</div>
        </div>

        <div className="col-6 col-xl-2">
          <span className={`badge rounded-pill text-bg-${getRiskTone(incidencias)}`}>
            {formatNumber(incidencias)} incidencias
          </span>
        </div>

        <div className="col-12 col-xl-3">
          <div className="d-flex align-items-center gap-2">
            <ProgressLine value={avance} tone={getPercentTone(avance)} height={9} />
            <span className="small fw-bold" style={{ minWidth: 48 }}>{formatPercent(avance)}</span>
          </div>
          <div className="small text-muted mt-1">
            Tareas {formatNumber(completadas)} / {formatNumber(tareas)} · {formatPercent(cumplimiento)}
          </div>
        </div>

        <div className="col-6 col-xl-2">
          <div className="small text-muted">
            Hitos {formatNumber(item.cantidadHitosCumplidos)} / {formatNumber(item.cantidadHitos)}
          </div>
        </div>

        <div className="col-12 col-xl-2">
          <AdminActionButtons item={item} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}

function AdminResourceLine({ item, onEdit, onDelete }) {
  const ocupacion = toNumber(item.porcentajeOcupacion);
  const asignadas = toNumber(item.horasAsignadas);
  const disponibles = toNumber(item.horasDisponibles);
  const total = asignadas + disponibles;
  const porcentajeAsignadas = total ? (asignadas / total) * 100 : 0;

  return (
    <div className="border-bottom px-3 py-2">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-xl-3">
          <div className="fw-semibold small">Recurso {item.idRecurso}</div>
          <div className="small text-muted">{item.periodo || 'Sin período'} · {formatDate(item.fechaCalculo)}</div>
        </div>

        <div className="col-6 col-xl-2">
          <span className={`badge rounded-pill text-bg-${ocupacion >= 85 ? 'danger' : ocupacion >= 60 ? 'warning' : 'success'}`}>
            {formatNumber(item.cantidadProyectosAsignados)} proyectos
          </span>
        </div>

        <div className="col-12 col-xl-3">
          <div className="d-flex align-items-center gap-2">
            <ProgressLine value={ocupacion} tone={ocupacion >= 85 ? 'danger' : ocupacion >= 60 ? 'warning' : 'success'} height={9} />
            <span className="small fw-bold" style={{ minWidth: 48 }}>{formatPercent(ocupacion)}</span>
          </div>
          <div className="small text-muted mt-1">
            Asignadas {formatNumber(asignadas)} h · {formatPercent(porcentajeAsignadas)}
          </div>
        </div>

        <div className="col-6 col-xl-2">
          <div className="small text-muted">
            Disponibles {formatNumber(disponibles)} h
          </div>
        </div>

        <div className="col-12 col-xl-2">
          <AdminActionButtons item={item} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}

function AdminReportLine({ item, onEdit, onDelete }) {
  return (
    <div className="border-bottom px-3 py-2">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-xl-3">
          <div className="fw-semibold small">{item.tipoReporte || `Reporte #${item.id}`}</div>
          <div className="small text-muted">{item.periodo || 'Sin período'} · {formatDate(item.fechaGeneracion)}</div>
        </div>

        <div className="col-6 col-xl-2">
          <span className="badge rounded-pill text-bg-primary">
            {item.formato || 'SIN_FORMATO'}
          </span>
        </div>

        <div className="col-12 col-xl-3">
          <div className="small text-muted text-truncate">
            {item.rutaArchivo || 'Sin ruta registrada'}
          </div>
        </div>

        <div className="col-6 col-xl-2">
          <div className="small text-muted">
            Usuario {item.generadoPorUsuario || 'N/A'}
          </div>
        </div>

        <div className="col-12 col-xl-2">
          <AdminActionButtons item={item} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}

function AdminFormModal({ title, fields, item, onClose, onSubmit }) {
  const [form, setForm] = useState(() => {
    const initial = {};

    fields.forEach((field) => {
      if (field.type === 'datetime-local') {
        initial[field.name] = toInputDateTime(item?.[field.name]);
        return;
      }

      initial[field.name] = item?.[field.name] ?? field.defaultValue ?? '';
    });

    return initial;
  });

  const handleChange = (field, target) => {
    setForm((prev) => ({
      ...prev,
      [field.name]: target.value,
    }));
  };

  const buildPayload = () => {
    const payload = {};

    fields.forEach((field) => {
      const value = form[field.name];

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
              <div className="small text-muted">Formulario compacto de monitoreo.</div>
            </div>

            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <div className="row g-3">
              {fields.map((field) => (
                <div className={field.col || 'col-12 col-md-6'} key={field.name}>
                  <label className="form-label small fw-semibold">{field.label}</label>

                  {field.type === 'textarea' ? (
                    <textarea
                      className="form-control form-control-sm"
                      rows={3}
                      value={form[field.name] ?? ''}
                      required={field.required}
                      onChange={(event) => handleChange(field, event.target)}
                    />
                  ) : (
                    <input
                      className="form-control form-control-sm"
                      type={field.type || 'text'}
                      min={field.min}
                      max={field.max}
                      step={field.step}
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

export default function MonitoringPage({ session, token, onError }) {
  const [kpiGeneral, setKpiGeneral] = useState([]);
  const [kpiProyecto, setKpiProyecto] = useState([]);
  const [kpiRecurso, setKpiRecurso] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [tabActivo, setTabActivo] = useState('resumen');
  const [adminActivo, setAdminActivo] = useState('general');
  const [modalAdmin, setModalAdmin] = useState(null);

  const loadAll = async () => {
    try {
      const [general, proyecto, recurso, reportesData] = await Promise.all([
        monitoreoApi.listarKpiGeneral(token),
        monitoreoApi.listarKpiProyecto(token),
        monitoreoApi.listarKpiRecurso(token),
        monitoreoApi.listarReportes(token),
      ]);

      setKpiGeneral(general);
      setKpiProyecto(proyecto);
      setKpiRecurso(recurso);
      setReportes(reportesData);
    } catch (error) {
      onError(error.message);
    }
  };

  useEffect(() => {
    loadAll();
  }, [token]);

  const nombreUsuario = [session?.nombres, session?.apellidos].filter(Boolean).join(' ') || 'Usuario';

  const latestGeneral = useMemo(() => latestByDate(kpiGeneral), [kpiGeneral]);

  const resumen = useMemo(() => {
    const proyectosActivos = latestGeneral?.cantidadProyectosActivos ?? 0;
    const proyectosFinalizados = latestGeneral?.cantidadProyectosFinalizados ?? 0;
    const recursosActivos = latestGeneral?.cantidadRecursosActivos ?? 0;
    const incidencias = latestGeneral?.cantidadIncidenciasAbiertas ?? 0;

    return {
      proyectosActivos: toNumber(proyectosActivos),
      proyectosFinalizados: toNumber(proyectosFinalizados),
      recursosActivos: toNumber(recursosActivos),
      incidencias: toNumber(incidencias),
      promedioAvance: latestGeneral?.promedioAvanceProyectos ?? average(kpiProyecto, 'porcentajeAvance'),
      promedioOcupacion: latestGeneral?.promedioOcupacionRecursos ?? average(kpiRecurso, 'porcentajeOcupacion'),
    };
  }, [latestGeneral, kpiProyecto, kpiRecurso]);

  const tendenciaGeneral = useMemo(() => {
    return [...kpiGeneral]
      .sort((a, b) => new Date(a?.fechaCalculo || 0) - new Date(b?.fechaCalculo || 0))
      .map((item) => ({
        periodo: item.periodo || `#${item.id}`,
        avance: toNumber(item.promedioAvanceProyectos),
        ocupacion: toNumber(item.promedioOcupacionRecursos),
        incidencias: toNumber(item.cantidadIncidenciasAbiertas),
        activos: toNumber(item.cantidadProyectosActivos),
        finalizados: toNumber(item.cantidadProyectosFinalizados),
        recursos: toNumber(item.cantidadRecursosActivos),
      }));
  }, [kpiGeneral]);

  const proyectosOrdenados = useMemo(() => {
    return [...kpiProyecto].sort((a, b) => toNumber(b.porcentajeAvance) - toNumber(a.porcentajeAvance));
  }, [kpiProyecto]);

  const proyectosCriticos = useMemo(() => {
    return [...kpiProyecto]
      .sort((a, b) => toNumber(b.cantidadIncidenciasAbiertas) - toNumber(a.cantidadIncidenciasAbiertas))
      .slice(0, 8);
  }, [kpiProyecto]);

  const recursosOrdenados = useMemo(() => {
    return [...kpiRecurso].sort((a, b) => toNumber(b.porcentajeOcupacion) - toNumber(a.porcentajeOcupacion));
  }, [kpiRecurso]);

  const reportesPorFormato = useMemo(() => {
    const map = new Map();

    reportes.forEach((item) => {
      const key = item.formato || 'SIN_FORMATO';
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [reportes]);

  const reportesPorTipo = useMemo(() => {
    const map = new Map();

    reportes.forEach((item) => {
      const key = item.tipoReporte || 'SIN_TIPO';
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries()).map(([tipo, cantidad]) => ({ tipo, cantidad }));
  }, [reportes]);

  const generalFields = [
    { name: 'periodo', label: 'Periodo', required: true },
    { name: 'cantidadProyectosActivos', label: 'Proyectos activos', type: 'number', required: true },
    { name: 'cantidadProyectosFinalizados', label: 'Proyectos finalizados', type: 'number', required: true },
    { name: 'cantidadRecursosActivos', label: 'Recursos activos', type: 'number', required: true },
    { name: 'promedioAvanceProyectos', label: 'Promedio avance proyectos', type: 'number', step: '0.01', required: true },
    { name: 'promedioOcupacionRecursos', label: 'Promedio ocupación recursos', type: 'number', step: '0.01', required: true },
    { name: 'cantidadIncidenciasAbiertas', label: 'Incidencias abiertas', type: 'number', required: true },
    { name: 'fechaCalculo', label: 'Fecha cálculo', type: 'datetime-local', required: true },
  ];

  const proyectoFields = [
    { name: 'idProyecto', label: 'ID proyecto', type: 'number', required: true },
    { name: 'periodo', label: 'Periodo', required: true },
    { name: 'porcentajeAvance', label: 'Porcentaje avance', type: 'number', step: '0.01', required: true },
    { name: 'cantidadTareas', label: 'Cantidad tareas', type: 'number', required: true },
    { name: 'cantidadTareasCompletadas', label: 'Tareas completadas', type: 'number', required: true },
    { name: 'cantidadHitos', label: 'Cantidad hitos', type: 'number', required: true },
    { name: 'cantidadHitosCumplidos', label: 'Hitos cumplidos', type: 'number', required: true },
    { name: 'cantidadIncidenciasAbiertas', label: 'Incidencias abiertas', type: 'number', required: true },
    { name: 'fechaCalculo', label: 'Fecha cálculo', type: 'datetime-local', required: true },
  ];

  const recursoFields = [
    { name: 'idRecurso', label: 'ID recurso', type: 'number', required: true },
    { name: 'periodo', label: 'Periodo', required: true },
    { name: 'horasAsignadas', label: 'Horas asignadas', type: 'number', step: '0.01', required: true },
    { name: 'horasDisponibles', label: 'Horas disponibles', type: 'number', step: '0.01', required: true },
    { name: 'porcentajeOcupacion', label: 'Porcentaje ocupación', type: 'number', step: '0.01', required: true },
    { name: 'cantidadProyectosAsignados', label: 'Cantidad proyectos asignados', type: 'number', required: true },
    { name: 'fechaCalculo', label: 'Fecha cálculo', type: 'datetime-local', required: true },
  ];

  const reporteFields = [
    { name: 'tipoReporte', label: 'Tipo reporte', required: true },
    { name: 'periodo', label: 'Periodo', required: true },
    { name: 'generadoPorUsuario', label: 'Generado por usuario', type: 'number', required: true },
    { name: 'formato', label: 'Formato', required: true },
    { name: 'rutaArchivo', label: 'Ruta archivo', required: true, col: 'col-12' },
    { name: 'fechaGeneracion', label: 'Fecha generación', type: 'datetime-local', required: true },
  ];

  const tabs = [
    { key: 'resumen', label: 'Resumen' },
    { key: 'proyectos', label: 'Proyectos KPI' },
    { key: 'recursos', label: 'Recursos KPI' },
    { key: 'reportes', label: 'Reportes' },
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
      if (modalAdmin.tipo === 'general') {
        if (modalAdmin.item?.id) {
          await monitoreoApi.actualizarKpiGeneral(modalAdmin.item.id, payload, token);
        } else {
          await monitoreoApi.crearKpiGeneral(payload, token);
        }
      }

      if (modalAdmin.tipo === 'proyecto') {
        if (modalAdmin.item?.id) {
          await monitoreoApi.actualizarKpiProyecto(modalAdmin.item.id, payload, token);
        } else {
          await monitoreoApi.crearKpiProyecto(payload, token);
        }
      }

      if (modalAdmin.tipo === 'recurso') {
        if (modalAdmin.item?.id) {
          await monitoreoApi.actualizarKpiRecurso(modalAdmin.item.id, payload, token);
        } else {
          await monitoreoApi.crearKpiRecurso(payload, token);
        }
      }

      if (modalAdmin.tipo === 'reporte') {
        if (modalAdmin.item?.id) {
          await monitoreoApi.actualizarReporte(modalAdmin.item.id, payload, token);
        } else {
          await monitoreoApi.crearReporte(payload, token);
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
        <StatPill label="Proyectos activos" value={formatNumber(resumen.proyectosActivos)} tone="primary" />
        <StatPill label="Avance promedio" value={formatPercent(resumen.promedioAvance)} tone={getPercentTone(resumen.promedioAvance)} />
        <StatPill label="Ocupación recursos" value={formatPercent(resumen.promedioOcupacion)} tone={resumen.promedioOcupacion >= 85 ? 'danger' : resumen.promedioOcupacion >= 60 ? 'warning' : 'success'} />
        <StatPill label="Incidencias" value={formatNumber(resumen.incidencias)} tone={getRiskTone(resumen.incidencias)} />
        <StatPill label="Reportes" value={formatNumber(reportes.length)} tone="info" />
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

      {tabActivo === 'resumen' && (
        <>
          <div className="row g-3 mb-3">
            <div className="col-12 col-xl-3">
              <FilledMetric
                label="Avance promedio"
                value={formatPercent(resumen.promedioAvance)}
                percent={resumen.promedioAvance}
                tone={getPercentTone(resumen.promedioAvance)}
                helper="Promedio consolidado de proyectos."
              />
            </div>

            <div className="col-12 col-xl-3">
              <FilledMetric
                label="Ocupación promedio"
                value={formatPercent(resumen.promedioOcupacion)}
                percent={resumen.promedioOcupacion}
                tone={resumen.promedioOcupacion >= 85 ? 'danger' : resumen.promedioOcupacion >= 60 ? 'warning' : 'success'}
                helper="Carga promedio de recursos."
              />
            </div>

            <div className="col-12 col-xl-3">
              <FilledMetric
                label="Control operativo"
                value={formatPercent(Math.max(0, 100 - resumen.incidencias * 10))}
                percent={Math.max(0, 100 - resumen.incidencias * 10)}
                tone={getRiskTone(resumen.incidencias)}
                helper={`${formatNumber(resumen.incidencias)} incidencias abiertas.`}
              />
            </div>

            <div className="col-12 col-xl-3">
              <FilledMetric
                label="Recursos activos"
                value={formatNumber(resumen.recursosActivos)}
                tone="info"
                helper="Último cálculo general registrado."
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-xl-8">
              <ChartPanel title="Tendencia general" subtitle="Avance, ocupación e incidencias por período" height={320}>
                {tendenciaGeneral.length ? (
                  <ResponsiveContainer>
                    <AreaChart data={tendenciaGeneral}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="periodo" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="avance" stroke="#0d6efd" fill="#0d6efd" fillOpacity={0.15} strokeWidth={3} name="Avance %" />
                      <Area type="monotone" dataKey="ocupacion" stroke="#198754" fill="#198754" fillOpacity={0.12} strokeWidth={3} name="Ocupación %" />
                      <Area type="monotone" dataKey="incidencias" stroke="#dc3545" fill="#dc3545" fillOpacity={0.10} strokeWidth={3} name="Incidencias" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState />
                )}
              </ChartPanel>
            </div>

            <div className="col-12 col-xl-4">
              <ChartPanel title="Distribución operativa" subtitle="Composición del último estado" height={320}>
                {[
                  { name: 'Activos', value: resumen.proyectosActivos },
                  { name: 'Finalizados', value: resumen.proyectosFinalizados },
                  { name: 'Recursos', value: resumen.recursosActivos },
                  { name: 'Incidencias', value: resumen.incidencias },
                ].filter((item) => item.value > 0).length ? (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Activos', value: resumen.proyectosActivos },
                          { name: 'Finalizados', value: resumen.proyectosFinalizados },
                          { name: 'Recursos', value: resumen.recursosActivos },
                          { name: 'Incidencias', value: resumen.incidencias },
                        ].filter((item) => item.value > 0)}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        {['#0d6efd', '#198754', '#ffc107', '#dc3545'].map((color, index) => (
                          <Cell key={`dist-${color}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState />
                )}
              </ChartPanel>
            </div>
          </div>

          <MetricPanel title="Lectura ejecutiva" subtitle="Indicadores principales en formato de barra" count="3" tone="primary">
            <MetricLine
              left="Portafolio"
              title="Avance promedio de proyectos"
              subtitle="Consolidado operativo"
              badge="Avance"
              badgeTone={getPercentTone(resumen.promedioAvance)}
              percent={resumen.promedioAvance}
              percentTone={getPercentTone(resumen.promedioAvance)}
              right="General"
              meta="Mientras más alto, mejor comportamiento del portafolio."
            />

            <MetricLine
              left="Recursos"
              title="Ocupación promedio"
              subtitle="Carga general del equipo"
              badge="Ocupación"
              badgeTone={resumen.promedioOcupacion >= 85 ? 'danger' : resumen.promedioOcupacion >= 60 ? 'warning' : 'success'}
              percent={resumen.promedioOcupacion}
              percentTone={resumen.promedioOcupacion >= 85 ? 'danger' : resumen.promedioOcupacion >= 60 ? 'warning' : 'success'}
              right="Capacidad"
              meta="Carga alta puede indicar riesgo operativo."
            />

            <MetricLine
              left="Riesgo"
              title="Control operativo"
              subtitle={`${formatNumber(resumen.incidencias)} incidencias abiertas`}
              badge="Control"
              badgeTone={getRiskTone(resumen.incidencias)}
              percent={Math.max(0, 100 - resumen.incidencias * 10)}
              percentTone={getRiskTone(resumen.incidencias)}
              right="Incidencias"
              meta="Baja automáticamente cuando suben las incidencias."
            />
          </MetricPanel>
        </>
      )}

      {tabActivo === 'proyectos' && (
        <div className="d-flex flex-column gap-3">
          <div className="row g-3">
            <div className="col-12 col-xl-4">
              <FilledMetric
                label="Avance promedio"
                value={formatPercent(average(kpiProyecto, 'porcentajeAvance'))}
                percent={average(kpiProyecto, 'porcentajeAvance')}
                tone={getPercentTone(average(kpiProyecto, 'porcentajeAvance'))}
                helper="Promedio de avance de proyectos monitoreados."
              />
            </div>

            <div className="col-12 col-xl-4">
              <FilledMetric
                label="Tareas completadas"
                value={`${formatNumber(kpiProyecto.reduce((acc, item) => acc + toNumber(item.cantidadTareasCompletadas), 0))} / ${formatNumber(kpiProyecto.reduce((acc, item) => acc + toNumber(item.cantidadTareas), 0))}`}
                percent={
                  kpiProyecto.reduce((acc, item) => acc + toNumber(item.cantidadTareas), 0)
                    ? (kpiProyecto.reduce((acc, item) => acc + toNumber(item.cantidadTareasCompletadas), 0) / kpiProyecto.reduce((acc, item) => acc + toNumber(item.cantidadTareas), 0)) * 100
                    : 0
                }
                tone="success"
                helper="Cumplimiento total de tareas registradas."
              />
            </div>

            <div className="col-12 col-xl-4">
              <FilledMetric
                label="Incidencias abiertas"
                value={formatNumber(kpiProyecto.reduce((acc, item) => acc + toNumber(item.cantidadIncidenciasAbiertas), 0))}
                tone="danger"
                helper="Suma total de incidencias en proyectos."
              />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-xl-8">
              <MetricPanel title="Ranking de avance por proyecto" subtitle="Ordenado desde mayor avance" count={proyectosOrdenados.length} tone="success">
                {proyectosOrdenados.length ? (
                  proyectosOrdenados.map((item) => {
                    const avance = toNumber(item.porcentajeAvance);
                    const tareas = toNumber(item.cantidadTareas);
                    const completadas = toNumber(item.cantidadTareasCompletadas);
                    const cumplimiento = tareas ? (completadas / tareas) * 100 : 0;

                    return (
                      <MetricLine
                        key={`${item.id}-${item.idProyecto}`}
                        left={`Proyecto #${item.idProyecto}`}
                        title={`Periodo ${item.periodo || 'sin período'}`}
                        subtitle={`Tareas ${formatNumber(completadas)} / ${formatNumber(tareas)} · Cumplimiento ${formatPercent(cumplimiento)}`}
                        badge={`${formatNumber(item.cantidadIncidenciasAbiertas)} incid.`}
                        badgeTone={getRiskTone(item.cantidadIncidenciasAbiertas)}
                        percent={avance}
                        percentTone={getPercentTone(avance)}
                        right={formatDate(item.fechaCalculo)}
                        meta={`Hitos ${formatNumber(item.cantidadHitosCumplidos)} / ${formatNumber(item.cantidadHitos)}`}
                      />
                    );
                  })
                ) : (
                  <div className="p-3">
                    <EmptyState />
                  </div>
                )}
              </MetricPanel>
            </div>

            <div className="col-12 col-xl-4">
              <ChartPanel title="Incidencias críticas" subtitle="Proyectos con más incidencias" height={360}>
                {proyectosCriticos.length ? (
                  <ResponsiveContainer>
                    <BarChart data={proyectosCriticos.map((item) => ({
                      proyecto: `P${item.idProyecto}`,
                      incidencias: toNumber(item.cantidadIncidenciasAbiertas),
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="proyecto" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="incidencias" fill="#dc3545" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState />
                )}
              </ChartPanel>
            </div>
          </div>
        </div>
      )}

      {tabActivo === 'recursos' && (
        <div className="d-flex flex-column gap-3">
          <div className="row g-3">
            <div className="col-12 col-xl-4">
              <FilledMetric
                label="Ocupación promedio"
                value={formatPercent(average(kpiRecurso, 'porcentajeOcupacion'))}
                percent={average(kpiRecurso, 'porcentajeOcupacion')}
                tone={average(kpiRecurso, 'porcentajeOcupacion') >= 85 ? 'danger' : average(kpiRecurso, 'porcentajeOcupacion') >= 60 ? 'warning' : 'success'}
                helper="Carga promedio del equipo monitoreado."
              />
            </div>

            <div className="col-12 col-xl-4">
              <FilledMetric
                label="Horas asignadas"
                value={`${formatNumber(kpiRecurso.reduce((acc, item) => acc + toNumber(item.horasAsignadas), 0))} h`}
                tone="primary"
                helper="Total de horas asignadas en registros KPI."
              />
            </div>

            <div className="col-12 col-xl-4">
              <FilledMetric
                label="Horas disponibles"
                value={`${formatNumber(kpiRecurso.reduce((acc, item) => acc + toNumber(item.horasDisponibles), 0))} h`}
                tone="success"
                helper="Capacidad disponible acumulada."
              />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-xl-7">
              <MetricPanel title="Ranking de ocupación por recurso" subtitle="Ordenado por mayor carga" count={recursosOrdenados.length} tone="warning">
                {recursosOrdenados.length ? (
                  recursosOrdenados.map((item) => {
                    const ocupacion = toNumber(item.porcentajeOcupacion);
                    const asignadas = toNumber(item.horasAsignadas);
                    const disponibles = toNumber(item.horasDisponibles);

                    return (
                      <MetricLine
                        key={`${item.id}-${item.idRecurso}`}
                        left={`Recurso #${item.idRecurso}`}
                        title={`Periodo ${item.periodo || 'sin período'}`}
                        subtitle={`${formatNumber(asignadas)} h asignadas · ${formatNumber(disponibles)} h disponibles`}
                        badge={`${formatNumber(item.cantidadProyectosAsignados)} proyectos`}
                        badgeTone={ocupacion >= 85 ? 'danger' : ocupacion >= 60 ? 'warning' : 'success'}
                        percent={ocupacion}
                        percentTone={ocupacion >= 85 ? 'danger' : ocupacion >= 60 ? 'warning' : 'success'}
                        right={formatDate(item.fechaCalculo)}
                        meta="Carga laboral registrada"
                      />
                    );
                  })
                ) : (
                  <div className="p-3">
                    <EmptyState />
                  </div>
                )}
              </MetricPanel>
            </div>

            <div className="col-12 col-xl-5">
              <ChartPanel title="Carga de recursos" subtitle="Ocupación, horas asignadas y disponibilidad" height={390}>
                {recursosOrdenados.length ? (
                  <ResponsiveContainer>
                    <BarChart data={recursosOrdenados.slice(0, 12).map((item) => ({
                      recurso: `R${item.idRecurso}`,
                      ocupacion: toNumber(item.porcentajeOcupacion),
                      asignadas: toNumber(item.horasAsignadas),
                      disponibles: toNumber(item.horasDisponibles),
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="recurso" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="ocupacion" name="Ocupación %" fill="#ffc107" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="asignadas" name="Horas asignadas" fill="#0d6efd" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="disponibles" name="Horas disponibles" fill="#198754" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState />
                )}
              </ChartPanel>
            </div>
          </div>
        </div>
      )}

      {tabActivo === 'reportes' && (
        <div className="d-flex flex-column gap-3">
          <div className="row g-3">
            <div className="col-12 col-xl-4">
              <FilledMetric label="Reportes generados" value={formatNumber(reportes.length)} tone="primary" helper="Total de reportes registrados." />
            </div>

            <div className="col-12 col-xl-4">
              <FilledMetric label="Tipos distintos" value={formatNumber(reportesPorTipo.length)} tone="success" helper="Categorías de reportes disponibles." />
            </div>

            <div className="col-12 col-xl-4">
              <FilledMetric label="Formatos distintos" value={formatNumber(reportesPorFormato.length)} tone="warning" helper="Formatos de salida registrados." />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-xl-7">
              <ChartPanel title="Reportes por tipo" subtitle="Distribución de reportes generados" height={330}>
                {reportesPorTipo.length ? (
                  <ResponsiveContainer>
                    <BarChart data={reportesPorTipo}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tipo" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#0d6efd" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState />
                )}
              </ChartPanel>
            </div>

            <div className="col-12 col-xl-5">
              <ChartPanel title="Formatos de salida" subtitle="Participación por formato" height={330}>
                {reportesPorFormato.length ? (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={reportesPorFormato} dataKey="value" nameKey="name" outerRadius={105} label>
                        {reportesPorFormato.map((entry, index) => (
                          <Cell key={`formato-${entry.name}`} fill={['#0d6efd', '#198754', '#ffc107', '#6f42c1', '#dc3545'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState />
                )}
              </ChartPanel>
            </div>
          </div>

          <MetricPanel title="Últimos reportes" subtitle="Líneas de salida generadas por el sistema" count={reportes.length} tone="info">
            {reportes.length ? (
              [...reportes]
                .sort((a, b) => new Date(b?.fechaGeneracion || 0) - new Date(a?.fechaGeneracion || 0))
                .map((item) => (
                  <MetricLine
                    key={item.id}
                    left={`Reporte #${item.id}`}
                    title={item.tipoReporte || 'Sin tipo'}
                    subtitle={item.rutaArchivo || 'Sin ruta registrada'}
                    badge={item.formato || 'SIN_FORMATO'}
                    badgeTone="primary"
                    right={formatDate(item.fechaGeneracion)}
                    meta={`Periodo ${item.periodo || 'sin período'} · Usuario ${item.generadoPorUsuario || 'N/A'}`}
                  />
                ))
            ) : (
              <div className="p-3">
                <EmptyState message="No hay reportes registrados." />
              </div>
            )}
          </MetricPanel>
        </div>
      )}

      {tabActivo === 'admin' && (
        <>
          <AdminTabs active={adminActivo} onChange={setAdminActivo} />

          {adminActivo === 'general' && (
            <AdminPanel
              title="Administración KPI general"
              description="Gestión visual de métricas generales del sistema."
              createLabel="Crear KPI general"
              onCreate={() => setModalAdmin({ tipo: 'general', item: null, fields: generalFields, title: 'Crear KPI general' })}
            >
              {kpiGeneral.map((item) => (
                <AdminGeneralLine
                  key={item.id}
                  item={item}
                  onEdit={(row) => setModalAdmin({ tipo: 'general', item: row, fields: generalFields, title: 'Editar KPI general' })}
                  onDelete={(row) => runAction(() => monitoreoApi.eliminarKpiGeneral(row.id, token))}
                />
              ))}
            </AdminPanel>
          )}

          {adminActivo === 'proyectos' && (
            <AdminPanel
              title="Administración KPI por proyecto"
              description="Gestión visual de indicadores por proyecto."
              createLabel="Crear KPI proyecto"
              onCreate={() => setModalAdmin({ tipo: 'proyecto', item: null, fields: proyectoFields, title: 'Crear KPI proyecto' })}
            >
              {kpiProyecto.map((item) => (
                <AdminProjectLine
                  key={item.id}
                  item={item}
                  onEdit={(row) => setModalAdmin({ tipo: 'proyecto', item: row, fields: proyectoFields, title: 'Editar KPI proyecto' })}
                  onDelete={(row) => runAction(() => monitoreoApi.eliminarKpiProyecto(row.id, token))}
                />
              ))}
            </AdminPanel>
          )}

          {adminActivo === 'recursos' && (
            <AdminPanel
              title="Administración KPI por recurso"
              description="Gestión visual de carga, ocupación y disponibilidad por recurso."
              createLabel="Crear KPI recurso"
              onCreate={() => setModalAdmin({ tipo: 'recurso', item: null, fields: recursoFields, title: 'Crear KPI recurso' })}
            >
              {kpiRecurso.map((item) => (
                <AdminResourceLine
                  key={item.id}
                  item={item}
                  onEdit={(row) => setModalAdmin({ tipo: 'recurso', item: row, fields: recursoFields, title: 'Editar KPI recurso' })}
                  onDelete={(row) => runAction(() => monitoreoApi.eliminarKpiRecurso(row.id, token))}
                />
              ))}
            </AdminPanel>
          )}

          {adminActivo === 'reportes' && (
            <AdminPanel
              title="Administración de reportes"
              description="Gestión visual de reportes generados por el sistema."
              createLabel="Crear reporte"
              onCreate={() => setModalAdmin({ tipo: 'reporte', item: null, fields: reporteFields, title: 'Crear reporte' })}
            >
              {reportes.map((item) => (
                <AdminReportLine
                  key={item.id}
                  item={item}
                  onEdit={(row) => setModalAdmin({ tipo: 'reporte', item: row, fields: reporteFields, title: 'Editar reporte' })}
                  onDelete={(row) => runAction(() => monitoreoApi.eliminarReporte(row.id, token))}
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