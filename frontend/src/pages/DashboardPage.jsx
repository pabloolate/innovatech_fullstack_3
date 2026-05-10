import { useEffect, useMemo, useState } from 'react';
import { authApi, proyectosApi, recursosApi, monitoreoApi } from '../services/api.js';
import { puedeVerMonitoreo, puedeVerProyectos, puedeVerRecursos, puedeVerUsuarios } from '../utils/auth.js';

function toNumber(value) {
  const numero = Number(value);
  return Number.isFinite(numero) ? numero : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat('es-CL').format(toNumber(value));
}

function getRolTone(rol) {
  const value = String(rol || '').toUpperCase();

  if (value === 'ADMIN') return 'danger';
  if (value === 'USER') return 'primary';

  return 'secondary';
}

function getPerfilTone(perfil) {
  const value = String(perfil || '').toUpperCase();

  if (value === 'ADMINISTRADOR') return 'danger';
  if (value === 'DIRECTIVO') return 'warning';
  if (value === 'GESTOR') return 'primary';
  if (value === 'LIDER_PROYECTO') return 'success';
  if (value === 'JEFE_PROYECTO') return 'success';
  if (value === 'ARQUITECTO') return 'info';
  if (value === 'DEVOPS') return 'dark';
  if (value === 'DESARROLLADOR') return 'secondary';
  if (value === 'DISENADOR') return 'secondary';

  return 'secondary';
}

