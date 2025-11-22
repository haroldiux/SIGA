<!-- src/components/dashboard/EncargadoLabDashboard.vue -->
<template>
  <div class="encargado-lab-dashboard">
    <div class="row q-col-gutter-md">
      <!-- Tarjetas de estadísticas -->
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Inventario Total</div>
            <div class="text-h3 q-mt-sm text-primary">{{ stats.totalItems }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Items asignados a laboratorios</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Préstamos Activos</div>
            <div class="text-h3 q-mt-sm text-secondary">{{ stats.prestamosActivos }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Items prestados actualmente</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Alertas</div>
            <div class="text-h3 q-mt-sm text-negative">{{ stats.alertas }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Requieren atención</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Solicitudes Pendientes</div>
            <div class="text-h3 q-mt-sm text-warning">{{ stats.solicitudesPendientes }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Por aprobar/rechazar</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Estado de equipos por laboratorio -->
      <div class="col-12 col-lg-6">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Estado de Equipos por Laboratorio</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="chart-container" style="height: 300px;">
              <canvas ref="labStatusChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Alertas de inventario -->
      <div class="col-12 col-lg-6">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Alertas de Inventario</div>
            <q-badge color="negative" floating>{{ alertas.length }}</q-badge>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-list separator>
              <q-item v-for="alerta in alertas" :key="alerta.id" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar :color="getAlertColor(alerta.tipo)" text-color="white">
                    <q-icon :name="getAlertIcon(alerta.tipo)" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ alerta.mensaje }}</q-item-label>
                  <q-item-label caption>
                    Laboratorio: {{ alerta.laboratorio }} |
                    Reportado: {{ alerta.fecha }}
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

      <!-- Solicitudes de préstamos pendientes -->
      <div class="col-12">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Solicitudes de Préstamos Pendientes</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-table
              :rows="solicitudesPrestamo"
              :columns="solicitudesColumns"
              row-key="id"
              :pagination="{ rowsPerPage: 5 }"
              dense
              flat
            >
              <template v-slot:body-cell-estado="props">
                <q-td :props="props">
                  <q-badge :color="getStatusColor(props.value)">{{ props.value }}</q-badge>
                </q-td>
              </template>
              <template v-slot:body-cell-acciones="props">
                <q-td :props="props" class="q-gutter-x-sm">
                  <q-btn size="sm" color="positive" icon="check" flat>
                    <q-tooltip>Aprobar</q-tooltip>
                  </q-btn>
                  <q-btn size="sm" color="negative" icon="close" flat>
                    <q-tooltip>Rechazar</q-tooltip>
                  </q-btn>
                  <q-btn size="sm" color="info" icon="info" flat>
                    <q-tooltip>Detalles</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

      <!-- Acciones rápidas -->
      <div class="col-12">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-card class="dashboard-card action-card">
              <q-card-section class="text-center">
                <q-icon name="inventory_2" size="56px" color="primary" />
                <div class="text-h6 q-mt-sm">Gestionar Inventario</div>
                <div class="text-caption q-mt-sm">Actualizar estado y ubicación de items</div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="primary" label="Acceder" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card class="dashboard-card action-card">
              <q-card-section class="text-center">
                <q-icon name="handshake" size="56px" color="secondary" />
                <div class="text-h6 q-mt-sm">Gestionar Préstamos</div>
                <div class="text-caption q-mt-sm">Control de entradas y salidas de equipos</div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="secondary" label="Acceder" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card class="dashboard-card action-card">
              <q-card-section class="text-center">
                <q-icon name="warning" size="56px" color="warning" />
                <div class="text-h6 q-mt-sm">Reportar Incidencia</div>
                <div class="text-caption q-mt-sm">Informar sobre problemas con equipos</div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="warning" label="Reportar" />
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
const labStatusChart = ref(null);

// Datos de ejemplo - En producción vendrían de una API
const stats = ref({
  totalItems: 456,
  prestamosActivos: 38,
  alertas: 7,
  solicitudesPendientes: 12
});

const alertas = ref([
  {
    id: 1,
    tipo: 'mantenimiento',
    mensaje: 'Microscopio #12 requiere calibración',
    laboratorio: 'Laboratorio de Biología',
    fecha: '09/11/2025'
  },
  {
    id: 2,
    tipo: 'stock',
    mensaje: 'Stock bajo de reactivos para prácticas',
    laboratorio: 'Laboratorio de Química',
    fecha: '08/11/2025'
  },
  {
    id: 3,
    tipo: 'incidencia',
    mensaje: 'Proyector con fallos en la imagen',
    laboratorio: 'Aula Multimedia',
    fecha: '07/11/2025'
  },
  {
    id: 4,
    tipo: 'caducidad',
    mensaje: 'Reactivos próximos a caducar',
    laboratorio: 'Laboratorio de Química',
    fecha: '06/11/2025'
  }
]);

const solicitudesColumns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'solicitante', label: 'Solicitante', field: 'solicitante', sortable: true },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', sortable: true },
  { name: 'fecha', label: 'Fecha', field: 'fecha', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', sortable: true },
  { name: 'acciones', label: 'Acciones', field: 'acciones' }
];

const solicitudesPrestamo = ref([
  {
    id: 'SOL-2023-156',
    solicitante: 'Dr. Juan Pérez',
    descripcion: 'Microscopio digital para clase de Histología',
    fecha: '10/11/2025',
    estado: 'Pendiente'
  },
  {
    id: 'SOL-2023-157',
    solicitante: 'Dra. María López',
    descripcion: 'Kit de instrumentos para práctica de anatomía',
    fecha: '10/11/2025',
    estado: 'Pendiente'
  },
  {
    id: 'SOL-2023-158',
    solicitante: 'Dr. Carlos Rodríguez',
    descripcion: 'Equipo de medición para práctica de campo',
    fecha: '09/11/2025',
    estado: 'En revisión'
  },
  {
    id: 'SOL-2023-159',
    solicitante: 'Dra. Ana Martínez',
    descripcion: 'Material para práctica de microbiología',
    fecha: '09/11/2025',
    estado: 'Pendiente'
  },
  {
    id: 'SOL-2023-160',
    solicitante: 'Dr. Luis Sánchez',
    descripcion: 'Proyector y equipo audiovisual para conferencia',
    fecha: '08/11/2025',
    estado: 'En revisión'
  }
]);

// Funciones auxiliares
const getAlertIcon = (tipo) => {
  switch (tipo) {
    case 'mantenimiento': return 'build';
    case 'stock': return 'inventory';
    case 'incidencia': return 'error';
    case 'caducidad': return 'event_busy';
    default: return 'warning';
  }
};

const getAlertColor = (tipo) => {
  switch (tipo) {
    case 'mantenimiento': return 'warning';
    case 'stock': return 'info';
    case 'incidencia': return 'negative';
    case 'caducidad': return 'orange';
    default: return 'grey';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Aprobado': return 'positive';
    case 'Pendiente': return 'warning';
    case 'En revisión': return 'info';
    case 'Rechazado': return 'negative';
    default: return 'grey';
  }
};

// Configuración del gráfico
onMounted(() => {
  // Gráfico de estado de equipos por laboratorio
  if (labStatusChart.value) {
    const ctx = labStatusChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Lab. Biología', 'Lab. Química', 'Lab. Física', 'Lab. Informática', 'Aula Multimedia'],
        datasets: [
          {
            label: 'Operativos',
            data: [85, 72, 64, 92, 45],
            backgroundColor: 'rgba(38, 166, 154, 0.7)'
          },
          {
            label: 'En préstamo',
            data: [12, 15, 8, 10, 5],
            backgroundColor: 'rgba(2, 123, 227, 0.7)'
          },
          {
            label: 'En mantenimiento',
            data: [3, 8, 6, 2, 3],
            backgroundColor: 'rgba(242, 192, 55, 0.7)'
          },
          {
            label: 'Fuera de servicio',
            data: [2, 5, 3, 1, 2],
            backgroundColor: 'rgba(244, 67, 54, 0.7)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
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
