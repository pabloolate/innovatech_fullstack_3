async function request(path, options = {}, token = null) {
  const headers = {
    ...(options.headers || {}),
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers,
    body: options.body && !(options.body instanceof FormData)
      ? JSON.stringify(options.body)
      : options.body,
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const error = new Error(
      typeof payload === 'string' && payload
        ? payload
        : payload?.message || `Error ${response.status}`
    );

    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const authApi = {
  login: (body) => request('/api/auth/login', { method: 'POST', body }),
  me: (token) => request('/api/auth/me', { method: 'GET' }, token),

  listarUsuarios: (token) => request('/api/usuarios', { method: 'GET' }, token),
  crearUsuario: (body, token) => request('/api/usuarios', { method: 'POST', body }, token),
  actualizarUsuario: (id, body, token) => request(`/api/usuarios/${id}`, { method: 'PUT', body }, token),
  activarUsuario: (id, token) => request(`/api/usuarios/${id}/activar`, { method: 'PATCH' }, token),
  desactivarUsuario: (id, token) => request(`/api/usuarios/${id}/desactivar`, { method: 'PATCH' }, token),
  eliminarUsuario: (id, token) => request(`/api/usuarios/${id}`, { method: 'DELETE' }, token),
};

export const proyectosApi = {
  listarProyectos: (token) => request('/api/proyectos', { method: 'GET' }, token),
  crearProyecto: (body, token) => request('/api/proyectos', { method: 'POST', body }, token),
  actualizarProyecto: (id, body, token) => request(`/api/proyectos/${id}`, { method: 'PUT', body }, token),
  activarProyecto: (id, token) => request(`/api/proyectos/${id}/activar`, { method: 'PATCH' }, token),
  desactivarProyecto: (id, token) => request(`/api/proyectos/${id}/desactivar`, { method: 'PATCH' }, token),
  eliminarProyecto: (id, token) => request(`/api/proyectos/${id}`, { method: 'DELETE' }, token),

  listarTareas: (token) => request('/api/tareas', { method: 'GET' }, token),
  crearTarea: (body, token) => request('/api/tareas', { method: 'POST', body }, token),
  actualizarTarea: (id, body, token) => request(`/api/tareas/${id}`, { method: 'PUT', body }, token),
  activarTarea: (id, token) => request(`/api/tareas/${id}/activar`, { method: 'PATCH' }, token),
  desactivarTarea: (id, token) => request(`/api/tareas/${id}/desactivar`, { method: 'PATCH' }, token),
  eliminarTarea: (id, token) => request(`/api/tareas/${id}`, { method: 'DELETE' }, token),

  listarParticipantes: (token) => request('/api/participantes-proyecto', { method: 'GET' }, token),
  crearParticipante: (body, token) => request('/api/participantes-proyecto', { method: 'POST', body }, token),
  actualizarParticipante: (id, body, token) => request(`/api/participantes-proyecto/${id}`, { method: 'PUT', body }, token),
  activarParticipante: (id, token) => request(`/api/participantes-proyecto/${id}/activar`, { method: 'PATCH' }, token),
  desactivarParticipante: (id, token) => request(`/api/participantes-proyecto/${id}/desactivar`, { method: 'PATCH' }, token),
  eliminarParticipante: (id, token) => request(`/api/participantes-proyecto/${id}`, { method: 'DELETE' }, token),
};

export const recursosApi = {
  listarRecursos: (token) => request('/api/recursos', { method: 'GET' }, token),
  crearRecurso: (body, token) => request('/api/recursos', { method: 'POST', body }, token),
  actualizarRecurso: (id, body, token) => request(`/api/recursos/${id}`, { method: 'PUT', body }, token),
  activarRecurso: (id, token) => request(`/api/recursos/${id}/activar`, { method: 'PATCH' }, token),
  desactivarRecurso: (id, token) => request(`/api/recursos/${id}/desactivar`, { method: 'PATCH' }, token),
  eliminarRecurso: (id, token) => request(`/api/recursos/${id}`, { method: 'DELETE' }, token),
  obtenerCargaLaboral: (id, token) => request(`/api/recursos/${id}/carga-laboral`, { method: 'GET' }, token),

  listarAsignaciones: (token) => request('/api/asignaciones-recurso', { method: 'GET' }, token),
  crearAsignacion: (body, token) => request('/api/asignaciones-recurso', { method: 'POST', body }, token),
  actualizarAsignacion: (id, body, token) => request(`/api/asignaciones-recurso/${id}`, { method: 'PUT', body }, token),
  eliminarAsignacion: (id, token) => request(`/api/asignaciones-recurso/${id}`, { method: 'DELETE' }, token),

  listarDisponibilidades: (token) => request('/api/disponibilidades-recurso', { method: 'GET' }, token),
  crearDisponibilidad: (body, token) => request('/api/disponibilidades-recurso', { method: 'POST', body }, token),
  actualizarDisponibilidad: (id, body, token) => request(`/api/disponibilidades-recurso/${id}`, { method: 'PUT', body }, token),
  eliminarDisponibilidad: (id, token) => request(`/api/disponibilidades-recurso/${id}`, { method: 'DELETE' }, token),
};

export const calendarioApi = {
  sincronizarTarea: (id, body, token) => request(`/api/calendario/tareas/${id}/sync`, { method: 'POST', body }, token),
  sincronizarProyecto: (id, body, token) => request(`/api/calendario/proyectos/${id}/sync`, { method: 'POST', body }, token),
  eliminarSincronizacionTarea: (id, token) => request(`/api/calendario/tareas/${id}/unsync`, { method: 'POST' }, token),
  eliminarSincronizacionProyecto: (id, token) => request(`/api/calendario/proyectos/${id}/unsync`, { method: 'POST' }, token),
  listarEventos: (token) => request('/api/calendario/eventos', { method: 'GET' }, token),
  listarVinculos: (token) => request('/api/calendario/vinculos', { method: 'GET' }, token),
};

export const monitoreoApi = {
  listarKpiGeneral: (token) => request('/api/kpi-general', { method: 'GET' }, token),
  crearKpiGeneral: (body, token) => request('/api/kpi-general', { method: 'POST', body }, token),
  actualizarKpiGeneral: (id, body, token) => request(`/api/kpi-general/${id}`, { method: 'PUT', body }, token),
  eliminarKpiGeneral: (id, token) => request(`/api/kpi-general/${id}`, { method: 'DELETE' }, token),

  listarKpiProyecto: (token) => request('/api/kpi-proyecto', { method: 'GET' }, token),
  crearKpiProyecto: (body, token) => request('/api/kpi-proyecto', { method: 'POST', body }, token),
  actualizarKpiProyecto: (id, body, token) => request(`/api/kpi-proyecto/${id}`, { method: 'PUT', body }, token),
  eliminarKpiProyecto: (id, token) => request(`/api/kpi-proyecto/${id}`, { method: 'DELETE' }, token),

  listarKpiRecurso: (token) => request('/api/kpi-recurso', { method: 'GET' }, token),
  crearKpiRecurso: (body, token) => request('/api/kpi-recurso', { method: 'POST', body }, token),
  actualizarKpiRecurso: (id, body, token) => request(`/api/kpi-recurso/${id}`, { method: 'PUT', body }, token),
  eliminarKpiRecurso: (id, token) => request(`/api/kpi-recurso/${id}`, { method: 'DELETE' }, token),

  listarReportes: (token) => request('/api/reportes-generados', { method: 'GET' }, token),
  crearReporte: (body, token) => request('/api/reportes-generados', { method: 'POST', body }, token),
  actualizarReporte: (id, body, token) => request(`/api/reportes-generados/${id}`, { method: 'PUT', body }, token),
  eliminarReporte: (id, token) => request(`/api/reportes-generados/${id}`, { method: 'DELETE' }, token),
};