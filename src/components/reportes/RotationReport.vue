<template>
  <div class="rotation-report">
    <!-- Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-3">
            <q-select
              v-model="periodo"
              :options="['Último Mes', 'Último Trimestre', 'Último Semestre', 'Último Año']"
              label="Periodo de Análisis"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="categoria"
              :options="['Todas', 'Reactivos', 'Equipos', 'Vidriería']"
              label="Categoría"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-6 text-right">
            <q-btn color="primary" icon="refresh" label="Generar Análisis" @click="generarReporte" />
            <q-btn flat color="secondary" icon="download" label="Exportar" class="q-ml-sm" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Resumen KPIs -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-blue-1">
          <q-card-section>
            <div class="text-subtitle2 text-grey-8">Índice de Rotación Promedio</div>
            <div class="text-h4 text-primary q-my-sm">{{ kpis.rotacionPromedio }}x</div>
            <div class="text-caption">Veces que el inventario se renueva en el periodo</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-green-1">
          <q-card-section>
            <div class="text-subtitle2 text-grey-8">Días Promedio en Inventario</div>
            <div class="text-h4 text-positive q-my-sm">{{ kpis.diasInventario }} días</div>
            <div class="text-caption">Tiempo promedio que un item permanece almacenado</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-orange-1">
          <q-card-section>
            <div class="text-subtitle2 text-grey-8">Items sin Movimiento</div>
            <div class="text-h4 text-warning q-my-sm">{{ kpis.itemsEstancados }}</div>
            <div class="text-caption">Items sin salidas en el periodo seleccionado</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tabla Detallada -->
    <q-table
      title="Detalle de Rotación por Item"
      :rows="items"
      :columns="columns"
      row-key="id"
      flat
      bordered
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-indice="props">
        <q-td :props="props">
          <q-badge :color="getRotacionColor(props.value)">
            {{ props.value }}x
          </q-badge>
        </q-td>
      </template>
      
      <template v-slot:body-cell-clasificacion="props">
        <q-td :props="props">
          <div class="text-weight-bold" :class="getClasificacionClass(props.value)">
            {{ props.value }}
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const periodo = ref('Último Trimestre');
const categoria = ref('Todas');

const kpis = ref({
  rotacionPromedio: 0,
  diasInventario: 0,
  itemsEstancados: 0
});

const items = ref([]);

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'nombre', label: 'Item', field: 'nombre', align: 'left', sortable: true },
  { name: 'stockPromedio', label: 'Stock Promedio', field: 'stockPromedio', align: 'center' },
  { name: 'salidas', label: 'Salidas (Cant)', field: 'salidas', align: 'center', sortable: true },
  { name: 'indice', label: 'Índice Rotación', field: 'indice', align: 'center', sortable: true },
  { name: 'dias', label: 'Días en Inv.', field: 'dias', align: 'center', sortable: true },
  { name: 'clasificacion', label: 'Clasificación', field: 'clasificacion', align: 'center' }
];

const generarReporte = () => {
  // Simulación de cálculo
  kpis.value = {
    rotacionPromedio: 4.2,
    diasInventario: 21,
    itemsEstancados: 12
  };

  items.value = [
    { id: 1, codigo: 'REACT-001', nombre: 'Ácido Sulfúrico', stockPromedio: 15, salidas: 60, indice: 4.0, dias: 22, clasificacion: 'Alta' },
    { id: 2, codigo: 'MAT-005', nombre: 'Pipetas 10ml', stockPromedio: 50, salidas: 10, indice: 0.2, dias: 450, clasificacion: 'Baja (Estancado)' },
    { id: 3, codigo: 'EQUI-012', nombre: 'Microscopio', stockPromedio: 5, salidas: 20, indice: 4.0, dias: 22, clasificacion: 'Alta' },
    { id: 4, codigo: 'MOB-001', nombre: 'Silla Lab', stockPromedio: 20, salidas: 40, indice: 2.0, dias: 45, clasificacion: 'Media' },
    { id: 5, codigo: 'REACT-005', nombre: 'Etanol', stockPromedio: 10, salidas: 80, indice: 8.0, dias: 11, clasificacion: 'Muy Alta' },
  ];
};

const getRotacionColor = (indice) => {
  if (indice > 5) return 'purple';
  if (indice >= 3) return 'positive';
  if (indice >= 1) return 'primary';
  return 'negative';
};

const getClasificacionClass = (clasif) => {
  if (clasif.includes('Alta')) return 'text-positive';
  if (clasif.includes('Baja')) return 'text-negative';
  return 'text-primary';
};

onMounted(() => {
  generarReporte();
});
</script>
