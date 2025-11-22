// src/stores/store-main.js
import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    userRole: 'superadmin', // Rol por defecto
    userLocation: 'CBBA', // 'CBBA' o 'Sede'
    
    // Permisos por rol
    permissions: {
      superadmin: ['all'],
      docente: ['request_items', 'view_inventory'],
      encargado_lab: ['request_items', 'view_inventory', 'manage_lab_stock'],
      encargado_almacen: ['view_inventory', 'manage_stock', 'process_transfers'],
      encargado_adquisicion: ['create_purchase_order'], // Solo crea
      aprobador_compras: ['approve_purchase_order'], // Solo aprueba
      codificador: ['create_items', 'edit_items'] // Nuevo rol para items
    },

    // Configuración global para cálculos de precios e impuestos
    ivaPercentage: 13, // Porcentaje de IVA (Bolivia 13%)
    uninvoicedIncrement: 8, // Retención (aprox 8% bienes, 15.5% servicios)

    // Regiones exentas de impuestos
    taxExemptRegions: ['Cobija', 'Zona Franca'], // Corregido Cojiba -> Cobija

    // Unidades de medida disponibles
    measurementUnits: [
      'Gramos', 'Kilogramos', 'Toneladas',
      'Mililitros', 'Litros', 'Galones',
      'Unidades', 'Pares', 'Cajas', 'Paquetes',
      'Metros', 'Centímetros', 'Rollos'
    ],

    // Macro Áreas
    macroAreas: ['Laboratorios (Académico)', 'Activos (Administrativo)']
  }),

  actions: {
    // Cambiar el rol del usuario
    setUserRole(role) {
      this.userRole = role;
    },

    // Cambiar ubicación (para simular CBBA vs Sedes)
    setUserLocation(location) {
      this.userLocation = location;
    },

    // Verificar permiso
    hasPermission(permission) {
      if (this.userRole === 'superadmin') return true;
      
      // Lógica especial: En Sedes, Adquisición también puede aprobar
      if (this.userLocation !== 'CBBA' && 
          this.userRole === 'encargado_adquisicion' && 
          permission === 'approve_purchase_order') {
        return true;
      }

      const rolePermissions = this.permissions[this.userRole] || [];
      return rolePermissions.includes(permission);
    },

    // Actualizar la configuración de impuestos
    updateTaxSettings(ivaPercentage, uninvoicedIncrement) {
      this.ivaPercentage = ivaPercentage;
      this.uninvoicedIncrement = uninvoicedIncrement;
    },

    // Calcular el precio neto basado en la región, facturado y precio bruto
    calculateNetPrice(grossPrice, region, hasInvoice) {
      // Si es una región exenta de impuestos, no se aplica IVA
      if (this.taxExemptRegions.includes(region)) {
        return grossPrice;
      }

      // Si no está facturado, se aplica el incremento (retención)
      if (!hasInvoice) {
        return grossPrice; // Asumimos que el precio bruto ya incluye lo que se paga, la retención es interna
        // O si se quiere calcular el costo total para la empresa:
        // return grossPrice * (1 + this.uninvoicedIncrement / 100);
      }

      // Si está facturado y no es región exenta, se aplica IVA
      return grossPrice * (1 + this.ivaPercentage / 100);
    },

    // Calcular el monto del IVA
    calculateTaxAmount(grossPrice, region, hasInvoice) {
      // Si es región exenta o no está facturado, no hay IVA
      if (this.taxExemptRegions.includes(region) || !hasInvoice) {
        return 0;
      }

      // Calcular el monto del IVA
      return grossPrice * (this.ivaPercentage / 100);
    }
  }
});
