import axios from 'axios';
import { Notify } from 'quasar';

// Configuración base de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo de errores comunes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expirado o no válido
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          window.location.href = '/#/login';
          Notify.create({
            type: 'negative',
            message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
            position: 'top',
          });
          break;
        case 403:
          Notify.create({
            type: 'negative',
            message: 'No tienes permisos para realizar esta acción.',
            position: 'top',
          });
          break;
        case 404:
      }
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      Notify.create({
        type: 'negative',
        message: 'No se pudo conectar con el servidor. Verifica tu conexión.',
        position: 'top',
      });
    } else {
      // Algo pasó al configurar la petición
      Notify.create({
        type: 'negative',
        message: 'Error al procesar la solicitud.',
        position: 'top',
      });
    }
    return Promise.reject(error);
  }
);

export default api;
