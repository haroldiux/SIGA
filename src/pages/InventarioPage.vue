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
        <q-btn color="secondary" icon="remove" label="Registrar Salida" @click="showSalidaDialog = true"
          class="q-ml-sm" />
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
          <q-select v-model="ubicacionFilter" :options="ubicacionOptions" label="Ubicación" outlined dense options-dense
            emit-value map-options style="width: 200px" />
        </div>
        <div>
          <q-select v-model="estadoFilter" :options="estadoOptions" label="Estado de Stock" outlined dense options-dense
            emit-value map-options style="width: 200px" />
        </div>
        <div>
          <q-input v-model="search" outlined dense placeholder="Buscar ítem...">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <!-- Tabla de inventario -->
    <q-table :rows="filteredInventario" :columns="inventarioColumns" row-key="id" :filter="search"
      :pagination="{ rowsPerPage: 10 }">
      <template v-slot:body-cell-stockStatus="props">
        <q-td :props="props">
          <q-badge :color="getStockStatusColor(props.row)" :label="getStockStatusLabel(props.row)" />
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
    <BaseModal v-model="showEntradaDialog" title="Registrar Entrada de Inventario" size="md"
      confirm-label="Registrar Entrada" @confirm="registrarEntrada" @cancel="showEntradaDialog = false">
      <q-select v-model="entradaForm.itemId" :options="itemOptions" label="Ítem" outlined emit-value map-options
        class="q-mb-md" />
      <q-input v-model.number="entradaForm.cantidad" type="number" label="Cantidad" outlined class="q-mb-md" />
      <q-select v-model="entradaForm.ubicacion" :options="ubicacionOptions" label="Ubicación" outlined emit-value
        map-options class="q-mb-md" />
      <q-input v-model="entradaForm.observaciones" type="textarea" label="Observaciones" outlined rows="3" />
    </BaseModal>

    <!-- Diálogo de Salida -->
    <BaseModal v-model="showSalidaDialog" title="Registrar Salida de Inventario" size="md"
      confirm-label="Registrar Salida" @confirm="registrarSalida" @cancel="showSalidaDialog = false">
      <q-select v-model="salidaForm.itemId" :options="itemOptions" label="Ítem" outlined emit-value map-options
        class="q-mb-md" />
      <q-input v-model.number="salidaForm.cantidad" type="number" label="Cantidad" outlined class="q-mb-md" />
      <q-select v-model="salidaForm.motivo" :options="motivoOptions" label="Motivo" outlined emit-value map-options
        class="q-mb-md" />
      <q-input v-model="salidaForm.observaciones" type="textarea" label="Observaciones" outlined rows="3" />
    </BaseModal>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import BaseModal from 'src/components/common/BaseModal.vue';
import inventarioService from 'src/services/inventarioService';
import itemsService from 'src/services/itemsService';

const $q = useQuasar();

// Estado
const showEntradaDialog = ref(false);
const showSalidaDialog = ref(false);
const search = ref('');
const ubicacionFilter = ref(null);
const estadoFilter = ref(null);
const loading = ref(false);

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
  { label: 'Lab. Química', value: 'lab_quimica' }, // TODO: Cargar desde backend
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

const itemOptions = ref([]);

const motivoOptions = [
  { label: 'Uso en laboratorio', value: 'uso' },
  { label: 'Préstamo', value: 'prestamo' },
  { label: 'Traspaso', value: 'traspaso' },
  { label: 'Merma/Pérdida', value: 'merma' },
  { label: 'Otro', value: 'otro' }
];

// Datos de inventario
const inventario = ref([]);

