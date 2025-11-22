<!-- src/components/compras/DialogNuevaOrden.vue -->
<template>
  <BaseModal
    v-model="isOpen"
    title="Nueva Orden de Compra"
    size="xl"
    confirm-label="Guardar Orden"
    :persistent="true"
    @confirm="onSubmit"
    @cancel="handleCancel"
    @before-show="checkInitialData"
  >
    <div class="text-subtitle2 text-grey-7 q-mb-md">
      Complete la información de la orden de compra
    </div>

    <q-form ref="formRef" class="row q-col-gutter-md">
      <!-- Información general de la orden -->
      <div class="col-12 col-md-3">
        <q-input
          v-model="ordenData.codigo"
          label="Código de Orden *"
          placeholder="Ej: OC-2025-001"
          outlined
          :rules="[val => !!val || 'El código es obligatorio']"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-input
          v-model="ordenData.rq"
          label="RQ (Requerimiento)"
          placeholder="Ej: RQ-105"
          outlined
        />
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="ordenData.proveedor"
          :options="proveedoresOptions"
          label="Proveedor *"
          outlined
          emit-value
          map-options
          :rules="[val => !!val || 'El proveedor es obligatorio']"
          @update:model-value="validarProveedor"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
                <q-item-label caption>{{ scope.opt.tipo === 'juridica' ? 'NIT: ' + scope.opt.nit : 'CI: ' + scope.opt.ci }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-12 col-md-3">
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

          <q-card-section v-if="newItem.item" class="q-pb-none">
            <q-card class="bg-grey-1 q-mb-md">
              <q-card-section>
                <div class="text-subtitle2 text-primary q-mb-sm flex items-center">
                  <q-icon name="compare_arrows" class="q-mr-sm" />
                  Cuadro Comparativo de Precios
                </div>
                <q-markup-table dense flat bordered class="bg-white">
                  <thead>
                    <tr>
                      <th class="text-left">Ítem</th>
                      <th class="text-right">Precio Actual</th>
                      <th class="text-right">Proveedor A</th>
                      <th class="text-right">Proveedor B</th>
                      <th class="text-center">Ciudad</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-left">{{ getNombreItem(newItem.item) }}</td>
                      <td class="text-right text-bold">150.00 Bs.</td>
                      <td class="text-right">155.00 Bs.</td>
                      <td class="text-right">148.00 Bs.</td>
                      <td class="text-center">Cochabamba</td>
                    </tr>
                    <!-- Datos simulados para el ejemplo -->
                  </tbody>
                </q-markup-table>
              </q-card-section>
            </q-card>
          </q-card-section>

          <q-card-section>
            <!-- Tabla de ítems -->
            <q-table
              :rows="ordenData.items"
              :columns="itemsColumns"
              row-key="id"
              dense
              class="q-mb-md"
              :rows-per-page-options="[0]"
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

            <!-- Formulario para agregar nuevo ítem con lógica de precios (CRÍTICO) -->
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
                <q-select
                  v-model="newItem.facturacionTipo"
                  :options="facturacionOptions"
                  label="Facturación"
                  outlined
                  dense
                  emit-value
                  map-options
                  @update:model-value="calcularPrecios"
                />
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
    </q-form>
  </BaseModal>
</template>

<script setup>
import { ref, defineModel, onMounted } from 'vue';
import { useMainStore } from 'src/stores/store-main';
import BaseModal from 'src/components/common/BaseModal.vue';

const isOpen = defineModel('modelValue');
const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
});
const emit = defineEmits(['order-added']);
const store = useMainStore();
const formRef = ref(null);

// Datos de la orden
const ordenData = ref({
  codigo: '',
  rq: '',
  proveedor: null,
  fecha: '',
  items: []
});

