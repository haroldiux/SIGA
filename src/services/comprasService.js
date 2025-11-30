import api from './api';

const comprasService = {
  async getOrdenes(params = {}) {
    const response = await api.get('/ordenes-compra', { params });
    return response.data;
  },

  async getOrden(id) {
    const response = await api.get(`/ordenes-compra/${id}`);
    return response.data;
  },

  async createOrden(ordenData) {
    const response = await api.post('/ordenes-compra', ordenData);
    return response.data;
  },

  async updateOrden(id, ordenData) {
    const response = await api.put(`/ordenes-compra/${id}`, ordenData);
    return response.data;
  },

  async aprobarOrden(id) {
    const response = await api.post(`/ordenes-compra/${id}/aprobar`);
    return response.data;
  },

  async recibirOrden(id, recepcionData) {
    const response = await api.post(`/ordenes-compra/${id}/recibir`, recepcionData);
    return response.data;
  },

  async devolverItems(id, devolucionData) {
    const response = await api.post(`/ordenes-compra/${id}/devolver`, devolucionData);
    return response.data;
  },

  async getCuadroComparativo(itemId) {
    const response = await api.get(`/compras/cuadro-comparativo/${itemId}`);
    return response.data;
  },
};

export default comprasService;
