<!-- src/components/proveedores/DialogNuevoProveedor.vue -->
<template>
  <q-dialog
    v-model="isOpen"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Registrar Nuevo Proveedor</div>
        <div class="text-subtitle2 text-grey-7 q-ml-sm">Complete la información del proveedor. El NIT es opcional.</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator class="q-my-md" />

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="providerData.nombre"
            label="Nombre del Proveedor *"
            placeholder="Ej: Química del Sur SRL"
            outlined
            :rules="[val => !!val || 'El nombre es obligatorio']"
          />

          <q-input
            v-model="providerData.nit"
            label="NIT (Opcional)"
            placeholder="1234567890"
            outlined
          />

          <q-input
            v-model="providerData.telefono"
            label="Teléfono/Celular *"
            placeholder="+591 78945612"
            outlined
            :rules="[val => !!val || 'El teléfono es obligatorio']"
          />

          <q-input
            v-model="providerData.email"
            label="Email"
            placeholder="contacto@proveedor.com"
            type="email"
            outlined
          />

          <q-input
            v-model="providerData.direccion"
            label="Dirección *"
            placeholder="Av. Principal #123, Ciudad"
            outlined
            :rules="[val => !!val || 'La dirección es obligatoria']"
          />

          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-select
                v-model="providerData.ciudad"
                :options="ciudadesOptions"
                label="Ciudad *"
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'La ciudad es obligatoria']"
              />
            </div>
            <div class="col-6">
              <q-select
                v-model="providerData.tipoFacturacion"
                :options="facturacionOptions"
                label="Tipo de Facturación *"
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'El tipo es obligatorio']"
              />
            </div>
          </div>

          <q-input
            v-model="providerData.observaciones"
            label="Observaciones"
            placeholder="Información adicional sobre el proveedor..."
            type="textarea"
            outlined
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn label="Cancelar" color="grey-7" v-close-popup />
        <q-btn label="Registrar Proveedor" color="primary" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineModel } from 'vue';

const isOpen = defineModel('modelValue');
const emit = defineEmits(['provider-added']);

// Datos del proveedor
const providerData = ref({
  nombre: '',
  nit: '',
  telefono: '',
  email: '',
  direccion: '',
  ciudad: null,
  tipoFacturacion: 'factura',
  observaciones: ''
});

// Métodos
const onSubmit = () => {
  // Validar campos requeridos
  if (!providerData.value.nombre || !providerData.value.telefono || !providerData.value.direccion) {
    return;
  }

  // Emitir el nuevo proveedor
  emit('provider-added', { ...providerData.value, itemsSuministrados: 0 });

  // Cerrar el diálogo
  isOpen.value = false;

  // Reiniciar el formulario
  resetForm();
};

const resetForm = () => {
  providerData.value = {
    nombre: '',
    nit: '',
    telefono: '',
    email: '',
  direccion: '',
    ciudad: null,
    tipoFacturacion: 'factura',
    observaciones: ''
  };
};

const ciudadesOptions = [
  'Cochabamba', 'Santa Cruz', 'La Paz', 'El Alto', 'Oruro', 'Potosí', 'Tarija', 'Sucre', 'Trinidad', 'Cobija'
];

const facturacionOptions = [
  { label: 'Con Factura', value: 'factura' },
  { label: 'Sin Factura', value: 'sin_factura' }
];
</script>
