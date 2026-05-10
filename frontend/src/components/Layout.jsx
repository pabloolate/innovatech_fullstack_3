import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { limpiarSesion, modulosDisponibles } from '../utils/auth.js';

const LINKS = [
  { key: 'dashboard', label: 'Dashboard', hash: '#/dashboard' },
  { key: 'usuarios', label: 'Usuarios', hash: '#/usuarios' },
  { key: 'proyectos', label: 'Proyectos', hash: '#/proyectos' },
  { key: 'recursos', label: 'Recursos', hash: '#/recursos' },
  { key: 'monitoreo', label: 'Monitoreo KPI', hash: '#/monitoreo' },
];

function leerModoOscuroInicial() {
  const guardado = localStorage.getItem('innovatech_dark_mode');

  if (guardado === 'true') return true;
  if (guardado === 'false') return false;

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
}

export default function Layout({ session, route, children, onLogout }) {
  const modulos = modulosDisponibles(session);
  const [modoOscuro, setModoOscuro] = useState(leerModoOscuroInicial);

  useEffect(() => {
    localStorage.setItem('innovatech_dark_mode', String(modoOscuro));
    document.body.classList.toggle('app-dark', modoOscuro);
    document.documentElement.setAttribute('data-bs-theme', modoOscuro ? 'dark' : 'light');
  }, [modoOscuro]);

  const linksVisibles = LINKS.filter((link) => modulos[link.key]);

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-topbar-inner">
          <a href="#/dashboard" className="app-logo-link" aria-label="Ir al dashboard">
            <img
              src={logo}
              alt="Innovatech Solutions"
              className="app-logo"
              style={{
                '--logo-width': '230px',
                '--logo-height': '58px',
              }}
            />
          </a>

          <nav className="app-topnav" aria-label="Navegación principal">
            {linksVisibles.map((link) => (
              <a
                key={link.key}
                href={link.hash}
                className={`app-topnav-link ${route === link.key ? 'active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="app-topbar-actions">
            <button
              type="button"
              className={`theme-toggle ${modoOscuro ? 'active' : ''}`}
              onClick={() => setModoOscuro((prev) => !prev)}
              aria-label={modoOscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
              title={modoOscuro ? 'Modo claro' : 'Modo oscuro'}
            >
              <span className="theme-toggle-icon">{modoOscuro ? '☀' : '☾'}</span>
              <span className="theme-toggle-text">{modoOscuro ? 'Claro' : 'Oscuro'}</span>
            </button>

            <button
              className="btn btn-sm btn-outline-danger rounded-pill px-3"
              onClick={() => {
                limpiarSesion();
                onLogout();
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="card card-soft app-content-card">
          <div className="card-body">{children}</div>
        </div>
      </main>
    </div>
  );
}