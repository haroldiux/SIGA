import api from './api';

/**
 * Servicio para gestión de solicitudes
 */
const solicitudesService = {
  /**
   * Obtener todas las solicitudes
   */
  async getSolicitudes(params = {}) {
    const response = await api.get('/solicitudes', { params });
    return response.data;
  },

  /**
   * Obtener una solicitud por ID
   */
  async getSolicitud(id) {
    const response = await api.get(`/solicitudes/${id}`);
    return response.data;
  },

  /**
   * Crear nueva solicitud
   */
  async createSolicitud(solicitudData) {
    const response = await api.post('/solicitudes', solicitudData);
    return response.data;
  },

  /**
   * Actualizar solicitud
   */
  async updateSolicitud(id, solicitudData) {
    const response = await api.put(`/solicitudes/${id}`, solicitudData);
    return response.data;
  },

  /**
   * Aprobar solicitud
   */
  async aprobarSolicitud(id, etapa, data = {}) {
    const response = await api.post(`/solicitudes/${id}/aprobar/${etapa}`, data);
    return response.data;
  },

  /**
   * Rechazar solicitud
   */
  async rechazarSolicitud(id, etapa, motivo) {
    const response = await api.post(`/solicitudes/${id}/rechazar/${etapa}`, { motivo });
    return response.data;
  },

  /**
   * Agregar comentario a solicitud
   */
  async agregarComentario(id, comentario) {
    const response = await api.post(`/solicitudes/${id}/comentarios`, { comentario });
    return response.data;
  },

  /**
   * Subir documento a solicitud
   */
  async subirDocumento(id, formData) {
    const response = await api.post(`/solicitudes/${id}/documentos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  /**
   * Obtener historial de cambios
   */
  async getHistorial(id) {
    const response = await api.get(`/solicitudes/${id}/historial`);
    return response.data;
  },
};

export default solicitudesService;
