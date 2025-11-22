// import api from './api'; // Descomentar cuando se active el backend

const prestamosService = {
  async getPrestamos(_params = {}) {
    return Promise.resolve({ data: [], total: 0 });
  },

  async getPrestamo(_id) {
    return Promise.resolve({});
  },

  async createPrestamo(prestamoData) {
    return Promise.resolve(prestamoData);
  },

  async devolverPrestamo(_id, devolucionData) {
    return Promise.resolve(devolucionData);
  },

  async renovarPrestamo(_id, renovacionData) {
    return Promise.resolve(renovacionData);
  },

  async getMultas(_params = {}) {
    return Promise.resolve({ data: [] });
  },

  async registrarMulta(multaData) {
    return Promise.resolve(multaData);
  },

  async pagarMulta(_id) {
    return Promise.resolve({ success: true });
  },

  async getHistorialUsuario(_usuarioId) {
    return Promise.resolve({ prestamos: [] });
  },

  async createReserva(reservaData) {
    return Promise.resolve(reservaData);
  },

  async getReservas(_params = {}) {
    return Promise.resolve({ data: [] });
  },
};

export default prestamosService;
