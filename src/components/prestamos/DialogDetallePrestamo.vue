<!-- src/components/prestamos/DialogDetallePrestamo.vue -->
<template>
  <q-dialog
    v-model="isOpen"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="min-width: 700px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Detalle de Préstamo</div>
        <div class="text-subtitle2 text-grey-7 q-ml-sm">{{ prestamoData.codigo }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator class="q-my-md" />

      <q-card-section class="q-pt-none">
        <!-- Información básica -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Solicitante</q-item-label>
                  <q-item-label>{{ prestamoData.solicitante }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Departamento</q-item-label>
                  <q-item-label>{{ getDepartamentoLabel(prestamoData.departamento) }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Propósito</q-item-label>
                  <q-item-label>{{ prestamoData.proposito }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="col-12 col-md-6">
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Estado</q-item-label>
                  <q-item-label>
                    <q-badge :color="getEstadoColor(prestamoData.estado)">{{ prestamoData.estado }}</q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Fecha de Préstamo</q-item-label>
                  <q-item-label>{{ prestamoData.fechaPrestamo }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Fecha de Devolución Estimada</q-item-label>
                  <q-item-label>{{ prestamoData.fechaDevolucion }}</q-item-label>
                </q-item-section>
              </q-item>

              <!-- Mostrar fecha real de devolución si ya fue devuelto -->
              <q-item v-if="prestamoData.estado === 'Devuelto'">
                <q-item-section>
                  <q-item-label caption>Fecha de Devolución Real</q-item-label>
                  <q-item-label>{{ prestamoData.fechaDevolucionReal || 'No registrada' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <!-- Items del préstamo -->
        <div class="text-subtitle1 q-mb-sm">Ítems Prestados</div>
        <q-table
          :rows="prestamoData.items || []"
          :columns="itemsColumns"
          row-key="id"
          dense
          :pagination="{ rowsPerPage: 0 }"
        >
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-badge :color="props.value === 'Devuelto' ? 'positive' : 'warning'">
                {{ props.value }}
              </q-badge>
            </q-td>
          </template>
        </q-table>

        <!-- Comentarios o notas -->
        <div v-if="prestamoData.comentarios" class="q-mt-md">
          <div class="text-subtitle1 q-mb-sm">Comentarios</div>
          <q-card flat bordered>
            <q-card-section>
              {{ prestamoData.comentarios }}
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn
          v-if="prestamoData.estado === 'Activo'"
          label="Registrar Devolución"
          color="positive"
          @click="registrarDevolucion"
          class="q-mr-sm"
        />
        <q-btn
          v-if="prestamoData.estado === 'Pendiente'"
          label="Aprobar Préstamo"
          color="primary"
          @click="aprobarPrestamo"
          class="q-mr-sm"
        />
        <q-btn
          v-if="prestamoData.estado === 'Pendiente'"
          label="Rechazar"
          color="negative"
          @click="rechazarPrestamo"
          class="q-mr-sm"
        />
        <q-btn label="Cerrar" color="grey-7" v-close-popup />
      </q-card-actions>
    </q-card>

    <!-- Diálogo para registrar devolución -->
    <q-dialog v-model="showDevolucionDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Registrar Devolución</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="confirmarDevolucion">
            <div class="q-gutter-md">
              <q-input
                v-model="devolucionData.fecha"
                label="Fecha de Devolución"
                outlined
                readonly
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="devolucionData.fecha" today-btn>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                v-model="devolucionData.comentarios"
                label="Comentarios"
                type="textarea"
                outlined
                placeholder="Observaciones sobre el estado de los ítems devueltos..."
                rows="3"
              />

              <div class="text-subtitle2 q-mb-sm">Estado de los Ítems</div>
              <div class="q-gutter-md">
                <div v-for="(item, index) in prestamoData.items" :key="index" class="q-mb-sm">
                  <div class="row items-center q-col-gutter-md">
                    <div class="col-6">
                      <span>{{ getItemLabel(item.item) }} ({{ item.cantidad }} {{ item.unidad }})</span>
                    </div>
                    <div class="col-6">
                      <q-select
                        v-model="itemsDevolucionState[index]"
                        :options="estadosDevolucionOptions"
                        label="Estado"
                        outlined
                        dense
                        emit-value
                        map-options
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancelar" color="grey-7" v-close-popup class="q-mr-sm" />
              <q-btn label="Confirmar Devolución" color="positive" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script setup>
import { ref, watch, defineModel } from 'vue';
import { useQuasar } from 'quasar';

const props = defineProps({
  prestamo: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['prestamo-updated']);
const isOpen = defineModel('modelValue');
const $q = useQuasar();

// Datos del préstamo
const prestamoData = ref({
  id: 0,
  codigo: '',
  solicitante: '',
  departamento: '',
  fechaPrestamo: '',
  fechaDevolucion: '',
  fechaDevolucionReal: '',
  proposito: '',
  items: [],
  estado: 'Pendiente',
  comentarios: ''
});

// Diálogo de devolución
const showDevolucionDialog = ref(false);
const devolucionData = ref({
  fecha: new Date().toISOString().slice(0, 10),
  comentarios: ''
});
const itemsDevolucionState = ref([]);

// Opciones para los selects
const departamentosOptions = [
  { label: 'Departamento de Química', value: 'quimica' },
  { label: 'Departamento de Física', value: 'fisica' },
  { label: 'Departamento de Biología', value: 'biologia' },
  { label: 'Facultad de Medicina', value: 'medicina' },
  { label: 'Facultad de Ingeniería', value: 'ingenieria' }
];

const estadosDevolucionOptions = [
  { label: 'Buen estado', value: 'bueno' },
  { label: 'Estado regular', value: 'regular' },
  { label: 'Dañado', value: 'danado' }
];

const itemsOptions = [
  { label: 'Microscopio Binocular', value: 'microscopio' },
  { label: 'Balanza Analítica', value: 'balanza' },
  { label: 'Centrífuga', value: 'centrifuga' },
  { label: 'Kit de Disección', value: 'kit_diseccion' },
  { label: 'Espectrofotómetro', value: 'espectrofotometro' }
];

// Columnas para la tabla de ítems
const itemsColumns = [
  { name: 'nombre', align: 'left', label: 'Ítem', field: row => getItemLabel(row.item) },
  { name: 'cantidad', align: 'center', label: 'Cantidad', field: 'cantidad' },
  { name: 'unidad', align: 'center', label: 'Unidad', field: 'unidad' },
  { name: 'estado', align: 'center', label: 'Estado', field: row => row.estado || 'Prestado' }
];

// Vigilar los cambios en el préstamo
watch(
  () => props.prestamo,
  (newPrestamo) => {
    if (newPrestamo) {
      prestamoData.value = { ...newPrestamo };

      // Inicializar estados de devolución
      itemsDevolucionState.value = prestamoData.value.items.map(() => 'bueno');
    }
  },
  { immediate: true }
);

// Métodos para obtener etiquetas
const getDepartamentoLabel = (value) => {
  const departamento = departamentosOptions.find(d => d.value === value);
  return departamento ? departamento.label : value;
};

const getItemLabel = (value) => {
  const item = itemsOptions.find(i => i.value === value);
  return item ? item.label : value;
};

const getEstadoColor = (estado) => {
  switch(estado) {
    case 'Pendiente': return 'orange';
    case 'Aprobado':
    case 'Activo': return 'blue';
    case 'Devuelto': return 'positive';
    case 'Rechazado':
    case 'Cancelado': return 'negative';
    default: return 'grey';
  }
};

// Métodos de acciones
const aprobarPrestamo = () => {
  $q.dialog({
    title: 'Confirmar aprobación',
    message: `¿Está seguro que desea aprobar el préstamo ${prestamoData.value.codigo}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    // Actualizar estado
    prestamoData.value.estado = 'Activo';

    // Emitir evento
    emit('prestamo-updated', { ...prestamoData.value });

    // Notificar
    $q.notify({
      color: 'positive',
      message: `Préstamo ${prestamoData.value.codigo} aprobado correctamente`,
      icon: 'check_circle'
    });

    // Cerrar diálogo
    isOpen.value = false;
  });
};

const rechazarPrestamo = () => {
  $q.dialog({
    title: 'Confirmar rechazo',
    message: `¿Está seguro que desea rechazar el préstamo ${prestamoData.value.codigo}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    // Actualizar estado
    prestamoData.value.estado = 'Rechazado';

    // Emitir evento
    emit('prestamo-updated', { ...prestamoData.value });

    // Notificar
    $q.notify({
      color: 'negative',
      message: `Préstamo ${prestamoData.value.codigo} rechazado`,
      icon: 'cancel'
    });

    // Cerrar diálogo
    isOpen.value = false;
  });
};

const registrarDevolucion = () => {
  // Mostrar diálogo de devolución
  showDevolucionDialog.value = true;
};

const confirmarDevolucion = () => {
  // Actualizar estado del préstamo
  prestamoData.value.estado = 'Devuelto';
  prestamoData.value.fechaDevolucionReal = devolucionData.value.fecha;

  // Actualizar comentarios
  if (devolucionData.value.comentarios) {
    prestamoData.value.comentarios = (prestamoData.value.comentarios || '') +
      `\n\nComentarios de devolución (${devolucionData.value.fecha}):\n${devolucionData.value.comentarios}`;
  }

  // Actualizar estado de los ítems
  prestamoData.value.items.forEach((item, index) => {
    item.estado = 'Devuelto';
    item.estadoDevolucion = itemsDevolucionState.value[index];
  });

  // Emitir evento
  emit('prestamo-updated', { ...prestamoData.value });

  // Notificar
  $q.notify({
    color: 'positive',
    message: `Devolución del préstamo ${prestamoData.value.codigo} registrada correctamente`,
    icon: 'check_circle'
  });

  // Cerrar diálogos
  showDevolucionDialog.value = false;
  isOpen.value = false;
};
</script>
