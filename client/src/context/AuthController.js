/**
 * AuthController - Controlador de Autenticación
 * Encargado de la lógica de inicio de sesión y gestión de sesión local.
 */
class AuthController {
  static STORAGE_KEY = 'conote_user_session';

  /**
   * Valida las credenciales ingresadas por el usuario.
   * Credenciales por defecto: usuario "admin" y clave "admin".
   * 
   * @param {string} username - Nombre de usuario ingresado
   * @param {string} password - Contraseña ingresada
   * @returns {Object} { success: boolean, user?: Object, error?: string }
   */
  static login(username, password) {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanUser || !cleanPass) {
      return {
        success: false,
        error: 'Por favor, ingrese tanto el usuario como la contraseña.'
      };
    }

    // Validación con datos por defecto: usuario "admin" y clave "admin"
    if (cleanUser === 'admin' && cleanPass === 'admin') {
      const user = {
        username: 'admin',
        name: 'Administrador Principal',
        role: 'admin',
        email: 'admin@conote.local',
        avatar: '👑',
        loginTime: new Date().toISOString()
      };

      this.saveSession(user);

      return {
        success: true,
        user
      };
    }

    return {
      success: false,
      error: 'Credenciales inválidas. Compruebe el usuario y la contraseña (usuario: admin / clave: admin).'
    };
  }

  /**
   * Guarda la sesión del usuario en sessionStorage
   */
  static saveSession(user) {
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Error al guardar la sesión:', e);
    }
  }

  /**
   * Obtiene el usuario actual si existe una sesión activa
   */
  static getCurrentUser() {
    try {
      const data = sessionStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error al recuperar la sesión:', e);
      return null;
    }
  }

  /**
   * Verifica si existe una sesión activa
   */
  static isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  /**
   * Cierra la sesión del usuario
   */
  static logout() {
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.error('Error al cerrar la sesión:', e);
    }
  }
}

export default AuthController;
