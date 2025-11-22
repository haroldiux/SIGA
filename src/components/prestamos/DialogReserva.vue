<template>
  <BaseModal
    v-model="isOpen"
    title="Reservar Equipo"
    size="large"
  >
    <template #body>
      <q-form ref="formRef">
        <div class="row q-col-gutter-md">
          <!-- Selección de Equipo -->
          <div class="col-12">
            <q-select
              v-model="formData.equipo"
              :options="equiposDisponibles"
              label="Equipo *"
              outlined
              emit-value
              map-options
              :rules="[val => !!val || 'Selecciona un equipo']"
              @update:model-value="verificarDisponibilidad"
            >
              <template v-slot:prepend>
                <q-icon name="devices" />
              </template>
            </q-select>
          </div>

          <!-- Calendario de Disponibilidad -->
          <div v-if="formData.equipo" class="col-12">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 q-mb-md">Calendario de Disponibilidad</div>
                <q-date
                  v-model="formData.fechaReserva"
                  :events="diasReservados"
                  event-color="orange"
                  :options="optionsFn"
                  minimal
                  class="full-width"
                />
              </q-card-section>
            </q-card>
          </div>

          <!-- Fecha y Hora de Reserva -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.fechaReserva"
              label="Fecha de Reserva *"
              outlined
              type="date"
              :min="minDate"
              :rules="[val => !!val || 'Requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.horaReserva"
              label="Hora de Inicio *"
              outlined
              type="time"
              :rules="[val => !!val || 'Requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="schedule" />
              </template>
            </q-input>
          </div>

          <!-- Duración -->
          <div class="col-12 col-md-6">
            <q-input
              v-model.number="formData.duracionHoras"
              label="Duración (horas) *"
              outlined
              type="number"
              min="1"
              max="24"
              :rules="[
                val => !!val || 'Requerido',
                val => val > 0 && val <= 24 || 'Entre 1 y 24 horas'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="timer" />
              </template>
            </q-input>
          </div>

          <!-- Ubicación -->
          <div class="col-12 col-md-6">
            <q-select
              v-model="formData.ubicacion"
              :options="ubicaciones"
              label="Ubicación de Uso *"
              outlined
              emit-value
              map-options
              :rules="[val => !!val || 'Requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="place" />
              </template>
            </q-select>
          </div>

          <!-- Propósito -->
          <div class="col-12">
            <q-input
              v-model="formData.proposito"
              label="Propósito de la Reserva *"
              outlined
              type="textarea"
              rows="3"
              :rules="[val => !!val || 'Requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>
          </div>

          <!-- Notificación -->
          <div class="col-12">
            <q-checkbox
              v-model="formData.notificarRecordatorio"
              label="Enviar recordatorio 1 día antes"
            />
          </div>

          <!-- Estado de Disponibilidad -->
          <div v-if="estadoDisponibilidad" class="col-12">
            <q-banner
              :class="estadoDisponibilidad.disponible ? 'bg-positive text-white' : 'bg-negative text-white'"
              rounded
            >
              <template v-slot:avatar>
                <q-icon :name="estadoDisponibilidad.disponible ? 'check_circle' : 'error'" />
              </template>
              {{ estadoDisponibilidad.mensaje }}
            </q-banner>
          </div>
        </div>
      </q-form>

      <!-- Reservas Existentes -->
      <q-separator class="q-my-lg" />
      <div class="text-subtitle2 q-mb-md">Mis Reservas</div>
      <q-table
        :rows="reservasUsuario"
        :columns="columns"
        row-key="id"
        dense
        :rows-per-page-options="[5]"
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge
              :color="getEstadoColor(props.value)"
              :label="props.value"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.estado === 'Pendiente'"
              flat
              dense
              round
              icon="cancel"
              color="negative"
              size="sm"
              @click="cancelarReserva(props.row)"
            >
              <q-tooltip>Cancelar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.estado === 'Confirmada'"
              flat
              dense
              round
              icon="check"
              color="positive"
              size="sm"
              @click="convertirAPrestamo(props.row)"
            >
              <q-tooltip>Convertir a Préstamo</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </template>

    <template #actions>
      <q-btn flat label="Cancelar" color="grey-7" @click="closeDialog" />
      <q-btn
        unelevated
        label="Confirmar Reserva"
        color="primary"
        :disable="!estadoDisponibilidad?.disponible"
        @click="confirmarReserva"
      />
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import BaseModal from 'src/components/common/BaseModal.vue';

