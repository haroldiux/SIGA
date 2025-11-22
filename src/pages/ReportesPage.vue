<!-- src/pages/ReportesPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h4 q-my-none">Reportes</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm q-mb-none">
          Generación de reportes y análisis del sistema
        </p>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="download" label="Exportar Reporte" @click="exportarReporte" />
      </div>
    </div>

    <!-- Selector de tipo de reporte -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Tipo de Reporte</div>
            <q-select
              v-model="tipoReporte"
              :options="tipoReporteOptions"
              label="Seleccionar tipo de reporte"
              outlined
              emit-value
              map-options
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Filtros</div>
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  v-model="fechaInicio"
                  label="Fecha Inicio"
                  outlined
                  type="date"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="fechaFin"
                  label="Fecha Fin"
                  outlined
                  type="date"
                />
              </div>
              <div class="col-6">
                <q-select
                  v-model="ubicacionReporte"
                  :options="ubicacionOptions"
                  label="Ubicación"
                  outlined
                  emit-value
                  map-options
                />
              </div>
              <div class="col-6">
                <q-select
                  v-model="categoriaReporte"
                  :options="categoriaOptions"
                  label="Categoría"
                  outlined
                  emit-value
                  map-options
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" label="Generar Reporte" @click="generarReporte" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Reportes rápidos -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12">
        <div class="text-h6 q-mb-md">Reportes Rápidos</div>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="cursor-pointer" @click="generarReporteRapido('inventario')">
          <q-card-section class="text-center">
            <q-icon name="inventory" size="3rem" class="text-primary" />
            <div class="text-h6 q-mt-md">Inventario Actual</div>
            <div class="text-caption text-grey-7">Stock de todos los ítems</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="cursor-pointer" @click="generarReporteRapido('stock_bajo')">
          <q-card-section class="text-center">
            <q-icon name="warning" size="3rem" class="text-warning" />
            <div class="text-h6 q-mt-md">Stock Bajo</div>
            <div class="text-caption text-grey-7">Ítems que requieren reposición</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="cursor-pointer" @click="generarReporteRapido('prestamos')">
          <q-card-section class="text-center">
            <q-icon name="handshake" size="3rem" class="text-blue" />
            <div class="text-h6 q-mt-md">Préstamos Activos</div>
            <div class="text-caption text-grey-7">Estado de préstamos</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="cursor-pointer" @click="generarReporteRapido('movimientos')">
          <q-card-section class="text-center">
            <q-icon name="timeline" size="3rem" class="text-green" />
            <div class="text-h6 q-mt-md">Movimientos</div>
            <div class="text-caption text-grey-7">Historial del mes</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Visualización del reporte -->
    <div v-if="reporteGenerado" class="q-mb-lg">
      <q-card>
        <q-card-section>
          <div class="row items-center q-mb-md">
            <div class="col">
              <div class="text-h6">{{ reporteActual.titulo }}</div>
              <div class="text-caption text-grey-7">Generado el {{ reporteActual.fecha }}</div>
            </div>
            <div class="col-auto">
              <q-btn flat round dense icon="close" @click="cerrarReporte" />
            </div>
          </div>

          <!-- Gráfico de ejemplo -->
          <div v-if="reporteActual.tipo === 'inventario'" class="q-mb-md">
            <div class="text-subtitle1 q-mb-sm">Distribución de Stock por Categoría</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-linear-progress 
                  size="25px" 
                  :value="0.45" 
                  color="primary"
                  class="q-mb-sm"
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge color="white" text-color="primary" label="Reactivos: 45%" />
                  </div>
                </q-linear-progress>
                <q-linear-progress 
                  size="25px" 
                  :value="0.30" 
                  color="blue"
                  class="q-mb-sm"
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge color="white" text-color="blue" label="Material: 30%" />
                  </div>
                </q-linear-progress>
                <q-linear-progress 
                  size="25px" 
                  :value="0.25" 
                  color="green"
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge color="white" text-color="green" label="Equipamiento: 25%" />
                  </div>
                </q-linear-progress>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-subtitle2 q-mb-sm">Resumen</div>
                <div class="q-pa-md bg-grey-2 rounded-borders">
                  <div class="row q-col-gutter-sm">
                    <div class="col-6">
                      <div class="text-caption text-grey-7">Total Ítems</div>
                      <div class="text-h6">{{ datosReporte.totalItems }}</div>
                    </div>
                    <div class="col-6">
                      <div class="text-caption text-grey-7">Valor Total</div>
                      <div class="text-h6">Bs. {{ datosReporte.valorTotal }}</div>
                    </div>
                    <div class="col-6">
                      <div class="text-caption text-grey-7">Stock Bajo</div>
                      <div class="text-h6 text-warning">{{ datosReporte.stockBajo }}</div>
                    </div>
                    <div class="col-6">
                      <div class="text-caption text-grey-7">Sin Stock</div>
                      <div class="text-h6 text-negative">{{ datosReporte.sinStock }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabla de datos -->
          <q-table
            :rows="reporteActual.datos"
            :columns="reporteActual.columnas"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-badge
                  :color="getEstadoBadgeColor(props.value)"
                  :label="props.value"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <!-- Historial de reportes generados -->
    <div>
      <div class="text-h6 q-mb-md">Historial de Reportes</div>
      <q-card>
        <q-list separator>
          <q-item v-for="reporte in historialReportes" :key="reporte.id" clickable>
            <q-item-section avatar>
              <q-icon :name="reporte.icono" :color="reporte.color" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ reporte.nombre }}</q-item-label>
              <q-item-label caption>{{ reporte.descripcion }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{ reporte.fecha }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round dense icon="download" color="primary">
                <q-tooltip>Descargar</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

// Estado
const tipoReporte = ref('inventario');
const fechaInicio = ref('');
const fechaFin = ref('');
const ubicacionReporte = ref(null);
const categoriaReporte = ref(null);
const reporteGenerado = ref(false);
const reporteActual = ref({});

// Opciones
const tipoReporteOptions = [
  { label: 'Inventario General', value: 'inventario' },
  { label: 'Stock Bajo', value: 'stock_bajo' },
  { label: 'Movimientos de Inventario', value: 'movimientos' },
  { label: 'Préstamos', value: 'prestamos' },
  { label: 'Traspasos', value: 'traspasos' },
  { label: 'Órdenes de Compra', value: 'compras' },
  { label: 'Consumo Periódico (Semestral)', value: 'consumo' },
  { label: 'Valorización de Inventario', value: 'valorizacion' }
];

const ubicacionOptions = [
  { label: 'Todas las ubicaciones', value: null },
  { label: 'Lab. Química', value: 'lab_quimica' },
  { label: 'Lab. Física', value: 'lab_fisica' },
  { label: 'Lab. Biología', value: 'lab_biologia' },
  { label: 'Almacén Central', value: 'almacen_central' }
];

const categoriaOptions = [
  { label: 'Todas las categorías', value: null },
  { label: 'Reactivos Químicos', value: 'reactivos' },
  { label: 'Material de Laboratorio', value: 'material' },
  { label: 'Equipamiento', value: 'equipamiento' },
  { label: 'Bioseguridad', value: 'bioseguridad' }
];

// Datos de ejemplo
const datosReporte = ref({
  totalItems: 156,
  valorTotal: 45780,
  stockBajo: 12,
  sinStock: 3
});

const historialReportes = ref([
  {
    id: 1,
    nombre: 'Inventario General - Noviembre 2025',
    descripcion: 'Reporte completo de inventario',
    fecha: '2025-11-20',
    icono: 'inventory',
    color: 'primary'
  },
  {
    id: 2,
    nombre: 'Stock Bajo - Noviembre 2025',
    descripcion: 'Ítems con stock bajo',
    fecha: '2025-11-19',
    icono: 'warning',
    color: 'warning'
  },
  {
    id: 3,
    nombre: 'Préstamos Activos',
    descripcion: 'Estado de préstamos del mes',
    fecha: '2025-11-18',
    icono: 'handshake',
    color: 'blue'
  }
]);

// Métodos
const generarReporte = () => {
  $q.loading.show({ message: 'Generando reporte...' });

  setTimeout(() => {
    reporteGenerado.value = true;
    reporteActual.value = {
      tipo: tipoReporte.value,
      titulo: getTituloReporte(tipoReporte.value),
      fecha: new Date().toLocaleDateString('es-BO'),
      datos: getDatosReporte(tipoReporte.value),
      columnas: getColumnasReporte(tipoReporte.value)
    };

    $q.loading.hide();
    $q.notify({
      color: 'positive',
      message: 'Reporte generado exitosamente',
      icon: 'check_circle'
    });
  }, 1000);
};

const generarReporteRapido = (tipo) => {
  tipoReporte.value = tipo;
  generarReporte();
};

const exportarReporte = () => {
  $q.notify({
    color: 'info',
    message: 'Exportando reporte a Excel...',
    icon: 'download'
  });
};

const cerrarReporte = () => {
  reporteGenerado.value = false;
  reporteActual.value = {};
};

const getTituloReporte = (tipo) => {
  const titulos = {
    inventario: 'Reporte de Inventario General',
    stock_bajo: 'Reporte de Stock Bajo',
    movimientos: 'Reporte de Movimientos',
    prestamos: 'Reporte de Préstamos Activos',
    consumo: 'Reporte de Consumo Periódico',
    valorizacion: 'Resumen de Stock y Valorización'
  };
  return titulos[tipo] || 'Reporte';
};

const getDatosReporte = (tipo) => {
  // Datos de ejemplo
  const datos = {
    inventario: [
      { id: 1, codigo: 'QUI-001', nombre: 'Ácido Sulfúrico H2SO4', categoria: 'Reactivos', stock: 5, estado: 'Stock Bajo' },
      { id: 2, codigo: 'BIO-045', nombre: 'Guantes de Látex', categoria: 'Bioseguridad', stock: 12, estado: 'Stock Bajo' },
      { id: 3, codigo: 'EQU-010', nombre: 'Microscopio Binocular', categoria: 'Equipamiento', stock: 10, estado: 'Normal' }
    ],
    stock_bajo: [
      { id: 1, codigo: 'QUI-001', nombre: 'Ácido Sulfúrico H2SO4', stockActual: 5, stockMinimo: 20, deficit: 15 },
      { id: 2, codigo: 'BIO-045', nombre: 'Guantes de Látex', stockActual: 12, stockMinimo: 50, deficit: 38 }
    ],
    movimientos: [
      { id: 1, fecha: '2025-11-20', tipo: 'Entrada', item: 'Pipetas 10ml', cantidad: 50, ubicacion: 'Lab. Química' },
      { id: 2, fecha: '2025-11-19', tipo: 'Salida', item: 'Guantes de Látex', cantidad: 20, ubicacion: 'Lab. Biología' }
    ],
    prestamos: [
      { id: 1, codigo: 'PRES-001', item: 'Microscopio Binocular', solicitante: 'Juan Pérez', fechaDevolucion: '2025-11-25', estado: 'Activo' },
      { id: 2, codigo: 'PRES-002', item: 'Balanza Analítica', solicitante: 'María García', fechaDevolucion: '2025-11-15', estado: 'Vencido' }
    ],
    consumo: [
      { id: 1, item: 'Ácido Sulfúrico', categoria: 'Reactivos', consumoSemestral: 150, unidad: 'Litros', costoTotal: 4500 },
      { id: 2, item: 'Guantes de Látex', categoria: 'Bioseguridad', consumoSemestral: 500, unidad: 'Cajas', costoTotal: 12500 },
      { id: 3, item: 'Pipetas Pasteur', categoria: 'Material', consumoSemestral: 1200, unidad: 'Unidades', costoTotal: 2400 }
    ],
    valorizacion: [
      { id: 1, categoria: 'Reactivos Químicos', items: 45, stockTotal: 1200, valorNeto: 25000 },
      { id: 2, categoria: 'Material de Vidrio', items: 120, stockTotal: 5000, valorNeto: 15000 },
      { id: 3, categoria: 'Equipamiento', items: 15, stockTotal: 15, valorNeto: 150000 },
      { id: 4, categoria: 'Bioseguridad', items: 30, stockTotal: 800, valorNeto: 8500 }
    ]
  };
  return datos[tipo] || [];
};

const getColumnasReporte = (tipo) => {
  const columnas = {
    inventario: [
      { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
      { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre', sortable: true },
      { name: 'categoria', align: 'left', label: 'Categoría', field: 'categoria' },
      { name: 'stock', align: 'center', label: 'Stock', field: 'stock', sortable: true },
      { name: 'estado', align: 'center', label: 'Estado', field: 'estado' }
    ],
    stock_bajo: [
      { name: 'codigo', align: 'left', label: 'Código', field: 'codigo' },
      { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre' },
      { name: 'stockActual', align: 'center', label: 'Stock Actual', field: 'stockActual' },
      { name: 'stockMinimo', align: 'center', label: 'Stock Mínimo', field: 'stockMinimo' },
      { name: 'deficit', align: 'center', label: 'Déficit', field: 'deficit' }
    ],
    movimientos: [
      { name: 'fecha', align: 'left', label: 'Fecha', field: 'fecha', sortable: true },
      { name: 'tipo', align: 'left', label: 'Tipo', field: 'tipo' },
      { name: 'item', align: 'left', label: 'Ítem', field: 'item' },
      { name: 'cantidad', align: 'center', label: 'Cantidad', field: 'cantidad' },
      { name: 'ubicacion', align: 'left', label: 'Ubicación', field: 'ubicacion' }
    ],
    prestamos: [
      { name: 'codigo', align: 'left', label: 'Código', field: 'codigo' },
      { name: 'item', align: 'left', label: 'Ítem', field: 'item' },
      { name: 'solicitante', align: 'left', label: 'Solicitante', field: 'solicitante' },
      { name: 'fechaDevolucion', align: 'center', label: 'Fecha Devolución', field: 'fechaDevolucion' },
      { name: 'estado', align: 'center', label: 'Estado', field: 'estado' }
    ],
    consumo: [
      { name: 'item', align: 'left', label: 'Ítem', field: 'item', sortable: true },
      { name: 'categoria', align: 'left', label: 'Categoría', field: 'categoria', sortable: true },
      { name: 'consumoSemestral', align: 'center', label: 'Consumo (Semestral)', field: 'consumoSemestral', sortable: true },
      { name: 'unidad', align: 'center', label: 'Unidad', field: 'unidad' },
      { name: 'costoTotal', align: 'right', label: 'Costo Total (Bs)', field: 'costoTotal', sortable: true, format: val => `${val.toFixed(2)}` }
    ],
    valorizacion: [
      { name: 'categoria', align: 'left', label: 'Categoría', field: 'categoria', sortable: true },
      { name: 'items', align: 'center', label: 'Cant. Ítems', field: 'items', sortable: true },
      { name: 'stockTotal', align: 'center', label: 'Stock Total', field: 'stockTotal' },
      { name: 'valorNeto', align: 'right', label: 'Valor Neto (Bs)', field: 'valorNeto', sortable: true, format: val => `${val.toFixed(2)}` }
    ]
  };
  return columnas[tipo] || [];
};

const getEstadoBadgeColor = (estado) => {
  const colores = {
    'Normal': 'positive',
    'Stock Bajo': 'warning',
    'Agotado': 'negative',
    'Activo': 'primary',
    'Vencido': 'negative'
  };
  return colores[estado] || 'grey';
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: transform 0.2s;
}

.cursor-pointer:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