// Nuevo ítem temporal
const newItem = ref({
  id: 0,
  itemId: null,
  item: null,
  nombre: '',
  cantidad: 1,
  unidadMedida: 'Unidades',
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
  { name: 'facturado', align: 'center', label: 'Facturación', field: row => row.facturacionTipo === 'si' ? 'Factura' : (row.facturacionTipo === 'retencion' ? 'Retención' : 'Sin Factura') },
  { name: 'montoIVA', align: 'right', label: 'IVA (Bs.)', field: 'montoIVA' },
  { name: 'precioNeto', align: 'right', label: 'Precio Neto (Bs.)', field: 'precioNeto' }
];

// Opciones para los selects
const proveedoresOptions = [
  { label: 'Química del Sur SRL', value: 'quimica_sur', tipo: 'juridica', nit: '1020304050' },
  { label: 'LabEquip Bolivia', value: 'labequip', tipo: 'juridica', nit: '5040302010' },
  { label: 'Juan Pérez (Consultor)', value: 'juan_perez', tipo: 'natural', ci: '1234567 SC' }
];

const itemsOptions = [
  { label: 'Ácido Sulfúrico H2SO4 1L', value: 'acido_sulfurico', itemId: 'QUI-001', unidad: 'Litros' },
  { label: 'Guantes de Látex (100 unid)', value: 'guantes_latex', itemId: 'BIO-001', unidad: 'Cajas' },
  { label: 'Pipetas 10ml', value: 'pipetas_10ml', itemId: 'MAT-001', unidad: 'Unidades' },
  { label: 'Microscopio Binocular', value: 'microscopio', itemId: 'EQU-001', unidad: 'Unidades' }
];

const regionesOptions = [
  'Región Principal',
  'Cobija',
  'Zona Franca'
];

const facturacionOptions = [
  { label: 'Con Factura', value: 'si' },
  { label: 'Sin Factura', value: 'no' },
  { label: 'Retención', value: 'retencion' }
];

// MÉTODO CRÍTICO: Calcular precios e IVA en base a configuración global
const calcularPrecios = () => {
  let bruto = newItem.value.precioBruto || 0;
  let tipo = newItem.value.facturacionTipo;
  let region = newItem.value.region;

  // Lógica de cálculo (Simulada, idealmente vendría del store)
  let impuesto = 0;
  
  if (tipo === 'si') {
    // IVA 13% (Variable según config, pero usaremos estándar aquí)
    // Si es Zona Franca, IVA es 0
    if (region === 'Zona Franca') {
      impuesto = 0;
    } else {
      // El precio bruto INCLUYE el impuesto si es factura
      // Precio Neto = Bruto / 1.1494 (aprox) o Bruto * 0.87
      // Usaremos lógica simple: Impuesto es parte del bruto
      impuesto = bruto * 0.13; 
    }
  } else if (tipo === 'retencion') {
    // Retención (ej. 8% bienes)
    // El precio bruto es lo que se paga, se retiene el impuesto
    impuesto = bruto * 0.08;
  } else {
    // Sin factura (ilegal/informal, impuesto 0)
    impuesto = 0;
  }

  newItem.value.montoIVA = impuesto;
  newItem.value.precioNeto = bruto - impuesto;

  // Redondear a 2 decimales para mostrar
  newItem.value.montoIVA = Math.round(newItem.value.montoIVA * 100) / 100;
  newItem.value.precioNeto = Math.round(newItem.value.precioNeto * 100) / 100;
};

const addItem = () => {
  // Obtener información del item seleccionado
  const itemInfo = itemsOptions.find(i => i.value === newItem.value.item);
  
  // Agregar el ítem a la orden
  ordenData.value.items.push({
    ...newItem.value,
    id: Date.now(), // Generar ID único
    itemId: itemInfo?.itemId || newItem.value.item,
    nombre: itemInfo?.label || '',
    unidadMedida: itemInfo?.unidad || 'Unidades'
  });

  // Reiniciar el formulario de nuevo ítem
  newItem.value = {
    id: 0,
    itemId: null,
    item: null,
    nombre: '',
    cantidad: 1,
    unidadMedida: 'Unidades',
    precioBruto: 0,
    region: 'Región Principal',
    facturacionTipo: 'si',
    montoIVA: 0,
    precioNeto: 0
  };
};

const removeItem = (item) => {
  // Eliminar el ítem de la orden
  ordenData.value.items = ordenData.value.items.filter(i => i.id !== item.id);
};

const onSubmit = async () => {
  // Validar el formulario
  const isValid = await formRef.value?.validate();
  
  if (!isValid || ordenData.value.items.length === 0) {
    return;
  }

  // Emitir la nueva orden
  emit('order-added', { ...ordenData.value });

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
  ordenData.value = {
    codigo: '',
    rq: '',
    proveedor: null,
    fecha: '',
    items: []
  };
  
  newItem.value = {
    id: 0,
    itemId: null,
    item: null,
    nombre: '',
    cantidad: 1,
    unidadMedida: 'Unidades',
    precioBruto: 0,
    region: 'Región Principal',
    facturacionTipo: 'si',
    montoIVA: 0,
    precioNeto: 0
  };
  
  formRef.value?.resetValidation();
  
  // Establecer la fecha actual
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  ordenData.value.fecha = `${year}-${month}-${day}`;
};

// Al montar el componente, establecer la fecha actual
onMounted(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  ordenData.value.fecha = `${year}-${month}-${day}`;
});

const checkInitialData = () => {
  if (props.initialData) {
    ordenData.value = {
      ...ordenData.value,
      ...props.initialData,
      items: props.initialData.items.map(i => ({
        ...i,
        precioBruto: i.precioBruto || 0,
        region: i.region || 'Región Principal',
        facturado: i.facturado !== false,
        montoIVA: 0,
        precioNeto: 0
      }))
    };
    // Recalcular precios para los items importados
    ordenData.value.items.forEach(item => {
      item.montoIVA = store.calculateTaxAmount(item.precioBruto, item.region, item.facturado);
      item.precioNeto = store.calculateNetPrice(item.precioBruto, item.region, item.facturado);
    });
  }
};

const validarProveedor = (val) => {
  const proveedor = proveedoresOptions.find(p => p.value === val);
  if (proveedor) {
    if (proveedor.tipo === 'juridica' && !proveedor.nit) {
      // Alerta o validación (aquí solo log por simplicidad)
      console.warn('Proveedor Jurídico sin NIT');
    }
  }
};
const getNombreItem = (value) => {
  return itemsOptions.find(i => i.value === value)?.label || '';
};
</script>
