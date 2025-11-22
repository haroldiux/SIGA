// import api from './api'; // Descomentar cuando se active el backend

/**
 * Servicio para gestión de inventario
 */
const inventarioService = {
  // ==================== ITEMS ====================
  
  /**
   * Obtener todos los items del catálogo
   */
  async getItems(_params = {}) {
    // const response = await api.get('/items', { params });
    // return response.data;
    
    // SIMULADO - Reemplazar con llamada real
    return Promise.resolve({ data: [], total: 0 });
  },

  /**
   * Obtener un item por ID
   */
  async getItem(_id) {
    // const response = await api.get(`/items/${id}`);
    // return response.data;
    
    return Promise.resolve({});
  },

  /**
   * Crear nuevo item
   */
  async createItem(itemData) {
    // const response = await api.post('/items', itemData);
    // return response.data;
    
    return Promise.resolve(itemData);
  },

  /**
   * Actualizar item existente
   */
  async updateItem(_id, itemData) {
    // const response = await api.put(`/items/${id}`, itemData);
    // return response.data;
    
    return Promise.resolve(itemData);
  },

  /**
   * Eliminar item
   */
  async deleteItem(_id) {
    // const response = await api.delete(`/items/${id}`);
    // return response.data;
    
    return Promise.resolve({ success: true });
  },

  // ==================== INVENTARIO ====================
  
  /**
   * Obtener inventario por ubicación
   */
  async getInventario(_ubicacion = null, _params = {}) {
    // const response = await api.get('/inventario', { 
    //   params: { ubicacion, ...params } 
    // });
    // return response.data;
    
    return Promise.resolve({ data: [], total: 0 });
  },

  /**
   * Registrar entrada de inventario
   */
  async registrarEntrada(entradaData) {
    // const response = await api.post('/inventario/entradas', entradaData);
    // return response.data;
    
    return Promise.resolve(entradaData);
  },

  /**
   * Registrar salida de inventario
   */
  async registrarSalida(salidaData) {
    // const response = await api.post('/inventario/salidas', salidaData);
    // return response.data;
    
    return Promise.resolve(salidaData);
  },

  /**
   * Registrar ajuste de inventario
   */
  async registrarAjuste(ajusteData) {
    // const response = await api.post('/inventario/ajustes', ajusteData);
    // return response.data;
    
    return Promise.resolve(ajusteData);
  },

  /**
   * Obtener movimientos de inventario
   */
  async getMovimientos(_params = {}) {
    // const response = await api.get('/inventario/movimientos', { params });
    // return response.data;
    
    return Promise.resolve({ data: [], total: 0 });
  },

  /**
   * Obtener alertas de stock mínimo
   */
  async getAlertasStock() {
    // const response = await api.get('/inventario/alertas');
    // return response.data;
    
    return Promise.resolve({ data: [] });
  },

  // ==================== LOTES Y SERIES ====================
  
  /**
   * Registrar lote
   */
  async registrarLote(loteData) {
    // const response = await api.post('/inventario/lotes', loteData);
    // return response.data;
    
    return Promise.resolve(loteData);
  },

  /**
   * Obtener lotes de un item
   */
  async getLotes(_itemId) {
    // const response = await api.get(`/inventario/items/${itemId}/lotes`);
    // return response.data;
    
    return Promise.resolve({ data: [] });
  },

  /**
   * Registrar número de serie
   */
  async registrarSerie(serieData) {
    // const response = await api.post('/inventario/series', serieData);
    // return response.data;
    
    return Promise.resolve(serieData);
  },

  /**
   * Obtener trazabilidad de lote/serie
   */
  async getTrazabilidad(_tipo, _codigo) {
    // const response = await api.get(`/inventario/trazabilidad/${tipo}/${codigo}`);
    // return response.data;
    
    return Promise.resolve({ movimientos: [] });
  },
};

export default inventarioService;
