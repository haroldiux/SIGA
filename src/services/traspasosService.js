// import api from './api'; // Descomentar cuando se active el backend

const traspasosService = {
  async getTraspasos(_params = {}) {
    return Promise.resolve({ data: [], total: 0 });
  },

  async getTraspaso(_id) {
    return Promise.resolve({});
  },

  async createTraspaso(traspasoData) {
    return Promise.resolve(traspasoData);
  },

  async aprobarTraspaso(_id) {
    return Promise.resolve({ success: true });
  },

  async completarTraspaso(_id, confirmacionData) {
    return Promise.resolve(confirmacionData);
  },

  async rechazarTraspaso() {
    return Promise.resolve({ success: true });
  },

  async createTraspasoMasivo(traspasosData) {
    return Promise.resolve(traspasosData);
  },

  async programarTraspaso(traspasoData) {
    return Promise.resolve(traspasoData);
  },
};

export default traspasosService;
