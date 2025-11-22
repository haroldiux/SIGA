<!-- src/pages/DashboardPage.vue -->
<template>
  <q-page class="q-pa-md">
    <h1 class="text-h4 q-my-md">Dashboard</h1>
    <p class="text-subtitle1 text-grey-7 q-mt-none q-mb-lg">Vista general del sistema de control de inventarios</p>

    <!-- Carga dinámica del dashboard según el rol del usuario -->
    <component :is="currentDashboard" />
  </q-page>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from 'src/stores/store-main';

// Importación dinámica de los componentes de dashboard
import SuperAdminDashboard from 'src/components/dashboard/SuperAdminDashboard.vue';
import DocenteDashboard from 'src/components/dashboard/DocenteDashboard.vue';
import EncargadoLabDashboard from 'src/components/dashboard/EncargadoLabDashboard.vue';
import EncargadoAlmacenDashboard from 'src/components/dashboard/EncargadoAlmacenDashboard.vue';
import EncargadoAdquisicionDashboard from 'src/components/dashboard/EncargadoAdquisicionDashboard.vue';

const store = useMainStore();

// Componente a mostrar según el rol del usuario
const currentDashboard = computed(() => {
  switch(store.userRole) {
    case 'superadmin':
      return SuperAdminDashboard;
    case 'docente':
      return DocenteDashboard;
    case 'encargado_lab':
      return EncargadoLabDashboard;
    case 'encargado_almacen':
      return EncargadoAlmacenDashboard;
    case 'encargado_adquisicion':
      return EncargadoAdquisicionDashboard;
    default:
      return SuperAdminDashboard;
  }
});
</script>
