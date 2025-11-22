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
          <q-select
            v-model="estadoFilter"
            :options="estadoOptions"
            label="Estado"
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
            v-model="fechaDesdeFilter"
            label="Desde"
            outlined
            dense
            readonly
          >
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
          <q-input
            v-model="fechaHastaFilter"
            label="Hasta"
            outlined
            dense
            readonly
          >
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
          <q-input
            v-model="search"
            outlined
            dense
            placeholder="Buscar orden..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <q-table
      :rows="filteredOrdenes"
      :columns="ordenesColumns"
      row-key="id"
      :filter="search"
    >
      <template v-slot:body-cell-estado="props">
        <q-td :props="props">
          <q-badge :color="getEstadoColor(props.value)" :label="props.value" />
        </q-td>
      </template>

      <template v-slot:body-cell-total="props">
        <q-td :props="props" class="text-right">
          Bs. {{ props.value.toFixed(2) }}
        </q-td>
      </template>

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
    <DialogNuevaOrden
      v-model="showNuevaOrdenDialog"
      @order-added="onOrderAdded"
    />

    <!-- Diálogo de Recepción de Mercancía -->
    <DialogRecepcionOrden
      v-model="showRecepcionDialog"
      :orden="ordenSeleccionada"
      @recepcion-confirmada="onRecepcionConfirmada"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useInventarioStore } from 'src/stores/store-inventario';
import DialogNuevaOrden from 'src/components/compras/DialogNuevaOrden.vue';
import DialogRecepcionOrden from 'src/components/compras/DialogRecepcionOrden.vue';

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

// Opciones para filtros
const estadoOptions = [
  { label: 'Todos los estados', value: null },
  { label: 'Pendiente', value: 'Pendiente' },
  { label: 'Aprobada', value: 'Aprobada' },
  { label: 'En Proceso', value: 'En Proceso' },
  { label: 'Completada', value: 'Completada' },
  { label: 'Cancelada', value: 'Cancelada' }
];

// Datos de órdenes
const ordenes = ref([
  {
    id: 1,
    codigo: 'OC-2025-001',
    fecha: '2025-11-05',
    proveedor: 'Química del Sur SRL',
    items: [
      {
        itemId: 'QUI-001',
        nombre: 'Ácido Sulfúrico H2SO4',
        cantidad: 10,
        unidadMedida: 'Litros',
        precioBruto: 85.00,
        precioNeto: 101.15,
        montoIVA: 16.15
      }
    ],
    subtotal: 850.00,
    iva: 161.50,
    total: 1011.50,
    estado: 'Pendiente'
  },
  {
    id: 2,
    codigo: 'OC-2025-002',
    fecha: '2025-11-02',
    proveedor: 'LabEquip Bolivia',
    items: 3,
    subtotal: 2800.00,
    iva: 0, // Sin IVA porque es región exenta
    total: 2800.00,
    estado: 'Aprobada'
  },
  {
    id: 3,
    codigo: 'OC-2025-003',
    fecha: '2025-10-29',
    proveedor: 'BioInsumos Científicos',
    items: 8,
    subtotal: 1200.00,
    iva: 228.00,
    total: 1428.00,
    estado: 'En Proceso'
  },
  {
    id: 4,
    codigo: 'OC-2025-004',
    fecha: '2025-10-25',
    proveedor: 'LabEquip Bolivia',
    items: 2,
    subtotal: 320.00,
    iva: 60.80,
    total: 380.80,
    estado: 'Completada'
  },
  {
    id: 5,
    codigo: 'OC-2025-005',
    fecha: '2025-10-20',
    proveedor: 'Química del Sur SRL',
    items: 1,
    subtotal: 150.00,
    iva: 28.50,
    total: 178.50,
    estado: 'Cancelada'
  }
]);

// Computed properties
const filteredOrdenes = computed(() => {
  return ordenes.value.filter(orden => {
    // Filtrar por estado
    if (estadoFilter.value && orden.estado !== estadoFilter.value) return false;

    // Filtrar por fecha desde
    if (fechaDesdeFilter.value && new Date(orden.fecha) < new Date(fechaDesdeFilter.value)) return false;

    // Filtrar por fecha hasta
    if (fechaHastaFilter.value && new Date(orden.fecha) > new Date(fechaHastaFilter.value)) return false;

    return true;
  });
});

const ordenesActivas = computed(() => ordenes.value.filter(orden => orden.estado !== 'Cancelada').length);

const ordenesPendientes = computed(() => ordenes.value.filter(orden => orden.estado === 'Pendiente'));

const ordenesEnProceso = computed(() => ordenes.value.filter(orden => orden.estado === 'En Proceso' || orden.estado === 'Aprobada'));

const ordenesCompletadas = computed(() => ordenes.value.filter(orden => orden.estado === 'Completada'));

// Métodos
const onOrderAdded = (orden) => {
  // Asignar ID único
  const newOrden = {
    id: Date.now(),
    ...orden,
    estado: 'Pendiente',
    items: orden.items.length,
    subtotal: orden.items.reduce((sum, item) => sum + (item.precioBruto * item.cantidad), 0),
    iva: orden.items.reduce((sum, item) => sum + (item.montoIVA * item.cantidad), 0),
    total: orden.items.reduce((sum, item) => sum + (item.precioNeto * item.cantidad), 0)
  };

  // Agregar a la lista
  ordenes.value.push(newOrden);

  $q.notify({
    color: 'positive',
    message: `Orden ${orden.codigo} agregada correctamente`,
    icon: 'check_circle'
  });
};

