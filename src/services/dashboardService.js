import api from './api';

const dashboardService = {
  /**
   * Obtener datos del dashboard ejecutivo
   */
  async getDashboardData() {
    const response = await api.get('/dashboard');
    return response.data;
  },

  /**
   * Obtener KPIs principales
   */
  async getKPIs() {
    const response = await api.get('/dashboard/kpis');
    return response.data;
  },

  /**
   * Obtener estadísticas de inventario
   */
  async getInventarioStats() {
    const response = await api.get('/dashboard/inventario-stats');
    return response.data;
  },

  /**
   * Obtener actividad reciente
   */
  async getActividadReciente(limit = 10) {
    const response = await api.get('/dashboard/actividad-reciente', {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Obtener alertas importantes
   */
  async getAlertas() {
    const response = await api.get('/dashboard/alertas');
    return response.data;
  },
};

export default dashboardService;
