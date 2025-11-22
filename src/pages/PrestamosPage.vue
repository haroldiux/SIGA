<!-- src/pages/PrestamosPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h4 q-my-none">Orden de Préstamo</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm q-mb-none">
          Gestión de préstamos de equipamiento y materiales
        </p>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Nuevo Préstamo" @click="showNuevoPrestamoDialog = true" />
      </div>
    </div>

    <!-- Cards de resumen -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Préstamos Activos</div>
            <q-icon name="handshake" size="2rem" class="q-my-sm text-primary" />
            <div class="text-h3 text-weight-medium">{{ prestamosActivos.length }}</div>
            <div class="text-subtitle2 text-grey-7">En curso</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Vencidos</div>
            <q-icon name="schedule" size="2rem" class="q-my-sm text-negative" />
            <div class="text-h3 text-weight-medium">{{ prestamosVencidos.length }}</div>
            <div class="text-subtitle2 text-grey-7">Requieren devolución</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Por Vencer</div>
            <q-icon name="warning" size="2rem" class="q-my-sm text-warning" />
            <div class="text-h3 text-weight-medium">{{ prestamosPorVencer.length }}</div>
            <div class="text-subtitle2 text-grey-7">Próximos 3 días</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Total Mes</div>
            <q-icon name="calendar_month" size="2rem" class="q-my-sm text-blue" />
            <div class="text-h3 text-weight-medium">{{ prestamos.length }}</div>
            <div class="text-subtitle2 text-grey-7">Préstamos realizados</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tabs de filtro -->
    <div class="q-mb-md">
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey-8 bg-grey-2"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="activos" label="A Préstamo (Activos)" />
        <q-tab name="vencidos" label="Vencidos" :alert="prestamosVencidos.length > 0" alert-icon="warning" />
        <q-tab name="historial" label="Historial" />
      </q-tabs>
    </div>

    <!-- Filtros -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6">{{ getTabTitle() }}</div>
      </div>
      <div class="col-auto row q-col-gutter-md">
        <div>
          <q-select
            v-model="solicitanteFilter"
            :options="solicitanteOptions"
            label="Solicitante"
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
            placeholder="Buscar préstamo..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <!-- Tabla de préstamos activos -->
    <div v-if="activeTab === 'activos'">
      <q-table
        :rows="prestamosActivos"
        :columns="prestamosColumns"
        row-key="id"
        :filter="search"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge
              :color="getEstadoColor(props.value)"
              :label="props.value"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-fechaDevolucion="props">
          <q-td :props="props">
            <div :class="isVencido(props.value) ? 'text-negative text-weight-bold' : ''">
              {{ props.value }}
              <q-icon v-if="isVencido(props.value)" name="error" color="negative" class="q-ml-xs" />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn 
              size="sm" 
              flat 
              round 
              dense 
              icon="assignment_return" 
              color="primary"
              @click="registrarDevolucion(props.row)"
            >
              <q-tooltip>Registrar devolución</q-tooltip>
            </q-btn>
            <q-btn size="sm" flat round dense icon="visibility" color="blue">
              <q-tooltip>Ver detalles</q-tooltip>
            </q-btn>
            <q-btn size="sm" flat round dense icon="timeline" color="secondary" @click="viewSeguimiento(props.row)">
              <q-tooltip>Ver Seguimiento</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Tabla de préstamos vencidos -->
    <div v-if="activeTab === 'vencidos'">
      <q-table
        :rows="prestamosVencidos"
        :columns="prestamosColumns"
        row-key="id"
        :filter="search"
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge color="negative" label="Vencido" />
          </q-td>
        </template>

        <template v-slot:body-cell-fechaDevolucion="props">
          <q-td :props="props">
            <div class="text-negative text-weight-bold">
              {{ props.value }}
              <q-icon name="error" color="negative" class="q-ml-xs" />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn 
              size="sm" 
              flat 
              round 
              dense 
              icon="assignment_return" 
              color="primary"
              @click="registrarDevolucion(props.row)"
            >
              <q-tooltip>Registrar devolución</q-tooltip>
            </q-btn>
            <q-btn size="sm" flat round dense icon="phone" color="orange">
              <q-tooltip>Contactar solicitante</q-tooltip>
            </q-btn>
            <q-btn size="sm" flat round dense icon="timeline" color="secondary" @click="viewSeguimiento(props.row)">
              <q-tooltip>Ver Seguimiento</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Tabla de historial -->
    <div v-if="activeTab === 'historial'">
      <q-table
        :rows="prestamosHistorial"
        :columns="historialColumns"
        row-key="id"
        :filter="search"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge
              :color="getEstadoColor(props.value)"
              :label="props.value"
            />
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Diálogo de Nuevo Préstamo -->
    <BaseModal
      v-model="showNuevoPrestamoDialog"
      title="Nueva Orden de Préstamo"
      size="md"
      confirm-label="Crear Préstamo"
      @confirm="crearPrestamo"
      @cancel="showNuevoPrestamoDialog = false"
    >
      <q-select
        v-model="prestamoForm.itemId"
        :options="itemsDisponibles"
        label="Ítem a prestar"
        outlined
        emit-value
        map-options
        class="q-mb-md"
      />
      
      <q-input
        v-model="prestamoForm.solicitante"
        label="Solicitante"
        outlined
        class="q-mb-md"
      />

      <q-input
        v-model="prestamoForm.cargoSolicitante"
        label="Cargo/Rol"
        outlined
        class="q-mb-md"
      />

      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-6">
          <q-input
            v-model="prestamoForm.fechaPrestamo"
            label="Fecha de Préstamo"
            outlined
            type="date"
          />
        </div>
        <div class="col-6">
          <q-input
            v-model="prestamoForm.fechaDevolucion"
            label="Fecha de Devolución"
            outlined
            type="date"
          />
        </div>
      </div>

      <q-input
        v-model.number="prestamoForm.cantidad"
        type="number"
        label="Cantidad"
        outlined
        class="q-mb-md"
      />

      <q-input
        v-model="prestamoForm.observaciones"
        type="textarea"
        label="Observaciones"
        outlined
        rows="3"
      />
    </BaseModal>

    <!-- Diálogo de Seguimiento -->
    <SeguimientoDialog
      v-model="showSeguimientoDialog"
      title="Seguimiento de Préstamo"
      :steps="seguimientoSteps"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useInventarioStore } from 'src/stores/store-inventario';
