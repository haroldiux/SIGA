// import api from './api'; // Descomentar cuando se active el backend

const adminService = {
  // ==================== ROLES Y PERMISOS ====================
  
  /**
   * Obtener lista de roles con sus permisos
   */
  async getRoles() {
    // const response = await api.get('/admin/roles');
    // return response.data;
    
    // SIMULADO
    return Promise.resolve({
      data: [
        {
          id: 1,
          nombre: 'Super Admin',
          descripcion: 'Acceso total al sistema',
          permisos: ['*'], // '*' significa todo
          usuariosCount: 2
        },
        {
          id: 2,
          nombre: 'Administrador',
          descripcion: 'Gestión de inventario y usuarios',
          permisos: ['inventario.*', 'usuarios.ver', 'usuarios.crear'],
          usuariosCount: 5
        },
        {
          id: 3,
          nombre: 'Almacenero',
          descripcion: 'Gestión operativa de inventario',
          permisos: ['inventario.ver', 'inventario.movimientos', 'solicitudes.ver'],
          usuariosCount: 8
        }
      ]
    });
  },

  /**
   * Obtener lista de todos los permisos disponibles en el sistema
   */
  async getPermisosDisponibles() {
    // const response = await api.get('/admin/permisos');
    // return response.data;

    // SIMULADO - Estructura de árbol para la UI
    return Promise.resolve([
      {
        modulo: 'Inventario',
        clave: 'inventario',
        acciones: [
          { label: 'Ver Inventario', clave: 'ver' },
          { label: 'Crear Items', clave: 'crear' },
          { label: 'Editar Items', clave: 'editar' },
          { label: 'Eliminar Items', clave: 'eliminar' },
          { label: 'Ajustes de Stock', clave: 'ajustes' },
          { label: 'Ver Kardex', clave: 'kardex' }
        ]
      },
      {
        modulo: 'Compras',
        clave: 'compras',
        acciones: [
          { label: 'Ver Órdenes', clave: 'ver' },
          { label: 'Crear Solicitud', clave: 'solicitar' },
          { label: 'Aprobar Órdenes', clave: 'aprobar' },
          { label: 'Recepcionar', clave: 'recepcionar' }
        ]
      },
      {
        modulo: 'Ventas/Salidas',
        clave: 'ventas',
        acciones: [
          { label: 'Ver Salidas', clave: 'ver' },
          { label: 'Registrar Salida', clave: 'crear' }
        ]
      },
      {
        modulo: 'Proveedores',
        clave: 'proveedores',
        acciones: [
          { label: 'Ver Proveedores', clave: 'ver' },
          { label: 'Gestionar Proveedores', clave: 'gestionar' },
          { label: 'Calificar', clave: 'calificar' }
        ]
      },
      {
        modulo: 'Reportes',
        clave: 'reportes',
        acciones: [
          { label: 'Ver Reportes', clave: 'ver' },
          { label: 'Exportar', clave: 'exportar' }
        ]
      },
      {
        modulo: 'Administración',
        clave: 'admin',
        acciones: [
          { label: 'Gestionar Usuarios', clave: 'usuarios' },
          { label: 'Gestionar Roles', clave: 'roles' },
          { label: 'Configuración Global', clave: 'config' }
        ]
      }
    ]);
  },

  async createRol(rolData) {
    // const response = await api.post('/admin/roles', rolData);
    // return response.data;
    return Promise.resolve({ ...rolData, id: Date.now() });
  },

  async updateRol(_id, rolData) {
    // const response = await api.put(`/admin/roles/${id}`, rolData);
    // return response.data;
    return Promise.resolve(rolData);
  },

  async deleteRol(_id) {
    // const response = await api.delete(`/admin/roles/${id}`);
    // return response.data;
    return Promise.resolve({ success: true });
  },

  // ==================== CONFIGURACIÓN GLOBAL ====================

  async getConfig() {
    // const response = await api.get('/admin/config');
    // return response.data;

    // SIMULADO
    return Promise.resolve({
      iva: 13, // 13%
      incrementoSinIva: 5, // 5%
      monedaPrincipal: 'BOB',
      notificacionesEmail: true,
      sedes: [
        { id: 1, nombre: 'Sede Central', direccion: 'Av. Principal 123', telefono: '4444444' },
        { id: 2, nombre: 'Sucursal Norte', direccion: 'Av. Norte 555', telefono: '5555555' }
      ]
    });
  },

  async updateConfig(configData) {
    // const response = await api.put('/admin/config', configData);
    // return response.data;
    return Promise.resolve(configData);
  },

  // ==================== SEDES ====================

  async createSede(sedeData) {
    return Promise.resolve({ ...sedeData, id: Date.now() });
  },

  async updateSede(_id, sedeData) {
    return Promise.resolve(sedeData);
  },

  async deleteSede(_id) {
    return Promise.resolve({ success: true });
  }
};

export default adminService;
