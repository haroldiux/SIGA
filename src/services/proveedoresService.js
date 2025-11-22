// import api from './api'; // Descomentar cuando se active el backend

const proveedoresService = {
  async getProveedores(_params = {}) {
    return Promise.resolve({ data: [], total: 0 });
  },

  async getProveedor(_id) {
    return Promise.resolve({});
  },

  async createProveedor(proveedorData) {
    return Promise.resolve(proveedorData);
  },

  async updateProveedor(_id, proveedorData) {
    return Promise.resolve(proveedorData);
  },

  async deleteProveedor(_id) {
    return Promise.resolve({ success: true });
  },

  async getHistorialPrecios(_proveedorId = null, _itemId = null) {
    return Promise.resolve({ data: [] });
  },

  async calificarProveedor(_id, calificacionData) {
    return Promise.resolve(calificacionData);
  },

  async getCalificaciones(_id) {
    return Promise.resolve({ calificaciones: [] });
  },

  async subirDocumento(_id, _formData) {
    return Promise.resolve({ success: true });
  },
};

export default proveedoresService;
