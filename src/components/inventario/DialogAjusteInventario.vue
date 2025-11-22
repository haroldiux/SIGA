<template>
  <BaseModal
    v-model="isOpen"
    title="Ajuste de Inventario"
    size="large"
    @before-show="onBeforeShow"
  >
    <template #body>
      <q-form ref="formRef" @submit="onSubmit">
        <div class="row q-col-gutter-md">
          <!-- Selección de Item -->
          <div class="col-12">
            <q-select
              v-model="formData.item"
              :options="itemsOptions"
              label="Item *"
              outlined
              emit-value
              map-options
              :rules="[val => !!val || 'Selecciona un item']"
            >
              <template v-slot:prepend>
                <q-icon name="inventory_2" />
              </template>
            </q-select>
          </div>

          <!-- Ubicación -->
          <div class="col-12 col-md-6">
            <q-select
              v-model="formData.ubicacion"
              :options="ubicacionesOptions"
              label="Ubicación *"
              outlined
              emit-value
              map-options
              :rules="[val => !!val || 'Selecciona una ubicación']"
            >
              <template v-slot:prepend>
                <q-icon name="place" />
              </template>
            </q-select>
          </div>

          <!-- Tipo de Ajuste -->
          <div class="col-12 col-md-6">
            <q-select
              v-model="formData.tipoAjuste"
              :options="tiposAjuste"
              label="Tipo de Ajuste *"
              outlined
              emit-value
              map-options
              :rules="[val => !!val || 'Selecciona el tipo de ajuste']"
            >
              <template v-slot:prepend>
                <q-icon name="tune" />
              </template>
            </q-select>
          </div>

          <!-- Cantidad Actual -->
          <div class="col-12 col-md-4">
            <q-input
              :model-value="cantidadActual"
              label="Cantidad Actual"
              outlined
              readonly
              type="number"
            >
              <template v-slot:prepend>
                <q-icon name="inventory" />
              </template>
            </q-input>
          </div>

          <!-- Nueva Cantidad -->
          <div class="col-12 col-md-4">
            <q-input
              v-model.number="formData.nuevaCantidad"
              label="Nueva Cantidad *"
              outlined
              type="number"
              :rules="[
                val => val !== null && val !== '' || 'Ingresa la nueva cantidad',
                val => val >= 0 || 'La cantidad no puede ser negativa'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="edit" />
              </template>
            </q-input>
          </div>

          <!-- Diferencia -->
          <div class="col-12 col-md-4">
            <q-input
              :model-value="diferencia"
              label="Diferencia"
              outlined
              readonly
              :class="diferencia > 0 ? 'text-positive' : diferencia < 0 ? 'text-negative' : ''"
            >
              <template v-slot:prepend>
                <q-icon :name="diferencia > 0 ? 'add' : diferencia < 0 ? 'remove' : 'remove'" />
              </template>
            </q-input>
          </div>

          <!-- Justificación -->
          <div class="col-12">
            <q-input
              v-model="formData.justificacion"
              label="Justificación *"
              outlined
              type="textarea"
              rows="3"
              :rules="[val => !!val || 'La justificación es obligatoria']"
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>
          </div>

          <!-- Alerta si el ajuste es grande -->
          <div v-if="Math.abs(diferencia) > 10" class="col-12">
            <q-banner class="bg-warning text-white" rounded>
              <template v-slot:avatar>
                <q-icon name="warning" />
              </template>
              Este ajuste es significativo y requerirá aprobación adicional.
            </q-banner>
          </div>
        </div>
      </q-form>
    </template>

    <template #actions>
      <q-btn flat label="Cancelar" color="grey-7" @click="closeDialog" />
      <q-btn unelevated label="Registrar Ajuste" color="primary" @click="onSubmit" />
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import BaseModal from 'src/components/common/BaseModal.vue';

const props = defineProps({
  modelValue: Boolean,
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'ajuste-registrado']);

const $q = useQuasar();
const formRef = ref(null);
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const formData = ref({
  item: null,
  ubicacion: null,
  tipoAjuste: null,
  nuevaCantidad: null,
  justificacion: '',
});

const cantidadActual = ref(0);

const tiposAjuste = [
  { label: 'Corrección', value: 'correccion' },
  { label: 'Merma', value: 'merma' },
  { label: 'Daño', value: 'dano' },
  { label: 'Vencimiento', value: 'vencimiento' },
  { label: 'Otro', value: 'otro' },
];

const ubicacionesOptions = [
  { label: 'Almacén Central', value: 'almacen_central' },
  { label: 'Lab. Química', value: 'lab_quimica' },
  { label: 'Lab. Física', value: 'lab_fisica' },
  { label: 'Lab. Biología', value: 'lab_biologia' },
];

const itemsOptions = computed(() => {
  return props.items.map(item => ({
    label: `${item.codigo} - ${item.nombre}`,
    value: item.id,
    cantidad: item.cantidad || 0,
  }));
});

const diferencia = computed(() => {
  if (formData.value.nuevaCantidad === null) return 0;
  return formData.value.nuevaCantidad - cantidadActual.value;
});

// Watch item selection to update current quantity
watch(() => formData.value.item, (newItemId) => {
  if (newItemId) {
    const item = props.items.find(i => i.id === newItemId);
    cantidadActual.value = item?.cantidad || 0;
  }
});

const onBeforeShow = () => {
  resetForm();
};

const resetForm = () => {
  formData.value = {
    item: null,
    ubicacion: null,
    tipoAjuste: null,
    nuevaCantidad: null,
    justificacion: '',
  };
  cantidadActual.value = 0;
};

const onSubmit = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;

  const ajusteData = {
    ...formData.value,
    cantidadAnterior: cantidadActual.value,
    diferencia: diferencia.value,
    fecha: new Date().toISOString(),
    usuario: 'Usuario Actual', // Obtener del store
    requiereAprobacion: Math.abs(diferencia.value) > 10,
  };

  emit('ajuste-registrado', ajusteData);

  $q.notify({
    type: 'positive',
    message: 'Ajuste de inventario registrado correctamente',
    icon: 'check_circle',
  });

  closeDialog();
};

const closeDialog = () => {
  isOpen.value = false;
};
</script>
