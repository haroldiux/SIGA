<template>
  <BaseModal
    v-model="isOpen"
    title="Gestión de Contratos"
    size="large"
  >
    <template #body>
      <q-form ref="formRef">
        <div class="row q-col-gutter-md">
          <!-- Número de Contrato -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.numeroContrato"
              label="Número de Contrato *"
              outlined
              :rules="[val => !!val || 'Requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>
          </div>

          <!-- Tipo de Contrato -->
          <div class="col-12 col-md-6">
            <q-select
              v-model="formData.tipoContrato"
              :options="tiposContrato"
              label="Tipo de Contrato *"
              outlined
              emit-value
              map-options
              :rules="[val => !!val || 'Requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="category" />
              </template>
            </q-select>
          </div>

          <!-- Fecha Inicio -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.fechaInicio"
              label="Fecha de Inicio *"
              outlined
              type="date"
              :rules="[val => !!val || 'Requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-input>
          </div>

          <!-- Fecha Fin -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.fechaFin"
              label="Fecha de Fin *"
              outlined
              type="date"
              :rules="[
                val => !!val || 'Requerido',
                val => val > formData.fechaInicio || 'Debe ser posterior a la fecha de inicio'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-input>
          </div>

          <!-- Monto del Contrato -->
          <div class="col-12 col-md-6">
            <q-input
              v-model.number="formData.monto"
              label="Monto del Contrato (Bs.)"
              outlined
              type="number"
              step="0.01"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>

          <!-- Moneda -->
          <div class="col-12 col-md-6">
            <q-select
              v-model="formData.moneda"
              :options="monedas"
              label="Moneda"
              outlined
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="currency_exchange" />
              </template>
            </q-select>
          </div>

          <!-- Condiciones Comerciales -->
          <div class="col-12">
            <q-input
              v-model="formData.condicionesComerciales"
              label="Condiciones Comerciales"
              outlined
              type="textarea"
              rows="3"
            >
              <template v-slot:prepend>
                <q-icon name="article" />
              </template>
            </q-input>
          </div>

          <!-- Términos de Pago -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.terminosPago"
              label="Términos de Pago"
              outlined
              placeholder="Ej: 30 días"
            >
              <template v-slot:prepend>
                <q-icon name="payment" />
              </template>
            </q-input>
          </div>

          <!-- Tiempo de Entrega -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.tiempoEntrega"
              label="Tiempo de Entrega"
              outlined
              placeholder="Ej: 15 días"
            >
              <template v-slot:prepend>
                <q-icon name="local_shipping" />
              </template>
            </q-input>
          </div>

          <!-- Documentos Adjuntos -->
          <div class="col-12">
            <FileUploader
              v-model="formData.documentos"
              label="Documentos del Contrato"
              accept=".pdf,.doc,.docx"
              :max-file-size="10485760"
            />
          </div>

          <!-- Alerta de Vencimiento -->
          <div class="col-12">
            <q-checkbox
              v-model="formData.alertaVencimiento"
              label="Activar alerta de vencimiento (30 días antes)"
            />
          </div>

          <!-- Estado del Contrato -->
          <div v-if="diasParaVencer !== null" class="col-12">
            <q-banner
              :class="getBannerClass()"
              rounded
            >
              <template v-slot:avatar>
                <q-icon :name="getBannerIcon()" />
              </template>
              {{ getMensajeVencimiento() }}
            </q-banner>
          </div>
        </div>
      </q-form>

      <!-- Lista de contratos existentes -->
      <q-separator class="q-my-lg" />
      <div class="text-subtitle2 q-mb-md">Contratos Registrados</div>
      <q-table
        :rows="contratos"
        :columns="columns"
        row-key="numeroContrato"
        dense
        :rows-per-page-options="[5]"
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge
              :color="getEstadoColor(props.row)"
              :label="getEstadoContrato(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              round
              icon="visibility"
              color="primary"
              size="sm"
              @click="verContrato(props.row)"
            >
              <q-tooltip>Ver Detalle</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </template>

    <template #actions>
      <q-btn flat label="Cancelar" color="grey-7" @click="closeDialog" />
      <q-btn unelevated label="Guardar Contrato" color="primary" @click="guardarContrato" />
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import BaseModal from 'src/components/common/BaseModal.vue';
import FileUploader from 'src/components/common/FileUploader.vue';

