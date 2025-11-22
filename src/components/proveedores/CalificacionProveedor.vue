<template>
  <BaseModal
    v-model="isOpen"
    title="Calificar Proveedor"
    size="medium"
  >
    <template #body>
      <q-form ref="formRef">
        <!-- Info del proveedor -->
        <q-card flat bordered class="q-mb-md bg-grey-1">
          <q-card-section>
            <div class="text-h6">{{ proveedor?.nombre }}</div>
            <div v-if="promedioActual" class="text-body2 q-mt-xs">
              <q-rating
                :model-value="promedioActual"
                size="sm"
                color="warning"
                readonly
              />
              <span class="q-ml-sm text-grey-7">{{ promedioActual.toFixed(1) }} / 5.0</span>
            </div>
          </q-card-section>
        </q-card>

        <!-- Criterios de calificación -->
        <div class="q-gutter-md">
          <div>
            <div class="text-subtitle2 q-mb-sm">Calidad de Productos</div>
            <q-rating
              v-model="formData.calidad"
              size="md"
              color="warning"
              :max="5"
            />
          </div>

          <div>
            <div class="text-subtitle2 q-mb-sm">Precio</div>
            <q-rating
              v-model="formData.precio"
              size="md"
              color="warning"
              :max="5"
            />
          </div>

          <div>
            <div class="text-subtitle2 q-mb-sm">Tiempo de Entrega</div>
            <q-rating
              v-model="formData.tiempoEntrega"
              size="md"
              color="warning"
              :max="5"
            />
          </div>

          <div>
            <div class="text-subtitle2 q-mb-sm">Servicio al Cliente</div>
            <q-rating
              v-model="formData.servicio"
              size="md"
              color="warning"
              :max="5"
            />
          </div>
        </div>

        <!-- Promedio calculado -->
        <q-card flat bordered class="q-mt-md bg-primary text-white">
          <q-card-section class="text-center">
            <div class="text-subtitle2">Calificación General</div>
            <div class="text-h4 text-weight-bold">{{ promedioCalificacion.toFixed(1) }}</div>
            <q-rating
              :model-value="promedioCalificacion"
              size="md"
              color="white"
              readonly
            />
          </q-card-section>
        </q-card>

        <!-- Comentarios -->
        <q-input
          v-model="formData.comentarios"
          label="Comentarios (opcional)"
          outlined
          type="textarea"
          rows="3"
          class="q-mt-md"
        >
          <template v-slot:prepend>
            <q-icon name="comment" />
          </template>
        </q-input>
      </q-form>
    </template>

    <template #actions>
      <q-btn flat label="Cancelar" color="grey-7" @click="closeDialog" />
      <q-btn unelevated label="Guardar Calificación" color="primary" @click="onSubmit" />
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import BaseModal from 'src/components/common/BaseModal.vue';

const props = defineProps({
  modelValue: Boolean,
  proveedor: Object,
});

const emit = defineEmits(['update:modelValue', 'calificacion-guardada']);

const $q = useQuasar();
const formRef = ref(null);
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const formData = ref({
  calidad: 0,
  precio: 0,
  tiempoEntrega: 0,
  servicio: 0,
  comentarios: '',
});

const promedioActual = computed(() => props.proveedor?.calificacionPromedio || 0);

const promedioCalificacion = computed(() => {
  const { calidad, precio, tiempoEntrega, servicio } = formData.value;
  const suma = calidad + precio + tiempoEntrega + servicio;
  return suma > 0 ? suma / 4 : 0;
});

const onSubmit = async () => {
  if (promedioCalificacion.value === 0) {
    $q.notify({
      type: 'warning',
      message: 'Por favor califica al menos un criterio',
    });
    return;
  }

  const calificacionData = {
    proveedorId: props.proveedor.id,
    calidad: formData.value.calidad,
    precio: formData.value.precio,
    tiempoEntrega: formData.value.tiempoEntrega,
    servicio: formData.value.servicio,
    promedio: promedioCalificacion.value,
    comentarios: formData.value.comentarios,
    fecha: new Date().toISOString(),
  };

  emit('calificacion-guardada', calificacionData);

  $q.notify({
    type: 'positive',
    message: 'Calificación guardada correctamente',
    icon: 'star',
  });

  closeDialog();
};

const closeDialog = () => {
  isOpen.value = false;
  formData.value = {
    calidad: 0,
    precio: 0,
    tiempoEntrega: 0,
    servicio: 0,
    comentarios: '',
  };
};
</script>
