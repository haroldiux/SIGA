<!-- src/pages/TraspasosPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h4 q-my-none">Traspasos</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm q-mb-none">
          Gestión de traspasos entre ubicaciones
        </p>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Nuevo Traspaso" @click="showNuevoTraspasoDialog = true" />
      </div>
    </div>

    <!-- Cards de resumen -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Pendientes</div>
            <q-icon name="pending" size="2rem" class="q-my-sm text-warning" />
            <div class="text-h3 text-weight-medium">{{ traspasosPendientes.length }}</div>
            <div class="text-subtitle2 text-grey-7">Por aprobar</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">En Tránsito</div>
            <q-icon name="local_shipping" size="2rem" class="q-my-sm text-blue" />
            <div class="text-h3 text-weight-medium">{{ traspasosEnTransito.length }}</div>
            <div class="text-subtitle2 text-grey-7">En movimiento</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Completados</div>
            <q-icon name="check_circle" size="2rem" class="q-my-sm text-positive" />
            <div class="text-h3 text-weight-medium">{{ traspasosCompletados.length }}</div>
            <div class="text-subtitle2 text-grey-7">Este mes</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Total</div>
            <q-icon name="swap_horiz" size="2rem" class="q-my-sm text-primary" />
            <div class="text-h3 text-weight-medium">{{ traspasos.length }}</div>
            <div class="text-subtitle2 text-grey-7">Todos los traspasos</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tabs de filtro -->
    <div class="q-mb-md">
      <q-tabs v-model="activeTab" dense class="text-grey-8 bg-grey-2" active-color="primary" indicator-color="primary"
        align="left" narrow-indicator>
        <q-tab name="pendientes" label="Pendientes" :alert="traspasosPendientes.length > 0" />
        <q-tab name="transito" label="En Tránsito" />
        <q-tab name="completados" label="Completados" />
        <q-tab name="todos" label="Todos" />
      </q-tabs>
    </div>

    <!-- Filtros -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6">{{ getTabTitle() }}</div>
      </div>
      <div class="col-auto row q-col-gutter-md">
        <div>
          <q-select v-model="ubicacionFilter" :options="ubicacionOptions" label="Ubicación" outlined dense options-dense
            emit-value map-options style="width: 200px" />
        </div>
        <div>
          <q-input v-model="search" outlined dense placeholder="Buscar traspaso...">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <!-- Tabla de traspasos -->
    <q-table :rows="filteredTraspasos" :columns="traspasosColumns" row-key="id" :filter="search"
      :pagination="{ rowsPerPage: 10 }">
      <template v-slot:body-cell-estado="props">
        <q-td :props="props">
          <q-badge :color="getEstadoColor(props.value)" :label="props.value" />
        </q-td>
      </template>

      <template v-slot:body-cell-origen="props">
        <q-td :props="props">
          <q-chip size="sm" color="blue-1" text-color="blue-9">
            <q-icon name="place" size="xs" class="q-mr-xs" />
            {{ getUbicacionLabel(props.value) }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-destino="props">
        <q-td :props="props">
          <q-chip size="sm" color="green-1" text-color="green-9">
            <q-icon name="place" size="xs" class="q-mr-xs" />
            {{ getUbicacionLabel(props.value) }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn v-if="props.row.estado === 'Pendiente'" size="sm" flat round dense icon="check" color="positive"
            @click="aprobarTraspaso(props.row)">
            <q-tooltip>Aprobar traspaso</q-tooltip>
          </q-btn>
          <q-btn v-if="props.row.estado === 'Pendiente'" size="sm" flat round dense icon="close" color="negative"
            @click="rechazarTraspaso(props.row)">
            <q-tooltip>Rechazar traspaso</q-tooltip>
          </q-btn>
          <q-btn v-if="props.row.estado === 'En Tránsito'" size="sm" flat round dense icon="done_all" color="primary"
            @click="completarTraspaso(props.row)">
            <q-tooltip>Marcar como completado</q-tooltip>
          </q-btn>
          <q-btn size="sm" flat round dense icon="visibility" color="blue">
            <q-tooltip>Ver detalles</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Diálogo de Nuevo Traspaso -->
    <BaseModal v-model="showNuevoTraspasoDialog" title="Nuevo Traspaso" size="md" confirm-label="Crear Traspaso"
      @confirm="crearTraspaso" @cancel="showNuevoTraspasoDialog = false">
      <q-select v-model="traspasoForm.itemId" :options="itemsDisponibles" label="Ítem a traspasar" outlined emit-value
        map-options class="q-mb-md" />

      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-6">
          <q-select v-model="traspasoForm.origen" :options="almacenesOptions" label="Ubicación Origen" outlined
            emit-value map-options />
        </div>
        <div class="col-6">
          <q-select v-model="traspasoForm.destino" :options="destinoOptions" label="Ubicación Destino" outlined
            emit-value map-options :disable="!traspasoForm.origen" />
        </div>
      </div>

      <q-input v-model.number="traspasoForm.cantidad" type="number" label="Cantidad" outlined class="q-mb-md" />

      <q-input v-model="traspasoForm.solicitante" label="Solicitante" outlined class="q-mb-md" />

      <q-input v-model="traspasoForm.motivo" type="textarea" label="Motivo del traspaso" outlined rows="3" />
    </BaseModal>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useInventarioStore } from 'src/stores/store-inventario';
import BaseModal from 'src/components/common/BaseModal.vue';

const $q = useQuasar();
const inventarioStore = useInventarioStore();

// Estado
const showNuevoTraspasoDialog = ref(false);
const activeTab = ref('pendientes');
const search = ref('');
const ubicacionFilter = ref(null);

// Formulario
const traspasoForm = ref({
  itemId: null,
  origen: null,
  destino: null,
  cantidad: 1,
  solicitante: '',
  motivo: ''
});

// Opciones
const ubicacionOptions = [
  { label: 'Todas las ubicaciones', value: null },
  { label: 'Almacén Central (Campus)', value: 'almacen_central' },
  { label: 'Almacén Medicina', value: 'almacen_medicina' },
  { label: 'Almacén Odontología', value: 'almacen_odontologia' }
];

const almacenesOptions = [
  { label: 'Almacén Central (Campus)', value: 'almacen_central' },
  { label: 'Almacén Medicina', value: 'almacen_medicina' },
  { label: 'Almacén Odontología', value: 'almacen_odontologia' }
];

const itemsDisponibles = computed(() => {
  return inventarioStore.inventario.map(item => ({
    label: `${item.nombre} (Stock: ${item.stock} ${item.unidadMedida})`,
    value: item.itemId,
    stock: item.stock,
    ubicacion: item.ubicacion,
    unidadMedida: item.unidadMedida
  })).filter(i => i.stock > 0);
});

// Opciones de destino dinámicas (Solo entre almacenes)
const destinoOptions = computed(() => {
  if (!traspasoForm.value.origen) return [];
  return almacenesOptions.filter(u => u.value !== traspasoForm.value.origen);
});

// Datos de traspasos
const traspasos = ref([
  {
    id: 1,
    codigo: 'TRAS-001',
    item: 'Microscopio Binocular',
    origen: 'lab_quimica',
    destino: 'lab_biologia',
    cantidad: 2,
    solicitante: 'Juan Pérez',
    fecha: '2025-11-18',
    estado: 'Pendiente',
    motivo: 'Necesidad de equipamiento en Lab. Biología'
  },
  {
    id: 2,
    codigo: 'TRAS-002',
    item: 'Pipetas 10ml',
    origen: 'almacen_central',
    destino: 'lab_quimica',
    cantidad: 50,
    solicitante: 'María García',
    fecha: '2025-11-19',
    estado: 'En Tránsito',
    motivo: 'Reposición de stock'
  },
  {
    id: 3,
    codigo: 'TRAS-003',
    item: 'Guantes de Látex',
    origen: 'almacen_central',
    destino: 'lab_fisica',
    cantidad: 100,
    solicitante: 'Carlos López',
    fecha: '2025-11-15',
    estado: 'Completado',
    motivo: 'Stock inicial para laboratorio'
  },
  {
    id: 4,
    codigo: 'TRAS-004',
    item: 'Ácido Sulfúrico H2SO4',
    origen: 'lab_quimica',
    destino: 'almacen_central',
    cantidad: 5,
    solicitante: 'Ana Martínez',
    fecha: '2025-11-20',
    estado: 'Pendiente',
    motivo: 'Exceso de stock en laboratorio'
  }
]);

// Computed
const traspasosPendientes = computed(() => {
  return traspasos.value.filter(t => t.estado === 'Pendiente');
});

const traspasosEnTransito = computed(() => {
  return traspasos.value.filter(t => t.estado === 'En Tránsito');
});

const traspasosCompletados = computed(() => {
  return traspasos.value.filter(t => t.estado === 'Completado');
});

const filteredTraspasos = computed(() => {
  let filtered = traspasos.value;

  // Filtrar por tab
  switch (activeTab.value) {
    case 'pendientes':
      filtered = traspasosPendientes.value;
      break;
    case 'transito':
      filtered = traspasosEnTransito.value;
      break;
    case 'completados':
      filtered = traspasosCompletados.value;
      break;
  }

  // Filtrar por ubicación
  if (ubicacionFilter.value) {
    filtered = filtered.filter(t =>
      t.origen === ubicacionFilter.value || t.destino === ubicacionFilter.value
    );
  }

  return filtered;
});

// Métodos
const getTabTitle = () => {
  switch (activeTab.value) {
    case 'pendientes': return 'Traspasos Pendientes';
    case 'transito': return 'Traspasos en Tránsito';
    case 'completados': return 'Traspasos Completados';
    case 'todos': return 'Todos los Traspasos';
    default: return '';
  }
};

const getEstadoColor = (estado) => {
  switch (estado) {
    case 'Pendiente': return 'warning';
    case 'En Tránsito': return 'blue';
    case 'Completado': return 'positive';
    case 'Rechazado': return 'negative';
    default: return 'grey';
  }
};

const getUbicacionLabel = (value) => {
  const ubicacion = ubicacionOptions.find(u => u.value === value);
  return ubicacion?.label || value;
};

const crearTraspaso = () => {
  const itemInfo = itemsDisponibles.value.find(i => i.value === traspasoForm.value.itemId);

  if (!itemInfo) {
    $q.notify({
      color: 'negative',
      message: 'Item no válido'
    });
    return;
  }

  // Validar stock en origen si coincide con la ubicación del item seleccionado
  if (traspasoForm.value.origen === itemInfo.ubicacion && traspasoForm.value.cantidad > itemInfo.stock) {
    $q.notify({
      color: 'warning',
      message: `Stock insuficiente en origen. Disponible: ${itemInfo.stock}`
    });
    return;
  }

  const nuevoTraspaso = {
    id: Date.now(),
    codigo: `TRAS-${String(traspasos.value.length + 1).padStart(3, '0')}`,
    itemId: itemInfo.value,
    item: itemInfo.label.split(' (')[0],
    origen: traspasoForm.value.origen,
    destino: traspasoForm.value.destino,
    cantidad: traspasoForm.value.cantidad,
    unidadMedida: itemInfo.unidadMedida,
    solicitante: traspasoForm.value.solicitante,
    fecha: new Date().toISOString().split('T')[0],
    estado: 'Pendiente',
    motivo: traspasoForm.value.motivo
  };

  traspasos.value.push(nuevoTraspaso);

  $q.notify({
    color: 'positive',
    message: `Solicitud de traspaso ${nuevoTraspaso.codigo} creada`,
    icon: 'check_circle'
  });

  showNuevoTraspasoDialog.value = false;
  traspasoForm.value = {
    itemId: null,
    origen: null,
    destino: null,
    cantidad: 1,
    solicitante: '',
    motivo: ''
  };
};

const aprobarTraspaso = (traspaso) => {
  $q.dialog({
    title: 'Aprobar Traspaso',
    message: `¿Aprobar el traspaso ${traspaso.codigo}? Se descontará el stock del origen.`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    try {
      // 1. Descontar stock del origen
      inventarioStore.registrarSalida({
        itemId: traspaso.itemId || 'QUI-001', // Fallback
        cantidad: traspaso.cantidad,
        ubicacion: traspaso.origen,
        motivo: 'Traspaso (Salida)',
        referencia: traspaso.codigo,
        usuario: 'Encargado Almacén'
      });

      // 2. Actualizar estado
      traspaso.estado = 'En Tránsito';

      $q.notify({
        color: 'positive',
        message: 'Traspaso aprobado y en tránsito',
        icon: 'local_shipping'
      });
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Error al aprobar traspaso',
        caption: error.message
      });
    }
  });
};