import BaseModal from 'src/components/common/BaseModal.vue';
import SeguimientoDialog from 'src/components/common/SeguimientoDialog.vue';

const $q = useQuasar();
const inventarioStore = useInventarioStore();

// Estado
const showNuevoPrestamoDialog = ref(false);
const showSeguimientoDialog = ref(false);
const seguimientoSteps = ref([]);
const activeTab = ref('activos');

const viewSeguimiento = (prestamo) => {
  // Generar pasos simulados basados en el estado
  const steps = [
    { titulo: 'Solicitud Creada', fecha: prestamo.fechaPrestamo, descripcion: `Solicitado por ${prestamo.solicitante}`, icon: 'edit', color: 'primary' },
    { titulo: 'Préstamo Activo', fecha: prestamo.fechaPrestamo, descripcion: 'Material entregado', icon: 'handshake', color: 'positive' }
  ];

  if (prestamo.estado === 'Devuelto') {
    steps.push({ titulo: 'Devolución', fecha: prestamo.fechaDevolucionReal || prestamo.fechaDevolucion, descripcion: 'Material devuelto y verificado', icon: 'assignment_return', color: 'positive' });
  } else if (prestamo.estado === 'Vencido') {
    steps.push({ titulo: 'Vencimiento', fecha: prestamo.fechaDevolucion, descripcion: 'Plazo de devolución excedido', icon: 'warning', color: 'negative' });
  }

  seguimientoSteps.value = steps;
  showSeguimientoDialog.value = true;
};
const search = ref('');
const solicitanteFilter = ref(null);

