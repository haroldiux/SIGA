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
      <q-tabs v-model="activeFilter" dense class="text-grey-8 bg-grey-2" active-color="primary"
        indicator-color="primary" align="left" narrow-indicator>
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
            <q-select v-model="categoriaFilter" :options="categoriaOptions" label="Categoría" outlined dense
              options-dense emit-value map-options class="q-mr-sm" style="width: 200px" />
          </div>
          <div>
            <q-select v-model="laboratorioFilter" :options="laboratorioOptions" label="Laboratorio" outlined dense
              options-dense emit-value map-options class="q-mr-sm" style="width: 200px" />
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

      <q-table :rows="filteredItems" :columns="itemsColumns" row-key="id" :filter="search">
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

      <q-table :rows="stockBajo" :columns="stockBajoColumns" row-key="id">
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
    <DialogNuevoItem v-model="showNuevoItemDialog" @item-added="onItemAdded" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import DialogNuevoItem from 'src/components/items/DialogNuevoItem.vue';
import itemsService from 'src/services/itemsService';
import categoriasService from 'src/services/categoriasService';

const $q = useQuasar();

// Control de estado
const showNuevoItemDialog = ref(false);
const activeFilter = ref('all');
const search = ref('');
const categoriaFilter = ref(null);
const laboratorioFilter = ref(null);
const loading = ref(false);

// Datos reactivos
const items = ref([]);
const categorias = ref([]);

// Opciones para filtros (computadas desde datos reales)
const categoriaOptions = computed(() => {
  const options = categorias.value.map(c => ({ label: c.nombre, value: c.id }));
  return [{ label: 'Todas las categorías', value: null }, ...options];
});

const laboratorioOptions = [
  { label: 'Todos los laboratorios', value: null },
  { label: 'Lab. Química', value: 'lab_quimica' }, // TODO: Cargar desde backend si existe endpoint
  { label: 'Lab. Física', value: 'lab_fisica' },
  { label: 'Lab. Biología', value: 'lab_biologia' },
  { label: 'Almacén Central', value: 'almacen_central' }
];

// Cargar datos
const loadData = async () => {
  loading.value = true;
  try {
    const [itemsData, categoriasData] = await Promise.all([
      itemsService.getItems(),
      categoriasService.getCategorias()
    ]);

    // Manejar paginación si es necesario
    items.value = itemsData.data || itemsData;
    categorias.value = categoriasData.data || categoriasData;
  } catch (error) {
    console.error('Error cargando datos:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar el catálogo'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});

// Computed properties
const filteredItems = computed(() => {
  return items.value.filter(item => {
    // Filtro de búsqueda
    if (search.value) {
      const term = search.value.toLowerCase();
      const matchCodigo = item.codigo?.toLowerCase().includes(term);
      const matchNombre = item.nombre?.toLowerCase().includes(term);
      if (!matchCodigo && !matchNombre) return false;
    }

    // Filtro de categoría
    if (categoriaFilter.value && item.categoria_id !== categoriaFilter.value) return false;

    // Filtro de laboratorio (Pendiente de implementar en backend relación item-laboratorio si aplica)
    // if (laboratorioFilter.value && item.laboratorio !== laboratorioFilter.value) return false;

    return true;
  });
});

const activeItems = computed(() => items.value.filter(item => item.activo).length);

const consumibles = computed(() => items.value.filter(item => item.es_consumible));

const retornables = computed(() => items.value.filter(item => !item.es_consumible));

const stockBajo = computed(() => {
  return items.value.filter(item => {
    const stock = Number(item.stock_total || 0);
    const minimo = Number(item.stock_minimo || 0);
    return stock < minimo;
  });
});

// Métodos
const onItemAdded = async (item) => {
  try {
    await itemsService.createItem(item);
    await loadData();

    $q.notify({
      color: 'positive',
      message: `Ítem ${item.nombre} agregado correctamente`,
      icon: 'check_circle'
    });
  } catch (error) {
    console.error('Error creando ítem:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al crear el ítem'
    });
  }
};

const getPrioridadColor = (prioridad) => {
  switch (prioridad) {
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
  { name: 'tipo', align: 'left', label: 'Tipo', field: row => row.es_consumible ? 'Consumible' : 'Activo/Equipo', sortable: true },
  { name: 'categoria', align: 'left', label: 'Categoría', field: row => row.categoria?.nombre || 'N/A' },
  { name: 'subcategoria', align: 'left', label: 'Subcategoría', field: row => row.subcategoria?.nombre || 'N/A' },
  { name: 'unidadMedida', align: 'center', label: 'Unidad', field: 'unidad_medida_base' },
  { name: 'marca', align: 'left', label: 'Marca', field: 'marca' },
  { name: 'stockActual', align: 'center', label: 'Stock Total', field: row => Number(row.stock_total || 0), sortable: true },
  { name: 'actions', align: 'center', label: 'Acciones', field: 'actions' }
];

const stockBajoColumns = [
  { name: 'codigo', align: 'left', label: 'Código', field: 'codigo' },
  { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre' },
  { name: 'categoria', align: 'left', label: 'Categoría', field: row => row.categoria?.nombre },
  { name: 'stockActual', align: 'center', label: 'Stock Actual', field: row => Number(row.stock_total || 0) },
  { name: 'stockMinimo', align: 'center', label: 'Stock Mínimo', field: 'stock_minimo' },
  { name: 'deficit', align: 'center', label: 'Déficit', field: row => `${Number(row.stock_minimo) - Number(row.stock_total || 0)} ${row.unidad_medida_base}` },
  { name: 'prioridad', align: 'center', label: 'Prioridad', field: row => Number(row.stock_total || 0) === 0 ? 'Alta' : (Number(row.stock_total || 0) < Number(row.stock_minimo) / 2 ? 'Media' : 'Baja') }
];
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
