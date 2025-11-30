import api from './api';

/**
 * Servicio para gestión de inventario
 */
const inventarioService = {
  // ==================== INVENTARIO ====================

  /**
   * Obtener inventario por ubicación
   */
  async getInventario(ubicacion = null, params = {}) {
    const queryParams = { ...params };
    if (ubicacion) queryParams.ubicacion = ubicacion;

    const response = await api.get('/inventario', { params: queryParams });
    return response.data;
  },

  /**
   * Registrar entrada de inventario
   */
  async registrarEntrada(entradaData) {
    const response = await api.post('/inventario/entradas', entradaData);
    return response.data;
  },

  /**
   * Registrar salida de inventario
   */
  async registrarSalida(salidaData) {
    const response = await api.post('/inventario/salidas', salidaData);
    return response.data;
  },

  /**
   * Registrar ajuste de inventario
   */
  async registrarAjuste(ajusteData) {
    const response = await api.post('/inventario/ajustes', ajusteData);
    return response.data;
  },

  /**
   * Obtener movimientos de inventario
   */
  async getMovimientos(params = {}) {
    const response = await api.get('/inventario/movimientos', { params });
    return response.data;
  },

  /**
   * Obtener alertas de stock mínimo
   */
  async getAlertasStock() {
    const response = await api.get('/inventario/alertas');
    return response.data;
  },

  // ==================== LOTES Y SERIES ====================

  /**
   * Registrar lote
   */
  async registrarLote(loteData) {
    const response = await api.post('/inventario/lotes', loteData);
    return response.data;
  },

  /**
   * Obtener lotes de un item
   */
  async getLotes(itemId) {
    const response = await api.get(`/inventario/items/${itemId}/lotes`);
    return response.data;
  },

  /**
   * Registrar número de serie
   */
  async registrarSerie(serieData) {
    const response = await api.post('/inventario/series', serieData);
    return response.data;
  },

  /**
   * Obtener trazabilidad de lote/serie
   */
  async getTrazabilidad(tipo, codigo) {
    const response = await api.get(`/inventario/trazabilidad/${tipo}/${codigo}`);
    return response.data;
  },
};

export default inventarioService;