// Formulario
const prestamoForm = ref({
  itemId: null,
  solicitante: '',
  cargoSolicitante: '',
  fechaPrestamo: new Date().toISOString().split('T')[0],
  fechaDevolucion: '',
  cantidad: 1,
  observaciones: ''
});

// Opciones
const solicitanteOptions = [
  { label: 'Todos los solicitantes', value: null },
  { label: 'Juan Pérez', value: 'Juan Pérez' },
  { label: 'María García', value: 'María García' },
  { label: 'Carlos López', value: 'Carlos López' }
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

// Datos de préstamos
const prestamos = ref([
  {
    id: 1,
    codigo: 'PRES-001',
    item: 'Microscopio Binocular',
    solicitante: 'Juan Pérez',
    cargo: 'Docente',
    fechaPrestamo: '2025-11-10',
    fechaDevolucion: '2025-11-25',
    cantidad: 2,
    estado: 'Activo'
  },
  {
    id: 2,
    codigo: 'PRES-002',
    item: 'Balanza Analítica',
    solicitante: 'María García',
    cargo: 'Investigadora',
    fechaPrestamo: '2025-11-05',
    fechaDevolucion: '2025-11-15',
    cantidad: 1,
    estado: 'Activo'
  },
  {
    id: 3,
    codigo: 'PRES-003',
    item: 'Centrífuga',
    solicitante: 'Carlos López',
    cargo: 'Estudiante',
    fechaPrestamo: '2025-11-18',
    fechaDevolucion: '2025-11-22',
    cantidad: 1,
    estado: 'Activo'
  },
  {
    id: 4,
    codigo: 'PRES-004',
    item: 'Pipetas Automáticas',
    solicitante: 'Ana Martínez',
    cargo: 'Docente',
    fechaPrestamo: '2025-10-20',
    fechaDevolucion: '2025-11-01',
    cantidad: 3,
    estado: 'Devuelto'
  }
]);

// Computed
const prestamosActivos = computed(() => {
  return prestamos.value.filter(p => p.estado === 'Activo');
});

const prestamosVencidos = computed(() => {
  const hoy = new Date().toISOString().split('T')[0];
  return prestamosActivos.value.filter(p => p.fechaDevolucion < hoy);
});

const prestamosPorVencer = computed(() => {
  const hoy = new Date();
  const tresDias = new Date(hoy.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const hoyStr = hoy.toISOString().split('T')[0];
  
  return prestamosActivos.value.filter(p => 
    p.fechaDevolucion >= hoyStr && p.fechaDevolucion <= tresDias
  );
});

const prestamosHistorial = computed(() => {
  return prestamos.value.filter(p => p.estado === 'Devuelto');
});

// Métodos
const getTabTitle = () => {
  switch(activeTab.value) {
    case 'activos': return 'Préstamos Activos';
    case 'vencidos': return 'Préstamos Vencidos';
    case 'historial': return 'Historial de Préstamos';
    default: return '';
  }
};

const getEstadoColor = (estado) => {
  switch(estado) {
    case 'Activo': return 'primary';
    case 'Vencido': return 'negative';
    case 'Devuelto': return 'positive';
    default: return 'grey';
  }
};

const isVencido = (fechaDevolucion) => {
  const hoy = new Date().toISOString().split('T')[0];
  return fechaDevolucion < hoy;
};

const crearPrestamo = () => {
  const itemInfo = itemsDisponibles.value.find(i => i.value === prestamoForm.value.itemId);
  
  if (!itemInfo) {
    $q.notify({
      color: 'negative',
      message: 'Item no válido'
    });
    return;
  }

  if (prestamoForm.value.cantidad > itemInfo.stock) {
    $q.notify({
      color: 'warning',
      message: `Stock insuficiente. Disponible: ${itemInfo.stock}`
    });
    return;
  }

  try {
    // 1. Registrar salida en inventario
    inventarioStore.registrarSalida({
      itemId: itemInfo.value,
      cantidad: prestamoForm.value.cantidad,
      ubicacion: itemInfo.ubicacion,
      motivo: 'Préstamo',
      referencia: `PRES-${String(prestamos.value.length + 1).padStart(3, '0')}`,
      usuario: prestamoForm.value.solicitante
    });

    // 2. Crear registro de préstamo local
    const nuevoPrestamo = {
      id: Date.now(),
      codigo: `PRES-${String(prestamos.value.length + 1).padStart(3, '0')}`,
      itemId: itemInfo.value,
      item: itemInfo.label.split(' (')[0], // Solo el nombre
      solicitante: prestamoForm.value.solicitante,
      cargo: prestamoForm.value.cargoSolicitante,
      fechaPrestamo: prestamoForm.value.fechaPrestamo,
      fechaDevolucion: prestamoForm.value.fechaDevolucion,
      cantidad: prestamoForm.value.cantidad,
      ubicacion: itemInfo.ubicacion,
      unidadMedida: itemInfo.unidadMedida,
      estado: 'Activo'
    };

    prestamos.value.push(nuevoPrestamo);

    $q.notify({
      color: 'positive',
      message: `Préstamo ${nuevoPrestamo.codigo} creado correctamente`,
      icon: 'check_circle'
    });

    showNuevoPrestamoDialog.value = false;
    prestamoForm.value = {
      itemId: null,
      solicitante: '',
      cargoSolicitante: '',
      fechaPrestamo: new Date().toISOString().split('T')[0],
      fechaDevolucion: '',
      cantidad: 1,
      observaciones: ''
    };
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error al crear préstamo',
      caption: error.message
    });
  }
};

