// import api from './api'; // Descomentar cuando se active el backend

const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials) {
    // const response = await api.post('/auth/login', credentials);
    // const { token, user } = response.data;
    // localStorage.setItem('auth_token', token);
    // localStorage.setItem('user_data', JSON.stringify(user));
    // return { token, user };
    
    // SIMULADO
    const mockUser = {
      id: 1,
      nombre: 'Usuario Demo',
      email: credentials.email,
      rol: 'Super Administrador',
    };
    const mockToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    return Promise.resolve({ token: mockToken, user: mockUser });
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    // await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    return Promise.resolve({ success: true });
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
   * Refrescar token
   */
  async refreshToken() {
    // const response = await api.post('/auth/refresh');
    // const { token } = response.data;
    // localStorage.setItem('auth_token', token);
    // return token;
    
    return Promise.resolve('refreshed-token');
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(_passwordData) {
    // const response = await api.post('/auth/change-password', passwordData);
    // return response.data;
    
    return Promise.resolve({ success: true });
  },
};

export default authService;
