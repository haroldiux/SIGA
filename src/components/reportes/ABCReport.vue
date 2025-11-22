<template>
  <div class="abc-analysis">
    <!-- Encabezado -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row items-center">
          <div class="col">
            <div class="text-h6">Análisis ABC de Inventario</div>
            <div class="text-subtitle2 text-grey-7">Clasificación por valor</div>
          </div>
          <div class="col-auto">
            <q-btn-group unelevated>
              <q-btn color="negative" icon="picture_as_pdf" label="PDF" @click="exportarPDF" />
              <q-btn color="positive" icon="table_chart" label="Excel" @click="exportarExcel" />
            </q-btn-group>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Resumen por Categoría -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-red-1">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-grey-7">Categoría A</div>
                <div class="text-h6 text-negative">{{ categoriaA.porcentaje }}%</div>
                <div class="text-caption">{{ categoriaA.items }} items</div>
              </div>
              <div class="col-auto">
                <q-icon name="trending_up" size="48px" color="negative" />
              </div>
            </div>
            <q-separator class="q-my-sm" />
            <div class="text-caption text-grey-7">Valor Total</div>
            <div class="text-body1 text-weight-bold">Bs. {{ categoriaA.valor.toLocaleString() }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-orange-1">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-grey-7">Categoría B</div>
                <div class="text-h6 text-warning">{{ categoriaB.porcentaje }}%</div>
                <div class="text-caption">{{ categoriaB.items }} items</div>
              </div>
              <div class="col-auto">
                <q-icon name="trending_flat" size="48px" color="warning" />
              </div>
            </div>
            <q-separator class="q-my-sm" />
            <div class="text-caption text-grey-7">Valor Total</div>
            <div class="text-body1 text-weight-bold">Bs. {{ categoriaB.valor.toLocaleString() }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-green-1">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-grey-7">Categoría C</div>
                <div class="text-h6 text-positive">{{ categoriaC.porcentaje }}%</div>
                <div class="text-caption">{{ categoriaC.items }} items</div>
              </div>
              <div class="col-auto">
                <q-icon name="trending_down" size="48px" color="positive" />
              </div>
            </div>
            <q-separator class="q-my-sm" />
            <div class="text-caption text-grey-7">Valor Total</div>
            <div class="text-body1 text-weight-bold">Bs. {{ categoriaC.valor.toLocaleString() }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Gráfico de Pareto -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle2 q-mb-md">Gráfico de Pareto</div>
        <div class="pareto-chart">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla Detallada -->
    <q-table
      :rows="itemsClasificados"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[10, 25, 50]"
      :pagination="{ rowsPerPage: 25 }"
    >
      <template v-slot:body-cell-clasificacion="props">
        <q-td :props="props">
          <q-badge
            :color="getClasificacionColor(props.value)"
            :label="props.value"
            size="lg"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-valorTotal="props">
        <q-td :props="props">
          <span class="text-weight-bold">
            Bs. {{ props.value.toLocaleString() }}
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-porcentajeAcumulado="props">
        <q-td :props="props">
          <div class="row items-center">
            <div class="col-auto q-mr-sm">{{ props.value }}%</div>
            <div class="col">
              <q-linear-progress
                :value="props.value / 100"
                size="8px"
                :color="getProgressColor(props.value)"
              />
            </div>
          </div>
        </q-td>
      </template>
    </q-table>

    <!-- Recomendaciones -->
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="text-subtitle2 q-mb-md">Recomendaciones de Gestión</div>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-avatar color="negative" text-color="white" icon="priority_high" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Categoría A ({{ categoriaA.porcentaje }}% del valor)</q-item-label>
              <q-item-label caption>
                Control estricto, revisión frecuente, pronósticos precisos, relaciones cercanas con proveedores
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-avatar color="warning" text-color="white" icon="info" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Categoría B ({{ categoriaB.porcentaje }}% del valor)</q-item-label>
              <q-item-label caption>
                Control moderado, revisión periódica, buenos sistemas de registro
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-avatar color="positive" text-color="white" icon="check" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Categoría C ({{ categoriaC.porcentaje }}% del valor)</q-item-label>
              <q-item-label caption>
                Control simple, revisión ocasional, órdenes grandes para minimizar costos
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const chartCanvas = ref(null);

const itemsClasificados = computed(() => {
  // Calcular valor total de cada item
  const itemsConValor = props.items.map(item => ({
    ...item,
    valorTotal: (item.cantidad || 0) * (item.precioUnitario || 0),
  }));

  // Ordenar por valor descendente
  itemsConValor.sort((a, b) => b.valorTotal - a.valorTotal);

  // Calcular porcentaje acumulado
  const valorTotal = itemsConValor.reduce((sum, item) => sum + item.valorTotal, 0);
  let acumulado = 0;

  return itemsConValor.map(item => {
    acumulado += item.valorTotal;
    const porcentajeAcumulado = ((acumulado / valorTotal) * 100).toFixed(2);
    
    // Clasificar según regla 80-15-5
    let clasificacion = 'C';
    if (porcentajeAcumulado <= 80) clasificacion = 'A';
    else if (porcentajeAcumulado <= 95) clasificacion = 'B';

    return {
      ...item,
      porcentajeAcumulado: parseFloat(porcentajeAcumulado),
      clasificacion,
    };
  });
});

const categoriaA = computed(() => {
  const items = itemsClasificados.value.filter(i => i.clasificacion === 'A');
  const valor = items.reduce((sum, i) => sum + i.valorTotal, 0);
  const valorTotal = itemsClasificados.value.reduce((sum, i) => sum + i.valorTotal, 0);
  return {
    items: items.length,
    valor,
    porcentaje: ((valor / valorTotal) * 100).toFixed(1),
  };
});

const categoriaB = computed(() => {
  const items = itemsClasificados.value.filter(i => i.clasificacion === 'B');
  const valor = items.reduce((sum, i) => sum + i.valorTotal, 0);
  const valorTotal = itemsClasificados.value.reduce((sum, i) => sum + i.valorTotal, 0);
  return {
    items: items.length,
    valor,
    porcentaje: ((valor / valorTotal) * 100).toFixed(1),
  };
});

const categoriaC = computed(() => {
  const items = itemsClasificados.value.filter(i => i.clasificacion === 'C');
  const valor = items.reduce((sum, i) => sum + i.valorTotal, 0);
  const valorTotal = itemsClasificados.value.reduce((sum, i) => sum + i.valorTotal, 0);
  return {
    items: items.length,
    valor,
    porcentaje: ((valor / valorTotal) * 100).toFixed(1),
  };
});

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'cantidad', label: 'Cantidad', field: 'cantidad', align: 'right', sortable: true },
  { name: 'precioUnitario', label: 'Precio Unit.', field: 'precioUnitario', align: 'right', sortable: true },
  { name: 'valorTotal', label: 'Valor Total', field: 'valorTotal', align: 'right', sortable: true },
  { name: 'porcentajeAcumulado', label: '% Acumulado', field: 'porcentajeAcumulado', align: 'center', sortable: true },
  { name: 'clasificacion', label: 'Clasificación', field: 'clasificacion', align: 'center', sortable: true },
];

const getClasificacionColor = (clasificacion) => {
  const colors = { A: 'negative', B: 'warning', C: 'positive' };
  return colors[clasificacion] || 'grey';
};

const getProgressColor = (porcentaje) => {
  if (porcentaje <= 80) return 'negative';
  if (porcentaje <= 95) return 'warning';
  return 'positive';
};

const exportarPDF = () => {
  alert('Exportar a PDF (requiere jsPDF)');
};

const exportarExcel = () => {
  alert('Exportar a Excel (requiere xlsx)');
};

onMounted(() => {
  // Aquí se inicializaría el gráfico de Pareto con Chart.js
  // Requiere: npm install chart.js
});
</script>

<style scoped>
.pareto-chart {
  height: 300px;
}
</style>
