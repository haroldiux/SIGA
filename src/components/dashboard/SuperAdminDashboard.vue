<template>
  <div>
    <!-- KPIs Principales -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h6">Total Items</div>
            <div class="text-h3">{{ dashboardData.totalItems || 0 }}</div>
            <div class="text-caption">En inventario</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-warning text-white">
          <q-card-section>
            <div class="text-h6">Stock Bajo</div>
            <div class="text-h3">{{ dashboardData.stockBajo || 0 }}</div>
            <div class="text-caption">Requieren reposición</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-info text-white">
          <q-card-section>
            <div class="text-h6">Solicitudes Pendientes</div>
            <div class="text-h3">{{ dashboardData.solicitudesPendientes || 0 }}</div>
            <div class="text-caption">Por aprobar</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-positive text-white">
          <q-card-section>
            <div class="text-h6">Préstamos Activos</div>
            <div class="text-h3">{{ dashboardData.prestamosActivos || 0 }}</div>
            <div class="text-caption">En curso</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Alertas Importantes -->
    <div v-if="alertas.length > 0" class="q-mb-lg">
      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="warning" color="warning" class="q-mr-sm" />
            Alertas Importantes
          </div>
          <q-list separator>
            <q-item v-for="alerta in alertas" :key="alerta.id">
              <q-item-section avatar>
                <q-icon :name="alerta.icon" :color="alerta.color" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ alerta.titulo }}</q-item-label>
                <q-item-label caption>{{ alerta.descripcion }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat dense round icon="arrow_forward" :to="alerta.ruta" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <!-- Gráficos y Estadísticas -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Movimientos Recientes</div>
            <q-list separator>
              <q-item v-for="movimiento in actividadReciente" :key="movimiento.id">
                <q-item-section avatar>
                  <q-avatar :color="getMovimientoColor(movimiento.tipo)" text-color="white">
                    <q-icon :name="getMovimientoIcon(movimiento.tipo)" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ movimiento.descripcion }}</q-item-label>
                  <q-item-label caption>{{ formatDate(movimiento.fecha) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Estado del Sistema</div>
            <div class="q-gutter-md">
              <div>
                <div class="text-caption text-grey-7">Órdenes de Compra Activas</div>
                <div class="text-h6">{{ dashboardData.ordenesActivas || 0 }}</div>
              </div>
              <div>
                <div class="text-caption text-grey-7">Traspasos Pendientes</div>
                <div class="text-h6">{{ dashboardData.traspasosPendientes || 0 }}</div>
              </div>
              <div>
                <div class="text-caption text-grey-7">Préstamos Vencidos</div>
                <div class="text-h6 text-negative">{{ dashboardData.prestamosVencidos || 0 }}</div>
              </div>
              <div>
                <div class="text-caption text-grey-7">Valor Total Inventario</div>
                <div class="text-h6 text-positive">Bs. {{ formatCurrency(dashboardData.valorInventario || 0) }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Accesos Rápidos -->
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">Accesos Rápidos</div>
        <div class="row q-col-gutter-sm">
          <div class="col-6 col-sm-4 col-md-2">
            <q-btn unelevated color="primary" icon="add_shopping_cart" label="Nueva Solicitud" to="/solicitudes"
              class="full-width" />
          </div>
          <div class="col-6 col-sm-4 col-md-2">
            <q-btn unelevated color="secondary" icon="shopping_cart" label="Nueva Orden" to="/compras"
              class="full-width" />
          </div>
          <div class="col-6 col-sm-4 col-md-2">
            <q-btn unelevated color="info" icon="swap_horiz" label="Nuevo Traspaso" to="/traspasos"
              class="full-width" />
          </div>
          <div class="col-6 col-sm-4 col-md-2">
            <q-btn unelevated color="warning" icon="assignment" label="Nuevo Préstamo" to="/prestamos"
              class="full-width" />
          </div>
          <div class="col-6 col-sm-4 col-md-2">
            <q-btn unelevated color="positive" icon="inventory" label="Ver Inventario" to="/inventario"
              class="full-width" />
          </div>
          <div class="col-6 col-sm-4 col-md-2">
            <q-btn unelevated color="dark" icon="assessment" label="Reportes" to="/reportes" class="full-width" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import dashboardService from 'src/services/dashboardService';

const $q = useQuasar();

const dashboardData = ref({});
const alertas = ref([]);
const actividadReciente = ref([]);
const loading = ref(false);

const loadDashboardData = async () => {
  loading.value = true;
  try {
    const response = await dashboardService.getDashboardData();
    dashboardData.value = response.data || response;
    alertas.value = response.alertas || [];
    actividadReciente.value = response.actividadReciente || [];
  } catch (error) {
    console.error('Error cargando dashboard:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar datos del dashboard'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDashboardData();
});

const getMovimientoColor = (tipo) => {
  const colores = {
    'entrada': 'positive',
    'salida': 'negative',
    'traspaso': 'info',
    'ajuste': 'warning'
  };
  return colores[tipo] || 'grey';
};

const getMovimientoIcon = (tipo) => {
  const iconos = {
    'entrada': 'add_circle',
    'salida': 'remove_circle',
    'traspaso': 'swap_horiz',
    'ajuste': 'tune'
  };
  return iconos[tipo] || 'circle';
};

const formatDate = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleString('es-BO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (valor) => {
  return new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
};
</script>

<style scoped>
.bg-info {
  background-color: #17a2b8 !important;
}
</style>
