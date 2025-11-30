import api from './api';

const itemsService = {
  /**
   * Obtener todos los items del catálogo
   */
  async getItems(params = {}) {
    const response = await api.get('/items', { params });
    return response.data;
  },

  /**
   * Obtener un item por ID
   */
  async getItem(id) {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  /**
   * Crear nuevo item
   */
  async createItem(itemData) {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  /**
   * Actualizar item existente
   */
  async updateItem(id, itemData) {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  /**
   * Eliminar item
   */
  async deleteItem(id) {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  }
};

export default itemsService;