function getNombreUsuario(session) {
  return [session?.nombres, session?.apellidos].filter(Boolean).join(' ') || 'Usuario';
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

function StatPill({ label, value, tone = 'primary' }) {
  return (
    <div className={`border border-${tone} border-opacity-25 rounded-pill px-3 py-2 bg-${tone} bg-opacity-10`}>
      <span className={`small fw-semibold text-${tone}`}>{label}: </span>
      <span className="small fw-bold">{value}</span>
    </div>
  );
}

function ModuleCard({ title, subtitle, value, helper, tone = 'primary', icon = '●', progress, visible }) {
  if (!visible) return null;

  return (
    <div className="col-12 col-md-6 col-xl-4">
      <div className={`card border-0 shadow-sm rounded-4 h-100 overflow-hidden`}>
        <div className={`bg-${tone} bg-opacity-10 border-bottom border-${tone} border-opacity-25 px-3 py-2`}>
          <div className="d-flex justify-content-between align-items-start gap-3">
            <div>
              <div className={`small fw-semibold text-${tone}`}>{title}</div>
              <div className="small text-muted">{subtitle}</div>
            </div>

            <div
              className={`rounded-circle bg-${tone} text-white d-flex align-items-center justify-content-center fw-bold`}
              style={{ width: 36, height: 36 }}
            >
              {icon}
            </div>
          </div>
        </div>

        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-end gap-3 mb-2">
            <div className="display-6 fw-bold mb-0">
              {value === null || value === undefined ? '...' : formatNumber(value)}
            </div>

            {typeof progress === 'number' ? (
              <span className={`badge rounded-pill text-bg-${tone}`}>
                {Math.round(progress)}%
              </span>
            ) : null}
          </div>

          {typeof progress === 'number' ? (
            <ProgressLine value={progress} tone={tone} height={9} />
          ) : null}

          {helper ? <div className="small text-muted mt-2">{helper}</div> : null}
        </div>
      </div>
    </div>
  );
}

function AccessLine({ label, description, enabled, tone = 'primary' }) {
  return (
    <div className="border-bottom py-2">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-xl-3">
          <div className="fw-semibold small">{label}</div>
          <div className="small text-muted">{description}</div>
        </div>

        <div className="col-6 col-xl-2">
          <span className={`badge rounded-pill text-bg-${enabled ? tone : 'secondary'}`}>
            {enabled ? 'Habilitado' : 'Oculto'}
          </span>
        </div>

        <div className="col-12 col-xl-5">
          <ProgressLine value={enabled ? 100 : 0} tone={enabled ? tone : 'secondary'} height={8} />
        </div>

        <div className="col-6 col-xl-2 text-xl-end">
          <div className="small text-muted">
            {enabled ? 'Visible para este usuario' : 'No visible por rol/perfil'}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessPanel({ permisos }) {
  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h6 className="mb-0">Accesos disponibles</h6>
            <div className="small text-muted">La vista cambia según rol y perfil del usuario.</div>
          </div>

          <span className="badge rounded-pill text-bg-dark">
            {permisos.filter((permiso) => permiso.enabled).length} / {permisos.length}
          </span>
        </div>

        <div className="border rounded-4 overflow-hidden bg-white">
          {permisos.map((permiso) => (
            <AccessLine
              key={permiso.label}
              label={permiso.label}
              description={permiso.description}
              enabled={permiso.enabled}
              tone={permiso.tone}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function WelcomePanel({ session, nombreUsuario, permisosActivos }) {
  const rolTone = getRolTone(session?.rol);
  const perfilTone = getPerfilTone(session?.perfil);

  return (
    <div className={`border border-${rolTone} border-opacity-25 rounded-4 overflow-hidden mb-3`}>
      <div className={`bg-${rolTone} bg-opacity-10 px-3 py-3 border-bottom border-${rolTone} border-opacity-25`}>
        <div className="d-flex flex-column flex-xl-row justify-content-between gap-3">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <h2 className="mb-0">Bienvenido: {nombreUsuario}</h2>
              <span className={`badge rounded-pill text-bg-${rolTone}`}>Rol: {session?.rol}</span>
              <span className={`badge rounded-pill text-bg-${perfilTone}`}>Perfil: {session?.perfil}</span>
            </div>

            <div className="small text-muted">
              Panel principal adaptado a los módulos disponibles para tu cuenta.
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-start">
            <StatPill label="Módulos visibles" value={formatNumber(permisosActivos)} tone={rolTone} />
            <StatPill label="Modo visual" value="Operativo" tone="primary" />
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-xl-8">
            <div className="small fw-semibold mb-1">Cobertura de acceso</div>
            <div className="d-flex align-items-center gap-2">
              <ProgressLine value={(permisosActivos / 4) * 100} tone={rolTone} height={12} />
              <span className="fw-bold">{formatNumber(permisosActivos)} / 4</span>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}

function DashboardTimeline({ cards }) {
  const visibles = cards.filter((card) => card.visible);

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h6 className="mb-0">Resumen operativo</h6>
            <div className="small text-muted">Líneas de lectura rápida según módulos habilitados.</div>
          </div>

          <span className="badge rounded-pill text-bg-primary">
            {formatNumber(visibles.length)}
          </span>
        </div>

        <div className="border rounded-4 overflow-hidden bg-white">
          {visibles.map((card) => (
            <div className="border-bottom py-2 px-3" key={card.label}>
              <div className="row g-2 align-items-center">
                <div className="col-12 col-xl-3">
                  <div className="fw-semibold small">{card.label}</div>
                  <div className="small text-muted">{card.subtitle}</div>
                </div>

                <div className="col-6 col-xl-2">
                  <span className={`badge rounded-pill text-bg-${card.tone}`}>
                    {card.value === null || card.value === undefined ? '...' : formatNumber(card.value)}
                  </span>
                </div>

                <div className="col-12 col-xl-5">
                  <ProgressLine value={card.progress} tone={card.tone} height={8} />
                </div>

                <div className="col-6 col-xl-2 text-xl-end">
                  <div className="small text-muted">{card.helper}</div>
                </div>
              </div>
            </div>
          ))}

          {!visibles.length ? (
            <div className="p-4 text-center text-muted small">
              No hay módulos visibles para este usuario.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage({ session, token, onError }) {
  const [stats, setStats] = useState({
    usuarios: null,
    usuariosActivos: null,
    proyectos: null,
    tareas: null,
    recursos: null,
    asignaciones: null,
    kpiGeneral: null,
    reportes: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const next = {
          usuarios: null,
          usuariosActivos: null,
          proyectos: null,
          tareas: null,
          recursos: null,
          asignaciones: null,
          kpiGeneral: null,
          reportes: null,
        };

        if (puedeVerUsuarios(session)) {
          const usuarios = await authApi.listarUsuarios(token);
          next.usuarios = usuarios.length;
          next.usuariosActivos = usuarios.filter((usuario) => usuario.activo).length;
        }

        if (puedeVerProyectos(session)) {
          const [proyectos, tareas] = await Promise.all([
            proyectosApi.listarProyectos(token),
            proyectosApi.listarTareas(token),
          ]);

          next.proyectos = proyectos.length;
          next.tareas = tareas.length;
        }

        if (puedeVerRecursos(session)) {
          const [recursos, asignaciones] = await Promise.all([
            recursosApi.listarRecursos(token),
            recursosApi.listarAsignaciones(token),
          ]);

          next.recursos = recursos.length;
          next.asignaciones = asignaciones.length;
        }

        if (puedeVerMonitoreo(session)) {
          const [kpiGeneral, reportes] = await Promise.all([
            monitoreoApi.listarKpiGeneral(token),
            monitoreoApi.listarReportes(token),
          ]);

          next.kpiGeneral = kpiGeneral.length;
          next.reportes = reportes.length;
        }

        if (!cancelled) setStats(next);
      } catch (error) {
        onError(error.message);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [session, token, onError]);

  const nombreUsuario = getNombreUsuario(session);

  const permisos = useMemo(() => {
    return [
      {
        label: 'Usuarios',
        description: 'Administración de cuentas, roles y perfiles.',
        enabled: puedeVerUsuarios(session),
        tone: 'danger',
      },
      {
        label: 'Proyectos',
        description: 'Gestión de proyectos, tareas y participantes.',
        enabled: puedeVerProyectos(session),
        tone: 'success',
      },
      {
        label: 'Recursos',
        description: 'Gestión de recursos, asignaciones y disponibilidad.',
        enabled: puedeVerRecursos(session),
        tone: 'warning',
      },
      {
        label: 'Monitoreo / KPI',
        description: 'Lectura de métricas, reportes e indicadores.',
        enabled: puedeVerMonitoreo(session),
        tone: 'info',
      },
    ];
  }, [session]);

  const permisosActivos = permisos.filter((permiso) => permiso.enabled).length;

  const maxValue = Math.max(
    1,
    ...[
      stats.usuarios,
      stats.proyectos,
      stats.tareas,
      stats.recursos,
      stats.asignaciones,
      stats.kpiGeneral,
      stats.reportes,
    ].map((value) => toNumber(value)),
  );

  const cards = [
    {
      label: 'Usuarios',
      subtitle: 'Cuentas registradas',
      value: stats.usuarios,
      visible: puedeVerUsuarios(session),
      tone: 'danger',
      icon: 'U',
      helper: `${formatNumber(stats.usuariosActivos)} activos`,
      progress: maxValue ? (toNumber(stats.usuarios) / maxValue) * 100 : 0,
    },
    {
      label: 'Proyectos',
      subtitle: 'Proyectos registrados',
      value: stats.proyectos,
      visible: puedeVerProyectos(session),
      tone: 'success',
      icon: 'P',
      helper: 'Portafolio visible',
      progress: maxValue ? (toNumber(stats.proyectos) / maxValue) * 100 : 0,
    },
    {
      label: 'Tareas',
      subtitle: 'Tareas del portafolio',
      value: stats.tareas,
      visible: puedeVerProyectos(session),
      tone: 'primary',
      icon: 'T',
      helper: 'Trabajo operativo',
      progress: maxValue ? (toNumber(stats.tareas) / maxValue) * 100 : 0,
    },
    {
      label: 'Recursos',
      subtitle: 'Recursos disponibles',
      value: stats.recursos,
      visible: puedeVerRecursos(session),
      tone: 'warning',
      icon: 'R',
      helper: 'Equipo registrado',
      progress: maxValue ? (toNumber(stats.recursos) / maxValue) * 100 : 0,
    },
    {
      label: 'Asignaciones',
      subtitle: 'Asignaciones activas o históricas',
      value: stats.asignaciones,
      visible: puedeVerRecursos(session),
      tone: 'info',
      icon: 'A',
      helper: 'Carga laboral',
      progress: maxValue ? (toNumber(stats.asignaciones) / maxValue) * 100 : 0,
    },
    {
      label: 'KPI General',
      subtitle: 'Cortes de monitoreo',
      value: stats.kpiGeneral,
      visible: puedeVerMonitoreo(session),
      tone: 'dark',
      icon: 'K',
      helper: 'Métricas registradas',
      progress: maxValue ? (toNumber(stats.kpiGeneral) / maxValue) * 100 : 0,
    },
    {
      label: 'Reportes',
      subtitle: 'Reportes generados',
      value: stats.reportes,
      visible: puedeVerMonitoreo(session),
      tone: 'secondary',
      icon: 'D',
      helper: 'Documentos de salida',
      progress: maxValue ? (toNumber(stats.reportes) / maxValue) * 100 : 0,
    },
  ];

  return (
    <div>
      <WelcomePanel
        session={session}
        nombreUsuario={nombreUsuario}
        permisosActivos={permisosActivos}
      />

      <div className="row g-3 mb-3">
        {cards.map((card) => (
          <ModuleCard
            key={card.label}
            title={card.label}
            subtitle={card.subtitle}
            value={card.value}
            helper={card.helper}
            tone={card.tone}
            icon={card.icon}
            progress={card.progress}
            visible={card.visible}
          />
        ))}
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-7">
          <DashboardTimeline cards={cards} />
        </div>

        <div className="col-12 col-xl-5">
          <AccessPanel permisos={permisos} />
        </div>
      </div>
    </div>
  );
}