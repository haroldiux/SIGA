<!-- src/pages/InventarioPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h4 q-my-none">Inventario</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm q-mb-none">
          Control de stock y ubicación de ítems
        </p>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Registrar Entrada" @click="showEntradaDialog = true" />
        <q-btn color="secondary" icon="remove" label="Registrar Salida" @click="showSalidaDialog = true" class="q-ml-sm" />
      </div>
    </div>

    <!-- Cards de resumen -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Total en Stock</div>
            <q-icon name="inventory" size="2rem" class="q-my-sm text-primary" />
            <div class="text-h3 text-weight-medium">{{ totalStock }}</div>
            <div class="text-subtitle2 text-grey-7">Unidades totales</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Stock Bajo</div>
            <q-icon name="warning" size="2rem" class="q-my-sm text-warning" />
            <div class="text-h3 text-weight-medium">{{ stockBajo.length }}</div>
            <div class="text-subtitle2 text-grey-7">Requieren atención</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Sin Stock</div>
            <q-icon name="error" size="2rem" class="q-my-sm text-negative" />
            <div class="text-h3 text-weight-medium">{{ sinStock.length }}</div>
            <div class="text-subtitle2 text-grey-7">Agotados</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Ubicaciones</div>
            <q-icon name="place" size="2rem" class="q-my-sm text-blue" />
            <div class="text-h3 text-weight-medium">{{ ubicaciones.length }}</div>
            <div class="text-subtitle2 text-grey-7">Laboratorios activos</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filtros -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6">Inventario por Ubicación</div>
      </div>
      <div class="col-auto row q-col-gutter-md">
        <div>
          <q-select
            v-model="ubicacionFilter"
            :options="ubicacionOptions"
            label="Ubicación"
            outlined
            dense
            options-dense
            emit-value
            map-options
            style="width: 200px"
          />
        </div>
        <div>
          <q-select
            v-model="estadoFilter"
            :options="estadoOptions"
            label="Estado de Stock"
            outlined
            dense
            options-dense
            emit-value
            map-options
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

    <!-- Tabla de inventario -->
    <q-table
      :rows="filteredInventario"
      :columns="inventarioColumns"
      row-key="id"
      :filter="search"
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-stockStatus="props">
        <q-td :props="props">
          <q-badge
            :color="getStockStatusColor(props.row)"
            :label="getStockStatusLabel(props.row)"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-stockActual="props">
        <q-td :props="props">
          <div class="text-weight-medium">
            {{ props.value }} {{ props.row.unidadMedida }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-ubicacion="props">
        <q-td :props="props">
          <q-chip size="sm" color="blue-1" text-color="blue-9">
            <q-icon name="place" size="xs" class="q-mr-xs" />
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn size="sm" flat round dense icon="visibility" color="primary">
            <q-tooltip>Ver detalles</q-tooltip>
          </q-btn>
          <q-btn size="sm" flat round dense icon="history" color="blue">
            <q-tooltip>Ver movimientos</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Diálogo de Entrada -->
    <BaseModal
      v-model="showEntradaDialog"
      title="Registrar Entrada de Inventario"
      size="md"
      confirm-label="Registrar Entrada"
      @confirm="registrarEntrada"
      @cancel="showEntradaDialog = false"
    >
      <q-select
        v-model="entradaForm.itemId"
        :options="itemOptions"
        label="Ítem"
        outlined
        emit-value
        map-options
        class="q-mb-md"
      />
      <q-input
        v-model.number="entradaForm.cantidad"
        type="number"
        label="Cantidad"
        outlined
        class="q-mb-md"
      />
      <q-select
        v-model="entradaForm.ubicacion"
        :options="ubicacionOptions"
        label="Ubicación"
        outlined
        emit-value
        map-options
        class="q-mb-md"
      />
      <q-input
        v-model="entradaForm.observaciones"
        type="textarea"
        label="Observaciones"
        outlined
        rows="3"
      />
    </BaseModal>

    <!-- Diálogo de Salida -->
    <BaseModal
      v-model="showSalidaDialog"
      title="Registrar Salida de Inventario"
      size="md"
      confirm-label="Registrar Salida"
      @confirm="registrarSalida"
      @cancel="showSalidaDialog = false"
    >
      <q-select
        v-model="salidaForm.itemId"
        :options="itemOptions"
        label="Ítem"
        outlined
        emit-value
        map-options
        class="q-mb-md"
      />
      <q-input
        v-model.number="salidaForm.cantidad"
        type="number"
        label="Cantidad"
        outlined
        class="q-mb-md"
      />
      <q-select
        v-model="salidaForm.motivo"
        :options="motivoOptions"
        label="Motivo"
        outlined
        emit-value
        map-options
        class="q-mb-md"
      />
      <q-input
        v-model="salidaForm.observaciones"
        type="textarea"
        label="Observaciones"
        outlined
        rows="3"
      />
    </BaseModal>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import BaseModal from 'src/components/common/BaseModal.vue';

const $q = useQuasar();

// Estado
const showEntradaDialog = ref(false);
const showSalidaDialog = ref(false);
const search = ref('');
const ubicacionFilter = ref(null);
const estadoFilter = ref(null);

// Formularios
const entradaForm = ref({
  itemId: null,
  cantidad: 0,
  ubicacion: null,
  observaciones: ''
});

const salidaForm = ref({
  itemId: null,
  cantidad: 0,
  motivo: null,
  observaciones: ''
});

// Opciones
const ubicacionOptions = [
  { label: 'Todas las ubicaciones', value: null },
  { label: 'Lab. Química', value: 'lab_quimica' },
  { label: 'Lab. Física', value: 'lab_fisica' },
  { label: 'Lab. Biología', value: 'lab_biologia' },
  { label: 'Almacén Central', value: 'almacen_central' }
];

const estadoOptions = [
  { label: 'Todos los estados', value: null },
  { label: 'Stock Normal', value: 'normal' },
  { label: 'Stock Bajo', value: 'bajo' },
  { label: 'Sin Stock', value: 'agotado' }
];

const itemOptions = [
  { label: 'Ácido Sulfúrico H2SO4', value: 1 },
  { label: 'Guantes de Látex', value: 2 },
  { label: 'Pipetas 10ml', value: 3 },
  { label: 'Microscopio Binocular', value: 4 },
  { label: 'Alcohol Etílico 96%', value: 5 }
];

const motivoOptions = [
  { label: 'Uso en laboratorio', value: 'uso' },
  { label: 'Préstamo', value: 'prestamo' },
  { label: 'Traspaso', value: 'traspaso' },
  { label: 'Merma/Pérdida', value: 'merma' },
  { label: 'Otro', value: 'otro' }
];

// Datos de inventario
const inventario = ref([
  {
    id: 1,
    codigo: 'QUI-001',
    nombre: 'Ácido Sulfúrico H2SO4',
    categoria: 'Reactivos Químicos',
    ubicacion: 'lab_quimica',
    stockActual: 5,
    stockMinimo: 20,
    unidadMedida: 'Litros',
    ultimoMovimiento: '2025-11-15'
  },
  {
    id: 2,
    codigo: 'BIO-045',
    nombre: 'Guantes de Látex',
    categoria: 'Bioseguridad',
    ubicacion: 'lab_quimica',
    stockActual: 12,
    stockMinimo: 50,
    unidadMedida: 'Pares',
    ultimoMovimiento: '2025-11-18'
  },
  {
    id: 3,
    codigo: 'MAT-023',
    nombre: 'Pipetas 10ml',
    categoria: 'Material de Laboratorio',
    ubicacion: 'lab_biologia',
    stockActual: 3,
    stockMinimo: 15,
    unidadMedida: 'Unidades',
    ultimoMovimiento: '2025-11-10'
  },
  {
    id: 4,
    codigo: 'EQU-010',
    nombre: 'Microscopio Binocular',
    categoria: 'Equipamiento',
    ubicacion: 'lab_biologia',
    stockActual: 10,
    stockMinimo: 5,
    unidadMedida: 'Unidades',
    ultimoMovimiento: '2025-11-19'
  },
  {
    id: 5,
    codigo: 'QUI-032',
    nombre: 'Alcohol Etílico 96%',
    categoria: 'Reactivos Químicos',
    ubicacion: 'lab_quimica',
    stockActual: 8,
    stockMinimo: 10,
    unidadMedida: 'Litros',
    ultimoMovimiento: '2025-11-17'
  },
  {
    id: 6,
    codigo: 'MAT-015',
    nombre: 'Tubos de Ensayo',
    categoria: 'Material de Laboratorio',
    ubicacion: 'almacen_central',
    stockActual: 0,
    stockMinimo: 100,
    unidadMedida: 'Unidades',
    ultimoMovimiento: '2025-11-05'
  }
]);

// Computed
const filteredInventario = computed(() => {
  return inventario.value.filter(item => {
    if (ubicacionFilter.value && item.ubicacion !== ubicacionFilter.value) return false;
    if (estadoFilter.value) {
      const status = getStockStatus(item);
      if (estadoFilter.value !== status) return false;
    }
    return true;
  });
});

const totalStock = computed(() => {
  return inventario.value.reduce((sum, item) => sum + item.stockActual, 0);
});

const stockBajo = computed(() => {
  return inventario.value.filter(item => item.stockActual > 0 && item.stockActual < item.stockMinimo);
});

const sinStock = computed(() => {
  return inventario.value.filter(item => item.stockActual === 0);
});

const ubicaciones = computed(() => {
  return [...new Set(inventario.value.map(item => item.ubicacion))];
});

// Métodos
const getStockStatus = (item) => {
  if (item.stockActual === 0) return 'agotado';
  if (item.stockActual < item.stockMinimo) return 'bajo';
  return 'normal';
};

const getStockStatusColor = (item) => {
  const status = getStockStatus(item);
  switch(status) {
    case 'agotado': return 'negative';
    case 'bajo': return 'warning';
    case 'normal': return 'positive';
    default: return 'grey';
  }
};

const getStockStatusLabel = (item) => {
  const status = getStockStatus(item);
  switch(status) {
    case 'agotado': return 'Agotado';
    case 'bajo': return 'Stock Bajo';
    case 'normal': return 'Normal';
    default: return 'Desconocido';
  }
};

const registrarEntrada = () => {
  const item = inventario.value.find(i => i.id === entradaForm.value.itemId);
  if (item) {
    item.stockActual += entradaForm.value.cantidad;
    item.ultimoMovimiento = new Date().toISOString().split('T')[0];
    
    $q.notify({
      color: 'positive',
      message: `Entrada registrada: +${entradaForm.value.cantidad} ${item.unidadMedida}`,
      icon: 'check_circle'
    });
    
    showEntradaDialog.value = false;
    entradaForm.value = { itemId: null, cantidad: 0, ubicacion: null, observaciones: '' };
  }
};

const registrarSalida = () => {
  const item = inventario.value.find(i => i.id === salidaForm.value.itemId);
  if (item) {
    if (item.stockActual >= salidaForm.value.cantidad) {
      item.stockActual -= salidaForm.value.cantidad;
      item.ultimoMovimiento = new Date().toISOString().split('T')[0];
      
      $q.notify({
        color: 'positive',
        message: `Salida registrada: -${salidaForm.value.cantidad} ${item.unidadMedida}`,
        icon: 'check_circle'
      });
      
      showSalidaDialog.value = false;
      salidaForm.value = { itemId: null, cantidad: 0, motivo: null, observaciones: '' };
    } else {
      $q.notify({
        color: 'negative',
        message: 'Stock insuficiente para realizar la salida',
        icon: 'error'
      });
    }
  }
};

// Columnas de la tabla
const inventarioColumns = [
  { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
  { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre', sortable: true },
  { name: 'categoria', align: 'left', label: 'Categoría', field: 'categoria', sortable: true },
  { name: 'ubicacion', align: 'center', label: 'Ubicación', field: 'ubicacion' },
  { name: 'stockActual', align: 'center', label: 'Stock Actual', field: 'stockActual', sortable: true },
  { name: 'stockMinimo', align: 'center', label: 'Stock Mínimo', field: 'stockMinimo' },
  { name: 'stockStatus', align: 'center', label: 'Estado', field: 'stockStatus' },
  { name: 'ultimoMovimiento', align: 'center', label: 'Último Movimiento', field: 'ultimoMovimiento', sortable: true },
  { name: 'actions', align: 'center', label: 'Acciones', field: 'actions' }
];
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
