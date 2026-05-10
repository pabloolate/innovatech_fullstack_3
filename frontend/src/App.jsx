import { useEffect, useMemo, useState } from 'react';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ResourcesPage from './pages/ResourcesPage.jsx';
import MonitoringPage from './pages/MonitoringPage.jsx';
import NoAccessPage from './pages/NoAccessPage.jsx';
import { authApi } from './services/api.js';
import { guardarSesion, leerSesion, limpiarSesion, modulosDisponibles } from './utils/auth.js';

function getRouteFromHash() {
  const hash = window.location.hash || '#/login';
  const clean = hash.replace('#/', '');
  return clean || 'login';
}

function goTo(hash) {
  window.location.hash = hash;
}

export default function App() {
  const [route, setRoute] = useState(getRouteFromHash());
  const [session, setSession] = useState(leerSesion());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  useEffect(() => {
    const current = leerSesion();
    setSession(current);
  }, []);

  const token = session?.token || null;
  const modulos = modulosDisponibles(session);

  useEffect(() => {
    if (!session && route !== 'login') {
      goTo('#/login');
    }
    if (session && route === 'login') {
      goTo('#/dashboard');
    }
  }, [session, route]);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const data = await authApi.login(credentials);
      guardarSesion(data);
      setSession(data);
      goTo('#/dashboard');
    } catch (err) {
      setError(err.message || 'No fue posible iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    limpiarSesion();
    setSession(null);
    setError('');
    goTo('#/login');
  };

  const pushError = (message) => setError(message || 'Ocurrió un error.');

  const content = useMemo(() => {
    if (!session) {
      return <LoginPage onLogin={handleLogin} error={error} loading={loading} />;
    }

    if (route === 'usuarios') {
      return modulos.usuarios ? <UsersPage session={session} token={token} onError={setError}  /> : <NoAccessPage />;
    }
    if (route === 'proyectos') {
      return modulos.proyectos ? <ProjectsPage session={session} token={token} onError={pushError} /> : <NoAccessPage />;
    }
    if (route === 'recursos') {
      return modulos.recursos ? <ResourcesPage session={session} token={token} onError={pushError} /> : <NoAccessPage />;
    }
    if (route === 'monitoreo') {
      return modulos.monitoreo ? <MonitoringPage session={session} token={token} onError={pushError} /> : <NoAccessPage />;
    }
    return <DashboardPage session={session} token={token} onError={pushError} />;
  }, [session, route, error, loading, token]);

  if (!session) {
    return content;
  }

  return (
    <>
      {error ? (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 2000, width: 'min(900px, 95vw)' }}>
          <div className="alert alert-danger shadow-sm d-flex justify-content-between align-items-center mb-0">
            <span>{error}</span>
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        </div>
      ) : null}
      <Layout session={session} route={route} onLogout={handleLogout}>
        {content}
      </Layout>
    </>
  );
}
