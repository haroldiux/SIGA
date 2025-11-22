<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="hHh LpR fFf">
    <!-- Header -->
    <q-header elevated class="header-gradient">
      <q-toolbar class="q-py-sm">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="text-white"
        />

        <q-toolbar-title class="flex items-center">
          <div class="flex items-center">
            <q-avatar size="45px" class="q-mr-md">
              <img src="~assets/unitepc-logo.png" alt="UNITEPC Logo" />
            </q-avatar>
            <div class="column">
              <div class="text-bold text-white text-h6">UNITEPC</div>
              <div class="text-caption text-white" style="opacity: 0.9">Sistema de Gestión de Inventarios</div>
            </div>
          </div>
        </q-toolbar-title>

        <q-space />

        <NotificationCenter />
        <q-btn round flat icon="help_outline" class="q-mr-sm text-white">
          <q-tooltip>Ayuda</q-tooltip>
        </q-btn>
        <q-btn round flat icon="account_circle" class="text-white">
          <q-menu>
            <q-list style="min-width: 220px">
              <q-item-label header class="text-weight-bold">
                <q-icon name="person" class="q-mr-sm" />
                Usuario Admin
              </q-item-label>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Mi Perfil</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>Configuración</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section class="text-negative">Cerrar Sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Drawer (Sidebar) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="280"
      :breakpoint="400"
      class="sidebar-drawer"
    >
      <q-scroll-area class="fit sidebar-scroll">
        <q-list padding class="menu-list">
          <q-item-label header class="text-grey-8 q-py-md q-px-md text-weight-bold">
            <q-icon name="apps" class="q-mr-sm" />
            MENÚ PRINCIPAL
          </q-item-label>

          <!-- Menú de navegación -->
          <q-item
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.route"
            clickable
            v-ripple
            :active="$route.path === item.route"
            active-class="menu-item-active"
            class="menu-item q-my-xs"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" size="22px" />
            </q-item-section>
            <q-item-section class="text-weight-medium">{{ item.label }}</q-item-section>
          </q-item>

          <!-- Selector de rol -->
          <q-separator class="q-my-md" />

          <q-item class="role-selector-item">
            <q-item-section>
              <div class="text-grey-8 text-caption text-weight-bold q-mb-sm">
                <q-icon name="swap_horiz" size="xs" class="q-mr-xs" />
                CAMBIAR VISTA COMO:
              </div>
              <q-select
                v-model="selectedRole"
                :options="roleOptions"
                dense
                outlined
                class="role-select"
                @update:model-value="changeUserRole"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Contenido principal -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from 'src/stores/store-main';
import { useNotificationsStore } from 'src/stores/store-notifications';
import NotificationCenter from 'src/components/common/NotificationCenter.vue';
import adminService from 'src/services/adminService';

// Referencias reactivas
const leftDrawerOpen = ref(true);
const selectedRole = ref(null);
const store = useMainStore();
const notificationsStore = useNotificationsStore();
const router = useRouter();

// Opciones de roles disponibles
const roleOptions = [
  { label: 'Super Administrador', value: 'superadmin' },
  { label: 'Docente', value: 'docente' },
  { label: 'Encargado de Laboratorio', value: 'encargado_lab' },
  { label: 'Encargado de Almacén', value: 'encargado_almacen' },
  { label: 'Encargado de Adquisición', value: 'encargado_adquisicion' }
];

// Menú dinámico basado en el rol del usuario
const menuItems = computed(() => {
  const items = [
    { label: 'Dashboard', icon: 'grid_view', route: '/', roles: ['superadmin', 'docente', 'encargado_lab', 'encargado_almacen', 'encargado_adquisicion'] },
    { label: 'Proveedores', icon: 'people', route: '/proveedores', roles: ['superadmin', 'encargado_adquisicion'] },
    { label: 'Catálogo de Items', icon: 'inventory_2', route: '/items', roles: ['superadmin', 'encargado_lab', 'encargado_almacen'] },
    { label: 'Solicitudes', icon: 'description', route: '/solicitudes', roles: ['superadmin', 'docente', 'encargado_lab', 'encargado_almacen', 'encargado_adquisicion'] },
    { label: 'Órdenes de Compra', icon: 'shopping_cart', route: '/compras', roles: ['superadmin', 'encargado_adquisicion'] },
    { label: 'Inventario', icon: 'warehouse', route: '/inventario', roles: ['superadmin', 'encargado_lab', 'encargado_almacen'] },
    { label: 'Préstamos', icon: 'handshake', route: '/prestamos', roles: ['superadmin', 'docente', 'encargado_lab'] },
    { label: 'Traspasos', icon: 'swap_horiz', route: '/traspasos', roles: ['superadmin', 'encargado_almacen'] },
    { label: 'Reportes', icon: 'bar_chart', route: '/reportes', roles: ['superadmin', 'encargado_lab', 'encargado_almacen'] },
    { label: 'Administración', icon: 'settings', route: '/admin', roles: ['superadmin'] }
  ];

  // Filtrar los ítems según el rol actual del usuario
  return items.filter(item => item.roles.includes(store.userRole));
});

// Métodos
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const changeUserRole = () => {
  // Actualizar el rol en el store
  store.setUserRole(selectedRole.value);

  // Redireccionar al dashboard al cambiar de rol
  router.push('/');
};

// ...

// Al montar el componente, establecer el rol desde el store
onMounted(async () => {
  selectedRole.value = store.userRole;
  // Cargar notificaciones iniciales
  notificationsStore.loadInitialNotifications();
  
  // Cargar configuración global (simulado por ahora)
  try {
    await adminService.getConfig();
    // Aquí podríamos actualizar el título o colores según la config
  } catch (error) {
    console.error('Error cargando configuración', error);
  }
});
</script>

<style lang="scss" scoped>
// Header con gradiente
.header-gradient {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

// Sidebar styling
.sidebar-drawer {
  background: linear-gradient(180deg, #f5f5f5 0%, #fafafa 100%);
  border-right: 1px solid #e0e0e0;
}

.sidebar-scroll {
  background: transparent;
}

.menu-list {
  padding: 8px;
}

// Menu items
.menu-item {
  border-radius: 8px;
  margin: 2px 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(25, 118, 210, 0.08);
    transform: translateX(4px);
  }
}

.menu-item-active {
  background: linear-gradient(90deg, rgba(25, 118, 210, 0.15) 0%, rgba(25, 118, 210, 0.05) 100%);
  border-left: 3px solid #1976d2;
  font-weight: 600;
  color: #1976d2;
  
  :deep(.q-icon) {
    color: #1976d2;
  }
}

// Role selector
.role-selector-item {
  background: white;
  border-radius: 8px;
  margin: 8px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.role-select {
  :deep(.q-field__control) {
    border-radius: 6px;
  }
}

// Animaciones
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.menu-item {
  animation: slideIn 0.3s ease;
}
</style>
