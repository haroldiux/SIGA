// import api from './api'; // Descomentar cuando se active el backend

const reportesService = {
  async generarReporte(_tipo, _params = {}) {
    return Promise.resolve({ data: [] });
  },

  async exportarPDF(_reporteData) {
    return Promise.resolve({ url: '' });
  },

  async exportarExcel(_reporteData) {
    return Promise.resolve({ url: '' });
  },

  async programarReporte(programacionData) {
    return Promise.resolve(programacionData);
  },

  async getReportesProgramados() {
    return Promise.resolve({ data: [] });
  },

  async deleteReporteProgramado(_id) {
    return Promise.resolve({ success: true });
  },
};

export default reportesService;
