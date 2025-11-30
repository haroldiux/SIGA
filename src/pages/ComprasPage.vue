<!-- src/pages/ComprasPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h4 q-my-none">Órdenes de Compra</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm q-mb-none">
          Gestiona las órdenes de compra y su seguimiento
        </p>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Nueva Orden de Compra" @click="showNuevaOrdenDialog = true" />
      </div>
    </div>

    <!-- Cards de resumen -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Total Órdenes</div>
            <q-icon name="shopping_cart" size="2rem" class="q-my-sm text-primary" />
            <div class="text-h3 text-weight-medium">{{ ordenes.length }}</div>
            <div class="text-subtitle2 text-grey-7">{{ ordenesActivas }} activas</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Pendientes</div>
            <q-icon name="pending" size="2rem" class="q-my-sm text-orange" />
            <div class="text-h3 text-weight-medium">{{ ordenesPendientes.length }}</div>
            <div class="text-subtitle2 text-grey-7">Esperando aprobación</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">En Proceso</div>
            <q-icon name="local_shipping" size="2rem" class="q-my-sm text-blue" />
            <div class="text-h3 text-weight-medium">{{ ordenesEnProceso.length }}</div>
            <div class="text-subtitle2 text-grey-7">En tránsito</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Completadas</div>
            <q-icon name="check_circle" size="2rem" class="q-my-sm text-positive" />
            <div class="text-h3 text-weight-medium">{{ ordenesCompletadas.length }}</div>
            <div class="text-subtitle2 text-grey-7">Recibidas en almacén</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filtros y tabla -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6">Lista de Órdenes de Compra</div>
        <div class="text-subtitle2 text-grey-7">Total: {{ ordenes.length }} órdenes</div>
      </div>
      <div class="col-auto row q-col-gutter-md">
        <div>
          <q-select v-model="estadoFilter" :options="estadoOptions" label="Estado" outlined dense options-dense
            emit-value map-options class="q-mr-sm" style="width: 200px" />
        </div>
        <div>
          <q-input v-model="fechaDesdeFilter" label="Desde" outlined dense readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="fechaDesdeFilter">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div>
          <q-input v-model="fechaHastaFilter" label="Hasta" outlined dense readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="fechaHastaFilter">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div>
          <q-input v-model="search" outlined dense placeholder="Buscar orden...">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <q-table :rows="filteredOrdenes" :columns="ordenesColumns" row-key="id" :filter="search"
      :pagination="{ rowsPerPage: 10 }">

      <!-- Template para Código -->
      <template v-slot:body-cell-codigo="props">
        <q-td :props="props">
          <span class="text-weight-medium">{{ props.row.codigo || props.row.id || 'N/A' }}</span>
        </q-td>
      </template>

      <!-- Template para Fecha -->
      <template v-slot:body-cell-fecha="props">
        <q-td :props="props">
          {{ formatDate(props.row.fecha || props.row.created_at) }}
        </q-td>
      </template>

      <!-- Template para Estado -->
      <template v-slot:body-cell-estado="props">
        <q-td :props="props">
          <q-badge :color="getEstadoColor(props.value)" :label="props.value || 'Pendiente'" class="q-px-sm q-py-xs" />
        </q-td>
      </template>

      <!-- Template para Total -->
      <template v-slot:body-cell-total="props">
        <q-td :props="props" class="text-right">
          <span class="text-weight-medium">Bs. {{ Number(props.value || 0).toFixed(2) }}</span>
        </q-td>
      </template>

      <!-- Template para Acciones -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <!-- Ver siempre disponible -->
          <q-btn size="sm" flat round dense icon="visibility" color="primary" @click="viewOrden(props.row)">
            <q-tooltip>Ver Detalles</q-tooltip>
          </q-btn>

          <!-- PENDIENTE: Aprobar/Rechazar -->
          <template v-if="props.row.estado === 'Pendiente'">
            <q-btn size="sm" flat round dense icon="check" color="positive" @click="aprobarOrden(props.row)">
              <q-tooltip>Aprobar Orden</q-tooltip>
            </q-btn>
            <q-btn size="sm" flat round dense icon="close" color="negative" @click="rechazarOrden(props.row)">
              <q-tooltip>Rechazar Orden</q-tooltip>
            </q-btn>
          </template>

          <!-- APROBADA: Marcar En Proceso -->
          <template v-if="props.row.estado === 'Aprobada'">
            <q-btn size="sm" flat round dense icon="local_shipping" color="blue" @click="marcarEnProceso(props.row)">
              <q-tooltip>Marcar En Proceso</q-tooltip>
            </q-btn>
          </template>

          <!-- EN PROCESO: Registrar Recepción -->
          <template v-if="props.row.estado === 'En Proceso'">
            <q-btn size="sm" flat round dense icon="inventory" color="teal" @click="abrirDialogRecepcion(props.row)">
              <q-tooltip>Registrar Recepción</q-tooltip>
            </q-btn>
          </template>

          <!-- RECIBIDA: Ingresar a Inventario -->
          <template v-if="props.row.estado === 'Recibida'">
            <q-btn size="sm" flat round dense icon="add_box" color="positive" @click="ingresarAInventario(props.row)">
              <q-tooltip>Ingresar a Inventario</q-tooltip>
            </q-btn>
          </template>
        </q-td>
      </template>
    </q-table>

    <!-- Diálogo de Nueva Orden (CRÍTICO: Lógica de precios e impuestos) -->
    <DialogNuevaOrden v-model="showNuevaOrdenDialog" @order-added="onOrderAdded" />

    <!-- Diálogo de Recepción de Mercancía -->
    <DialogRecepcionOrden v-model="showRecepcionDialog" :orden="ordenSeleccionada"
      @recepcion-confirmada="onRecepcionConfirmada" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, shallowRef } from 'vue';
