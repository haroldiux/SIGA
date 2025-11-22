<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h4 q-my-none">Catálogo de Ítems</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm q-mb-none">
          Gestiona todos los ítems del inventario (Laboratorios y Activos)
        </p>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Nuevo Ítem" @click="showNuevoItemDialog = true" />
      </div>
    </div>

    <!-- Cards de resumen -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Total Ítems</div>
            <q-icon name="inventory_2" size="2rem" class="q-my-sm text-primary" />
            <div class="text-h3 text-weight-medium">{{ items.length }}</div>
            <div class="text-subtitle2 text-grey-7">{{ activeItems }} activos</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Consumibles</div>
            <q-icon name="category" size="2rem" class="q-my-sm text-blue" />
            <div class="text-h3 text-weight-medium">{{ consumibles.length }}</div>
            <div class="text-subtitle2 text-grey-7">Ítems de uso único</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">A Préstamo</div>
            <q-icon name="restore" size="2rem" class="q-my-sm text-green" />
            <div class="text-h3 text-weight-medium">{{ retornables.length }}</div>
            <div class="text-subtitle2 text-grey-7">Equipamiento prestable</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Stock Bajo</div>
            <q-icon name="warning" size="2rem" class="q-my-sm text-negative" />
            <div class="text-h3 text-weight-medium">{{ stockBajo.length }}</div>
            <div class="text-subtitle2 text-grey-7">Requieren reposición</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tabs de filtro -->
    <div class="q-mb-md">
      <q-tabs
        v-model="activeFilter"
        dense
        class="text-grey-8 bg-grey-2"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="all" label="Todos los Ítems" />
        <q-tab name="stock" label="Alertas de Stock" :alert="stockBajo.length > 0" alert-icon="warning" />
      </q-tabs>
    </div>

    <!-- Tabla de ítems -->
    <div v-if="activeFilter === 'all'">
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-h6">Lista de Ítems</div>
          <div class="text-subtitle2 text-grey-7">Total: {{ items.length }} ítems</div>
        </div>
        <div class="col-auto row q-col-gutter-md">
          <div>
            <q-select
              v-model="categoriaFilter"
              :options="categoriaOptions"
              label="Categoría"
              outlined
              dense
              options-dense
              emit-value
              map-options
              class="q-mr-sm"
              style="width: 200px"
            />
          </div>
          <div>
            <q-select
              v-model="laboratorioFilter"
              :options="laboratorioOptions"
              label="Laboratorio"
              outlined
              dense
              options-dense
              emit-value
              map-options
              class="q-mr-sm"
              style="width: 200px"
            />
          </div>
          <div>
            <q-input
              v-model="search"
              outlined
              dense
              placeholder="Buscar ítem..."
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <q-table
        :rows="filteredItems"
        :columns="itemsColumns"
        row-key="id"
        :filter="search"
      >
        <template v-slot:body-cell-unidadMedida="props">
          <q-td :props="props">
            {{ props.value }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn size="sm" flat round dense icon="edit" color="primary" />
            <q-btn size="sm" flat round dense icon="delete" color="negative" />
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Tabla de ítems con stock bajo -->
    <div v-if="activeFilter === 'stock'">
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-h6">Ítems con Stock Bajo</div>
          <div class="text-subtitle2 text-grey-7">Ítems que están por debajo del stock mínimo</div>
        </div>
      </div>

      <q-table
        :rows="stockBajo"
        :columns="stockBajoColumns"
        row-key="id"
      >
        <template v-slot:body-cell-deficit="props">
          <q-td :props="props" class="text-negative">
            {{ props.value }}
          </q-td>
        </template>

        <template v-slot:body-cell-prioridad="props">
          <q-td :props="props">
            <q-badge :color="getPrioridadColor(props.value)" :label="props.value" />
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Diálogo de Nuevo Ítem -->
    <DialogNuevoItem
      v-model="showNuevoItemDialog"
      @item-added="onItemAdded"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import DialogNuevoItem from 'src/components/items/DialogNuevoItem.vue';

const $q = useQuasar();

// Control de estado
const showNuevoItemDialog = ref(false);
const activeFilter = ref('all');
const search = ref('');
const categoriaFilter = ref(null);
const laboratorioFilter = ref(null);

// Opciones para filtros
const categoriaOptions = [
  { label: 'Todas las categorías', value: null },
  { label: 'Reactivos Químicos', value: 'reactivos' },
  { label: 'Material de Laboratorio', value: 'material' },
  { label: 'Equipamiento', value: 'equipamiento' },
  { label: 'Bioseguridad', value: 'bioseguridad' },
  { label: 'Mobiliario', value: 'mobiliario' }
];

const laboratorioOptions = [
  { label: 'Todos los laboratorios', value: null },
  { label: 'Lab. Química', value: 'lab_quimica' },
  { label: 'Lab. Física', value: 'lab_fisica' },
  { label: 'Lab. Biología', value: 'lab_biologia' },
  { label: 'Almacén Central', value: 'almacen_central' }
];

// Datos de ítems
const items = ref([
  {
    id: 1,
    codigo: 'QUI-001',
    nombre: 'Ácido Sulfúrico H2SO4',
    categoria: 'reactivos',
    tipo: 'Consumible',
    area: 'Laboratorios',
    laboratorio: 'lab_quimica',
    unidadMedida: 'Litros',
    stockActual: 5,
    stockMinimo: 20,
    estado: 'Activo'
  },
  {
    id: 2,
    codigo: 'BIO-045',
    nombre: 'Guantes de Látex',
    categoria: 'bioseguridad',
    tipo: 'Consumible',
    area: 'Laboratorios',
    laboratorio: 'lab_quimica',
    unidadMedida: 'Pares',
    stockActual: 12,
    stockMinimo: 50,
    estado: 'Activo'
  },
  {
    id: 3,
    codigo: 'MAT-023',
    nombre: 'Pipetas 10ml',
    categoria: 'material',
    tipo: 'A Préstamo',
    area: 'Laboratorios',
    laboratorio: 'lab_biologia',
    unidadMedida: 'Unidades',
    stockActual: 3,
    stockMinimo: 15,
    estado: 'Activo'
  },
  {
    id: 4,
    codigo: 'EQU-010',
    nombre: 'Microscopio Binocular',
    categoria: 'equipamiento',
    tipo: 'A Préstamo',
    area: 'Laboratorios',
    laboratorio: 'lab_biologia',
    unidadMedida: 'Unidades',
    stockActual: 10,
    stockMinimo: 5,
    estado: 'Activo'
  },
  {
    id: 5,
    codigo: 'QUI-032',
    nombre: 'Alcohol Etílico 96%',
    categoria: 'reactivos',
    tipo: 'Consumible',
    area: 'Laboratorios',
    laboratorio: 'lab_quimica',
    unidadMedida: 'Litros',
    stockActual: 8,
    stockMinimo: 10,
    estado: 'Activo'
  },
  {
    id: 6,
    codigo: 'ACT-001',
    nombre: 'Escritorio Ejecutivo',
    categoria: 'mobiliario',
    tipo: 'Activo Fijo',
    area: 'Activos',
    laboratorio: 'almacen_central',
    unidadMedida: 'Unidades',
    stockActual: 50,
    stockMinimo: 10,
    estado: 'Activo'
  }
]);

// Computed properties
const filteredItems = computed(() => {
  return items.value.filter(item => {
    if (categoriaFilter.value && item.categoria !== categoriaFilter.value) return false;
    if (laboratorioFilter.value && item.laboratorio !== laboratorioFilter.value) return false;
    return true;
  });
});

const activeItems = computed(() => items.value.filter(item => item.estado === 'Activo').length);

const consumibles = computed(() => items.value.filter(item => item.tipo === 'Consumible'));

const retornables = computed(() => items.value.filter(item => item.tipo === 'A Préstamo' || item.tipo === 'Activo Fijo'));

const stockBajo = computed(() => items.value.filter(item => item.stockActual < item.stockMinimo));

// Métodos
const onItemAdded = (item) => {
  // Asignar ID único
  const newItem = {
    id: Date.now(),
    ...item,
    estado: 'Activo'
  };

  // Agregar a la lista
  items.value.push(newItem);

  $q.notify({
    color: 'positive',
    message: `Ítem ${item.nombre} agregado correctamente`,
    icon: 'check_circle'
  });
};

const getPrioridadColor = (prioridad) => {
  switch(prioridad) {
    case 'Alta': return 'negative';
    case 'Media': return 'warning';
    case 'Baja': return 'blue';
    default: return 'grey';
  }
};

// Columnas para las tablas
const itemsColumns = [
  { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
  { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre', sortable: true },
  { name: 'tipo', align: 'left', label: 'Tipo', field: 'tipo', sortable: true },
  { name: 'area', align: 'left', label: 'Área', field: 'area', sortable: true },
  { name: 'categoria', align: 'left', label: 'Categoría', field: 'categoria' },
  { name: 'laboratorio', align: 'left', label: 'Ubicación', field: 'laboratorio' },
  { name: 'unidadMedida', align: 'center', label: 'Unidad', field: 'unidadMedida' },
  { name: 'stockActual', align: 'center', label: 'Stock', field: 'stockActual' },
  { name: 'actions', align: 'center', label: 'Acciones', field: 'actions' }
];

const stockBajoColumns = [
  { name: 'codigo', align: 'left', label: 'Código', field: 'codigo' },
  { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre' },
  { name: 'categoria', align: 'left', label: 'Categoría', field: 'categoria' },
  { name: 'stockActual', align: 'center', label: 'Stock Actual', field: 'stockActual' },
  { name: 'stockMinimo', align: 'center', label: 'Stock Mínimo', field: 'stockMinimo' },
  { name: 'deficit', align: 'center', label: 'Déficit', field: row => `${row.stockMinimo - row.stockActual} ${row.unidadMedida}` },
  { name: 'prioridad', align: 'center', label: 'Prioridad', field: row => row.stockActual === 0 ? 'Alta' : (row.stockActual < row.stockMinimo / 2 ? 'Media' : 'Baja') }
];
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
