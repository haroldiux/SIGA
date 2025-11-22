import { defineStore } from 'pinia';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
  }),

  getters: {
    allNotifications: (state) => state.notifications,
    unreadNotifications: (state) => state.notifications.filter(n => !n.leida),
    readNotifications: (state) => state.notifications.filter(n => n.leida),
  },

  actions: {
    /**
     * Agregar nueva notificación
     */
    addNotification(notification) {
      const newNotification = {
        id: Date.now() + Math.random(),
        fecha: new Date().toISOString(),
        leida: false,
        ...notification,
      };

      this.notifications.unshift(newNotification);
      this.updateUnreadCount();

      // Limitar a 100 notificaciones
      if (this.notifications.length > 100) {
        this.notifications = this.notifications.slice(0, 100);
      }

      return newNotification;
    },

    /**
     * Marcar notificación como leída
     */
    markAsRead(id) {
      const notification = this.notifications.find(n => n.id === id);
      if (notification) {
        notification.leida = true;
        this.updateUnreadCount();
      }
    },

    /**
     * Marcar todas como leídas
     */
    markAllAsRead() {
      this.notifications.forEach(n => n.leida = true);
      this.updateUnreadCount();
    },

    /**
     * Eliminar notificación
     */
    deleteNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
      this.updateUnreadCount();
    },

    /**
     * Limpiar todas las notificaciones leídas
     */
    clearReadNotifications() {
      this.notifications = this.notifications.filter(n => !n.leida);
      this.updateUnreadCount();
    },

    /**
     * Actualizar contador de no leídas
     */
    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(n => !n.leida).length;
    },

    /**
     * Generar notificaciones de stock mínimo
     */
    checkStockMinimo(inventario) {
      const itemsBajoMinimo = inventario.filter(item => 
        item.cantidad <= item.stockMinimo && item.cantidad > 0
      );

      const itemsAgotados = inventario.filter(item => item.cantidad === 0);

      itemsBajoMinimo.forEach(item => {
        this.addNotification({
          tipo: 'warning',
          titulo: 'Stock Bajo',
          mensaje: `${item.nombre} está por debajo del stock mínimo (${item.cantidad}/${item.stockMinimo})`,
          icono: 'warning',
          accion: {
            label: 'Ver Item',
            route: `/inventario?item=${item.id}`,
          },
        });
      });

      itemsAgotados.forEach(item => {
        this.addNotification({
          tipo: 'error',
          titulo: 'Stock Agotado',
          mensaje: `${item.nombre} se ha agotado`,
          icono: 'error',
          accion: {
            label: 'Crear Solicitud',
            route: `/solicitudes/nueva?item=${item.id}`,
          },
        });
      });
    },

    /**
     * Notificación de préstamo por vencer
     */
    notifyPrestamoProximoVencer(prestamo) {
      this.addNotification({
        tipo: 'warning',
        titulo: 'Préstamo por Vencer',
        mensaje: `El préstamo ${prestamo.codigo} vence el ${prestamo.fechaDevolucion}`,
        icono: 'schedule',
        accion: {
          label: 'Ver Préstamo',
          route: `/prestamos?id=${prestamo.id}`,
        },
      });
    },

    /**
     * Notificación de préstamo vencido
     */
    notifyPrestamoVencido(prestamo) {
      this.addNotification({
        tipo: 'error',
        titulo: 'Préstamo Vencido',
        mensaje: `El préstamo ${prestamo.codigo} está vencido`,
        icono: 'error',
        accion: {
          label: 'Ver Préstamo',
          route: `/prestamos?id=${prestamo.id}`,
        },
      });
    },

    /**
     * Notificación de solicitud pendiente
     */
    notifySolicitudPendiente(solicitud) {
      this.addNotification({
        tipo: 'info',
        titulo: 'Solicitud Pendiente',
        mensaje: `Tienes una solicitud pendiente de aprobación: ${solicitud.codigo}`,
        icono: 'pending_actions',
        accion: {
          label: 'Revisar',
          route: `/solicitudes?id=${solicitud.id}`,
        },
      });
    },

    /**
     * Notificación de solicitud aprobada
     */
    notifySolicitudAprobada(solicitud) {
      this.addNotification({
        tipo: 'success',
        titulo: 'Solicitud Aprobada',
        mensaje: `Tu solicitud ${solicitud.codigo} ha sido aprobada`,
        icono: 'check_circle',
        accion: {
          label: 'Ver Solicitud',
          route: `/solicitudes?id=${solicitud.id}`,
        },
      });
    },

    /**
     * Notificación de solicitud rechazada
     */
    notifySolicitudRechazada(solicitud, motivo) {
      this.addNotification({
        tipo: 'error',
        titulo: 'Solicitud Rechazada',
        mensaje: `Tu solicitud ${solicitud.codigo} fue rechazada. Motivo: ${motivo}`,
        icono: 'cancel',
        accion: {
          label: 'Ver Solicitud',
          route: `/solicitudes?id=${solicitud.id}`,
        },
      });
    },

    /**
     * Notificación de orden de compra recibida
     */
    notifyOrdenRecibida(orden) {
      this.addNotification({
        tipo: 'success',
        titulo: 'Orden Recibida',
        mensaje: `La orden de compra ${orden.codigo} ha sido recibida`,
        icono: 'inventory_2',
        accion: {
          label: 'Ver Orden',
          route: `/compras?id=${orden.id}`,
        },
      });
    },

    /**
     * Notificación de traspaso completado
     */
    notifyTraspasoCompletado(traspaso) {
      this.addNotification({
        tipo: 'success',
        titulo: 'Traspaso Completado',
        mensaje: `El traspaso ${traspaso.codigo} ha sido completado`,
        icono: 'local_shipping',
        accion: {
          label: 'Ver Traspaso',
          route: `/traspasos?id=${traspaso.id}`,
        },
      });
    },

    /**
     * Cargar notificaciones iniciales (simuladas)
     */
    loadInitialNotifications() {
      // En producción, esto vendría del backend
      const mockNotifications = [
        {
          tipo: 'warning',
          titulo: 'Stock Bajo',
          mensaje: 'Microscopio Binocular está por debajo del stock mínimo',
          icono: 'warning',
          leida: false,
        },
        {
          tipo: 'info',
          titulo: 'Solicitud Pendiente',
          mensaje: 'Tienes 3 solicitudes pendientes de aprobación',
          icono: 'pending_actions',
          leida: false,
        },
        {
          tipo: 'success',
          titulo: 'Orden Recibida',
          mensaje: 'La orden OC-0156 ha sido recibida exitosamente',
          icono: 'check_circle',
          leida: true,
        },
      ];

      mockNotifications.forEach(notif => this.addNotification(notif));
    },
  },
});
