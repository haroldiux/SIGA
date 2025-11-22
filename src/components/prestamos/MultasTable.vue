<template>
  <BaseModal
    v-model="isOpen"
    title="Gestión de Multas"
    size="large"
  >
    <template #body>
      <!-- Resumen de multas -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-md-4">
          <q-card flat bordered class="bg-red-1">
            <q-card-section>
              <div class="text-caption text-grey-7">Total Multas</div>
              <div class="text-h5 text-negative">Bs. {{ totalMultas.toFixed(2) }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card flat bordered class="bg-orange-1">
            <q-card-section>
              <div class="text-caption text-grey-7">Pendientes</div>
              <div class="text-h5 text-warning">{{ multasPendientes }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card flat bordered class="bg-green-1">
            <q-card-section>
              <div class="text-caption text-grey-7">Pagadas</div>
              <div class="text-h5 text-positive">{{ multasPagadas }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Configuración de multas -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle2 q-mb-md">Configuración de Tarifas</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="config.multaPorDia"
                label="Multa por Día de Retraso (Bs.)"
                outlined
                dense
                type="number"
                step="0.01"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_money" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="config.multaMaxima"
                label="Multa Máxima (Bs.)"
                outlined
                dense
                type="number"
                step="0.01"
              >
                <template v-slot:prepend>
                  <q-icon name="money_off" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Tabla de multas -->
      <q-table
        :rows="multas"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[10]"
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge
              :color="getEstadoColor(props.value)"
              :label="props.value"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-monto="props">
          <q-td :props="props">
            <span class="text-weight-bold text-negative">
              Bs. {{ props.value.toFixed(2) }}
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row q-gutter-xs">
              <q-btn
                v-if="props.row.estado === 'Pendiente'"
                flat
                dense
                round
                icon="payment"
                color="positive"
                size="sm"
                @click="pagarMulta(props.row)"
              >
                <q-tooltip>Registrar Pago</q-tooltip>
              </q-btn>
              <q-btn
                v-if="props.row.estado === 'Pendiente'"
                flat
                dense
                round
                icon="cancel"
                color="warning"
                size="sm"
                @click="condonarMulta(props.row)"
              >
                <q-tooltip>Condonar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="visibility"
                color="primary"
                size="sm"
                @click="verDetalle(props.row)"
              >
                <q-tooltip>Ver Detalle</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </template>

    <template #actions>
      <q-btn flat label="Cerrar" color="grey-7" @click="closeDialog" />
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import BaseModal from 'src/components/common/BaseModal.vue';

const props = defineProps({
  modelValue: Boolean,
  multas: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'multa-pagada', 'multa-condonada']);

const $q = useQuasar();
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const config = ref({
  multaPorDia: 5.00,
  multaMaxima: 100.00,
});

const columns = [
  { name: 'prestamo', label: 'Préstamo', field: 'prestamo', align: 'left' },
  { name: 'diasRetraso', label: 'Días Retraso', field: 'diasRetraso', align: 'center' },
  { name: 'monto', label: 'Monto', field: 'monto', align: 'right' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'fechaGeneracion', label: 'Fecha', field: 'fechaGeneracion', align: 'center' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
];

const totalMultas = computed(() => {
  return props.multas.reduce((sum, multa) => sum + multa.monto, 0);
});

const multasPendientes = computed(() => {
  return props.multas.filter(m => m.estado === 'Pendiente').length;
});

const multasPagadas = computed(() => {
  return props.multas.filter(m => m.estado === 'Pagada').length;
});

const getEstadoColor = (estado) => {
  const colors = {
    'Pendiente': 'warning',
    'Pagada': 'positive',
    'Condonada': 'info',
  };
  return colors[estado] || 'grey';
};

const pagarMulta = (multa) => {
  $q.dialog({
    title: 'Confirmar Pago',
    message: `¿Confirmar pago de multa por Bs. ${multa.monto.toFixed(2)}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    emit('multa-pagada', multa);
    $q.notify({
      type: 'positive',
      message: 'Pago registrado correctamente',
      icon: 'check_circle',
    });
  });
};

const condonarMulta = (multa) => {
  $q.dialog({
    title: 'Condonar Multa',
    message: '¿Estás seguro de condonar esta multa?',
    prompt: {
      model: '',
      type: 'text',
      label: 'Motivo de condonación',
      rules: [val => !!val || 'El motivo es obligatorio'],
    },
    cancel: true,
    persistent: true,
  }).onOk((motivo) => {
    emit('multa-condonada', { multa, motivo });
    $q.notify({
      type: 'positive',
      message: 'Multa condonada',
      icon: 'check_circle',
    });
  });
};

const verDetalle = (multa) => {
  $q.dialog({
    title: 'Detalle de Multa',
    message: `
      Préstamo: ${multa.prestamo}
      Días de retraso: ${multa.diasRetraso}
      Monto: Bs. ${multa.monto.toFixed(2)}
      Estado: ${multa.estado}
      Fecha de generación: ${multa.fechaGeneracion}
    `,
  });
};

const closeDialog = () => {
  isOpen.value = false;
};
</script>
