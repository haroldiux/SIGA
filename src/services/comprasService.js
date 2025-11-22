// import api from './api'; // Descomentar cuando se active el backend

const comprasService = {
  async getOrdenes(_params = {}) {
    return Promise.resolve({ data: [], total: 0 });
  },

  async getOrden(_id) {
    return Promise.resolve({});
  },

  async createOrden(ordenData) {
    return Promise.resolve(ordenData);
  },

  async updateOrden(_id, ordenData) {
    return Promise.resolve(ordenData);
  },

  async aprobarOrden(_id) {
    return Promise.resolve({ success: true });
  },

  async recibirOrden(_id, recepcionData) {
    return Promise.resolve(recepcionData);
  },

  async devolverItems(_id, devolucionData) {
    return Promise.resolve(devolucionData);
  },

  async getCuadroComparativo(_itemId) {
    return Promise.resolve({ proveedores: [] });
  },
};

export default comprasService;