// Cargar datos
const loadData = async () => {
  loading.value = true;
  try {
    const [inventarioData, itemsData] = await Promise.all([
      inventarioService.getInventario(),
      itemsService.getItems()
    ]);

    inventario.value = inventarioData.data || inventarioData;

    // Cargar opciones de items para los selectores
    const itemsList = itemsData.data || itemsData;
    itemOptions.value = itemsList.map(item => ({
      label: item.nombre,
      value: item.id
    }));

  } catch (error) {
    console.error('Error cargando inventario:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar el inventario'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});

// Computed
const filteredInventario = computed(() => {
  return inventario.value.filter(item => {
    // Filtro de ubicación (si aplica en backend, mejor filtrar allá)
    // if (ubicacionFilter.value && item.ubicacion !== ubicacionFilter.value) return false;

    // Filtro de estado
    if (estadoFilter.value) {
      const status = getStockStatus(item);
      if (estadoFilter.value !== status) return false;
    }

    // Filtro de búsqueda
    if (search.value) {
      const term = search.value.toLowerCase();
      const matchCodigo = item.item?.codigo?.toLowerCase().includes(term);
      const matchNombre = item.item?.nombre?.toLowerCase().includes(term);
      if (!matchCodigo && !matchNombre) return false;
    }

    return true;
  });
});

const totalStock = computed(() => {
  return inventario.value.reduce((sum, item) => sum + Number(item.cantidad_actual), 0);
});

const stockBajo = computed(() => {
  return inventario.value.filter(item => Number(item.cantidad_actual) > 0 && Number(item.cantidad_actual) < Number(item.stock_minimo));
});

const sinStock = computed(() => {
  return inventario.value.filter(item => Number(item.cantidad_actual) === 0);
});

const ubicaciones = computed(() => {
  // TODO: Ajustar cuando tengamos ubicaciones reales
  return [...new Set(inventario.value.map(item => item.almacen?.nombre || 'Sin ubicación'))];
});

// Métodos
const getStockStatus = (item) => {
  const actual = Number(item.cantidad_actual);
  const minimo = Number(item.stock_minimo);

  if (actual === 0) return 'agotado';
  if (actual < minimo) return 'bajo';
  return 'normal';
};

const getStockStatusColor = (item) => {
  const status = getStockStatus(item);
  switch (status) {
    case 'agotado': return 'negative';
    case 'bajo': return 'warning';
    case 'normal': return 'positive';
    default: return 'grey';
  }
};

const getStockStatusLabel = (item) => {
  const status = getStockStatus(item);
  switch (status) {
    case 'agotado': return 'Agotado';
    case 'bajo': return 'Stock Bajo';
    case 'normal': return 'Normal';
    default: return 'Desconocido';
  }
};

const registrarEntrada = async () => {
  try {
    await inventarioService.registrarEntrada({
      item_id: entradaForm.value.itemId,
      cantidad: entradaForm.value.cantidad,
      ubicacion_id: entradaForm.value.ubicacion, // Ajustar según backend
      observaciones: entradaForm.value.observaciones
    });

    await loadData();

    $q.notify({
      color: 'positive',
      message: 'Entrada registrada correctamente',
      icon: 'check_circle'
    });

    showEntradaDialog.value = false;
    entradaForm.value = { itemId: null, cantidad: 0, ubicacion: null, observaciones: '' };
  } catch (error) {
    console.error('Error registrando entrada:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al registrar entrada'
    });
  }
};

const registrarSalida = async () => {
  try {
    await inventarioService.registrarSalida({
      item_id: salidaForm.value.itemId,
      cantidad: salidaForm.value.cantidad,
      motivo: salidaForm.value.motivo,
      observaciones: salidaForm.value.observaciones
    });

    await loadData();

    $q.notify({
      color: 'positive',
      message: 'Salida registrada correctamente',
      icon: 'check_circle'
    });

    showSalidaDialog.value = false;
    salidaForm.value = { itemId: null, cantidad: 0, motivo: null, observaciones: '' };
  } catch (error) {
    console.error('Error registrando salida:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al registrar salida'
    });
  }
};

// Columnas de la tabla
const inventarioColumns = [
  { name: 'codigo', align: 'left', label: 'Código', field: row => row.item?.codigo || 'N/A', sortable: true },
  { name: 'nombre', align: 'left', label: 'Nombre', field: row => row.item?.nombre || 'N/A', sortable: true },
  { name: 'categoria', align: 'left', label: 'Categoría', field: row => row.item?.categoria?.nombre || 'N/A', sortable: true },
  { name: 'ubicacion', align: 'center', label: 'Ubicación', field: row => row.almacen?.nombre || 'General' },
  { name: 'stockActual', align: 'center', label: 'Stock Actual', field: 'cantidad_actual', sortable: true },
  { name: 'stockMinimo', align: 'center', label: 'Stock Mínimo', field: 'stock_minimo' },
  { name: 'stockStatus', align: 'center', label: 'Estado', field: 'stockStatus' },
  { name: 'ultimoMovimiento', align: 'center', label: 'Último Movimiento', field: row => new Date(row.updated_at).toLocaleDateString(), sortable: true },
  { name: 'actions', align: 'center', label: 'Acciones', field: 'actions' }
];
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