const registrarDevolucion = (prestamo) => {
  $q.dialog({
    title: 'Confirmar Devolución',
    message: `¿Confirmar la devolución del préstamo ${prestamo.codigo}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    try {
      // 1. Registrar devolución en inventario (reponer stock)
      inventarioStore.registrarDevolucion({
        itemId: prestamo.itemId || 'QUI-001', // Fallback para datos mock
        nombre: prestamo.item,
        cantidad: prestamo.cantidad,
        unidadMedida: prestamo.unidadMedida || 'Unidades',
        ubicacion: prestamo.ubicacion || 'Almacén Central',
        referencia: prestamo.codigo,
        usuario: prestamo.solicitante
      });

      // 2. Actualizar estado del préstamo
      prestamo.estado = 'Devuelto';
      prestamo.fechaDevolucionReal = new Date().toISOString().split('T')[0];

      $q.notify({
        color: 'positive',
        message: 'Devolución registrada y stock actualizado',
        icon: 'check_circle'
      });
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Error al registrar devolución',
        caption: error.message
      });
    }
  });
};

// Columnas
const prestamosColumns = [
  { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
  { name: 'item', align: 'left', label: 'Ítem', field: 'item', sortable: true },
  { name: 'solicitante', align: 'left', label: 'Solicitante', field: 'solicitante', sortable: true },
  { name: 'cargo', align: 'left', label: 'Cargo', field: 'cargo' },
  { name: 'fechaPrestamo', align: 'center', label: 'Fecha Préstamo', field: 'fechaPrestamo', sortable: true },
  { name: 'fechaDevolucion', align: 'center', label: 'Fecha Devolución', field: 'fechaDevolucion', sortable: true },
  { name: 'cantidad', align: 'center', label: 'Cantidad', field: 'cantidad' },
  { name: 'estado', align: 'center', label: 'Estado', field: 'estado' },
  { name: 'actions', align: 'center', label: 'Acciones', field: 'actions' }
];

const historialColumns = [
  { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
  { name: 'item', align: 'left', label: 'Ítem', field: 'item', sortable: true },
  { name: 'solicitante', align: 'left', label: 'Solicitante', field: 'solicitante', sortable: true },
  { name: 'fechaPrestamo', align: 'center', label: 'Fecha Préstamo', field: 'fechaPrestamo', sortable: true },
  { name: 'fechaDevolucion', align: 'center', label: 'Fecha Devolución', field: 'fechaDevolucion', sortable: true },
  { name: 'cantidad', align: 'center', label: 'Cantidad', field: 'cantidad' },
  { name: 'estado', align: 'center', label: 'Estado', field: 'estado' }
];
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
