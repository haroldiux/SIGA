<template>
  <BaseModal
    v-model="isOpen"
    title="Renovar Préstamo"
    size="medium"
  >
    <template #body>
      <q-form ref="formRef">
        <!-- Info del préstamo actual -->
        <q-card flat bordered class="q-mb-md bg-grey-1">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Préstamo Actual</div>
            <div class="text-h6">{{ prestamo?.codigo }}</div>
            <div class="text-body2 q-mt-xs">
              <strong>Item:</strong> {{ prestamo?.item }}<br>
              <strong>Fecha de devolución actual:</strong> {{ prestamo?.fechaDevolucion }}
            </div>
          </q-card-section>
        </q-card>

        <!-- Nueva fecha de devolución -->
        <q-input
          v-model="formData.nuevaFechaDevolucion"
          label="Nueva Fecha de Devolución *"
          outlined
          type="date"
          :min="minDate"
          :rules="[val => !!val || 'Selecciona una fecha']"
        >
          <template v-slot:prepend>
            <q-icon name="event" />
          </template>
        </q-input>

        <!-- Justificación -->
        <q-input
          v-model="formData.justificacion"
          label="Justificación *"
          outlined
          type="textarea"
          rows="3"
          class="q-mt-md"
          :rules="[val => !!val || 'La justificación es obligatoria']"
        >
          <template v-slot:prepend>
            <q-icon name="description" />
          </template>
        </q-input>

        <!-- Alerta de renovaciones -->
        <q-banner v-if="renovacionesCount >= 2" class="bg-warning text-white q-mt-md" rounded>
          <template v-slot:avatar>
            <q-icon name="warning" />
          </template>
          Este préstamo ya ha sido renovado {{ renovacionesCount }} veces.
        </q-banner>
      </q-form>
    </template>

    <template #actions>
      <q-btn flat label="Cancelar" color="grey-7" @click="closeDialog" />
      <q-btn unelevated label="Renovar" color="primary" @click="onSubmit" />
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import BaseModal from 'src/components/common/BaseModal.vue';

const props = defineProps({
  modelValue: Boolean,
  prestamo: Object,
});

const emit = defineEmits(['update:modelValue', 'renovacion-registrada']);

const $q = useQuasar();
const formRef = ref(null);
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const formData = ref({
  nuevaFechaDevolucion: '',
  justificacion: '',
});

const renovacionesCount = computed(() => props.prestamo?.renovaciones?.length || 0);
const minDate = computed(() => new Date().toISOString().split('T')[0]);

const onSubmit = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;

  const renovacionData = {
    prestamoId: props.prestamo.id,
    fechaDevolucionAnterior: props.prestamo.fechaDevolucion,
    nuevaFechaDevolucion: formData.value.nuevaFechaDevolucion,
    justificacion: formData.value.justificacion,
    fecha: new Date().toISOString(),
  };

  emit('renovacion-registrada', renovacionData);

  $q.notify({
    type: 'positive',
    message: 'Préstamo renovado correctamente',
    icon: 'check_circle',
  });

  closeDialog();
};

const closeDialog = () => {
  isOpen.value = false;
  formData.value = {
    nuevaFechaDevolucion: '',
    justificacion: '',
  };
};
</script>