const props = defineProps({
  modelValue: Boolean,
  equipos: {
    type: Array,
    default: () => [],
  },
  reservasUsuario: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'reserva-confirmada', 'reserva-cancelada', 'convertir-prestamo']);

const $q = useQuasar();
const formRef = ref(null);
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const formData = ref({
  equipo: null,
  fechaReserva: '',
  horaReserva: '',
  duracionHoras: 2,
  ubicacion: null,
  proposito: '',
  notificarRecordatorio: true,
});

const estadoDisponibilidad = ref(null);
const diasReservados = ref([]);

const ubicaciones = [
  { label: 'Lab. Química', value: 'lab_quimica' },
  { label: 'Lab. Física', value: 'lab_fisica' },
  { label: 'Lab. Biología', value: 'lab_biologia' },
  { label: 'Sala de Conferencias', value: 'sala_conferencias' },
];

const equiposDisponibles = computed(() => {
  return props.equipos
    .filter(e => e.disponibleParaReserva)
    .map(e => ({
      label: `${e.codigo} - ${e.nombre}`,
      value: e.id,
    }));
});

const minDate = computed(() => new Date().toISOString().split('T')[0]);

const columns = [
  { name: 'equipo', label: 'Equipo', field: 'equipo', align: 'left' },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center' },
  { name: 'hora', label: 'Hora', field: 'hora', align: 'center' },
  { name: 'duracion', label: 'Duración', field: 'duracion', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
];

const verificarDisponibilidad = () => {
  // Simulación - En producción, verificar con el backend
  const disponible = Math.random() > 0.3;
  
  estadoDisponibilidad.value = {
    disponible,
    mensaje: disponible
      ? 'Equipo disponible para la fecha seleccionada'
      : 'Equipo no disponible. Selecciona otra fecha u horario.',
  };

  // Simular días reservados
  diasReservados.value = ['2025/11/25', '2025/11/28', '2025/12/01'];
};

const optionsFn = (date) => {
  // Deshabilitar fechas pasadas
  return date >= minDate.value;
};

const getEstadoColor = (estado) => {
  const colors = {
    'Pendiente': 'warning',
    'Confirmada': 'positive',
    'Cancelada': 'negative',
    'Completada': 'info',
  };
  return colors[estado] || 'grey';
};

const confirmarReserva = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;

  const reservaData = {
    ...formData.value,
    fecha: new Date().toISOString(),
    estado: 'Pendiente',
  };

  emit('reserva-confirmada', reservaData);

  $q.notify({
    type: 'positive',
    message: 'Reserva confirmada correctamente',
    icon: 'check_circle',
  });

  closeDialog();
};

const cancelarReserva = (reserva) => {
  $q.dialog({
    title: 'Cancelar Reserva',
    message: '¿Estás seguro de cancelar esta reserva?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    emit('reserva-cancelada', reserva);
    $q.notify({
      type: 'positive',
      message: 'Reserva cancelada',
    });
  });
};

const convertirAPrestamo = (reserva) => {
  emit('convertir-prestamo', reserva);
  $q.notify({
    type: 'info',
    message: 'Convirtiendo reserva a préstamo...',
  });
};

const closeDialog = () => {
  isOpen.value = false;
  formData.value = {
    equipo: null,
    fechaReserva: '',
    horaReserva: '',
    duracionHoras: 2,
    ubicacion: null,
    proposito: '',
    notificarRecordatorio: true,
  };
  estadoDisponibilidad.value = null;
};
</script>
