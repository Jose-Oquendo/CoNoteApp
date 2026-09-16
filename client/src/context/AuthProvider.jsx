import { useState } from 'react'
import { AuthContext } from './GlobalContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);

  const saveSession = (suser, token) => {
    try {
      sessionStorage.setItem('conote_token_session', JSON.stringify(token));
      console.log(suser);
      sessionStorage.setItem('conote_user_session', JSON.stringify(suser));
    } catch (e) {
      console.error('Error al guardar la sesión:', e);
    }
  }

  const login = async (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanUser || !cleanPass) {
      return {
        success: false,
        error: 'Por favor, ingrese tanto el usuario como la contraseña.'
      };
    }

    let res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: cleanUser, password: cleanPass })
    });
    res = await res.json();

    console.log(res);

    if(res.user){
      setUser({
        username: res.user.username,
        name: res.user.name,
        role: res.user.role,
        email: res.user.email,
        loginTime: new Date().toISOString()
      });
      saveSession(res.user,res.token);

      return { success: true };
    }

    return {
      success: false,
      error: res.error || 'Credenciales inválidas. Compruebe el usuario y la contraseña (usuario: admin / clave: admin).'
    };
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const getCurrentUser = () => {
    try {
      const data = sessionStorage.getItem('conote_user_session');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error al recuperar la sesión:', e);
      return null;
    }
  }

  const isAuthenticated = () => {
    return getCurrentUser() !== null;
  }

  const logout = () => {
    setUser(null);
    try {
      sessionStorage.removeItem('conote_token_session');
      sessionStorage.removeItem('conote_user_session');
    } catch (e) {
      console.error('Error al cerrar la sesión:', e);
    }
  }

  // 3. El return SOLO agrupa lo que los componentes van a usar
  const value = {
    user,
    setUser,
    loading,
    setLoading,
    login,
    handleLoginSuccess,
    isAuthenticated,
    getCurrentUser,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}