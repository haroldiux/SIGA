<!-- src/components/prestamos/DialogNuevoPrestamo.vue -->
<template>
  <q-dialog
    v-model="isOpen"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Nuevo Préstamo</div>
        <div class="text-subtitle2 text-grey-7 q-ml-sm">Complete la información del préstamo</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator class="q-my-md" />

      <q-card-section class="q-pa-md">
        <q-form @submit="onSubmit" class="row q-col-gutter-md">
          <!-- Información básica del préstamo -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="prestamoData.codigo"
              label="Código de Préstamo *"
              placeholder="Ej: PRES-0001"
              outlined
              :rules="[val => !!val || 'El código es obligatorio']"
              readonly
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="prestamoData.solicitante"
              label="Nombre del Solicitante *"
              placeholder="Ej: Dr. Juan Pérez"
              outlined
              :rules="[val => !!val || 'El solicitante es obligatorio']"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="prestamoData.departamento"
              :options="departamentosOptions"
              label="Departamento *"
              outlined
              emit-value
              map-options
              :rules="[val => !!val || 'El departamento es obligatorio']"
            />
          </div>

          <!-- Fechas de préstamo y devolución -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="prestamoData.fechaPrestamo"
              label="Fecha de Préstamo *"
              outlined
              readonly
              :rules="[val => !!val || 'La fecha es obligatoria']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="prestamoData.fechaPrestamo" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="prestamoData.fechaDevolucion"
              label="Fecha Estimada de Devolución *"
              outlined
              readonly
              :rules="[
                val => !!val || 'La fecha de devolución es obligatoria',
                val => new Date(val) > new Date(prestamoData.fechaPrestamo) || 'La fecha de devolución debe ser posterior a la de préstamo'
              ]"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="prestamoData.fechaDevolucion" :options="fechasDisponibles" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <q-input
              v-model="prestamoData.proposito"
              label="Propósito del Préstamo *"
              type="textarea"
              outlined
              placeholder="Explique para qué necesita estos equipos o materiales..."
              rows="3"
              :rules="[val => !!val || 'El propósito es obligatorio']"
            />
          </div>

          <div class="col-12">
            <q-card flat bordered>
              <q-card-section class="q-pb-none">
                <div class="text-subtitle1">Ítems a Prestar</div>
                <div class="text-caption text-grey-7">Agregue los ítems que desea solicitar en préstamo</div>
              </q-card-section>

              <q-card-section>
                <!-- Tabla de ítems -->
                <q-table
                  :rows="prestamoData.items"
                  :columns="itemsColumns"
                  row-key="id"
                  dense
                  :pagination="{ rowsPerPage: 0 }"
                  class="q-mb-md"
                >
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                      <q-btn size="sm" flat round dense icon="delete" color="negative" @click="removeItem(props.row)" />
                    </q-td>
                  </template>
                </q-table>

                <!-- Formulario para agregar nuevo ítem -->
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-5">
                    <q-select
                      v-model="newItem.item"
                      :options="itemsOptions"
                      label="Ítem *"
                      outlined
                      dense
                      emit-value
                      map-options
                      :rules="[val => !!val || 'Seleccione un ítem']"
                    />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-input
                      v-model.number="newItem.cantidad"
                      type="number"
                      label="Cantidad *"
                      outlined
                      dense
                      min="1"
                      :rules="[val => val > 0 || 'La cantidad debe ser mayor a 0']"
                    />
                  </div>
                  <div class="col-12 col-md-2">
                    <q-input
                      v-model="newItem.unidad"
                      label="Unidad"
                      outlined
                      dense
                      readonly
                    />
                  </div>
                  <div class="col-12 col-md-2 flex items-center">
                    <q-btn
                      color="primary"
                      icon="add"
                      label="Agregar"
                      @click="addItem"
                      :disable="!newItem.item || !newItem.cantidad || newItem.cantidad < 1"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Botones de acción -->
          <div class="col-12 flex justify-end q-gutter-sm">
            <q-btn label="Cancelar" color="grey-7" v-close-popup />
            <q-btn label="Guardar Como Borrador" color="blue" @click="saveDraft" class="q-mr-sm" />
            <q-btn label="Registrar Préstamo" color="primary" type="submit" :disable="prestamoData.items.length === 0" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, defineModel, onMounted } from 'vue';
import { useQuasar } from 'quasar';

const isOpen = defineModel('modelValue');
const emit = defineEmits(['prestamo-added']);
const $q = useQuasar();

// Datos del préstamo
const prestamoData = ref({
  codigo: '',
  solicitante: '',
  departamento: null,
  fechaPrestamo: '',
  fechaDevolucion: '',
  proposito: '',
  items: [],
  estado: 'Pendiente'
});

// Nuevo ítem temporal
const newItem = ref({
  id: 0,
  item: null,
  cantidad: 1,
  unidad: ''
});

