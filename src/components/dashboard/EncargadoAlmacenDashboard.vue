<!-- src/components/dashboard/EncargadoAlmacenDashboard.vue -->
<template>
  <div class="encargado-almacen-dashboard">
    <div class="row q-col-gutter-md">
      <!-- Tarjetas de estadísticas -->
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Inventario Total</div>
            <div class="text-h3 q-mt-sm text-primary">{{ stats.totalItems }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Items en almacén</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Traspasos</div>
            <div class="text-h3 q-mt-sm text-secondary">{{ stats.traspasos }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Pendientes de procesar</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Stock Bajo</div>
            <div class="text-h3 q-mt-sm text-negative">{{ stats.stockBajo }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Items por debajo del mínimo</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Recepciones</div>
            <div class="text-h3 q-mt-sm text-accent">{{ stats.recepcionesPendientes }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Pedidos pendientes de recibir</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Stock actual por categoría -->
      <div class="col-12 col-lg-8">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Stock Actual por Categoría</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="chart-container" style="height: 300px;">
              <canvas ref="stockChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Alertas de stock -->
      <div class="col-12 col-lg-4">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Alertas de Stock</div>
            <q-badge color="negative" floating>{{ stockAlertas.length }}</q-badge>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-list separator>
              <q-item v-for="alerta in stockAlertas" :key="alerta.id" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar color="negative" text-color="white">
                    <q-icon name="warning" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ alerta.item }}</q-item-label>
                  <q-item-label caption>
                    Stock actual: <span class="text-negative">{{ alerta.stockActual }}</span> |
                    Mínimo requerido: {{ alerta.stockMinimo }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn color="primary" size="sm" icon="add_shopping_cart" flat>
                    <q-tooltip>Solicitar</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Próximas recepciones -->
      <div class="col-12 col-lg-6">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Próximas Recepciones</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-list separator>
              <q-item v-for="recepcion in proximasRecepciones" :key="recepcion.id" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar :color="getStatusColor(recepcion.estado)" text-color="white">
                    <q-icon :name="getStatusIcon(recepcion.estado)" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ recepcion.descripcion }}</q-item-label>
                  <q-item-label caption>
                    Orden #{{ recepcion.orden }} |
                    Proveedor: {{ recepcion.proveedor }} |
                    Fecha estimada: {{ recepcion.fechaEstimada }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn color="primary" size="sm" icon="visibility" flat>
                    <q-tooltip>Ver detalles</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Traspasos pendientes -->
      <div class="col-12 col-lg-6">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Traspasos Pendientes</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-list separator>
              <q-item v-for="traspaso in traspasosPendientes" :key="traspaso.id" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar color="secondary" text-color="white">
                    <q-icon name="swap_horiz" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ traspaso.descripcion }}</q-item-label>
                  <q-item-label caption>
                    Desde: {{ traspaso.origen }} |
                    Hacia: {{ traspaso.destino }} |
                    Solicitado: {{ traspaso.fecha }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row q-gutter-x-sm">
                    <q-btn color="positive" size="sm" icon="check" flat>
                      <q-tooltip>Aprobar</q-tooltip>
                    </q-btn>
                    <q-btn color="primary" size="sm" icon="visibility" flat>
                      <q-tooltip>Ver detalles</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Acciones rápidas -->
      <div class="col-12">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-card class="dashboard-card action-card">
              <q-card-section class="text-center">
                <q-icon name="add_box" size="56px" color="primary" />
                <div class="text-h6 q-mt-sm">Registrar Entrada</div>
                <div class="text-caption q-mt-sm">Recibir y registrar nuevos items</div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="primary" label="Iniciar" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card class="dashboard-card action-card">
              <q-card-section class="text-center">
                <q-icon name="swap_horiz" size="56px" color="secondary" />
                <div class="text-h6 q-mt-sm">Gestionar Traspasos</div>
                <div class="text-caption q-mt-sm">Mover items entre ubicaciones</div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="secondary" label="Acceder" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card class="dashboard-card action-card">
              <q-card-section class="text-center">
                <q-icon name="inventory" size="56px" color="accent" />
                <div class="text-h6 q-mt-sm">Control de Inventario</div>
                <div class="text-caption q-mt-sm">Realizar conteo físico de items</div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="accent" label="Iniciar" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

// Referencias para los gráficos
const stockChart = ref(null);

// Datos de ejemplo - En producción vendrían de una API
const stats = ref({
  totalItems: 825,
  traspasos: 8,
  stockBajo: 12,
  recepcionesPendientes: 5
});

const stockAlertas = ref([
  {
    id: 1,
    item: 'Microscopio Digital HD',
    stockActual: 2,
    stockMinimo: 5
  },
  {
    id: 2,
    item: 'Reactivos para práctica de Biología',
    stockActual: 3,
    stockMinimo: 10
  },
  {
    id: 3,
    item: 'Equipos de medición de pH',
    stockActual: 1,
    stockMinimo: 4
  },
  {
    id: 4,
    item: 'Material de laboratorio (pipetas)',
    stockActual: 5,
    stockMinimo: 15
  }
]);

const proximasRecepciones = ref([
  {
    id: 1,
    descripcion: 'Microscopios Digitales (10 unidades)',
    orden: 'OC-2023-045',
    proveedor: 'MediTech Bolivia',
    fechaEstimada: '15/11/2025',
    estado: 'En tránsito'
  },
  {
    id: 2,
    descripcion: 'Equipos de laboratorio para química',
    orden: 'OC-2023-047',
    proveedor: 'LabChem SRL',
    fechaEstimada: '18/11/2025',
    estado: 'Procesado'
  },
  {
    id: 3,
    descripcion: 'Material de laboratorio general',
    orden: 'OC-2023-049',
    proveedor: 'SuministrosMed',
    fechaEstimada: '20/11/2025',
    estado: 'Procesado'
  }
]);

const traspasosPendientes = ref([
  {
    id: 1,
    descripcion: 'Equipos de medición para laboratorio',
    origen: 'Almacén Central',
    destino: 'Laboratorio de Física',
    fecha: '09/11/2025'
  },
  {
    id: 2,
    descripcion: 'Material didáctico para anatomía',
    origen: 'Almacén Central',
    destino: 'Laboratorio de Anatomía',
    fecha: '08/11/2025'
  },
  {
    id: 3,
    descripcion: 'Instrumentos para química',
    origen: 'Almacén Central',
    destino: 'Laboratorio de Química',
    fecha: '07/11/2025'
  }
]);

// Funciones auxiliares
const getStatusIcon = (status) => {
  switch (status) {
    case 'En tránsito': return 'local_shipping';
    case 'Procesado': return 'pending';
    case 'Recibido': return 'check_circle';
    case 'Con problemas': return 'error';
    default: return 'help';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'En tránsito': return 'info';
    case 'Procesado': return 'warning';
    case 'Recibido': return 'positive';
    case 'Con problemas': return 'negative';
    default: return 'grey';
  }
};

// Configuración del gráfico
onMounted(() => {
  // Gráfico de stock por categoría
  if (stockChart.value) {
    const ctx = stockChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: [
          'Equipos Electrónicos',
          'Instrumental Médico',
          'Material de Laboratorio',
          'Reactivos',
          'Equipos Informáticos',
          'Material Didáctico'
        ],
        datasets: [{
          label: 'Stock Actual',
          data: [120, 85, 205, 45, 78, 92],
          backgroundColor: 'rgba(2, 123, 227, 0.7)',
          borderColor: '#027BE3',
          borderWidth: 1
        }, {
          label: 'Stock Mínimo',
          data: [50, 40, 100, 30, 30, 40],
          backgroundColor: 'rgba(244, 67, 54, 0.5)',
          borderColor: '#F44336',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
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

.action-card {
  transition: all 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
</style>
