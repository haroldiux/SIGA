<!-- src/components/dashboard/DocenteDashboard.vue -->
<template>
  <div class="docente-dashboard">
    <div class="row q-col-gutter-md">
      <!-- Tarjetas de estadísticas -->
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Mis Solicitudes</div>
            <div class="text-h3 q-mt-sm text-primary">{{ stats.solicitudes }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Solicitudes activas</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Préstamos</div>
            <div class="text-h3 q-mt-sm text-secondary">{{ stats.prestamos }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Items prestados actualmente</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Próximas Devoluciones</div>
            <div class="text-h3 q-mt-sm text-negative">{{ stats.devoluciones }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Items a devolver esta semana</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Laboratorios</div>
            <div class="text-h3 q-mt-sm text-accent">{{ stats.laboratorios }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption">Espacios disponibles</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Próximas devoluciones -->
      <div class="col-12 col-lg-6">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Próximas Devoluciones</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-list separator>
              <q-item v-for="item in proximasDevoluciones" :key="item.id" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar :color="getDaysColor(item.diasRestantes)" text-color="white">
                    {{ item.diasRestantes }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.nombre }}</q-item-label>
                  <q-item-label caption>
                    Código: {{ item.codigo }} |
                    Laboratorio: {{ item.laboratorio }} |
                    Fecha devolución: {{ item.fechaDevolucion }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn color="primary" size="sm" label="Renovar" outline />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Estado de solicitudes -->
      <div class="col-12 col-lg-6">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Estado de mis Solicitudes</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-list separator>
              <q-item v-for="solicitud in solicitudes" :key="solicitud.id" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar :color="getStatusColor(solicitud.estado)" text-color="white">
                    <q-icon :name="getStatusIcon(solicitud.estado)" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ solicitud.descripcion }}</q-item-label>
                  <q-item-label caption>
                    Solicitud #{{ solicitud.id }} |
                    Fecha: {{ solicitud.fecha }} |
                    <span :class="'text-' + getStatusColor(solicitud.estado)">{{ solicitud.estado }}</span>
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

      <!-- Inventario disponible -->
      <div class="col-12">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Inventario Disponible por Categoría</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="chart-container" style="height: 300px;">
              <canvas ref="inventoryChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Acciones rápidas -->
      <div class="col-12">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-card class="dashboard-card action-card">
              <q-card-section class="text-center">
                <q-icon name="description" size="56px" color="primary" />
                <div class="text-h6 q-mt-sm">Nueva Solicitud</div>
                <div class="text-caption q-mt-sm">Solicita nuevos items para tus clases o proyectos</div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="primary" label="Crear Solicitud" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card class="dashboard-card action-card">
              <q-card-section class="text-center">
                <q-icon name="schedule" size="56px" color="secondary" />
                <div class="text-h6 q-mt-sm">Reservar Laboratorio</div>
                <div class="text-caption q-mt-sm">Agenda un espacio para tus actividades académicas</div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="secondary" label="Reservar" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card class="dashboard-card action-card">
              <q-card-section class="text-center">
                <q-icon name="help_outline" size="56px" color="accent" />
                <div class="text-h6 q-mt-sm">Asistencia</div>
                <div class="text-caption q-mt-sm">Solicita ayuda para usar equipos o laboratorios</div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="accent" label="Contactar" />
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
const inventoryChart = ref(null);

// Datos de ejemplo - En producción vendrían de una API
const stats = ref({
  solicitudes: 3,
  prestamos: 12,
  devoluciones: 2,
  laboratorios: 8
});

const proximasDevoluciones = ref([
  {
    id: 1,
    nombre: 'Microscopio Digital HD',
    codigo: 'MSC-2023-042',
    laboratorio: 'Laboratorio de Biología',
    fechaDevolucion: '14/11/2025',
    diasRestantes: 2
  },
  {
    id: 2,
    nombre: 'Kit de Instrumentos Quirúrgicos',
    codigo: 'KIT-2023-087',
    laboratorio: 'Laboratorio de Anatomía',
    fechaDevolucion: '16/11/2025',
    diasRestantes: 4
  },
  {
    id: 3,
    nombre: 'Proyector Portátil',
    codigo: 'PROJ-2023-015',
    laboratorio: 'Sala de Conferencias',
    fechaDevolucion: '20/11/2025',
    diasRestantes: 8
  }
]);

const solicitudes = ref([
  {
    id: 'SOL-2023-127',
    descripcion: 'Materiales para prácticas de Bioquímica',
    fecha: '08/11/2025',
    estado: 'Aprobado'
  },
  {
    id: 'SOL-2023-145',
    descripcion: 'Equipo de medición para práctica de campo',
    fecha: '05/11/2025',
    estado: 'En revisión'
  },
  {
    id: 'SOL-2023-118',
    descripcion: 'Licencia de software especializado',
    fecha: '01/11/2025',
    estado: 'Pendiente'
  }
]);

// Funciones auxiliares
const getDaysColor = (days) => {
  if (days <= 2) return 'negative';
  if (days <= 5) return 'warning';
  return 'positive';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Aprobado': return 'positive';
    case 'En revisión': return 'info';
    case 'Pendiente': return 'warning';
    case 'Rechazado': return 'negative';
    default: return 'grey';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Aprobado': return 'check_circle';
    case 'En revisión': return 'hourglass_top';
    case 'Pendiente': return 'schedule';
    case 'Rechazado': return 'cancel';
    default: return 'help';
  }
};

// Configuración del gráfico
onMounted(() => {
  // Gráfico de inventario disponible
  if (inventoryChart.value) {
    const ctx = inventoryChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Equipos Electrónicos', 'Instrumental Médico', 'Material de Laboratorio', 'Equipos Informáticos', 'Material Didáctico'],
        datasets: [{
          label: 'Items Disponibles',
          data: [42, 28, 64, 35, 22],
          backgroundColor: [
            'rgba(2, 123, 227, 0.7)',     // primary
            'rgba(38, 166, 154, 0.7)',    // secondary
            'rgba(156, 39, 176, 0.7)',    // accent
            'rgba(242, 192, 55, 0.7)',    // warning
            'rgba(189, 189, 189, 0.7)'    // grey
          ],
          borderColor: [
            '#027BE3',
            '#26A69A',
            '#9C27B0',
            '#F2C037',
            '#BDBDBD'
          ],
          borderWidth: 1
        }]
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

.action-card {
  transition: all 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
</style>
