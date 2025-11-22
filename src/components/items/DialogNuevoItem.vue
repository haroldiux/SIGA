<!-- src/components/items/DialogNuevoItem.vue -->
<template>
  <BaseModal
    v-model="isOpen"
    title="Registrar Nuevo Ítem"
    size="lg"
    confirm-label="Registrar Ítem"
    @confirm="onSubmit"
    @cancel="handleCancel"
  >
    <div class="text-subtitle2 text-grey-7 q-mb-md">
      Complete la información del ítem con su codificación única
    </div>

    <q-form ref="formRef" class="row q-col-gutter-md">
      <!-- Código y Nombre -->
      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.codigo"
          label="Código Único *"
          placeholder="Ej: QUI-001"
          outlined
          :rules="[val => !!val || 'El código es obligatorio']"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="formData.nombre"
          label="Nombre del Ítem *"
          placeholder="Ej: Ácido Sulfúrico H2SO4"
          outlined
          :rules="[val => !!val || 'El nombre es obligatorio']"
        />
      </div>

      <!-- Categoría y Subcategoría -->
      <div class="col-12 col-md-4">
        <q-select
          v-model="formData.categoria"
          :options="categoriasOptions"
          label="Categoría *"
          outlined
          emit-value
          map-options
          :rules="[val => !!val || 'La categoría es obligatoria']"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-select
          v-model="formData.subcategoria"
          :options="subcategoriasOptions"
          label="Subcategoría *"
          outlined
          emit-value
          map-options
          :rules="[val => !!val || 'La subcategoría es obligatoria']"
        />
      </div>
      <!-- Área y Tipo -->
      <div class="col-12 col-md-4">
        <q-select
          v-model="formData.area"
          :options="areasOptions"
          label="Área *"
          outlined
          emit-value
          map-options
          :rules="[val => !!val || 'El área es obligatoria']"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-select
          v-model="formData.tipo"
          :options="tiposOptions"
          label="Tipo *"
          outlined
          emit-value
          map-options
          :rules="[val => !!val || 'El tipo es obligatorio']"
        />
      </div>
      <div class="col-12 col-md-4 flex items-center">
        <q-checkbox v-model="formData.esCombo" label="Es Combo/Kit" />
      </div>

      <!-- Laboratorio y Ubicación -->
      <div class="col-12 col-md-6">
        <q-select
          v-model="formData.laboratorio"
          :options="laboratoriosOptions"
          label="Laboratorio/Almacén de Destino *"
          outlined
          emit-value
          map-options
          :rules="[val => !!val || 'El destino es obligatorio']"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          v-model="formData.ubicacion"
          :options="ubicacionesOptions"
          label="Ubicación Inicial"
          outlined
          emit-value
          map-options
        />
      </div>

      <!-- Unidad de Medida (CRÍTICO) y Stock -->
      <div class="col-12 col-md-4">
        <q-select
          v-model="formData.unidadMedida"
          :options="store.measurementUnits"
          label="Unidad de Medida *"
          outlined
          :rules="[val => !!val || 'La unidad de medida es obligatoria']"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model.number="formData.stockInicial"
          type="number"
          label="Stock Inicial"
          outlined
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model.number="formData.stockMinimo"
          type="number"
          label="Stock Mínimo *"
          outlined
          :rules="[val => val > 0 || 'El stock mínimo debe ser mayor a 0']"
        />
      </div>

      <!-- Especificaciones -->
      <div class="col-12">
        <q-input
          v-model="formData.especificaciones"
          label="Especificaciones Técnicas"
          placeholder="Ej: Pureza 98%, CAS 7664-93-9"
          outlined
          type="textarea"
          rows="3"
        />
      </div>

      <!-- Componentes del Combo (Solo si es Combo) -->
      <div class="col-12" v-if="formData.esCombo">
        <q-card flat bordered class="bg-grey-1">
          <q-card-section>
            <div class="text-subtitle2">Componentes del Kit/Combo</div>
            
            <div class="row q-col-gutter-sm q-mb-sm">
              <div class="col-8">
                <q-select
                  v-model="newComponent.id"
                  :options="availableItemsOptions"
                  label="Seleccionar Ítem"
                  dense
                  outlined
                  emit-value
                  map-options
                />
              </div>
              <div class="col-2">
                <q-input
                  v-model.number="newComponent.cantidad"
                  type="number"
                  label="Cant."
                  dense
                  outlined
                  min="1"
                />
              </div>
              <div class="col-2">
                <q-btn icon="add" color="primary" round dense @click="addComponent" :disable="!newComponent.id" />
              </div>
            </div>

            <q-list dense separator class="bg-white rounded-borders">
              <q-item v-for="(comp, index) in formData.componentes" :key="index">
                <q-item-section>
                  <q-item-label>{{ getComponentName(comp.id) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="primary">{{ comp.cantidad }}</q-badge>
                </q-item-section>
                <q-item-section side>
                  <q-btn icon="delete" flat round dense color="negative" size="sm" @click="removeComponent(index)" />
                </q-item-section>
              </q-item>
              <q-item v-if="formData.componentes && formData.componentes.length === 0">
                <q-item-section class="text-grey text-center">
                  No hay componentes agregados
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </q-form>
  </BaseModal>
</template>

<script setup>
import { ref, defineModel } from 'vue';
import { useMainStore } from 'src/stores/store-main';
import BaseModal from 'src/components/common/BaseModal.vue';

const isOpen = defineModel('modelValue');
const emit = defineEmits(['item-added']);
const store = useMainStore();
const formRef = ref(null);

// Datos del formulario
const formData = ref({
  codigo: '',
  nombre: '',
  categoria: null,
  subcategoria: null,
  tipo: null,
  laboratorio: null,
  ubicacion: null,
  unidadMedida: null, // Campo crítico para la unidad de medida
  stockInicial: 0,
  stockMinimo: 10,
  especificaciones: '',
  componentes: []
});

// Opciones para los selects
const categoriasOptions = [
  { label: 'Reactivos Químicos', value: 'reactivos' },
  { label: 'Material de Laboratorio', value: 'material' },
  { label: 'Equipamiento', value: 'equipamiento' },
  { label: 'Bioseguridad', value: 'bioseguridad' },
  { label: 'Electrónica', value: 'electronica' }
];

const subcategoriasOptions = [
  { label: 'Ácidos', value: 'acidos' },
  { label: 'Bases', value: 'bases' },
  { label: 'Sales', value: 'sales' },
  { label: 'Cristalería', value: 'cristaleria' },
  { label: 'Equipos ópticos', value: 'optica' }
];

const areasOptions = [
  { label: 'Laboratorios (Académico)', value: 'laboratorios' },
  { label: 'Activos (Administrativo)', value: 'activos' }
];

const tiposOptions = [
  { label: 'Consumible', value: 'consumible' },
  { label: 'A Préstamo', value: 'prestamo' },
  { label: 'Activo Fijo', value: 'activo' }
];

const laboratoriosOptions = [
  { label: 'Lab. Química', value: 'lab_quimica' },
  { label: 'Lab. Física', value: 'lab_fisica' },
  { label: 'Lab. Biología', value: 'lab_biologia' },
  { label: 'Almacén Central', value: 'almacen_central' }
];

const ubicacionesOptions = [
  { label: 'Estante A', value: 'estante_a' },
  { label: 'Estante B', value: 'estante_b' },
  { label: 'Armario de Seguridad', value: 'armario_seg' },
  { label: 'Refrigerador', value: 'refrigerador' }
];

// Métodos
const onSubmit = async () => {
  // Validar el formulario
  const isValid = await formRef.value?.validate();
  
  if (!isValid) {
    return;
  }

  // Simular agregado de ítem
  const newItem = { ...formData.value };

  // Emitir el nuevo ítem
  emit('item-added', newItem);

  // Cerrar el diálogo
  isOpen.value = false;

  // Reiniciar el formulario
  resetForm();
};

const handleCancel = () => {
  resetForm();
  isOpen.value = false;
};

const resetForm = () => {
  formData.value = {
    codigo: '',
    nombre: '',
    categoria: null,
    subcategoria: null,
    tipo: null,
    area: null,
    esCombo: false,
    laboratorio: null,
    ubicacion: null,
    unidadMedida: null,
    stockInicial: 0,
    stockMinimo: 10,
    especificaciones: '',
    componentes: []
  };
  formRef.value?.resetValidation();
  newComponent.value = { id: null, cantidad: 1 };
};

const newComponent = ref({ id: null, cantidad: 1 });

const availableItemsOptions = [
  { label: 'Ácido Sulfúrico H2SO4', value: 1 },
  { label: 'Guantes de Látex', value: 2 },
  { label: 'Pipetas 10ml', value: 3 },
  { label: 'Microscopio Binocular', value: 4 }
];

const addComponent = () => {
  if (newComponent.value.id && newComponent.value.cantidad > 0) {
    if (!formData.value.componentes) formData.value.componentes = [];
    formData.value.componentes.push({ ...newComponent.value });
    newComponent.value = { id: null, cantidad: 1 };
  }
};

const removeComponent = (index) => {
  formData.value.componentes.splice(index, 1);
};

const getComponentName = (id) => {
  return availableItemsOptions.find(i => i.value === id)?.label || 'Ítem desconocido';
};
</script>
