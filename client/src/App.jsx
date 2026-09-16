import { useEffect } from 'react';
import { useAuth } from './hooks/useGlobalState';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const { user, handleLoginSuccess, loading, setLoading, getCurrentUser, logout } = useAuth();

  // Verificar la sesión local al cargar la aplicación
  useEffect(() => {
    const currentUser = getCurrentUser();
    console.log(currentUser);
    if (currentUser) {
      handleLoginSuccess(currentUser);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#090d16',
        color: '#94a3b8',
        fontFamily: 'sans-serif'
      }}>
        Cargando CoNote...
      </div>
    );
  }

  return (
    <div className="app-container">
      {user ? (
        <Dashboard user={user} onLogout={logout} />
      ) : (
        <Login/>
      )}
    </div>
  );
}

export default App;
