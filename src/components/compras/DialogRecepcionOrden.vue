<!-- src/components/compras/DialogRecepcionOrden.vue -->
<template>
  <BaseModal
    v-model="isOpen"
    title="Registrar Recepción de Mercancía"
    size="lg"
    confirm-label="Confirmar Recepción"
    :loading="loading"
    @confirm="confirmarRecepcion"
    @cancel="handleCancel"
  >
    <div class="text-subtitle2 text-grey-7 q-mb-md">
      <strong>Orden:</strong> {{ orden?.codigo }} - {{ orden?.proveedor }}
    </div>

    <q-banner v-if="orden" class="bg-blue-1 q-mb-md" rounded>
      <template v-slot:avatar>
        <q-icon name="info" color="primary" />
      </template>
      Verifique las cantidades recibidas. Puede recibir parcialmente si no llegó todo el pedido.
    </q-banner>

    <!-- Lista de items a recibir -->
    <div class="text-subtitle1 text-weight-medium q-mb-sm">Items de la Orden</div>
    <q-list bordered separator class="rounded-borders q-mb-md">
      <q-item v-for="(item, index) in formData.items" :key="index" class="q-py-md">
        <q-item-section>
          <q-item-label class="text-weight-medium">{{ item.nombre }}</q-item-label>
          <q-item-label caption>
            <q-icon name="shopping_cart" size="xs" class="q-mr-xs" />
            Cantidad ordenada: {{ item.cantidad }} {{ item.unidadMedida }}
          </q-item-label>
          <q-item-label caption class="q-mt-xs">
            <q-icon name="attach_money" size="xs" class="q-mr-xs" />
            Precio unitario: Bs. {{ item.precioNeto?.toFixed(2) }}
          </q-item-label>
        </q-item-section>
        
        <q-item-section side style="min-width: 180px">
          <q-input
            v-model.number="item.cantidadRecibida"
            type="number"
            label="Cantidad Recibida *"
            outlined
            dense
            :max="item.cantidad"
            :min="0"
            :rules="[
              val => val !== null && val !== '' || 'Requerido',
              val => val >= 0 || 'Debe ser positivo',
              val => val <= item.cantidad || `Máximo ${item.cantidad}`
            ]"
          >
            <template v-slot:append>
              <q-icon 
                v-if="item.cantidadRecibida === item.cantidad" 
                name="check_circle" 
                color="positive" 
              />
              <q-icon 
                v-else-if="item.cantidadRecibida > 0 && item.cantidadRecibida < item.cantidad" 
                name="warning" 
                color="warning" 
              />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Ubicación de destino -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12">
        <q-select
          v-model="formData.ubicacionDestino"
          :options="ubicacionOptions"
          label="Ubicación de Almacenamiento *"
          outlined
          emit-value
          map-options
          :rules="[val => !!val || 'La ubicación es obligatoria']"
        >
          <template v-slot:prepend>
            <q-icon name="warehouse" />
          </template>
        </q-select>
      </div>
    </div>

    <!-- Observaciones -->
    <q-input
      v-model="formData.observaciones"
      type="textarea"
      label="Observaciones"
      outlined
      rows="3"
      placeholder="Ej: Algunos productos llegaron con embalaje dañado..."
    />

    <!-- Resumen -->
    <q-card flat bordered class="q-mt-md bg-grey-1">
      <q-card-section>
        <div class="text-subtitle2 text-weight-medium q-mb-sm">Resumen de Recepción</div>
        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <div class="text-caption text-grey-7">Total Items:</div>
            <div class="text-body1">{{ formData.items.length }}</div>
          </div>
          <div class="col-6">
            <div class="text-caption text-grey-7">Items Completos:</div>
            <div class="text-body1">{{ itemsCompletos }}</div>
          </div>
          <div class="col-6">
            <div class="text-caption text-grey-7">Items Parciales:</div>
            <div class="text-body1 text-warning">{{ itemsParciales }}</div>
          </div>
          <div class="col-6">
            <div class="text-caption text-grey-7">Items Pendientes:</div>
            <div class="text-body1 text-negative">{{ itemsPendientes }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch, defineModel } from 'vue';
import BaseModal from 'src/components/common/BaseModal.vue';

const props = defineProps({
  orden: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['recepcion-confirmada']);
const isOpen = defineModel('modelValue');
const loading = ref(false);

// Datos del formulario
const formData = ref({
  items: [],
  ubicacionDestino: 'Almacén Central',
  observaciones: ''
});

// Opciones de ubicación
const ubicacionOptions = [
  { label: 'Almacén Central', value: 'Almacén Central' },
  { label: 'Lab. Química', value: 'Lab. Química' },
  { label: 'Lab. Física', value: 'Lab. Física' },
  { label: 'Lab. Biología', value: 'Lab. Biología' },
  { label: 'Bodega Principal', value: 'Bodega Principal' }
];

// Computed properties para resumen
const itemsCompletos = computed(() => {
  return formData.value.items.filter(
    item => item.cantidadRecibida === item.cantidad
  ).length;
});

const itemsParciales = computed(() => {
  return formData.value.items.filter(
    item => item.cantidadRecibida > 0 && item.cantidadRecibida < item.cantidad
  ).length;
});

const itemsPendientes = computed(() => {
  return formData.value.items.filter(
    item => !item.cantidadRecibida || item.cantidadRecibida === 0
  ).length;
});

// Watch para inicializar datos cuando se abre el modal
watch(() => props.orden, (newOrden) => {
  if (newOrden && newOrden.items) {
    formData.value.items = newOrden.items.map(item => ({
      ...item,
      cantidadRecibida: item.cantidad // Por defecto, asumir que se recibe todo
    }));
  }
}, { immediate: true });

// Métodos
const confirmarRecepcion = () => {
  // Validar que al menos un item tenga cantidad recibida
  const hayItemsRecibidos = formData.value.items.some(
    item => item.cantidadRecibida > 0
  );

  if (!hayItemsRecibidos) {
    return;
  }

  loading.value = true;

  // Simular delay de procesamiento
  setTimeout(() => {
    emit('recepcion-confirmada', {
      ordenId: props.orden.id,
      items: formData.value.items,
      ubicacionDestino: formData.value.ubicacionDestino,
      observaciones: formData.value.observaciones,
      fechaRecepcion: new Date().toISOString(),
      recibidoPor: 'Encargado Almacén' // En producción, obtener del usuario actual
    });

    loading.value = false;
    isOpen.value = false;
    resetForm();
  }, 500);
};

const handleCancel = () => {
  resetForm();
  isOpen.value = false;
};

const resetForm = () => {
  formData.value = {
    items: [],
    ubicacionDestino: 'Almacén Central',
    observaciones: ''
  };
};
</script>
