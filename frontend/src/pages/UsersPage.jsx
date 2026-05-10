import { useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api.js';

const rolOptions = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'USER', label: 'USER' },
];

const perfilOptions = [
  'ADMINISTRADOR',
  'GESTOR',
  'DIRECTIVO',
  'LIDER_PROYECTO',
  'JEFE_PROYECTO',
  'DESARROLLADOR',
  'ARQUITECTO',
  'DISENADOR',
  'DEVOPS',
].map((value) => ({ value, label: value }));

function formatNumber(value) {
  const numero = Number(value);
  return new Intl.NumberFormat('es-CL').format(Number.isFinite(numero) ? numero : 0);
}

function getNombreUsuario(usuario) {
  return [usuario?.nombres, usuario?.apellidos].filter(Boolean).join(' ').trim() || `Usuario ${usuario?.id || 'N/A'}`;
}

function getInitials(usuario) {
  const nombres = String(usuario?.nombres || '').trim();
  const apellidos = String(usuario?.apellidos || '').trim();

  const inicialNombre = nombres[0] || '';
  const inicialApellido = apellidos[0] || '';

  return `${inicialNombre}${inicialApellido}`.toUpperCase() || 'U';
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

function StatPill({ label, value, tone = 'primary' }) {
  return (
    <div className={`border border-${tone} border-opacity-25 rounded-pill px-3 py-2 bg-${tone} bg-opacity-10`}>
      <span className={`small fw-semibold text-${tone}`}>{label}: </span>
      <span className="small fw-bold">{value}</span>
    </div>
  );
}

function UserAvatar({ usuario }) {
  const tone = usuario.activo ? getRolTone(usuario.rol) : 'secondary';

  return (
    <div
      className={`rounded-circle bg-${tone} bg-opacity-10 text-${tone} d-flex align-items-center justify-content-center fw-bold flex-shrink-0`}
      style={{ width: 38, height: 38 }}
    >
      {getInitials(usuario)}
    </div>
  );
}

function UserLine({ usuario, onEdit, onDelete, onActivate, onDeactivate }) {
  const rolTone = getRolTone(usuario.rol);
  const perfilTone = getPerfilTone(usuario.perfil);

  return (
    <div className="border-bottom px-3 py-2">
      <div className="row g-2 align-items-center">
        <div className="col-12 col-xl-4">
          <div className="d-flex align-items-center gap-2">
            <UserAvatar usuario={usuario} />

            <div className="min-w-0">
              <div className="fw-semibold small text-truncate">{getNombreUsuario(usuario)}</div>
              <div className="small text-muted text-truncate">{usuario.correo || 'Sin correo registrado'}</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-xl-2">
          <span className={`badge rounded-pill text-bg-${rolTone}`}>
            {usuario.rol || 'SIN_ROL'}
          </span>
        </div>

        <div className="col-6 col-xl-2">
          <span className={`badge rounded-pill text-bg-${perfilTone}`}>
            {usuario.perfil || 'SIN_PERFIL'}
          </span>
        </div>

        <div className="col-6 col-xl-1">
          <span className={`badge rounded-pill text-bg-${usuario.activo ? 'success' : 'secondary'}`}>
            {usuario.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <div className="col-6 col-xl-1 text-xl-end">
          <div className="small text-muted">ID {usuario.id}</div>
        </div>

        <div className="col-12 col-xl-2">
          <div className="d-flex justify-content-xl-end flex-wrap gap-1">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary rounded-pill px-2"
              onClick={() => onEdit(usuario)}
            >
              Editar
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger rounded-pill px-2"
              onClick={() => onDelete(usuario)}
            >
              Eliminar
            </button>

            {usuario.activo ? (
              <button
                type="button"
                className="btn btn-sm btn-outline-warning rounded-pill px-2"
                onClick={() => onDeactivate(usuario)}
              >
                Desactivar
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-sm btn-outline-success rounded-pill px-2"
                onClick={() => onActivate(usuario)}
              >
                Activar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersPanel({
  usuarios,
  filtroTexto,
  setFiltroTexto,
  filtroRol,
  setFiltroRol,
  filtroPerfil,
  setFiltroPerfil,
  filtroEstado,
  setFiltroEstado,
  onCreate,
  children,
}) {
  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-3">
        <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3 mb-3">
          <div>
            <h5 className="mb-0">Panel de usuarios</h5>
            <div className="small text-muted">
              Gestión visual de accesos, roles, perfiles y estado operativo.
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-primary rounded-pill px-3"
            onClick={onCreate}
          >
            Crear usuario
          </button>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-12 col-xl-4">
            <input
              className="form-control form-control-sm rounded-pill"
              placeholder="Buscar por nombre, correo, rol o perfil"
              value={filtroTexto}
              onChange={(event) => setFiltroTexto(event.target.value)}
            />
          </div>

          <div className="col-12 col-md-4 col-xl-2">
            <select
              className="form-select form-select-sm rounded-pill"
              value={filtroRol}
              onChange={(event) => setFiltroRol(event.target.value)}
            >
              <option value="todos">Todos los roles</option>
              {rolOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4 col-xl-3">
            <select
              className="form-select form-select-sm rounded-pill"
              value={filtroPerfil}
              onChange={(event) => setFiltroPerfil(event.target.value)}
            >
              <option value="todos">Todos los perfiles</option>
              {perfilOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4 col-xl-2">
            <select
              className="form-select form-select-sm rounded-pill"
              value={filtroEstado}
              onChange={(event) => setFiltroEstado(event.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>

          <div className="col-12 col-xl-1">
            <div className="border rounded-pill px-3 py-1 text-center bg-light small fw-semibold h-100 d-flex align-items-center justify-content-center">
              {formatNumber(usuarios.length)}
            </div>
          </div>
        </div>

        <div className="border rounded-4 overflow-hidden bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

function UserFormModal({ title, fields, item, onClose, onSubmit }) {
  const [form, setForm] = useState(() => {
    const initial = {};

    fields.forEach((field) => {
      if (field.type === 'checkbox') {
        initial[field.name] = Boolean(item?.[field.name] ?? field.defaultValue ?? false);
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
              <div className="small text-muted">
                Configuración de identidad, acceso y perfil del usuario.
              </div>
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

export default function UsersPage({ session, token, onError }) {
  const [usuarios, setUsuarios] = useState([]);
  const [modalUsuario, setModalUsuario] = useState(null);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [filtroPerfil, setFiltroPerfil] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const load = async () => {
    try {
      setUsuarios(await authApi.listarUsuarios(token));
    } catch (error) {
      onError(error.message);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const nombreUsuario = [session?.nombres, session?.apellidos].filter(Boolean).join(' ') || 'Usuario';

  const fields = [
    { name: 'nombres', label: 'Nombres', required: true },
    { name: 'apellidos', label: 'Apellidos', required: true },
    { name: 'correo', label: 'Correo', type: 'email', required: true },
    { name: 'contrasena', label: 'Contraseña', type: 'password', required: true, col: 'col-md-6' },
    { name: 'rol', label: 'Rol', type: 'select', options: rolOptions, required: true },
    { name: 'perfil', label: 'Perfil', type: 'select', options: perfilOptions, required: true },
    { name: 'activo', label: 'Activo', type: 'checkbox', defaultValue: true },
  ];

  const editFields = fields.filter((field) => field.name !== 'contrasena');

  const resumen = useMemo(() => {
    const activos = usuarios.filter((usuario) => usuario.activo).length;
    const inactivos = usuarios.length - activos;
    const admins = usuarios.filter((usuario) => String(usuario.rol || '').toUpperCase() === 'ADMIN').length;
    const users = usuarios.filter((usuario) => String(usuario.rol || '').toUpperCase() === 'USER').length;

    return {
      total: usuarios.length,
      activos,
      inactivos,
      admins,
      users,
    };
  }, [usuarios]);

  const usuariosFiltrados = useMemo(() => {
    const texto = filtroTexto.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const cumpleTexto = !texto || JSON.stringify(usuario).toLowerCase().includes(texto);
      const cumpleRol = filtroRol === 'todos' || String(usuario.rol || '').toUpperCase() === filtroRol;
      const cumplePerfil = filtroPerfil === 'todos' || String(usuario.perfil || '').toUpperCase() === filtroPerfil;

      const cumpleEstado =
        filtroEstado === 'todos' ||
        (filtroEstado === 'activos' && usuario.activo) ||
        (filtroEstado === 'inactivos' && !usuario.activo);

      return cumpleTexto && cumpleRol && cumplePerfil && cumpleEstado;
    });
  }, [usuarios, filtroTexto, filtroRol, filtroPerfil, filtroEstado]);

  const runAction = async (action) => {
    try {
      await action();
      await load();
    } catch (error) {
      onError(error.message);
    }
  };

  const handleSubmitUsuario = async (payload) => {
    if (!modalUsuario) return;

    await runAction(async () => {
      const payloadFinal = { ...payload, activo: !!payload.activo };

      if (modalUsuario.item?.id) {
        await authApi.actualizarUsuario(modalUsuario.item.id, payloadFinal, token);
      } else {
        await authApi.crearUsuario(payloadFinal, token);
      }
    });

    setModalUsuario(null);
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
        <StatPill label="Usuarios" value={formatNumber(resumen.total)} tone="primary" />
        <StatPill label="Activos" value={formatNumber(resumen.activos)} tone="success" />
        <StatPill label="Inactivos" value={formatNumber(resumen.inactivos)} tone={resumen.inactivos > 0 ? 'warning' : 'secondary'} />
        <StatPill label="Administradores" value={formatNumber(resumen.admins)} tone="danger" />
        <StatPill label="Usuarios estándar" value={formatNumber(resumen.users)} tone="info" />
      </div>

      <UsersPanel
        usuarios={usuariosFiltrados}
        filtroTexto={filtroTexto}
        setFiltroTexto={setFiltroTexto}
        filtroRol={filtroRol}
        setFiltroRol={setFiltroRol}
        filtroPerfil={filtroPerfil}
        setFiltroPerfil={setFiltroPerfil}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        onCreate={() => setModalUsuario({ item: null, fields, title: 'Crear usuario' })}
      >
        {usuariosFiltrados.length ? (
          usuariosFiltrados.map((usuario) => (
            <UserLine
              key={usuario.id}
              usuario={usuario}
              onEdit={(item) => setModalUsuario({ item, fields: editFields, title: 'Editar usuario' })}
              onDelete={(item) => runAction(() => authApi.eliminarUsuario(item.id, token))}
              onActivate={(item) => runAction(() => authApi.activarUsuario(item.id, token))}
              onDeactivate={(item) => runAction(() => authApi.desactivarUsuario(item.id, token))}
            />
          ))
        ) : (
          <div className="p-4 text-center text-muted small">
            No hay usuarios para los filtros seleccionados.
          </div>
        )}
      </UsersPanel>

      {modalUsuario ? (
        <UserFormModal
          title={modalUsuario.title}
          fields={modalUsuario.fields}
          item={modalUsuario.item}
          onClose={() => setModalUsuario(null)}
          onSubmit={handleSubmitUsuario}
        />
      ) : null}
    </div>
  );
}