import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const useInventarioStore = defineStore('inventario', {
  state: () => ({
    // Inventario actual por ubicación
    inventario: [
      // Mocks iniciales (se sobrescribirán si hay backend)
      {
        id: 1,
        itemId: 'QUI-001',
        nombre: 'Ácido Sulfúrico H2SO4',
        stock: 25,
        unidadMedida: 'Litros',
        unidadCompra: 'Litros',
        factorConversion: 1,
        macroArea: 'Laboratorios (Académico)',
        ubicacion: 'Almacén Central',
        stockMinimo: 10,
        ultimaActualizacion: '2025-11-15T10:30:00'
      },
      {
        id: 2,
        itemId: 'QUI-002',
        nombre: 'Hidróxido de Sodio NaOH',
        stock: 15000, // En gramos
        unidadMedida: 'Gramos',
        unidadCompra: 'Kilogramos',
        factorConversion: 1000, // 1 Kg = 1000 g
        macroArea: 'Laboratorios (Académico)',
        ubicacion: 'Lab. Química',
        stockMinimo: 5000,
        ultimaActualizacion: '2025-11-14T14:20:00'
      },
      {
        id: 3,
        itemId: 'MAT-001',
        nombre: 'Vaso de Precipitado 250ml',
        stock: 8,
        unidadMedida: 'Unidades',
        unidadCompra: 'Cajas',
        factorConversion: 12, // 1 Caja = 12 Unidades
        macroArea: 'Laboratorios (Académico)',
        ubicacion: 'Lab. Química',
        stockMinimo: 10,
        ultimaActualizacion: '2025-11-10T09:15:00'
      }
    ],

    // Historial de movimientos
    movimientos: []
  }),

  actions: {
    /**
     * Cargar inventario desde API
     */
    async fetchInventario() {
      try {
        const { data } = await api.get('/items');
        const items = data.data || data;

        if (Array.isArray(items) && items.length > 0) {
          this.inventario = items.map(item => ({
            id: item.id,
            itemId: item.codigo,
            nombre: item.nombre,
            stock: parseFloat(item.stock_inicial) || 0, // TODO: Usar endpoint de stock real
            unidadMedida: item.unidad_medida_base,
            unidadCompra: item.unidad_medida_base,
            factorConversion: 1,
            macroArea: 'Laboratorios',
            ubicacion: item.ubicacion_inicial?.nombre || 'Almacén Central',
            stockMinimo: parseFloat(item.stock_minimo) || 0,
            ultimaActualizacion: item.updated_at
          }));
          console.log('Inventario cargado desde API');
        }
      } catch (error) {
        console.warn('Backend no disponible o error en API /items. Usando datos locales.', error.message);
      }
    },

    /**
     * Crear nuevo item (Solo Codificador)
     */
    async crearItem(nuevoItem) {
      // Validar si ya existe el ID localmente
      if (this.inventario.some(i => i.itemId === nuevoItem.itemId)) {
        throw new Error('El código del item ya existe');
      }

      try {
        // Intentar guardar en backend
        const payload = {
          codigo: nuevoItem.itemId,
          nombre: nuevoItem.nombre,
          categoria_id: 1, // Default por ahora
          unidad_medida_base: nuevoItem.unidadMedida,
          stock_inicial: 0,
          stock_minimo: nuevoItem.stockMinimo,
          descripcion: nuevoItem.descripcion,
          activo: true
        };
        await api.post('/items', payload);
      } catch (e) {
        console.warn('No se pudo guardar en backend, guardando localmente', e);
      }

      this.inventario.push({
        ...nuevoItem,
        id: Date.now(),
        stock: 0, // Inicialmente 0
        ultimaActualizacion: new Date().toISOString()
      });
    },

    /**
     * Agregar entrada de inventario desde orden de compra
     */
    agregarEntrada(entrada) {
      // Buscar si el item ya existe en la ubicación especificada
      const itemExistente = this.inventario.find(
        inv => inv.itemId === entrada.itemId &&
          inv.ubicacion === entrada.ubicacion
      );

      // Calcular cantidad en unidad de uso
      let cantidadAgregar = entrada.cantidad;

      // Si existe y tiene factor de conversión, aplicar
      if (itemExistente && itemExistente.factorConversion > 1) {
        // Asumimos que la entrada viene en Unidad de Compra si no se especifica lo contrario
        // Si la entrada especifica unidad, verificar si coincide con unidadCompra
        if (entrada.unidadMedida === itemExistente.unidadCompra) {
          cantidadAgregar = entrada.cantidad * itemExistente.factorConversion;
        }
      }

      if (itemExistente) {
        // Actualizar stock existente
        itemExistente.stock += cantidadAgregar;
        itemExistente.ultimaActualizacion = new Date().toISOString();
      } else {
        // Crear nuevo registro de inventario (si no existe en esa ubicación)
        const definicionItem = this.inventario.find(i => i.itemId === entrada.itemId);

        this.inventario.push({
          id: Date.now(),
          itemId: entrada.itemId,
          nombre: entrada.nombre,
          stock: cantidadAgregar,
          unidadMedida: definicionItem ? definicionItem.unidadMedida : entrada.unidadMedida,
          unidadCompra: definicionItem ? definicionItem.unidadCompra : entrada.unidadMedida,
          factorConversion: definicionItem ? definicionItem.factorConversion : 1,
          macroArea: definicionItem ? definicionItem.macroArea : 'Laboratorios (Académico)',
          ubicacion: entrada.ubicacion,
          stockMinimo: entrada.stockMinimo || 10,
          ultimaActualizacion: new Date().toISOString()
        });
      }

      // Registrar movimiento en historial
      this.movimientos.push({
        id: Date.now(),
        itemId: entrada.itemId,
        tipo: 'Entrada',
        cantidad: cantidadAgregar, // Guardamos la cantidad real en inventario
        cantidadOriginal: entrada.cantidad, // Guardamos la cantidad de compra
        unidadOriginal: entrada.unidadMedida,
        motivo: entrada.motivo || 'Compra',
        referencia: entrada.referencia,
        ubicacion: entrada.ubicacion,
        fecha: new Date().toISOString(),
        usuario: entrada.usuario || 'Sistema'
      });

      return true;
    },

    /**
     * Registrar salida de inventario (préstamos, traspasos, etc.)
     */
    registrarSalida(salida) {
      const item = this.inventario.find(
        inv => inv.itemId === salida.itemId &&
          inv.ubicacion === salida.ubicacion
      );

      if (!item) {
        throw new Error('Item no encontrado en inventario');
      }

      if (item.stock < salida.cantidad) {
        throw new Error(`Stock insuficiente. Disponible: ${item.stock} ${item.unidadMedida}`);
      }

      // Reducir stock
      item.stock -= salida.cantidad;
      item.ultimaActualizacion = new Date().toISOString();

      // Registrar movimiento
      this.movimientos.push({
        id: Date.now(),
        itemId: salida.itemId,
        tipo: 'Salida',
        cantidad: salida.cantidad,
        motivo: salida.motivo,
        referencia: salida.referencia,
        ubicacion: salida.ubicacion,
        fecha: new Date().toISOString(),
        usuario: salida.usuario || 'Sistema'
      });

      return true;
    },

    /**
     * Registrar devolución de préstamo
     */
    registrarDevolucion(devolucion) {
      return this.agregarEntrada({
        itemId: devolucion.itemId,
        nombre: devolucion.nombre,
        cantidad: devolucion.cantidad,
        unidadMedida: devolucion.unidadMedida,
        ubicacion: devolucion.ubicacion,
        motivo: 'Devolución Préstamo',
        referencia: devolucion.referencia,
        usuario: devolucion.usuario
      });
    },

    /**
     * Procesar orden de compra completada
     */
    procesarOrdenCompra(orden) {
      const resultados = [];

      for (const item of orden.items) {
        try {
          this.agregarEntrada({
            itemId: item.itemId,
            nombre: item.nombre,
            cantidad: item.cantidadRecibida || item.cantidad,
            unidadMedida: item.unidadMedida,
            ubicacion: orden.ubicacionDestino || 'Almacén Central',
            stockMinimo: 10,
            motivo: 'Compra',
            referencia: orden.codigo,
            usuario: orden.recibidoPor || 'Encargado Almacén'
          });

          resultados.push({
            itemId: item.itemId,
            success: true,
            message: `${item.nombre} agregado correctamente`
          });
        } catch (error) {
          resultados.push({
            itemId: item.itemId,
            success: false,
            message: error.message
          });
        }
      }

      return resultados;
    },

    /**
     * Obtener stock total de un item (todas las ubicaciones)
     */
    getStockTotal(itemId) {
      return this.inventario
        .filter(inv => inv.itemId === itemId)
        .reduce((total, inv) => total + inv.stock, 0);
    },

    /**
     * Obtener stock por ubicación
     */
    getStockPorUbicacion(itemId, ubicacion) {
      const item = this.inventario.find(
        inv => inv.itemId === itemId && inv.ubicacion === ubicacion
      );
      return item ? item.stock : 0;
    },

    /**
     * Verificar si hay stock bajo
     */
    verificarStockBajo() {
      return this.inventario.filter(item => item.stock <= item.stockMinimo);
    }
  },

  getters: {
    /**
     * Obtener todos los items con stock bajo
     */
    itemsStockBajo: (state) => {
      return state.inventario.filter(item => item.stock <= item.stockMinimo);
    },

    /**
     * Obtener movimientos por item
     */
    getMovimientosPorItem: (state) => (itemId) => {
      return state.movimientos
        .filter(mov => mov.itemId === itemId)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },

    /**
     * Obtener movimientos recientes
     */
    movimientosRecientes: (state) => (limit = 10) => {
      return [...state.movimientos]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, limit);
    },

    /**
     * Estadísticas de inventario
     */
    estadisticas: (state) => {
      return {
        totalItems: state.inventario.length,
        itemsStockBajo: state.inventario.filter(i => i.stock <= i.stockMinimo).length,
        itemsSinStock: state.inventario.filter(i => i.stock === 0).length,
        totalMovimientos: state.movimientos.length
      };
    }
  }
});
