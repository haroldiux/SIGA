import api from './api';

const traspasosService = {
  /**
   * Obtener todos los traspasos (movimientos tipo 'traspaso')
   */
  async getTraspasos(params = {}) {
    const response = await api.get('/movimientos-inventario', {
      params: { ...params, tipo: 'traspaso' }
    });
    return response.data;
  },

  /**
   * Obtener un traspaso por ID
   */
  async getTraspaso(id) {
    const response = await api.get(`/movimientos-inventario/${id}`);
    return response.data;
  },

  /**
   * Crear nuevo traspaso
   */
  async createTraspaso(traspasoData) {
    const response = await api.post('/movimientos-inventario/traspaso', traspasoData);
    return response.data;
  },

  /**
   * Aprobar traspaso
   */
  async aprobarTraspaso(id) {
    const response = await api.post(`/movimientos-inventario/${id}/aprobar`);
    return response.data;
  },

  /**
   * Cancelar traspaso
   */
  async cancelarTraspaso(id, motivo) {
    const response = await api.post(`/movimientos-inventario/${id}/cancelar`, { motivo });
    return response.data;
  },
};

export default traspasosService;
