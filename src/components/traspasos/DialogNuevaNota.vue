<!-- src/components/compras/DialogNuevaOrden.vue -->
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
        <div class="text-h6">Nueva Orden de Compra</div>
        <div class="text-subtitle2 text-grey-7 q-ml-sm">Complete la información de la orden de compra</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator class="q-my-md" />

      <q-card-section class="q-pa-md">
        <q-form @submit="onSubmit" class="row q-col-gutter-md">
          <!-- Información general de la orden -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="ordenData.codigo"
              label="Código de Orden *"
              placeholder="Ej: OC-2025-001"
              outlined
              :rules="[val => !!val || 'El código es obligatorio']"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="ordenData.proveedor"
              :options="proveedoresOptions"
              label="Proveedor *"
              outlined
              emit-value
              map-options
              :rules="[val => !!val || 'El proveedor es obligatorio']"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="ordenData.fecha"
              label="Fecha *"
              outlined
              readonly
              :rules="[val => !!val || 'La fecha es obligatoria']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="ordenData.fecha">
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
            <q-card flat bordered>
              <q-card-section class="q-pb-none">
                <div class="text-h6">Detalle de Ítems</div>
                <div class="text-subtitle2 text-grey-7">Agregue los ítems a la orden de compra</div>
              </q-card-section>

              <q-card-section>
                <!-- Tabla de ítems -->
                <q-table
                  :rows="ordenData.items"
                  :columns="itemsColumns"
                  row-key="id"
                  dense
                  class="q-mb-md"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td v-for="col in props.cols" :key="col.name" :props="props">
                        {{ col.value }}
                      </q-td>
                      <q-td auto-width>
                        <q-btn size="sm" flat round dense icon="delete" color="negative" @click="removeItem(props.row)" />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>

                <!-- Formulario para agregar nuevo ítem -->
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-3">
                    <q-select
                      v-model="newItem.item"
                      :options="itemsOptions"
                      label="Ítem *"
                      outlined
                      dense
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="col-12 col-md-2">
                    <q-input
                      v-model.number="newItem.cantidad"
                      type="number"
                      label="Cantidad *"
                      outlined
                      dense
                      min="1"
                    />
                  </div>
                  <div class="col-12 col-md-2">
                    <q-input
                      v-model.number="newItem.precioBruto"
                      type="number"
                      label="Precio Bruto *"
                      outlined
                      dense
                      prefix="Bs."
                      min="0"
                      @update:model-value="calcularPrecios"
                    />
                  </div>
                  <div class="col-12 col-md-2">
                    <q-select
                      v-model="newItem.region"
                      :options="regionesOptions"
                      label="Región *"
                      outlined
                      dense
                      @update:model-value="calcularPrecios"
                    />
                  </div>
                  <div class="col-12 col-md-2">
                    <div class="q-mt-md">
                      <q-toggle
                        v-model="newItem.facturado"
                        label="Facturado"
                        @update:model-value="calcularPrecios"
                      />
                    </div>
                  </div>
                  <div class="col-12 col-md-1 flex items-center">
                    <q-btn
                      color="primary"
                      icon="add"
                      round
                      @click="addItem"
                      :disable="!newItem.item || !newItem.cantidad || !newItem.precioBruto || !newItem.region"
                    />
                  </div>
                </div>

                <!-- Resultados calculados -->
                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="newItem.montoIVA"
                      type="number"
                      label="IVA"
                      outlined
                      dense
                      prefix="Bs."
                      readonly
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="newItem.precioNeto"
                      type="number"
                      label="Precio Neto"
                      outlined
                      dense
                      prefix="Bs."
                      readonly
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Botones de acción -->
          <div class="col-12 flex justify-end q-gutter-sm">
            <q-btn label="Cancelar" color="grey-7" v-close-popup />
            <q-btn label="Guardar Orden" color="primary" type="submit" :disable="ordenData.items.length === 0" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMainStore } from 'src/stores/store-main';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'order-added']);
