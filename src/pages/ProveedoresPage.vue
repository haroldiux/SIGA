<!-- src/pages/ProveedoresPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h4 q-my-none">Gestión de Proveedores</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm q-mb-none">
          Administra los proveedores y su historial de precios
        </p>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Nuevo Proveedor" @click="showNuevoProveedorDialog = true" />
      </div>
    </div>

    <q-card flat bordered>
      <q-tabs v-model="activeTab" dense class="bg-grey-2 text-grey-7 rounded-borders q-pa-xs q-mb-md"
        active-class="bg-white text-dark shadow-1 rounded-borders" indicator-color="transparent" align="left" no-caps>
        <q-tab name="lista" label="Lista de Proveedores" class="q-px-lg" />
        <q-tab name="precios" label="Historial de Precios" class="q-px-lg" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeTab" animated>
        <!-- Panel de Lista de Proveedores -->
        <q-tab-panel name="lista">
          <div class="row items-center q-mb-md">
            <div class="col">
              <div class="text-h6">Proveedores Registrados</div>
              <div class="text-subtitle2 text-grey-7">Total: {{ proveedores.length }} proveedores activos</div>
            </div>
            <div class="col-auto">
              <q-input v-model="proveedoresFilter" outlined dense placeholder="Buscar proveedor..." class="q-mr-sm">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>

          <q-table :rows="proveedores" :columns="proveedoresColumns" row-key="id" :filter="proveedoresFilter">
            <template v-slot:body-cell-contacto="props">
              <q-td :props="props">
                <div>
                  <q-icon name="phone" size="xs" class="q-mr-xs" />
                  {{ props.row.telefono }}
                </div>
                <div>
                  {{ props.row.email }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-direccion="props">
              <q-td :props="props">
                <div class="flex items-center">
                  <q-icon name="location_on" size="xs" class="q-mr-xs" />
                  {{ props.row.direccion }}
                </div>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Panel de Precios y Comparativa (MERGED) -->
        <q-tab-panel name="precios">
          <!-- SECTION 1: COMPARATIVA -->
          <div class="row items-center q-mb-md">
            <div class="col">
              <div class="text-h6">Comparativa de Proveedores por Producto</div>
              <div class="text-subtitle2 text-grey-7">Seleccione un producto para comparar precios entre proveedores
              </div>
            </div>
          </div>

          <!-- Selector de Producto -->
          <div class="row q-mb-lg q-col-gutter-md">
            <div class="col-12 col-md-8">
              <q-select v-model="productoSeleccionado" :options="productosOptions"
                label="Seleccione un producto para comparar" outlined emit-value map-options
                @update:model-value="actualizarComparativa">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-4">
              <q-btn unelevated color="dark" label="Comparar Proveedores" class="full-width" style="height: 56px"
                :disable="!productoSeleccionado" @click="actualizarComparativa" />
            </div>
          </div>

          <div v-if="productoSeleccionado">
            <!-- Mejor Opción Card -->
            <q-card class="bg-green-1 q-mb-lg border-green">
              <q-card-section>
                <div class="row items-center">
                  <div class="col-auto q-mr-md">
                    <q-avatar color="positive" text-color="white" icon="star" />
                  </div>
                  <div class="col">
                    <div class="text-h6 text-positive">Mejor Opción</div>
                    <div class="text-subtitle1 text-weight-bold">{{ mejorOpcion.proveedor }}</div>
                  </div>
                  <div class="col-auto text-right">
                    <div class="text-caption text-grey-8">Precio</div>
                    <div class="text-h5 text-positive text-weight-bold">Bs. {{ (mejorOpcion.precio || 0).toFixed(2) }}
                    </div>
                  </div>
                  <div class="col-auto q-ml-lg text-right">
                    <div class="text-caption text-grey-8">Disponibilidad</div>
                    <div class="text-subtitle1 text-positive text-weight-bold">Disponible</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Tabla Comparativa -->
            <q-table :rows="datosComparativa" :columns="comparativaColumns" row-key="proveedor" hide-bottom>
              <template v-slot:body-cell-diferencia="props">
                <q-td :props="props">
                  <q-badge v-if="props.row.esMejor" color="black" label="Mejor precio" />
                  <span v-else class="text-negative text-weight-bold">{{ props.value }}</span>
                </q-td>
              </template>
              <template v-slot:body-cell-stock="props">
                <q-td :props="props">
                  <q-badge color="black" label="Disponible" />
                </q-td>
              </template>
              <template v-slot:body-cell-proveedor="props">
                <q-td :props="props">
                  <div class="text-weight-bold">{{ props.value }}</div>
                  <q-badge v-if="props.row.esMejor" color="black" label="Recomendado" class="q-ml-sm" />
                </q-td>
              </template>
            </q-table>

            <!-- Resumen Footer -->
            <div class="row q-mt-lg q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-card flat bordered class="bg-grey-1">
                  <q-card-section>
                    <div class="text-caption text-grey-7">Precio Promedio</div>
                    <div class="text-h6">Bs. {{ (precioPromedio || 0).toFixed(2) }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-4">
                <q-card flat bordered class="bg-grey-1">
                  <q-card-section>
                    <div class="text-caption text-grey-7">Ahorro con Mejor Opción</div>
                    <div class="text-h6 text-positive">Bs. {{ (ahorroMaximo || 0).toFixed(2) }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-4">
                <q-card flat bordered class="bg-grey-1">
                  <q-card-section>
                    <div class="text-caption text-grey-7">Proveedores Disponibles</div>
                    <div class="text-h6">{{ datosComparativa.length }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>

          <q-separator class="q-my-xl" />

          <!-- SECTION 2: HISTORIAL -->
          <div class="row items-center q-mb-md">
            <div class="col">
              <div class="text-h6">Historial de Precios</div>
              <div class="text-subtitle2 text-grey-7">Seguimiento de precios por ítem y proveedor</div>
            </div>
            <div class="col-auto">
              <q-input v-model="historialFilter" outlined dense placeholder="Buscar ítem..." class="q-mr-sm">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>

          <q-table :rows="historialPrecios" :columns="historialPreciosColumns" row-key="id" :filter="historialFilter">
            <template v-slot:body-cell-facturado="props">
              <q-td :props="props">
                <q-badge :color="props.row.facturado ? 'positive' : 'grey'"
                  :label="props.row.facturado ? 'Sí' : 'No'" />
              </q-td>
            </template>

            <template v-slot:body-cell-tendencia="props">
              <q-td :props="props">
                <div class="flex items-center" :class="getTendenciaColor(props.row.tendencia)">
                  <q-icon :name="getTendenciaIcon(props.row.tendencia)" size="sm" class="q-mr-xs" />
                  {{ props.row.tendencia ? props.row.tendencia : 'Sin cambio' }}
                </div>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Diálogo de Nuevo Proveedor -->
    <DialogNuevoProveedor v-model="showNuevoProveedorDialog" @provider-added="onProviderAdded" />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import DialogNuevoProveedor from 'src/components/proveedores/DialogNuevoProveedor.vue';

const $q = useQuasar();

// Control de tabs y diálogos
const activeTab = ref('lista');
const showNuevoProveedorDialog = ref(false);

// Filtros para las tablas
const proveedoresFilter = ref('');
const historialFilter = ref('');

// Estado para comparativa
const productoSeleccionado = ref(null);
const mejorOpcion = ref({});
const datosComparativa = ref([]);

// Opciones de productos (simulado)
const productosOptions = [
  { label: 'EQU-023 - Microscopio Binocular', value: 'microscopio' },
  { label: 'QUI-001 - Ácido Sulfúrico H2SO4 1L', value: 'acido' },
  { label: 'BIO-045 - Guantes de Látex (100 unid)', value: 'guantes' }
];

// Datos reactivos
const proveedores = ref([]);
const historialPrecios = ref([]);
const loading = ref(false);

// Cargar datos iniciales
const loadData = async () => {
  loading.value = true;
  try {
    const [proveedoresData, historialData] = await Promise.all([
      proveedoresService.getProveedores(),
      proveedoresService.getHistorialPrecios()
    ]);
    proveedores.value = proveedoresData.data || proveedoresData;
    historialPrecios.value = historialData.data || historialData;
  } catch (error) {
    console.error('Error cargando datos:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar datos de proveedores'
    });
  } finally {
    loading.value = false;
  }
};

// Cargar al montar
import { onMounted } from 'vue';
import proveedoresService from 'src/services/proveedoresService';

onMounted(() => {
  loadData();
});

// Métodos
const onProviderAdded = async (provider) => {
  try {
    await proveedoresService.createProveedor(provider);
    await loadData(); // Recargar lista

    $q.notify({
      color: 'positive',
      message: `Proveedor ${provider.nombre} agregado correctamente`,
      icon: 'check_circle'
    });
  } catch (error) {
    console.error('Error creando proveedor:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al crear proveedor'
    });
  }
};

const getTendenciaColor = (tendencia) => {
  if (!tendencia) return 'text-grey-7';
  return tendencia.startsWith('-') ? 'text-positive' : 'text-negative';
};

const getTendenciaIcon = (tendencia) => {
  if (!tendencia) return '';
  return tendencia.startsWith('-') ? 'trending_down' : 'trending_up';
};

const actualizarComparativa = (val) => {
  // Simular carga de datos según producto
  if (val === 'microscopio') {
    datosComparativa.value = [
      { proveedor: 'LabEquip Bolivia', precio: 2800.00, esMejor: true, diferencia: 'Mejor precio', ultimaCompra: '2025-10-28' },
      { proveedor: 'BioInsumos Científicos', precio: 3100.00, esMejor: false, diferencia: '+10.7%', ultimaCompra: '2025-10-20' }
    ];
    mejorOpcion.value = { proveedor: 'LabEquip Bolivia', precio: 2800.00 };
  } else if (val === 'acido') {
    datosComparativa.value = [
      { proveedor: 'Química del Sur SRL', precio: 85.00, esMejor: true, diferencia: 'Mejor precio', ultimaCompra: '2025-11-01' },
      { proveedor: 'LabEquip Bolivia', precio: 95.00, esMejor: false, diferencia: '+11.8%', ultimaCompra: '2025-09-15' }
    ];
    mejorOpcion.value = { proveedor: 'Química del Sur SRL', precio: 85.00 };
  } else {
    datosComparativa.value = [];
    mejorOpcion.value = {};
  }
};

const precioPromedio = computed(() => {
  if (datosComparativa.value.length === 0) return 0;
  const total = datosComparativa.value.reduce((acc, curr) => acc + curr.precio, 0);
  return total / datosComparativa.value.length;
});

const ahorroMaximo = computed(() => {
  if (datosComparativa.value.length === 0) return 0;
  const maxPrecio = Math.max(...datosComparativa.value.map(d => d.precio));
  return maxPrecio - mejorOpcion.value.precio;
});

// Columnas para las tablas
const proveedoresColumns = [
  { name: 'nombre', align: 'left', label: 'Proveedor', field: 'nombre', sortable: true },
  { name: 'nit', align: 'left', label: 'NIT', field: 'nit' },
  { name: 'contacto', align: 'left', label: 'Contacto', field: 'contacto' },
  { name: 'direccion', align: 'left', label: 'Dirección', field: 'direccion' },
  { name: 'itemsSuministrados', align: 'center', label: 'Ítems Suministrados', field: 'itemsSuministrados' }
];

// CRÍTICO: Columnas para el historial de precios, incluyendo las nuevas columnas
const historialPreciosColumns = [
  { name: 'fecha', align: 'left', label: 'Fecha', field: 'fecha_vigencia', sortable: true, format: val => new Date(val).toLocaleDateString() },
  { name: 'item', align: 'left', label: 'Ítem', field: row => row.item?.nombre || 'N/A' },
  { name: 'proveedor', align: 'left', label: 'Proveedor', field: row => row.proveedor?.nombre || 'N/A' },
  { name: 'precioBruto', align: 'right', label: 'Precio (Bs.)', field: 'precio', format: val => `Bs. ${Number(val).toFixed(2)}` },
  { name: 'moneda', align: 'center', label: 'Moneda', field: 'moneda' },
  { name: 'observaciones', align: 'left', label: 'Observaciones', field: 'observaciones' }
];

const comparativaColumns = [
  { name: 'proveedor', align: 'left', label: 'Proveedor', field: 'proveedor' },
  { name: 'precio', align: 'right', label: 'Precio Actual', field: 'precio', format: val => `Bs. ${Number(val || 0).toFixed(2)}` },
  { name: 'diferencia', align: 'center', label: 'Diferencia vs Mejor', field: 'diferencia' },
  { name: 'ultimaCompra', align: 'center', label: 'Última Compra', field: 'ultimaCompra' },
  { name: 'stock', align: 'center', label: 'Stock', field: 'stock' }
];
</script>

<style scoped>
.text-positive {
  color: #21ba45;
}

.text-negative {
  color: #c10015;
}
</style>
