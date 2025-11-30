import api from './api';

const proveedoresService = {
  async getProveedores(params = {}) {
    const response = await api.get('/proveedores', { params });
    return response.data;
  },

  async getProveedor(id) {
    const response = await api.get(`/proveedores/${id}`);
    return response.data;
  },

  async createProveedor(proveedorData) {
    const response = await api.post('/proveedores', proveedorData);
    return response.data;
  },

  async updateProveedor(id, proveedorData) {
    const response = await api.put(`/proveedores/${id}`, proveedorData);
    return response.data;
  },

  async deleteProveedor(id) {
    const response = await api.delete(`/proveedores/${id}`);
    return response.data;
  },

  async getHistorialPrecios(proveedorId = null, itemId = null) {
    const params = {};
    if (proveedorId) params.proveedor_id = proveedorId;
    if (itemId) params.item_id = itemId;

    const response = await api.get('/historial-precios', { params });
    return response.data;
  },

  async calificarProveedor(id, calificacionData) {
    // Nota: Ajustar endpoint si es diferente en el backend
    const response = await api.post(`/proveedores/${id}/calificar`, calificacionData);
    return response.data;
  },

  async getCalificaciones(id) {
    // Nota: Ajustar endpoint si es diferente en el backend
    const response = await api.get(`/proveedores/${id}/calificaciones`);
    return response.data;
  },

  async subirDocumento(id, formData) {
    const response = await api.post(`/proveedores/${id}/documentos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
};

export default proveedoresService;
