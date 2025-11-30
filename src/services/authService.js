import api from './api';

const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials) {
    const response = await api.post('/login', credentials);
    const { token, user, password_changed } = response.data;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('password_changed', password_changed ? 'true' : 'false');

    return { token, user, password_changed };
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('password_changed');
    }
    return { success: true };
  },

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Verificar si está autenticado
   */
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Verificar si cambió la contraseña
   */
  hasChangedPassword() {
    return localStorage.getItem('password_changed') === 'true';
  },

  /**
   * Obtener información del usuario desde el servidor
   */
  async me() {
    const response = await api.get('/me');
    const { user, password_changed } = response.data;

    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('password_changed', password_changed ? 'true' : 'false');

    return { user, password_changed };
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(passwordData) {
    const response = await api.post('/change-password', passwordData);
    const { user, password_changed } = response.data;

    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('password_changed', password_changed ? 'true' : 'false');

    return response.data;
  },
};

export default authService;
