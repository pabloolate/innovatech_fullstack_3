import { useState } from 'react';

export default function LoginPage({ onLogin, error, loading }) {
  const [correo, setCorreo] = useState('olate.pablo@gmail.com');
  const [contrasena, setContrasena] = useState('Fullstack2026@');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin({ correo, contrasena });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card card-soft">
            <div className="card-body p-4 p-lg-5">
              <div className="text-center mb-4">
                <div className="small text-uppercase text-muted fw-bold">Innovatech Solutions</div>
                <h2 className="mb-1">Ingreso al sistema</h2>
                <div className="text-muted">Usuarios, proyectos, recursos y KPI</div>
              </div>

              {error ? <div className="alert alert-danger">{error}</div> : null}

              <form onSubmit={handleSubmit} className="d-grid gap-3">
                <div>
                  <label className="form-label fw-semibold">Correo</label>
                  <input className="form-control" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input className="form-control" type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
                </div>
                <button className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? 'Ingresando...' : 'Entrar'}
                </button>
              </form>

              <div className="mt-4 small text-muted">
                Puedes iniciar con los usuarios ya sembrados, por ejemplo el admin de Pablo o Balbi.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
