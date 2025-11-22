<template>
  <BaseModal
    v-model="isOpen"
    title="Gestión de Lotes y Series"
    size="large"
  >
    <template #body>
      <q-tabs v-model="activeTab" dense class="q-mb-md">
        <q-tab name="lotes" label="Lotes" />
        <q-tab name="series" label="Números de Serie" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <!-- Panel de Lotes -->
        <q-tab-panel name="lotes">
          <q-form ref="loteFormRef">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="loteData.numeroLote"
                  label="Número de Lote *"
                  outlined
                  :rules="[val => !!val || 'Requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="qr_code" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="loteData.cantidad"
                  label="Cantidad *"
                  outlined
                  type="number"
                  :rules="[val => val > 0 || 'Debe ser mayor a 0']"
                >
                  <template v-slot:prepend>
                    <q-icon name="inventory" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="loteData.fechaFabricacion"
                  label="Fecha de Fabricación"
                  outlined
                  type="date"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="loteData.fechaVencimiento"
                  label="Fecha de Vencimiento *"
                  outlined
                  type="date"
                  :rules="[val => !!val || 'Requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" />
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <q-input
                  v-model="loteData.observaciones"
                  label="Observaciones"
                  outlined
                  type="textarea"
                  rows="2"
                />
              </div>

              <div class="col-12">
                <q-btn unelevated color="primary" label="Agregar Lote" @click="agregarLote" />
              </div>
            </div>
          </q-form>

          <!-- Lista de lotes -->
          <q-separator class="q-my-md" />
          <div class="text-subtitle2 q-mb-sm">Lotes Registrados</div>
          <q-table
            :rows="lotes"
            :columns="lotesColumns"
            row-key="numeroLote"
            dense
            :rows-per-page-options="[5]"
          >
            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-badge :color="getEstadoLoteColor(props.row)" :label="getEstadoLote(props.row)" />
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat dense round icon="delete" color="negative" size="sm" @click="eliminarLote(props.row)" />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Panel de Series -->
        <q-tab-panel name="series">
          <q-form ref="serieFormRef">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-8">
                <q-input
                  v-model="serieData.numeroSerie"
                  label="Número de Serie *"
                  outlined
                  :rules="[val => !!val || 'Requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="tag" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  v-model="serieData.estado"
                  :options="estadosSerieOptions"
                  label="Estado *"
                  outlined
                  emit-value
                  map-options
                >
                  <template v-slot:prepend>
                    <q-icon name="info" />
                  </template>
                </q-select>
              </div>

              <div class="col-12">
                <q-input
                  v-model="serieData.observaciones"
                  label="Observaciones"
                  outlined
                  type="textarea"
                  rows="2"
                />
              </div>

              <div class="col-12">
                <q-btn unelevated color="primary" label="Agregar Serie" @click="agregarSerie" />
              </div>
            </div>
          </q-form>

          <!-- Lista de series -->
          <q-separator class="q-my-md" />
          <div class="text-subtitle2 q-mb-sm">Series Registradas</div>
          <q-table
            :rows="series"
            :columns="seriesColumns"
            row-key="numeroSerie"
            dense
            :rows-per-page-options="[5]"
          >
            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-badge :color="getEstadoSerieColor(props.value)" :label="props.value" />
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat dense round icon="delete" color="negative" size="sm" @click="eliminarSerie(props.row)" />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </template>

    <template #actions>
      <q-btn flat label="Cerrar" color="grey-7" @click="closeDialog" />
      <q-btn unelevated label="Guardar Todo" color="primary" @click="guardarTodo" />
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import BaseModal from 'src/components/common/BaseModal.vue';

const props = defineProps({
  modelValue: Boolean,
  item: Object,
});

const emit = defineEmits(['update:modelValue', 'lotes-series-guardados']);

const $q = useQuasar();
const activeTab = ref('lotes');
const loteFormRef = ref(null);
const serieFormRef = ref(null);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const loteData = ref({
  numeroLote: '',
  cantidad: null,
  fechaFabricacion: '',
  fechaVencimiento: '',
  observaciones: '',
});

const serieData = ref({
  numeroSerie: '',
  estado: 'disponible',
  observaciones: '',
});

const lotes = ref([]);
const series = ref([]);

const estadosSerieOptions = [
  { label: 'Disponible', value: 'disponible' },
  { label: 'En Uso', value: 'en_uso' },
  { label: 'Mantenimiento', value: 'mantenimiento' },
  { label: 'Baja', value: 'baja' },
];

const lotesColumns = [
  { name: 'numeroLote', label: 'Nº Lote', field: 'numeroLote', align: 'left' },
  { name: 'cantidad', label: 'Cantidad', field: 'cantidad', align: 'center' },
  { name: 'fechaVencimiento', label: 'Vencimiento', field: 'fechaVencimiento', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
];

const seriesColumns = [
  { name: 'numeroSerie', label: 'Nº Serie', field: 'numeroSerie', align: 'left' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'observaciones', label: 'Observaciones', field: 'observaciones', align: 'left' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
];

const agregarLote = async () => {
  const valid = await loteFormRef.value.validate();
  if (!valid) return;

  lotes.value.push({ ...loteData.value });
  
  loteData.value = {
    numeroLote: '',
    cantidad: null,
    fechaFabricacion: '',
    fechaVencimiento: '',
    observaciones: '',
  };

  loteFormRef.value.resetValidation();
};

const agregarSerie = async () => {
  const valid = await serieFormRef.value.validate();
  if (!valid) return;

  series.value.push({ ...serieData.value });
  
  serieData.value = {
    numeroSerie: '',
    estado: 'disponible',
    observaciones: '',
  };

  serieFormRef.value.resetValidation();
};

const eliminarLote = (lote) => {
  const index = lotes.value.findIndex(l => l.numeroLote === lote.numeroLote);
  if (index > -1) {
    lotes.value.splice(index, 1);
  }
};

const eliminarSerie = (serie) => {
  const index = series.value.findIndex(s => s.numeroSerie === serie.numeroSerie);
  if (index > -1) {
    series.value.splice(index, 1);
  }
};

const getEstadoLote = (lote) => {
  const hoy = new Date();
  const vencimiento = new Date(lote.fechaVencimiento);
  const diasParaVencer = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));

  if (diasParaVencer < 0) return 'Vencido';
  if (diasParaVencer <= 30) return 'Por Vencer';
  return 'Vigente';
};

const getEstadoLoteColor = (lote) => {
  const estado = getEstadoLote(lote);
  if (estado === 'Vencido') return 'negative';
  if (estado === 'Por Vencer') return 'warning';
  return 'positive';
};

const getEstadoSerieColor = (estado) => {
  const colors = {
    disponible: 'positive',
    en_uso: 'info',
    mantenimiento: 'warning',
    baja: 'negative',
  };
  return colors[estado] || 'grey';
};

const guardarTodo = () => {
  if (lotes.value.length === 0 && series.value.length === 0) {
    $q.notify({
      type: 'warning',
      message: 'Agrega al menos un lote o serie',
    });
    return;
  }

  const data = {
    itemId: props.item?.id,
    lotes: lotes.value,
    series: series.value,
  };

  emit('lotes-series-guardados', data);

  $q.notify({
    type: 'positive',
    message: 'Lotes y series guardados correctamente',
    icon: 'check_circle',
  });

  closeDialog();
};

const closeDialog = () => {
  isOpen.value = false;
  lotes.value = [];
  series.value = [];
};
</script>