import { useQuasar } from 'quasar';
import { useInventarioStore } from 'src/stores/store-inventario';
import DialogNuevaOrden from 'src/components/compras/DialogNuevaOrden.vue';
import DialogRecepcionOrden from 'src/components/compras/DialogRecepcionOrden.vue';
import comprasService from 'src/services/comprasService';

const $q = useQuasar();
const inventarioStore = useInventarioStore();

// Control de estado
const showNuevaOrdenDialog = ref(false);
const showRecepcionDialog = ref(false);
const ordenSeleccionada = ref(null);
const search = ref('');
const estadoFilter = ref(null);
const fechaDesdeFilter = ref('');
const fechaHastaFilter = ref('');
const loading = ref(false);

// Opciones para filtros
const estadoOptions = [
  { label: 'Todos los estados', value: null },
  { label: 'Pendiente', value: 'Pendiente' },
  { label: 'Aprobada', value: 'Aprobada' },
  { label: 'En Proceso', value: 'En Proceso' },
  { label: 'Completada', value: 'Completada' },
  { label: 'Cancelada', value: 'Cancelada' }
];

// Usar shallowRef para evitar reactividad profunda que causa loops
const ordenes = shallowRef([]);

// Cargar datos
const loadData = async () => {
  if (loading.value) return; // Prevenir llamadas múltiples

  loading.value = true;
  try {
    const response = await comprasService.getOrdenes();
    // Extraer datos de forma segura
    let data = response;
    if (response && response.data) {
      data = response.data;
    }

    // Asegurarse de que sea un array
    if (Array.isArray(data)) {
      ordenes.value = data;
    } else if (data && Array.isArray(data.data)) {
      ordenes.value = data.data;
    } else {
      ordenes.value = [];
    }
  } catch (error) {
    console.error('Error cargando órdenes:', error);
    ordenes.value = [];
    $q.notify({
      type: 'negative',
      message: 'Error al cargar órdenes de compra'
    });
  } finally {
    loading.value = false;
  }
};

// Computed properties - usando funciones simples para evitar loops
const filteredOrdenes = computed(() => {
  if (!Array.isArray(ordenes.value)) return [];

  return ordenes.value.filter(orden => {
    if (!orden) return false;

    // Filtrar por estado
    if (estadoFilter.value && orden.estado !== estadoFilter.value) return false;

    // Filtrar por fecha desde
    if (fechaDesdeFilter.value && orden.fecha) {
      if (new Date(orden.fecha) < new Date(fechaDesdeFilter.value)) return false;
    }

    // Filtrar por fecha hasta
    if (fechaHastaFilter.value && orden.fecha) {
      if (new Date(orden.fecha) > new Date(fechaHastaFilter.value)) return false;
    }

    return true;
  });
});

const ordenesActivas = computed(() => {
  if (!Array.isArray(ordenes.value)) return 0;
  return ordenes.value.filter(orden => orden && orden.estado !== 'Cancelada').length;
});

const ordenesPendientes = computed(() => {
  if (!Array.isArray(ordenes.value)) return [];
  return ordenes.value.filter(orden => orden && orden.estado === 'Pendiente');
});

const ordenesEnProceso = computed(() => {
  if (!Array.isArray(ordenes.value)) return [];
  return ordenes.value.filter(orden => orden && (orden.estado === 'En Proceso' || orden.estado === 'Aprobada'));
});

const ordenesCompletadas = computed(() => {
  if (!Array.isArray(ordenes.value)) return [];
  return ordenes.value.filter(orden => orden && orden.estado === 'Completada');
});

// Métodos
const onOrderAdded = async (orden) => {
  try {
    await comprasService.createOrden(orden);
    showNuevaOrdenDialog.value = false;
    await loadData();

    $q.notify({
      color: 'positive',
      message: `Orden ${orden.codigo || ''} agregada correctamente`,
      icon: 'check_circle'
    });
  } catch (error) {
    console.error('Error creando orden:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al crear la orden de compra'
    });
  }
};

const viewOrden = (orden) => {
  $q.notify({
    message: `Ver detalles de la orden ${orden.codigo || ''}`,
    color: 'info'
  });
};

const getEstadoColor = (estado) => {
  const colores = {
    'Pendiente': 'orange',
    'Aprobada': 'blue',
    'En Proceso': 'teal',
    'Recibida': 'purple',
    'Completada': 'positive',
    'Cancelada': 'negative'
  };
  return colores[estado] || 'grey';
};