const viewOrden = (orden) => {
  $q.notify({
    message: `Ver detalles de la orden ${orden.codigo}`,
    color: 'info'
  });
};

const getEstadoColor = (estado) => {
  switch(estado) {
    case 'Pendiente': return 'orange';
    case 'Aprobada': return 'blue';
    case 'En Proceso': return 'teal';
    case 'Recibida': return 'purple';
    case 'Completada': return 'positive';
    case 'Cancelada': return 'negative';
    default: return 'grey';
  }
};

// ===== NUEVAS FUNCIONES DEL FLUJO =====

const aprobarOrden = (orden) => {
  $q.dialog({
    title: 'Aprobar Orden de Compra',
    message: `¿Confirma la aprobación de la orden ${orden.codigo}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    orden.estado = 'Aprobada';
    orden.fechaAprobacion = new Date().toISOString();
    orden.aprobadoPor = 'Superadmin'; // En producción, obtener del usuario actual

    $q.notify({
      color: 'positive',
      message: `Orden ${orden.codigo} aprobada correctamente`,
      icon: 'check_circle'
    });
  });
};

const rechazarOrden = (orden) => {
  $q.dialog({
    title: 'Rechazar Orden de Compra',
    message: `¿Está seguro que desea rechazar la orden ${orden.codigo}?`,
    prompt: {
      model: '',
      type: 'text',
      label: 'Motivo del rechazo',
      isValid: val => val.length > 0
    },
    cancel: true,
    persistent: true
  }).onOk((motivo) => {
    orden.estado = 'Cancelada';
    orden.motivoRechazo = motivo;
    orden.fechaRechazo = new Date().toISOString();

    $q.notify({
      color: 'warning',
      message: `Orden ${orden.codigo} rechazada`,
      icon: 'cancel'
    });
  });
};

const marcarEnProceso = (orden) => {
  $q.dialog({
    title: 'Marcar como En Proceso',
    message: `¿La compra de la orden ${orden.codigo} ha sido realizada?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    orden.estado = 'En Proceso';
    orden.fechaEnProceso = new Date().toISOString();

    $q.notify({
      color: 'info',
      message: `Orden ${orden.codigo} marcada como En Proceso`,
      icon: 'local_shipping'
    });
  });
};

const abrirDialogRecepcion = (orden) => {
  ordenSeleccionada.value = orden;
  showRecepcionDialog.value = true;
};

const onRecepcionConfirmada = (datosRecepcion) => {
  const orden = ordenes.value.find(o => o.id === datosRecepcion.ordenId);
  
  if (!orden) return;

  // Actualizar datos de la orden
  orden.estado = 'Recibida';
  orden.fechaRecepcion = datosRecepcion.fechaRecepcion;
  orden.recibidoPor = datosRecepcion.recibidoPor;
  orden.ubicacionDestino = datosRecepcion.ubicacionDestino;
  orden.observacionesRecepcion = datosRecepcion.observaciones;

  // Actualizar items con cantidades recibidas
  orden.items = datosRecepcion.items;

  $q.notify({
    color: 'positive',
    message: `Recepción de orden ${orden.codigo} registrada correctamente`,
    icon: 'inventory',
    caption: 'Ahora puede ingresar los items al inventario'
  });
};

const ingresarAInventario = (orden) => {
  $q.dialog({
    title: 'Ingresar a Inventario',
    message: `¿Confirma el ingreso de los items de la orden ${orden.codigo} al inventario?`,
    html: true,
    cancel: true,
    persistent: true
  }).onOk(() => {
    try {
      // Procesar orden de compra en el store de inventario
      const resultados = inventarioStore.procesarOrdenCompra(orden);

      // Verificar si hubo errores
      const errores = resultados.filter(r => !r.success);
      
      if (errores.length > 0) {
        $q.notify({
          color: 'warning',
          message: `Algunos items no pudieron ser procesados`,
          caption: errores.map(e => e.message).join(', ')
        });
      }

      // Actualizar estado de la orden
      orden.estado = 'Completada';
      orden.fechaCompletado = new Date().toISOString();

      $q.notify({
        color: 'positive',
        message: `Orden ${orden.codigo} completada exitosamente`,
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

// Columnas para las tablas
const ordenesColumns = [
  { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
  { name: 'fecha', align: 'left', label: 'Fecha', field: 'fecha', sortable: true },
  { name: 'proveedor', align: 'left', label: 'Proveedor', field: 'proveedor' },
  { name: 'items', align: 'center', label: 'Items', field: 'items' },
  { name: 'subtotal', align: 'right', label: 'Subtotal (Bs.)', field: 'subtotal' },
  { name: 'iva', align: 'right', label: 'IVA (Bs.)', field: 'iva' },
  { name: 'total', align: 'right', label: 'Total (Bs.)', field: 'total' },
  { name: 'estado', align: 'center', label: 'Estado', field: 'estado' },
  { name: 'actions', align: 'center', label: 'Acciones', field: 'actions' }
];
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