const store = useMainStore();

// Control de visibilidad del diálogo
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Datos de la orden
const ordenData = ref({
  codigo: '',
  proveedor: null,
  fecha: '',
  items: []
});

// Nuevo ítem temporal
const newItem = ref({
  id: 0,
  item: null,
  cantidad: 1,
  precioBruto: 0,
  region: 'Región Principal',
  facturado: true,
  montoIVA: 0,
  precioNeto: 0
});

// Columnas para la tabla de ítems
const itemsColumns = [
  { name: 'item', align: 'left', label: 'Ítem', field: row => itemsOptions.find(i => i.value === row.item)?.label || '' },
  { name: 'cantidad', align: 'center', label: 'Cantidad', field: 'cantidad' },
  { name: 'precioBruto', align: 'right', label: 'Precio Bruto (Bs.)', field: 'precioBruto' },
  { name: 'region', align: 'center', label: 'Región', field: 'region' },
  { name: 'facturado', align: 'center', label: 'Facturado', field: row => row.facturado ? 'Sí' : 'No' },
  { name: 'montoIVA', align: 'right', label: 'IVA (Bs.)', field: 'montoIVA' },
  { name: 'precioNeto', align: 'right', label: 'Precio Neto (Bs.)', field: 'precioNeto' }
];

// Opciones para los selects
const proveedoresOptions = [
  { label: 'Química del Sur SRL', value: 'quimica_sur' },
  { label: 'LabEquip Bolivia', value: 'labequip' },
  { label: 'BioInsumos Científicos', value: 'bioinsumos' }
];

const itemsOptions = [
  { label: 'Ácido Sulfúrico H2SO4 1L', value: 'acido_sulfurico' },
  { label: 'Guantes de Látex (100 unid)', value: 'guantes_latex' },
  { label: 'Pipetas 10ml', value: 'pipetas_10ml' },
  { label: 'Microscopio Binocular', value: 'microscopio' }
];

const regionesOptions = [
  'Región Principal',
  'Cojiba',
  'Zona Franca'
];

// Métodos
const calcularPrecios = () => {
  // Calcular el monto del IVA
  newItem.value.montoIVA = store.calculateTaxAmount(
    newItem.value.precioBruto,
    newItem.value.region,
    newItem.value.facturado
  );

  // Calcular el precio neto
  newItem.value.precioNeto = store.calculateNetPrice(
    newItem.value.precioBruto,
    newItem.value.region,
    newItem.value.facturado
  );

  // Redondear a 2 decimales para mostrar
  newItem.value.montoIVA = Math.round(newItem.value.montoIVA * 100) / 100;
  newItem.value.precioNeto = Math.round(newItem.value.precioNeto * 100) / 100;
};

const addItem = () => {
  // Agregar el ítem a la orden
  ordenData.value.items.push({
    ...newItem.value,
    id: Date.now() // Generar ID único
  });

  // Reiniciar el formulario de nuevo ítem
  newItem.value = {
    id: 0,
    item: null,
    cantidad: 1,
    precioBruto: 0,
    region: 'Región Principal',
    facturado: true,
    montoIVA: 0,
    precioNeto: 0
  };
};

const removeItem = (item) => {
  // Eliminar el ítem de la orden
  ordenData.value.items = ordenData.value.items.filter(i => i.id !== item.id);
};

const onSubmit = () => {
  // Aquí iría la lógica para guardar la orden
  // En un entorno real, esto enviaría los datos al backend

  // Emitir la nueva orden
  emit('order-added', { ...ordenData.value });

  // Cerrar el diálogo
  isOpen.value = false;

  // Reiniciar el formulario
  ordenData.value = {
    codigo: '',
    proveedor: null,
    fecha: '',
    items: []
  };
};

// Al montar el componente, establecer la fecha actual
onMounted(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  ordenData.value.fecha = `${year}-${month}-${day}`;
});
</script>