const props = defineProps({
  modelValue: Boolean,
  proveedor: Object,
  contratos: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'contrato-guardado']);

const $q = useQuasar();
const formRef = ref(null);
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const formData = ref({
  numeroContrato: '',
  tipoContrato: '',
  fechaInicio: '',
  fechaFin: '',
  monto: null,
  moneda: 'BOB',
  condicionesComerciales: '',
  terminosPago: '',
  tiempoEntrega: '',
  documentos: [],
  alertaVencimiento: true,
});

const tiposContrato = [
  { label: 'Suministro', value: 'suministro' },
  { label: 'Servicio', value: 'servicio' },
  { label: 'Marco', value: 'marco' },
  { label: 'Exclusividad', value: 'exclusividad' },
];

const monedas = [
  { label: 'Bolivianos (BOB)', value: 'BOB' },
  { label: 'Dólares (USD)', value: 'USD' },
];

const columns = [
  { name: 'numeroContrato', label: 'Nº Contrato', field: 'numeroContrato', align: 'left' },
  { name: 'tipoContrato', label: 'Tipo', field: 'tipoContrato', align: 'left' },
  { name: 'fechaInicio', label: 'Inicio', field: 'fechaInicio', align: 'center' },
  { name: 'fechaFin', label: 'Fin', field: 'fechaFin', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
];

const diasParaVencer = computed(() => {
  if (!formData.value.fechaFin) return null;
  const hoy = new Date();
  const fin = new Date(formData.value.fechaFin);
  return Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
});

const getBannerClass = () => {
  if (diasParaVencer.value < 0) return 'bg-negative text-white';
  if (diasParaVencer.value <= 30) return 'bg-warning text-white';
  return 'bg-positive text-white';
};

const getBannerIcon = () => {
  if (diasParaVencer.value < 0) return 'error';
  if (diasParaVencer.value <= 30) return 'warning';
  return 'check_circle';
};

const getMensajeVencimiento = () => {
  if (diasParaVencer.value < 0) return 'Contrato vencido';
  if (diasParaVencer.value <= 30) return `Contrato por vencer en ${diasParaVencer.value} días`;
  return `Contrato vigente (${diasParaVencer.value} días restantes)`;
};

const getEstadoContrato = (contrato) => {
  const hoy = new Date();
  const fin = new Date(contrato.fechaFin);
  const dias = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));

  if (dias < 0) return 'Vencido';
  if (dias <= 30) return 'Por Vencer';
  return 'Vigente';
};

const getEstadoColor = (contrato) => {
  const estado = getEstadoContrato(contrato);
  if (estado === 'Vencido') return 'negative';
  if (estado === 'Por Vencer') return 'warning';
  return 'positive';
};

const verContrato = (contrato) => {
  $q.dialog({
    title: `Contrato ${contrato.numeroContrato}`,
    message: `
      Tipo: ${contrato.tipoContrato}
      Vigencia: ${contrato.fechaInicio} - ${contrato.fechaFin}
      Monto: ${contrato.monto ? `Bs. ${contrato.monto}` : 'N/A'}
      Términos de pago: ${contrato.terminosPago || 'N/A'}
    `,
  });
};

const guardarContrato = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;

  const contratoData = {
    ...formData.value,
    proveedorId: props.proveedor?.id,
    fechaCreacion: new Date().toISOString(),
  };

  emit('contrato-guardado', contratoData);

  $q.notify({
    type: 'positive',
    message: 'Contrato guardado correctamente',
    icon: 'check_circle',
  });

  closeDialog();
};

const closeDialog = () => {
  isOpen.value = false;
  formData.value = {
    numeroContrato: '',
    tipoContrato: '',
    fechaInicio: '',
    fechaFin: '',
    monto: null,
    moneda: 'BOB',
    condicionesComerciales: '',
    terminosPago: '',
    tiempoEntrega: '',
    documentos: [],
    alertaVencimiento: true,
  };
};
</script>