// Opciones para los selects
const departamentosOptions = [
  { label: 'Departamento de Química', value: 'quimica' },
  { label: 'Departamento de Física', value: 'fisica' },
  { label: 'Departamento de Biología', value: 'biologia' },
  { label: 'Facultad de Medicina', value: 'medicina' },
  { label: 'Facultad de Ingeniería', value: 'ingenieria' }
];

// Opciones de ítems disponibles (solo los retornables)
const itemsOptions = [
  { label: 'Microscopio Binocular', value: 'microscopio', unidad: 'Unidades', stock: 10 },
  { label: 'Balanza Analítica', value: 'balanza', unidad: 'Unidades', stock: 5 },
  { label: 'Centrífuga', value: 'centrifuga', unidad: 'Unidades', stock: 3 },
  { label: 'Kit de Disección', value: 'kit_diseccion', unidad: 'Kits', stock: 8 },
  { label: 'Espectrofotómetro', value: 'espectrofotometro', unidad: 'Unidades', stock: 2 }
];

// Función para validar fechas disponibles
const fechasDisponibles = (date) => {
  // Solo permite fechas posteriores a la fecha de préstamo
  const fechaPrestamo = new Date(prestamoData.value.fechaPrestamo);
  return date >= fechaPrestamo;
};

// Vigilar cambios en el ítem seleccionado para actualizar la unidad
watch(
  () => newItem.value.item,
  (newValue) => {
    const selectedItem = itemsOptions.find(item => item.value === newValue);
    newItem.value.unidad = selectedItem ? selectedItem.unidad : '';
  }
);

// Columnas para la tabla de ítems
const itemsColumns = [
  { name: 'nombre', align: 'left', label: 'Ítem', field: row => {
    const item = itemsOptions.find(i => i.value === row.item);
    return item ? item.label : row.item;
  }},
  { name: 'cantidad', align: 'center', label: 'Cantidad', field: 'cantidad' },
  { name: 'unidad', align: 'center', label: 'Unidad', field: 'unidad' },
  { name: 'actions', align: 'center', label: 'Acciones', field: 'actions' }
];

// Métodos
const addItem = () => {
  // Buscar el ítem seleccionado para obtener su nombre
  const selectedItem = itemsOptions.find(item => item.value === newItem.value.item);

  // Validar stock disponible
  if (selectedItem && newItem.value.cantidad > selectedItem.stock) {
    $q.notify({
      color: 'negative',
      message: `No hay suficiente stock disponible. Máximo: ${selectedItem.stock}`,
      icon: 'warning'
    });
    return;
  }

  // Agregar el ítem al préstamo
  prestamoData.value.items.push({
    id: Date.now(),
    item: newItem.value.item,
    nombre: selectedItem ? selectedItem.label : '',
    cantidad: newItem.value.cantidad,
    unidad: newItem.value.unidad
  });

  // Reiniciar el formulario de nuevo ítem
  newItem.value = {
    id: 0,
    item: null,
    cantidad: 1,
    unidad: ''
  };
};

const removeItem = (item) => {
  // Eliminar el ítem de la lista
  prestamoData.value.items = prestamoData.value.items.filter(i => i.id !== item.id);
};

const saveDraft = () => {
  $q.notify({
    color: 'info',
    message: 'Borrador guardado correctamente',
    icon: 'save'
  });
};

const onSubmit = () => {
  // Validar que haya ítems
  if (prestamoData.value.items.length === 0) {
    $q.notify({
      color: 'negative',
      message: 'Debe agregar al menos un ítem al préstamo',
      icon: 'warning'
    });
    return;
  }

  // Validar campos requeridos
  if (!prestamoData.value.solicitante || !prestamoData.value.departamento ||
      !prestamoData.value.fechaPrestamo || !prestamoData.value.fechaDevolucion ||
      !prestamoData.value.proposito) {
    $q.notify({
      color: 'negative',
      message: 'Por favor complete todos los campos obligatorios',
      icon: 'warning'
    });
    return;
  }

  // Emitir evento con el nuevo préstamo
  emit('prestamo-added', {
    ...prestamoData.value,
    id: Date.now(),
    fechaRegistro: new Date().toISOString().slice(0, 10)
  });

  // Cerrar el diálogo
  isOpen.value = false;

  // Reiniciar el formulario
  resetForm();
};

const resetForm = () => {
  prestamoData.value = {
    codigo: generatePrestamoCode(),
    solicitante: '',
    departamento: null,
    fechaPrestamo: new Date().toISOString().slice(0, 10),
    fechaDevolucion: '',
    proposito: '',
    items: [],
    estado: 'Pendiente'
  };

  newItem.value = {
    id: 0,
    item: null,
    cantidad: 1,
    unidad: ''
  };
};

// Generar código único para el préstamo
const generatePrestamoCode = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(4, '0');

  return `PRES-${year}${month}${day}-${random}`;
};

// Al montar el componente
onMounted(() => {
  // Generar código único para el préstamo
  prestamoData.value.codigo = generatePrestamoCode();

  // Establecer fecha de préstamo actual
  prestamoData.value.fechaPrestamo = new Date().toISOString().slice(0, 10);
});
</script>
