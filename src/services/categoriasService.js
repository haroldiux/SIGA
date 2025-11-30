import api from './api';

const categoriasService = {
  /**
   * Obtener todas las categorías
   */
  async getCategorias(params = {}) {
    const response = await api.get('/categorias', { params });
    return response.data;
  },

  /**
   * Obtener una categoría por ID
   */
  async getCategoria(id) {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  /**
   * Crear nueva categoría
   */
  async createCategoria(categoriaData) {
    const response = await api.post('/categorias', categoriaData);
    return response.data;
  },

  /**
   * Actualizar categoría existente
   */
  async updateCategoria(id, categoriaData) {
    const response = await api.put(`/categorias/${id}`, categoriaData);
    return response.data;
  },

  /**
   * Eliminar categoría
   */
  async deleteCategoria(id) {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  },

  /**
   * Obtener subcategorías de una categoría
   */
  async getSubcategorias(categoriaId) {
    const response = await api.get(`/categorias/${categoriaId}/subcategorias`);
    return response.data;
  }
};

export default categoriasService;