const rechazarTraspaso = (traspaso) => {
  $q.dialog({
    title: 'Rechazar Traspaso',
    message: `¿Rechazar el traspaso ${traspaso.codigo}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    traspaso.estado = 'Rechazado';

    $q.notify({
      color: 'warning',
      message: 'Traspaso rechazado',
      icon: 'info'
    });
  });
};

const completarTraspaso = (traspaso) => {
  $q.dialog({
    title: 'Completar Traspaso',
    message: `¿Confirmar la recepción en destino del traspaso ${traspaso.codigo}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    try {
      // 1. Agregar stock al destino
      inventarioStore.agregarEntrada({
        itemId: traspaso.itemId || 'QUI-001', // Fallback
        nombre: traspaso.item,
        cantidad: traspaso.cantidad,
        unidadMedida: traspaso.unidadMedida || 'Unidades',
        ubicacion: traspaso.destino,
        motivo: 'Traspaso (Entrada)',
        referencia: traspaso.codigo,
        usuario: 'Encargado Destino'
      });

      // 2. Actualizar estado
      traspaso.estado = 'Completado';
      traspaso.fechaCompletado = new Date().toISOString().split('T')[0];

      $q.notify({
        color: 'positive',
        message: 'Traspaso completado exitosamente',
        icon: 'check_circle'
      });
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Error al completar traspaso',
        caption: error.message
      });
    }
  });
};

// Columnas
const traspasosColumns = [
  { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
  { name: 'item', align: 'left', label: 'Ítem', field: 'item', sortable: true },
  { name: 'origen', align: 'center', label: 'Origen', field: 'origen' },
  { name: 'destino', align: 'center', label: 'Destino', field: 'destino' },
  { name: 'cantidad', align: 'center', label: 'Cantidad', field: 'cantidad' },
  { name: 'solicitante', align: 'left', label: 'Solicitante', field: 'solicitante' },
  { name: 'fecha', align: 'center', label: 'Fecha', field: 'fecha', sortable: true },
  { name: 'estado', align: 'center', label: 'Estado', field: 'estado' },
  { name: 'actions', align: 'center', label: 'Acciones', field: 'actions' }
];
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
