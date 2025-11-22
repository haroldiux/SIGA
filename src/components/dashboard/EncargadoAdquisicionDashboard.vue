<!-- src/components/dashboard/EncargadoAdquisicionDashboard.vue -->
<template>
  <div class="encargado-adquisicion-dashboard">
    <div class="row q-col-gutter-md">
      <!-- Tarjetas de estadísticas -->
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Órdenes de Compra</div>
            <div class="text-h3 q-mt-sm text-primary">{{ stats.ordenesCompra }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Órdenes activas</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Proveedores</div>
            <div class="text-h3 q-mt-sm text-secondary">{{ stats.proveedores }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Proveedores activos</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Solicitudes</div>
            <div class="text-h3 q-mt-sm text-negative">{{ stats.solicitudesPendientes }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Pendientes de aprobar</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Presupuesto Usado</div>
            <div class="text-h3 q-mt-sm text-accent">{{ stats.presupuestoUsado }}%</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-linear-progress :value="stats.presupuestoUsado/100" class="q-mt-sm" size="10px" :color="getPresupuestoColor(stats.presupuestoUsado)" />
            <div class="text-caption q-mt-xs">Del presupuesto anual</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Gráfico de órdenes de compra por mes -->
      <div class="col-12 col-lg-8">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Órdenes de Compra por Mes</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="chart-container" style="height: 300px;">
              <canvas ref="ordenesChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Distribución de presupuesto -->
      <div class="col-12 col-lg-4">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Distribución del Presupuesto</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="chart-container" style="height: 250px;">
              <canvas ref="presupuestoChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Órdenes pendientes de aprobación -->
      <div class="col-12 col-lg-6">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Órdenes Pendientes de Aprobación</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-list separator>
              <q-item v-for="orden in ordenesPendientes" :key="orden.id" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar color="warning" text-color="white">
                    <q-icon name="shopping_cart" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ orden.descripcion }}</q-item-label>
                  <q-item-label caption>
                    Orden #{{ orden.id }} |
                    Proveedor: {{ orden.proveedor }} |
                    Monto: Bs. {{ orden.monto.toLocaleString() }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row q-gutter-x-sm">
                    <q-btn color="positive" size="sm" icon="check" flat>
                      <q-tooltip>Aprobar</q-tooltip>
                    </q-btn>
                    <q-btn color="negative" size="sm" icon="close" flat>
                      <q-tooltip>Rechazar</q-tooltip>
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

      <!-- Últimas cotizaciones -->
      <div class="col-12 col-lg-6">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Últimas Cotizaciones Recibidas</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-list separator>
              <q-item v-for="cotizacion in ultimasCotizaciones" :key="cotizacion.id" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar color="info" text-color="white">
                    <q-icon name="description" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ cotizacion.descripcion }}</q-item-label>
                  <q-item-label caption>
                    Cotización #{{ cotizacion.id }} |
                    Proveedor: {{ cotizacion.proveedor }} |
                    Fecha: {{ cotizacion.fecha }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn color="primary" size="sm" icon="visibility" flat>
                    <q-tooltip>Ver cotización</q-tooltip>
                  </q-btn>
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
                <q-icon name="add_shopping_cart" size="56px" color="primary" />
                <div class="text-h6 q-mt-sm">Nueva Orden</div>
                <div class="text-caption q-mt-sm">Crear una nueva orden de compra</div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="primary" label="Crear" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card class="dashboard-card action-card">
              <q-card-section class="text-center">
                <q-icon name="people" size="56px" color="secondary" />
                <div class="text-h6 q-mt-sm">Proveedores</div>
                <div class="text-caption q-mt-sm">Gestionar catálogo de proveedores</div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="secondary" label="Gestionar" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card class="dashboard-card action-card">
              <q-card-section class="text-center">
                <q-icon name="insert_chart" size="56px" color="accent" />
                <div class="text-h6 q-mt-sm">Reportes</div>
                <div class="text-caption q-mt-sm">Generar reportes de adquisiciones</div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="accent" label="Generar" />
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
const ordenesChart = ref(null);
const presupuestoChart = ref(null);

// Datos de ejemplo - En producción vendrían de una API
const stats = ref({
  ordenesCompra: 24,
  proveedores: 15,
  solicitudesPendientes: 7,
  presupuestoUsado: 78
});

const ordenesPendientes = ref([
  {
    id: 'OC-2023-052',
    descripcion: 'Equipos de cómputo para laboratorio',
    proveedor: 'TechBol',
    monto: 32500,
    fecha: '10/11/2025'
  },
  {
    id: 'OC-2023-053',
    descripcion: 'Material didáctico para anatomía',
    proveedor: 'Anatomic Models',
    monto: 18200,
    fecha: '09/11/2025'
  },
  {
    id: 'OC-2023-054',
    descripcion: 'Reactivos para laboratorio de química',
    proveedor: 'LabChem SRL',
    monto: 15640,
    fecha: '08/11/2025'
  },
  {
    id: 'OC-2023-055',
    descripcion: 'Mobiliario para aulas',
    proveedor: 'Muebles Educativos',
    monto: 27850,
    fecha: '07/11/2025'
  }
]);

const ultimasCotizaciones = ref([
  {
    id: 'COT-2023-085',
    descripcion: 'Microscopios digitales (10 unidades)',
    proveedor: 'MediTech Bolivia',
    fecha: '10/11/2025'
  },
  {
    id: 'COT-2023-086',
    descripcion: 'Equipos de laboratorio para física',
    proveedor: 'SciTech',
    fecha: '09/11/2025'
  },
  {
    id: 'COT-2023-087',
    descripcion: 'Software de simulación médica',
    proveedor: 'MedSim',
    fecha: '08/11/2025'
  },
  {
    id: 'COT-2023-088',
    descripcion: 'Material para prácticas de enfermería',
    proveedor: 'SaludEquipos',
    fecha: '07/11/2025'
  }
]);

// Funciones auxiliares
const getPresupuestoColor = (porcentaje) => {
  if (porcentaje < 50) return 'positive';
  if (porcentaje < 75) return 'warning';
  return 'negative';
};

// Configuración de los gráficos
onMounted(() => {
  // Gráfico de órdenes de compra por mes
  if (ordenesChart.value) {
    const ctx = ordenesChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'],
        datasets: [
          {
            label: 'Órdenes Emitidas',
            data: [8, 12, 15, 10, 7, 9, 14, 11, 13, 18, 10],
            borderColor: '#027BE3',
            backgroundColor: 'rgba(2, 123, 227, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Órdenes Completadas',
            data: [6, 10, 13, 9, 6, 8, 12, 9, 10, 15, 7],
            borderColor: '#26A69A',
            backgroundColor: 'rgba(38, 166, 154, 0.1)',
            tension: 0.4,
            fill: true
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

  // Gráfico de distribución del presupuesto
  if (presupuestoChart.value) {
    const ctx = presupuestoChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'Equipos Médicos',
          'Material de Laboratorio',
          'Equipos Informáticos',
          'Material Didáctico',
          'Mobiliario'
        ],
        datasets: [{
          data: [40, 25, 15, 12, 8],
          backgroundColor: [
            '#027BE3',   // primary
            '#26A69A',   // secondary
            '#9C27B0',   // accent
            '#F2C037',   // warning
            '#BDBDBD'    // grey
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
