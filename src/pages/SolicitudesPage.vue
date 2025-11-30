<!-- src/pages/SolicitudesPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h4 q-my-none">Solicitudes</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm q-mb-none">
          Gestiona las solicitudes de materiales y su flujo de aprobación
        </p>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Nueva Solicitud" @click="showNuevaSolicitudDialog = true" />
      </div>
    </div>

    <!-- Cards de resumen -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Total Solicitudes</div>
            <q-icon name="description" size="2rem" class="q-my-sm text-primary" />
            <div class="text-h3 text-weight-medium">{{ solicitudes.length }}</div>
            <div class="text-subtitle2 text-grey-7">{{ solicitudesActivas }} activas</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Pendientes Almacén</div>
            <q-icon name="warehouse" size="2rem" class="q-my-sm text-orange" />
            <div class="text-h3 text-weight-medium">{{ pendientesAlmacen }}</div>
            <div class="text-subtitle2 text-grey-7">Esperando revisión</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">En Adquisiciones</div>
            <q-icon name="shopping_cart" size="2rem" class="q-my-sm text-blue" />
            <div class="text-h3 text-weight-medium">{{ enAdquisiciones }}</div>
            <div class="text-subtitle2 text-grey-7">Proceso de compra</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-white">
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">Completadas</div>
            <q-icon name="check_circle" size="2rem" class="q-my-sm text-positive" />
            <div class="text-h3 text-weight-medium">{{ completadas }}</div>
            <div class="text-subtitle2 text-grey-7">Entregadas</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filtros y tabla -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6">Lista de Solicitudes</div>
        <div class="text-subtitle2 text-grey-7">Flujo: Sub-Almacén → Almacén → Adquisiciones</div>
      </div>
      <div class="col-auto row q-col-gutter-md">
        <div>
          <q-input v-model="search" outlined dense placeholder="Buscar solicitud...">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <q-table :rows="solicitudes" :columns="solicitudesColumns" row-key="id" :filter="search">
      <!-- Columna de Progreso Visual -->
      <template v-slot:body-cell-progreso="props">
        <q-td :props="props">
          <div class="row justify-center items-center q-gutter-xs">
            <!-- Nivel 1: Sub-Almacén -->
            <q-icon :name="getStatusIcon(props.row.aprobacionSubAlmacen.estado)"
              :color="getStatusColor(props.row.aprobacionSubAlmacen.estado)" size="sm">
              <q-tooltip>Sub-Almacén: {{ props.row.aprobacionSubAlmacen.estado }}</q-tooltip>
            </q-icon>

            <q-icon name="arrow_forward" size="xs" color="grey-5" />

            <!-- Nivel 2: Almacén -->
            <q-icon :name="getStatusIcon(props.row.aprobacionAlmacen.estado)"
              :color="getStatusColor(props.row.aprobacionAlmacen.estado)" size="sm">
              <q-tooltip>Almacén: {{ props.row.aprobacionAlmacen.estado }}</q-tooltip>
            </q-icon>

            <q-icon name="arrow_forward" size="xs" color="grey-5" />

            <!-- Nivel 3: Adquisiciones -->
            <q-icon :name="getStatusIcon(props.row.aprobacionAdquisiciones.estado)"
              :color="getStatusColor(props.row.aprobacionAdquisiciones.estado)" size="sm">
              <q-tooltip>Adquisiciones: {{ props.row.aprobacionAdquisiciones.estado }}</q-tooltip>
            </q-icon>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-ubicacion="props">
        <q-td :props="props">
          <div class="flex items-center">
            <q-icon name="place" color="primary" class="q-mr-xs" />
            {{ props.row.ubicacionActual }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn size="sm" flat round dense icon="visibility" color="primary" @click="viewSolicitud(props.row)" />
          <q-btn size="sm" flat round dense icon="timeline" color="secondary" @click="viewSeguimiento(props.row)">
            <q-tooltip>Ver Seguimiento</q-tooltip>
          </q-btn>
          <!-- Botón de aprobación rápida para demo -->
          <q-btn v-if="canApprove(props.row)" size="sm" flat round dense icon="check_circle" color="positive"
            @click="approveNextStep(props.row)">
            <q-tooltip>Aprobar siguiente paso</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Diálogo de Nueva Solicitud -->
    <BaseModal v-model="showNuevaSolicitudDialog" title="Nueva Solicitud de Materiales" size="lg"
      confirm-label="Guardar Solicitud" @confirm="guardarSolicitud" @cancel="showNuevaSolicitudDialog = false">
      <div class="text-subtitle2 text-grey-7 q-mb-md">
        Complete los datos de la solicitud
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-model="nuevaSolicitud.solicitante" label="Solicitante *" outlined readonly hint="Usuario actual" />
        </div>
        <div class="col-12 col-md-6">
          <q-select v-model="nuevaSolicitud.laboratorio" :options="laboratorioOptions" label="Laboratorio *" outlined />
        </div>
        <div class="col-12">
          <q-input v-model="nuevaSolicitud.descripcion" type="textarea" label="Descripción/Justificación *" outlined
            rows="3" hint="Explique el motivo de la solicitud" />
        </div>
        <div class="col-12">
          <q-checkbox v-model="nuevaSolicitud.urgente" label="Marcar como urgente" />
        </div>
      </div>
    </BaseModal>

    <!-- Diálogo de Detalle de Solicitud -->
    <BaseModal v-model="showDetalleSolicitudDialog" title="Detalle de Solicitud y Seguimiento" size="lg"
      :confirm-label="getConfirmLabel(selectedSolicitud)" cancel-label="Cerrar" @confirm="handleDetailAction"
      @cancel="showDetalleSolicitudDialog = false">
      <div v-if="selectedSolicitud">
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-md-8">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6 q-mb-sm">Información General</div>
                <div class="row">
                  <div class="col-6">
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Código</q-item-label>
                        <q-item-label class="text-weight-bold">{{ selectedSolicitud.codigo }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-6">
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Fecha</q-item-label>
                        <q-item-label>{{ selectedSolicitud.fecha }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-6">
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Solicitante</q-item-label>
                        <q-item-label>{{ selectedSolicitud.solicitante }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-6">
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Ubicación Actual</q-item-label>
                        <q-item-label class="text-primary text-weight-bold">
                          <q-icon name="place" /> {{ selectedSolicitud.ubicacionActual }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card flat bordered class="full-height">
              <q-card-section>
                <div class="text-h6 q-mb-sm">Estado de Aprobación</div>
                <q-list dense>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon :name="getStatusIcon(selectedSolicitud.aprobacionSubAlmacen.estado)"
                        :color="getStatusColor(selectedSolicitud.aprobacionSubAlmacen.estado)" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Sub-Almacén</q-item-label>
                      <q-item-label caption>{{ selectedSolicitud.aprobacionSubAlmacen.estado }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon :name="getStatusIcon(selectedSolicitud.aprobacionAlmacen.estado)"
                        :color="getStatusColor(selectedSolicitud.aprobacionAlmacen.estado)" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Almacén Central</q-item-label>
                      <q-item-label caption>{{ selectedSolicitud.aprobacionAlmacen.estado }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon :name="getStatusIcon(selectedSolicitud.aprobacionAdquisiciones.estado)"
                        :color="getStatusColor(selectedSolicitud.aprobacionAdquisiciones.estado)" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Adquisiciones</q-item-label>
                      <q-item-label caption>{{ selectedSolicitud.aprobacionAdquisiciones.estado }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Items Solicitados</div>
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-item v-for="(item, idx) in selectedSolicitud.itemsDetalle" :key="idx">
              <q-item-section avatar>
                <q-avatar color="grey-2" text-color="primary" icon="science" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.nombre }}</q-item-label>
                <q-item-label caption>Código: {{ item.itemId }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="primary" :label="`${item.cantidad} ${item.unidadMedida}`" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <q-expansion-item icon="map" label="Mapa de Ruta (Tracking)" header-class="bg-grey-2" default-opened>
          <q-card>
            <q-card-section>
              <q-timeline color="secondary">
                <q-timeline-entry v-for="(evento, index) in selectedSolicitud.historialRuta" :key="index"
                  :title="evento.ubicacion" :subtitle="evento.fecha" :icon="evento.icon || 'place'">
                  <div>{{ evento.descripcion }}</div>
                </q-timeline-entry>
              </q-timeline>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </BaseModal>

    <!-- Diálogo de Nueva Orden (Generada desde Solicitud) -->
    <DialogNuevaOrden v-model="showOrdenDialog" :initial-data="ordenInitialData" @order-added="onOrdenGenerada" />

    <!-- Diálogo de Seguimiento -->
    <SeguimientoDialog v-model="showSeguimientoDialog" title="Seguimiento de Solicitud" :steps="seguimientoSteps" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import BaseModal from 'src/components/common/BaseModal.vue';
import DialogNuevaOrden from 'src/components/compras/DialogNuevaOrden.vue';
import SeguimientoDialog from 'src/components/common/SeguimientoDialog.vue';
import solicitudesService from 'src/services/solicitudesService';

const $q = useQuasar();
const router = useRouter();

// Control de diálogos
const showNuevaSolicitudDialog = ref(false);
const showDetalleSolicitudDialog = ref(false);
const showOrdenDialog = ref(false);
const showSeguimientoDialog = ref(false);
const selectedSolicitud = ref(null);
const ordenInitialData = ref(null);
const seguimientoSteps = ref([]);
const loading = ref(false);

const viewSeguimiento = (solicitud) => {
  seguimientoSteps.value = (solicitud.historialRuta || []).map(h => ({
    titulo: h.ubicacion,
    fecha: h.fecha,
    descripcion: h.descripcion,
    icon: h.icon,
    color: 'primary'
  }));
  showSeguimientoDialog.value = true;
};

// Filtros
const search = ref('');

// Formulario nueva solicitud
const nuevaSolicitud = ref({
  solicitante: 'Usuario Actual', // TODO: Obtener del auth store
  laboratorio: null,
  descripcion: '',
  urgente: false,
  items: []
});

const laboratorioOptions = [
  'Lab. Química',
  'Lab. Física',
  'Lab. Biología',
  'Lab. Electrónica',
  'Lab. Simulación Clínica'
];

// Datos de solicitudes
const solicitudes = ref([]);

// Cargar datos
const loadData = async () => {
  loading.value = true;
  try {
    const response = await solicitudesService.getSolicitudes();
    solicitudes.value = response.data || response;
  } catch (error) {
    console.error('Error cargando solicitudes:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar solicitudes'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});

// Computed properties
const solicitudesActivas = computed(() => solicitudes.value.filter(sol => sol.aprobacionAlmacen?.estado !== 'rechazado').length);
const pendientesAlmacen = computed(() => solicitudes.value.filter(sol => sol.aprobacionSubAlmacen?.estado === 'aprobado' && sol.aprobacionAlmacen?.estado === 'pendiente').length);
const enAdquisiciones = computed(() => solicitudes.value.filter(sol => sol.aprobacionAlmacen?.estado === 'aprobado' && sol.aprobacionAdquisiciones?.estado !== 'aprobado').length);
const completadas = computed(() => solicitudes.value.filter(sol => sol.aprobacionAdquisiciones?.estado === 'aprobado').length);

// Métodos
const guardarSolicitud = async () => {
  try {
    await solicitudesService.createSolicitud({
      ...nuevaSolicitud.value,
      fecha: new Date().toISOString().split('T')[0]
    });

    await loadData();

    $q.notify({
      color: 'positive',
      message: 'Solicitud creada correctamente',
      icon: 'check_circle'
    });

    showNuevaSolicitudDialog.value = false;

    // Resetear formulario
    nuevaSolicitud.value = {
      solicitante: 'Usuario Actual',
      laboratorio: null,
      descripcion: '',
      urgente: false,
      items: []
    };
  } catch (error) {
    console.error('Error creando solicitud:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al crear la solicitud'
    });
  }
};

const viewSolicitud = (solicitud) => {
  selectedSolicitud.value = solicitud;
  showDetalleSolicitudDialog.value = true;
};

const getStatusIcon = (estado) => {
  switch (estado) {
    case 'aprobado': return 'check_circle';
    case 'rechazado': return 'cancel';
    case 'pendiente': return 'radio_button_unchecked';
    default: return 'help';
  }
};

const getStatusColor = (estado) => {
  switch (estado) {
    case 'aprobado': return 'positive';
    case 'rechazado': return 'negative';
    case 'pendiente': return 'grey-5';
    default: return 'grey';
  }
};

const canApprove = (solicitud) => {
  if (!solicitud.aprobacionSubAlmacen) return false;
  if (solicitud.aprobacionSubAlmacen.estado === 'pendiente') return true;
  if (solicitud.aprobacionSubAlmacen.estado === 'aprobado' && solicitud.aprobacionAlmacen.estado === 'pendiente') return true;
  if (solicitud.aprobacionAlmacen.estado === 'aprobado' && solicitud.aprobacionAdquisiciones.estado === 'pendiente') return true;
  return false;
};

const approveNextStep = async (solicitud) => {
  let etapa = '';
  if (solicitud.aprobacionSubAlmacen.estado === 'pendiente') etapa = 'subalmacen';
  else if (solicitud.aprobacionAlmacen.estado === 'pendiente') etapa = 'almacen';
  else if (solicitud.aprobacionAdquisiciones.estado === 'pendiente') {
    viewSolicitud(solicitud);
    return;
  }

  if (etapa) {
    try {
      await solicitudesService.aprobarSolicitud(solicitud.id, etapa);
      await loadData();
      $q.notify({
        color: 'positive',
        message: 'Etapa aprobada correctamente',
        icon: 'check_circle'
      });
    } catch (error) {
      console.error('Error aprobando solicitud:', error);
      $q.notify({
        type: 'negative',
        message: 'Error al aprobar la solicitud'
      });
    }
  }
};

const getConfirmLabel = (solicitud) => {
  if (!solicitud) return null;
  if (solicitud.aprobacionAlmacen?.estado === 'aprobado' && solicitud.aprobacionAdquisiciones?.estado === 'pendiente') {
    return 'Generar Orden de Compra';
  }
  return null;
};

const handleDetailAction = () => {
  if (selectedSolicitud.value.aprobacionAlmacen?.estado === 'aprobado' && selectedSolicitud.value.aprobacionAdquisiciones?.estado === 'pendiente') {
    aprobarYGenerarOrden();
  }
};

const aprobarYGenerarOrden = () => {
  ordenInitialData.value = {
    rq: selectedSolicitud.value.codigo,
    items: selectedSolicitud.value.itemsDetalle?.map(item => ({
      itemId: item.itemId,
      item: 'item_generico', // TODO: Mapear correctamente
      nombre: item.nombre,
      cantidad: item.cantidad,
      unidadMedida: item.unidadMedida,
      precioBruto: 0,
      region: 'Región Principal',
      facturado: true
    })) || []
  };

  showDetalleSolicitudDialog.value = false;
  showOrdenDialog.value = true;
};

const onOrdenGenerada = async (orden) => {
  // Aprobar etapa de adquisiciones automáticamente al generar orden
  if (selectedSolicitud.value) {
    try {
      await solicitudesService.aprobarSolicitud(selectedSolicitud.value.id, 'adquisiciones', { orden_id: orden.id });
      await loadData();
    } catch (error) {
      console.error('Error actualizando estado de solicitud:', error);
    }
  }

  $q.notify({
    color: 'positive',
    message: `Orden ${orden.numero_orden || 'generada'} creada exitosamente`,
    icon: 'check_circle'
  });

  router.push('/compras');
};

// Columnas para las tablas
const solicitudesColumns = [
  { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
  { name: 'fecha', align: 'left', label: 'Fecha', field: 'fecha', sortable: true },
  { name: 'solicitante', align: 'left', label: 'Solicitante', field: 'solicitante' },
  { name: 'laboratorio', align: 'left', label: 'Laboratorio', field: 'laboratorio' },
  { name: 'progreso', align: 'center', label: 'Progreso (Sub → Alm → Adq)', field: 'progreso' },
  { name: 'ubicacion', align: 'left', label: 'Ubicación Actual', field: 'ubicacionActual' },
  { name: 'actions', align: 'center', label: 'Acciones', field: 'actions' }
];
</script>
