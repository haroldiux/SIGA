<!-- src/components/dashboard/SuperAdminDashboard.vue -->
<template>
  <div class="super-admin-dashboard">
    <div class="row q-col-gutter-md">
      <!-- Estadísticas generales -->
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Total de Inventario</div>
            <div class="text-h3 q-mt-sm text-primary">{{ stats.totalItems }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Elementos registrados en el sistema</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Laboratorios</div>
            <div class="text-h3 q-mt-sm text-secondary">{{ stats.labCount }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Espacios registrados</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Alertas</div>
            <div class="text-h3 q-mt-sm text-negative">{{ stats.alerts }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Requieren atención</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Usuarios</div>
            <div class="text-h3 q-mt-sm text-accent">{{ stats.userCount }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Acceso al sistema</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Alertas de Stock (Nuevo Widget) -->
      <div class="col-12 col-md-6">
        <StockAlertsWidget @solicitar="handleSolicitarStock" />
      </div>

      <!-- Actividad reciente -->
      <div class="col-12 col-md-6">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Actividad Reciente</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-list separator>
              <q-item v-for="activity in recentActivity" :key="activity.id" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar :color="getActivityColor(activity.type)" text-color="white">
                    <q-icon :name="getActivityIcon(activity.type)" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ activity.description }}</q-item-label>
                  <q-item-label caption>{{ activity.user }} - {{ activity.timestamp }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Distribución de inventario -->
      <div class="col-12 col-lg-4">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Distribución por Categoría</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="chart-container" style="height: 250px;">
              <!-- Gráfico de distribución -->
              <canvas ref="distributionChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Estado de Compras -->
      <div class="col-12 col-lg-8">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Estado de Órdenes de Compra</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-8">
                <div class="chart-container" style="height: 250px;">
                  <!-- Gráfico de órdenes de compra por mes -->
                  <canvas ref="purchaseChart"></canvas>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="text-h6 q-mb-md">Órdenes Pendientes</div>
                <q-list dense separator>
                  <q-item v-for="(order, index) in pendingOrders" :key="index" class="q-py-sm">
                    <q-item-section>
                      <q-item-label>{{ order.description }}</q-item-label>
                      <q-item-label caption>Proveedor: {{ order.supplier }} | Monto: Bs. {{ order.amount }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-badge :color="getStatusColor(order.status)" text-color="white">
                        {{ order.status }}
                      </q-badge>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';
import { useInventarioStore } from 'src/stores/store-inventario';
import { useRouter } from 'vue-router';
import StockAlertsWidget from 'src/components/dashboard/widgets/StockAlertsWidget.vue';

const inventarioStore = useInventarioStore();
const router = useRouter();

const handleSolicitarStock = (item) => {
  // Redirigir a solicitudes con el item preseleccionado (simulado)
  router.push({ name: 'solicitudes', query: { item: item.id, action: 'new' } });
};

// Referencias para los gráficos
const distributionChart = ref(null);
const purchaseChart = ref(null);

// Datos reales del store
const stats = computed(() => ({
  totalItems: inventarioStore.estadisticas.totalItems,
  labCount: 4, // Dato estático por ahora
  alerts: inventarioStore.estadisticas.itemsStockBajo,
  userCount: 45 // Dato estático por ahora
}));

const recentActivity = computed(() => {
  return inventarioStore.movimientosRecientes(5).map(mov => ({
    id: mov.id,
    type: getMovimientoType(mov.tipo),
    description: `${mov.tipo}: ${mov.cantidad} ${mov.itemId} - ${mov.motivo}`,
    user: mov.usuario,
    timestamp: new Date(mov.fecha).toLocaleString()
  }));
});

const getMovimientoType = (tipo) => {
  if (tipo === 'Entrada') return 'add';
  if (tipo === 'Salida') return 'transfer';
  return 'info';
};

const pendingOrders = ref([
  {
    description: 'Microscopios Digitales (10 unidades)',
    supplier: 'MediTech Bolivia',
    amount: '25,600',
    status: 'Aprobado'
  },
  {
    description: 'Reactivos para laboratorio',
    supplier: 'LabChem SRL',
    amount: '8,320',
    status: 'Pendiente'
  },
  {
    description: 'Equipos de protección personal',
    supplier: 'Seguridad Industrial SA',
    amount: '4,150',
    status: 'En revisión'
  },
  {
    description: 'Computadoras para laboratorio',
    supplier: 'TechBol',
    amount: '32,000',
    status: 'En tránsito'
  }
]);

// Funciones para obtener íconos y colores según el tipo de actividad
const getActivityIcon = (type) => {
  switch(type) {
    case 'add': return 'add_circle';
    case 'transfer': return 'swap_horiz';
    case 'alert': return 'warning';
    case 'maintenance': return 'build';
    default: return 'info';
  }
};

const getActivityColor = (type) => {
  switch(type) {
    case 'add': return 'positive';
    case 'transfer': return 'info';
    case 'alert': return 'negative';
    case 'maintenance': return 'warning';
    default: return 'grey';
  }
};

const getStatusColor = (status) => {
  switch(status) {
    case 'Aprobado': return 'positive';
    case 'Pendiente': return 'warning';
    case 'En revisión': return 'info';
    case 'En tránsito': return 'primary';
    default: return 'grey';
  }
};

// Configuración de los gráficos
onMounted(() => {
  // Gráfico de distribución por categoría
  if (distributionChart.value) {
    const ctx = distributionChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Equipos', 'Mobiliario', 'Instrumental', 'Reactivos', 'Otros'],
        datasets: [{
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            '#027BE3', // primary
            '#26A69A', // secondary
            '#9C27B0', // accent
            '#F2C037', // warning
            '#BDBDBD'  // grey
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  }

  // Gráfico de órdenes de compra por mes
  if (purchaseChart.value) {
    const ctx = purchaseChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jul', 'Ago', 'Sep', 'Oct', 'Nov'],
        datasets: [
          {
            label: 'Órdenes Emitidas',
            data: [12, 19, 15, 8, 14],
            backgroundColor: '#027BE3'
          },
          {
            label: 'Órdenes Completadas',
            data: [10, 15, 12, 5, 8],
            backgroundColor: '#26A69A'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
});
</script>

<style scoped>
.dashboard-card {
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
