import { useState } from 'react';
import { useAuth } from '../hooks/useGlobalState';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Ejecutamos la autenticación mediante el controlador
    const result = await login(username, password);
    console.log(result);
    setTimeout(() => {
      setLoading(false);
      if (!result.success) {
        setError(result.error);
      }
    }, 300); // Pequeña pausa táctil para mejor experiencia de usuario
  };

  const handleQuickAdmin = () => {
    setUsername('admin@example.com');
    setPassword('admin');
    setError('');
    
    // Auto-login con credenciales por defecto
    login('admin@example.com', 'admin');
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow" />

      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">CoNote</h1>
          <p className="login-subtitle">Espacio Digital de Trabajo & Tablero Interactivo</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <div className="input-wrapper">
              <span className="input-icon"><i className="bi bi-person-bounding-box"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su usuario (ej: admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4 w-100" disabled={loading}>
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <button type="button" className="quick-fill-btn" onClick={handleQuickAdmin}>
          <span>Ingreso Rápido con credenciales por defecto (admin / admin)</span>
        </button>
      </div>
    </div>
  );
}
