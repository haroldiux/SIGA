<template>
  <div class="kardex-report">
    <!-- Encabezado del Reporte -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row items-center">
          <div class="col">
            <div class="text-h6">Kardex de Inventario</div>
            <div class="text-subtitle2 text-grey-7">{{ item?.nombre }}</div>
          </div>
          <div class="col-auto">
            <q-btn-group unelevated>
              <q-btn
                color="negative"
                icon="picture_as_pdf"
                label="PDF"
                @click="exportarPDF"
              />
              <q-btn
                color="positive"
                icon="table_chart"
                label="Excel"
                @click="exportarExcel"
              />
            </q-btn-group>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Información del Item -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-7">Código</div>
            <div class="text-body1 text-weight-bold">{{ item?.codigo }}</div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-7">Categoría</div>
            <div class="text-body1">{{ item?.categoria }}</div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-7">Unidad</div>
            <div class="text-body1">{{ item?.unidad }}</div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-7">Stock Actual</div>
            <div class="text-h6 text-primary">{{ stockActual }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filtros.fechaInicio"
              label="Fecha Inicio"
              outlined
              dense
              type="date"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="filtros.fechaFin"
              label="Fecha Fin"
              outlined
              dense
              type="date"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="filtros.tipoMovimiento"
              :options="tiposMovimiento"
              label="Tipo de Movimiento"
              outlined
              dense
              emit-value
              map-options
              clearable
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla de Movimientos -->
    <q-table
      :rows="movimientosFiltrados"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[10, 25, 50]"
      :pagination="{ rowsPerPage: 25 }"
    >
      <template v-slot:body-cell-tipo="props">
        <q-td :props="props">
          <q-badge
            :color="getTipoColor(props.value)"
            :label="props.value"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-entrada="props">
        <q-td :props="props">
          <span v-if="props.value" class="text-positive text-weight-bold">
            +{{ props.value }}
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-salida="props">
        <q-td :props="props">
          <span v-if="props.value" class="text-negative text-weight-bold">
            -{{ props.value }}
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-saldo="props">
        <q-td :props="props">
          <span class="text-weight-bold">{{ props.value }}</span>
        </q-td>
      </template>
    </q-table>

    <!-- Resumen -->
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="text-subtitle2 q-mb-md">Resumen del Período</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-card flat bordered class="bg-green-1">
              <q-card-section>
                <div class="text-caption text-grey-7">Total Entradas</div>
                <div class="text-h6 text-positive">{{ totalEntradas }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card flat bordered class="bg-red-1">
              <q-card-section>
                <div class="text-caption text-grey-7">Total Salidas</div>
                <div class="text-h6 text-negative">{{ totalSalidas }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card flat bordered class="bg-blue-1">
              <q-card-section>
                <div class="text-caption text-grey-7">Movimientos</div>
                <div class="text-h6 text-primary">{{ movimientosFiltrados.length }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card flat bordered class="bg-grey-2">
              <q-card-section>
                <div class="text-caption text-grey-7">Saldo Final</div>
                <div class="text-h6">{{ stockActual }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { exportKardexPDF } from 'src/utils/pdfExporter';
import { exportKardexToExcel } from 'src/utils/excelExporter';

const props = defineProps({
  item: Object,
  movimientos: {
    type: Array,
    default: () => [],
  },
});

const filtros = ref({
  fechaInicio: '',
  fechaFin: '',
  tipoMovimiento: null,
});

const tiposMovimiento = [
  { label: 'Entrada', value: 'entrada' },
  { label: 'Salida', value: 'salida' },
  { label: 'Ajuste', value: 'ajuste' },
  { label: 'Traspaso', value: 'traspaso' },
];

const columns = [
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'center' },
  { name: 'documento', label: 'Documento', field: 'documento', align: 'left' },
  { name: 'detalle', label: 'Detalle', field: 'detalle', align: 'left' },
  { name: 'entrada', label: 'Entrada', field: 'entrada', align: 'right' },
  { name: 'salida', label: 'Salida', field: 'salida', align: 'right' },
  { name: 'saldo', label: 'Saldo', field: 'saldo', align: 'right' },
];

const movimientosFiltrados = computed(() => {
  let result = [...props.movimientos];

  if (filtros.value.fechaInicio) {
    result = result.filter(m => m.fecha >= filtros.value.fechaInicio);
  }

  if (filtros.value.fechaFin) {
    result = result.filter(m => m.fecha <= filtros.value.fechaFin);
  }

  if (filtros.value.tipoMovimiento) {
    result = result.filter(m => m.tipo.toLowerCase() === filtros.value.tipoMovimiento);
  }

  return result;
});

const stockActual = computed(() => {
  if (movimientosFiltrados.value.length === 0) return 0;
  return movimientosFiltrados.value[movimientosFiltrados.value.length - 1].saldo;
});

const totalEntradas = computed(() => {
  return movimientosFiltrados.value.reduce((sum, m) => sum + (m.entrada || 0), 0);
});

const totalSalidas = computed(() => {
  return movimientosFiltrados.value.reduce((sum, m) => sum + (m.salida || 0), 0);
});

const getTipoColor = (tipo) => {
  const colors = {
    'Entrada': 'positive',
    'Salida': 'negative',
    'Ajuste': 'warning',
    'Traspaso': 'info',
  };
  return colors[tipo] || 'grey';
};

const exportarPDF = () => {
  exportKardexPDF(props.item, movimientosFiltrados.value);
};

const exportarExcel = () => {
  exportKardexToExcel(props.item, movimientosFiltrados.value);
};
</script>