const aprobarOrden = (orden) => {
  $q.dialog({
    title: 'Aprobar Orden de Compra',
    message: `¿Confirma la aprobación de la orden ${orden.codigo || ''}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await comprasService.aprobarOrden(orden.id);
      await loadData();
      $q.notify({
        color: 'positive',
        message: `Orden ${orden.codigo || ''} aprobada correctamente`,
        icon: 'check_circle'
      });
    } catch (error) {
      console.error('Error aprobando orden:', error);
      $q.notify({
        type: 'negative',
        message: 'Error al aprobar la orden'
      });
    }
  });
};

const rechazarOrden = (orden) => {
  $q.dialog({
    title: 'Rechazar Orden de Compra',
    message: `¿Está seguro que desea rechazar la orden ${orden.codigo || ''}?`,
    prompt: {
      model: '',
      type: 'text',
      label: 'Motivo del rechazo',
      isValid: val => val.length > 0
    },
    cancel: true,
    persistent: true
  }).onOk(async (motivo) => {
    try {
      // Simulación local por ahora si no existe endpoint
      const index = ordenes.value.findIndex(o => o.id === orden.id);
      if (index !== -1) {
        ordenes.value[index].estado = 'Cancelada';
        ordenes.value[index].motivoRechazo = motivo;
        ordenes.value = [...ordenes.value]; // Trigger reactivity
      }

      $q.notify({
        color: 'warning',
        message: `Orden ${orden.codigo || ''} rechazada`,
        icon: 'cancel'
      });
    } catch (error) {
      console.error('Error rechazando orden:', error);
    }
  });
};

const marcarEnProceso = (orden) => {
  $q.dialog({
    title: 'Marcar como En Proceso',
    message: `¿La compra de la orden ${orden.codigo || ''} ha sido realizada?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await comprasService.updateOrden(orden.id, { estado: 'En Proceso' });
      await loadData();
      $q.notify({
        color: 'info',
        message: `Orden ${orden.codigo || ''} marcada como En Proceso`,
        icon: 'local_shipping'
      });
    } catch (error) {
      console.error('Error actualizando orden:', error);
      $q.notify({
        type: 'negative',
        message: 'Error al actualizar la orden'
      });
    }
  });
};

const abrirDialogRecepcion = (orden) => {
  ordenSeleccionada.value = orden;
  showRecepcionDialog.value = true;
};

const onRecepcionConfirmada = async (datosRecepcion) => {
  try {
    await comprasService.recibirOrden(datosRecepcion.ordenId, datosRecepcion);
    showRecepcionDialog.value = false;
    await loadData();

    $q.notify({
      color: 'positive',
      message: 'Recepción registrada correctamente',
      icon: 'inventory',
      caption: 'Ahora puede ingresar los items al inventario'
    });
  } catch (error) {
    console.error('Error recibiendo orden:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al registrar recepción'
    });
  }
};

const ingresarAInventario = (orden) => {
  $q.dialog({
    title: 'Ingresar a Inventario',
    message: `¿Confirma el ingreso de los items de la orden ${orden.codigo || ''} al inventario?`,
    html: true,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const resultados = inventarioStore.procesarOrdenCompra(orden);
      const errores = resultados.filter(r => !r.success);

      if (errores.length > 0) {
        $q.notify({
          color: 'warning',
          message: 'Algunos items no pudieron ser procesados',
          caption: errores.map(e => e.message).join(', ')
        });
      }

      await comprasService.updateOrden(orden.id, { estado: 'Completada' });
      await loadData();

      $q.notify({
        color: 'positive',
        message: `Orden ${orden.codigo || ''} completada exitosamente`,
        icon: 'done_all',
        caption: `${resultados.filter(r => r.success).length} items agregados al inventario`
      });
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Error al procesar la orden',
        caption: error.message
      });
    }
  });
};

// Helper para formatear fechas
const formatDate = (fecha) => {
  if (!fecha) return 'N/A';
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return 'N/A';
  }
};

// Columnas para las tablas
const ordenesColumns = [
  { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
  { name: 'fecha', align: 'left', label: 'Fecha', field: 'fecha', sortable: true },
  { name: 'proveedor', align: 'left', label: 'Proveedor', field: row => row.proveedor?.nombre || row.proveedor || 'N/A' },
  { name: 'items', align: 'center', label: 'Items', field: row => Array.isArray(row.items) ? row.items.length : (row.items || 0) },
  { name: 'subtotal', align: 'right', label: 'Subtotal (Bs.)', field: 'subtotal', format: val => Number(val || 0).toFixed(2) },
  { name: 'iva', align: 'right', label: 'IVA (Bs.)', field: 'iva', format: val => Number(val || 0).toFixed(2) },
  { name: 'total', align: 'right', label: 'Total (Bs.)', field: 'total' },
  { name: 'estado', align: 'center', label: 'Estado', field: 'estado' },
  { name: 'actions', align: 'center', label: 'Acciones', field: 'actions' }
];

// Cargar datos al montar
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
