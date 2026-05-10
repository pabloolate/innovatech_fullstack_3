export const STORAGE_KEY = 'innovatech_auth';

export function guardarSesion(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function leerSesion() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function limpiarSesion() {
  localStorage.removeItem(STORAGE_KEY);
}

export function esAdmin(session) {
  return session?.rol === 'ADMIN';
}

export function perfilNormalizado(session) {
  return session?.perfil || '';
}

export function puedeVerUsuarios(session) {
  return esAdmin(session);
}

export function puedeVerProyectos(session) {
  if (esAdmin(session)) return true;
  return ['GESTOR', 'LIDER_PROYECTO'].includes(perfilNormalizado(session));
}

export function puedeVerRecursos(session) {
  if (esAdmin(session)) return true;
  return ['GESTOR', 'JEFE_PROYECTO'].includes(perfilNormalizado(session));
}

export function puedeVerMonitoreo(session) {
  if (esAdmin(session)) return true;
  return ['GESTOR', 'DIRECTIVO'].includes(perfilNormalizado(session));
}

export function modulosDisponibles(session) {
  return {
    dashboard: !!session,
    usuarios: puedeVerUsuarios(session),
    proyectos: puedeVerProyectos(session),
    recursos: puedeVerRecursos(session),
    monitoreo: puedeVerMonitoreo(session),
  };
}
