import api from './api';

const reportesService = {
  /**
   * Reporte: Inventario Valorizado
   */
  async getInventarioValorizado(params = {}) {
    const response = await api.get('/reportes/inventario-valorizado', { params });
    return response.data;
  },

  /**
   * Reporte: Órdenes de Compra por Estado
   */
  async getOrdenesCompraPorEstado(params = {}) {
    const response = await api.get('/reportes/ordenes-compra-estado', { params });
    return response.data;
  },

  /**
   * Reporte: Consumo por Laboratorio
   */
  async getConsumoPorLaboratorio(params = {}) {
    const response = await api.get('/reportes/consumo-laboratorio', { params });
    return response.data;
  },

  /**
   * Reporte: Estado de Préstamos
   */
  async getEstadoPrestamos(params = {}) {
    const response = await api.get('/reportes/estado-prestamos', { params });
    return response.data;
  },

  /**
   * Reporte: Inversión en Inventario
   */
  async getInversionInventario(params = {}) {
    const response = await api.get('/reportes/inversion-inventario', { params });
    return response.data;
  },

  /**
   * Exportar reporte a Excel
   */
  async exportarExcel(tipoReporte, params = {}) {
    const response = await api.get(`/reportes/${tipoReporte}/excel`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Exportar reporte a PDF
   */
  async exportarPDF(tipoReporte, params = {}) {
    const response = await api.get(`/reportes/${tipoReporte}/pdf`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  },
};

export default reportesService;
