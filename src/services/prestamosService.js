import api from './api';

const prestamosService = {
  /**
   * Obtener todos los préstamos
   */
  async getPrestamos(params = {}) {
    const response = await api.get('/prestamos', { params });
    return response.data;
  },

  /**
   * Obtener un préstamo por ID
   */
  async getPrestamo(id) {
    const response = await api.get(`/prestamos/${id}`);
    return response.data;
  },

  /**
   * Crear nuevo préstamo
   */
  async createPrestamo(prestamoData) {
    const response = await api.post('/prestamos', prestamoData);
    return response.data;
  },

  /**
   * Actualizar préstamo
   */
  async updatePrestamo(id, prestamoData) {
    const response = await api.put(`/prestamos/${id}`, prestamoData);
    return response.data;
  },

  /**
   * Devolver préstamo
   */
  async devolverPrestamo(id, devolucionData) {
    const response = await api.post(`/prestamos/${id}/devolver`, devolucionData);
    return response.data;
  },

  /**
   * Cancelar préstamo
   */
  async cancelarPrestamo(id, motivo) {
    const response = await api.post(`/prestamos/${id}/cancelar`, { motivo });
    return response.data;
  },

  /**
   * Obtener préstamos activos
   */
  async getPrestamosActivos(params = {}) {
    const response = await api.get('/prestamos/activos', { params });
    return response.data;
  },

  /**
   * Obtener préstamos vencidos
   */
  async getPrestamosVencidos(params = {}) {
    const response = await api.get('/prestamos/vencidos', { params });
    return response.data;
  },

  /**
   * Obtener devoluciones programadas para hoy
   */
  async getDevolucionesHoy() {
    const response = await api.get('/prestamos/devoluciones-hoy');
    return response.data;
  },

  /**
   * Obtener historial de préstamos
   */
  async getHistorial(params = {}) {
    const response = await api.get('/prestamos/historial', { params });
    return response.data;
  },

  /**
   * Enviar recordatorio manual
   */
  async enviarRecordatorio(id) {
    const response = await api.post(`/prestamos/${id}/recordatorio`);
    return response.data;
  },
};

export default prestamosService;
