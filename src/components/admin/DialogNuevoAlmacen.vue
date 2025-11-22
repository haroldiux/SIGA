<!-- src/components/admin/DialogNuevoAlmacen.vue -->
<template>
  <q-dialog
    v-model="isOpen"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Registrar Nuevo Almacén</div>
        <div class="text-subtitle2 text-grey-7 q-ml-sm">Complete la información del almacén</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator class="q-my-md" />

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="almacenData.nombre"
            label="Nombre del Almacén *"
            placeholder="Ej: Laboratorio de Química"
            outlined
            :rules="[val => !!val || 'El nombre es obligatorio']"
          />

          <q-input
            v-model="almacenData.codigo"
            label="Código *"
            placeholder="Ej: LAB-QUI"
            outlined
            :rules="[val => !!val || 'El código es obligatorio']"
          />

          <q-input
            v-model="almacenData.ubicacion"
            label="Ubicación *"
            placeholder="Ej: Edificio de Ciencias, Piso 2"
            outlined
            :rules="[val => !!val || 'La ubicación es obligatoria']"
          />

          <q-select
            v-model="almacenData.responsable"
            :options="usuariosOptions"
            label="Responsable *"
            outlined
            emit-value
            map-options
            :rules="[val => !!val || 'El responsable es obligatorio']"
          />

          <q-select
            v-model="almacenData.tipo"
            :options="tiposOptions"
            label="Tipo de Almacén *"
            outlined
            emit-value
            map-options
            :rules="[val => !!val || 'El tipo es obligatorio']"
          />

          <q-input
            v-model="almacenData.descripcion"
            label="Descripción"
            type="textarea"
            outlined
            placeholder="Descripción detallada del almacén..."
            rows="3"
          />

          <q-toggle
            v-model="almacenData.activo"
            label="Almacén Activo"
            color="green"
            checked-icon="check"
            unchecked-icon="clear"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn label="Cancelar" color="grey-7" v-close-popup />
        <q-btn label="Registrar Almacén" color="primary" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineModel } from 'vue';
import { useQuasar } from 'quasar';

const isOpen = defineModel('modelValue');
const emit = defineEmits(['warehouse-added']);
const $q = useQuasar();

// Datos del almacén
const almacenData = ref({
  nombre: '',
  codigo: '',
  ubicacion: '',
  responsable: null,
  tipo: null,
  descripcion: '',
  activo: true
});

// Opciones para los selects
const usuariosOptions = [
  { label: 'María García', value: 'maria_garcia' },
  { label: 'Juan Pérez', value: 'juan_perez' },
  { label: 'Carlos López', value: 'carlos_lopez' },
  { label: 'Ana Torres', value: 'ana_torres' },
  { label: 'Pedro Martínez', value: 'pedro_martinez' }
];

const tiposOptions = [
  { label: 'Almacén Central', value: 'central' },
  { label: 'Laboratorio', value: 'laboratorio' },
  { label: 'Sub-Almacén', value: 'subalmacen' }
];

// Métodos
const onSubmit = () => {
  // Validar campos requeridos
  if (!almacenData.value.nombre || !almacenData.value.codigo || !almacenData.value.ubicacion ||
      !almacenData.value.responsable || !almacenData.value.tipo) {
    $q.notify({
      color: 'negative',
      message: 'Por favor complete todos los campos obligatorios',
      icon: 'warning'
    });
    return;
  }

  // Preparar datos para emitir
  const almacenToEmit = {
    id: Date.now(),
    ...almacenData.value,
    items: 0,  // Inicia sin ítems
    fechaCreacion: new Date().toISOString().slice(0, 10),
    estado: almacenData.value.activo ? 'Activo' : 'Inactivo'
  };

  // Emitir evento con los datos del nuevo almacén
  emit('warehouse-added', almacenToEmit);

  // Notificar
  $q.notify({
    color: 'positive',
    message: `Almacén ${almacenData.value.nombre} creado correctamente`,
    icon: 'check_circle'
  });

  // Cerrar el diálogo
  isOpen.value = false;

  // Reiniciar el formulario
  resetForm();
};

const resetForm = () => {
  almacenData.value = {
    nombre: '',
    codigo: '',
    ubicacion: '',
    responsable: null,
    tipo: null,
    descripcion: '',
    activo: true
  };
};
</script>
