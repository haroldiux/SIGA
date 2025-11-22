<template>
  <div class="toma-inventario">
    <q-card flat bordered>
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6">Toma de Inventario Físico</div>
          <q-btn 
            v-if="!sesionActiva"
            color="primary" 
            icon="play_arrow" 
            label="Iniciar Nueva Toma" 
            @click="iniciarToma"
          />
          <div v-else class="row q-gutter-sm">
            <q-btn flat color="grey" label="Cancelar" @click="cancelarToma" />
            <q-btn color="positive" icon="save" label="Finalizar y Guardar" @click="finalizarToma" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="!sesionActiva">
        <div class="text-center q-pa-xl text-grey-7">
          <q-icon name="inventory" size="64px" />
          <div class="text-h6 q-mt-md">No hay una toma de inventario activa</div>
          <p>Inicie una nueva sesión para comenzar el conteo físico de una ubicación.</p>
        </div>
      </q-card-section>

      <q-card-section v-else>
        <!-- Cabecera de la sesión -->
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-md-4">
            <q-select
              v-model="sesion.ubicacion"
              :options="ubicaciones"
              label="Ubicación *"
              outlined
              dense
              :disable="items.length > 0"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="sesion.responsable"
              label="Responsable"
              outlined
              dense
              readonly
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="sesion.fecha"
              label="Fecha"
              outlined
              dense
              readonly
            />
          </div>
        </div>

        <!-- Tabla de Conteo -->
        <q-table
          :rows="items"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :filter="filter"
          :pagination="{ rowsPerPage: 0 }"
        >
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar item...">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" :class="getRowClass(props.row)">
              <q-td key="codigo" :props="props">{{ props.row.codigo }}</q-td>
              <q-td key="nombre" :props="props">{{ props.row.nombre }}</q-td>
              <q-td key="sistema" :props="props">
                <span v-if="mostrarSistema" class="text-weight-bold">{{ props.row.stockSistema }}</span>
                <span v-else class="text-grey-5">???</span>
              </q-td>
              <q-td key="fisico" :props="props">
                <q-input
                  v-model.number="props.row.conteoFisico"
                  type="number"
                  dense
                  outlined
                  style="max-width: 100px"
                  min="0"
                  @update:model-value="calcularDiferencia(props.row)"
                />
              </q-td>
              <q-td key="diferencia" :props="props">
                <q-badge v-if="props.row.conteoFisico !== null && mostrarSistema" :color="getDiffColor(props.row.diferencia)">
                  {{ props.row.diferencia > 0 ? '+' : '' }}{{ props.row.diferencia }}
                </q-badge>
              </q-td>
              <q-td key="estado" :props="props">
                <q-icon 
                  v-if="props.row.conteoFisico !== null" 
                  name="check_circle" 
                  color="positive" 
                />
                <q-icon v-else name="radio_button_unchecked" color="grey" />
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <div class="row justify-between items-center q-mt-md">
          <q-checkbox v-model="mostrarSistema" label="Mostrar Stock del Sistema (para auditoría)" />
          <div class="text-subtitle2">
            Progreso: {{ itemsContados }} / {{ items.length }} items
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
// import { useMainStore } from 'src/stores/store-main';

const $q = useQuasar();
// const store = useMainStore();

const sesionActiva = ref(false);
const filter = ref('');
const mostrarSistema = ref(false);

const sesion = ref({
  ubicacion: null,
  responsable: '',
  fecha: ''
});

const ubicaciones = ['Almacén Central', 'Lab. Química', 'Lab. Física', 'Lab. Biología'];

const items = ref([]);

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'nombre', label: 'Item', field: 'nombre', align: 'left', sortable: true },
  { name: 'sistema', label: 'Stock Sistema', field: 'stockSistema', align: 'center' },
  { name: 'fisico', label: 'Conteo Físico', field: 'conteoFisico', align: 'center' },
  { name: 'diferencia', label: 'Diferencia', field: 'diferencia', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' }
];

const itemsContados = computed(() => {
  return items.value.filter(i => i.conteoFisico !== null).length;
});

const iniciarToma = () => {
  sesionActiva.value = true;
  sesion.value = {
    ubicacion: null,
    responsable: 'Usuario Actual', // Tomar del store
    fecha: new Date().toLocaleString()
  };
  
  // Cargar items simulados
  items.value = [
    { id: 1, codigo: 'REACT-001', nombre: 'Ácido Sulfúrico', stockSistema: 10, conteoFisico: null, diferencia: 0 },
    { id: 2, codigo: 'MAT-005', nombre: 'Pipetas 10ml', stockSistema: 25, conteoFisico: null, diferencia: 0 },
    { id: 3, codigo: 'EQUI-012', nombre: 'Microscopio Básico', stockSistema: 5, conteoFisico: null, diferencia: 0 },
    { id: 4, codigo: 'MOB-001', nombre: 'Silla de Laboratorio', stockSistema: 15, conteoFisico: null, diferencia: 0 },
    { id: 5, codigo: 'REACT-002', nombre: 'Alcohol Etílico', stockSistema: 8, conteoFisico: null, diferencia: 0 },
  ];
};

const calcularDiferencia = (row) => {
  if (row.conteoFisico !== null) {
    row.diferencia = row.conteoFisico - row.stockSistema;
  }
};

const getDiffColor = (diff) => {
  if (diff === 0) return 'positive';
  if (diff < 0) return 'negative';
  return 'warning';
};

const getRowClass = (row) => {
  if (row.conteoFisico !== null && mostrarSistema.value) {
    if (row.diferencia !== 0) return 'bg-red-1';
    return 'bg-green-1';
  }
  return '';
};

const cancelarToma = () => {
  $q.dialog({
    title: 'Cancelar Toma',
    message: '¿Estás seguro? Se perderán los datos no guardados.',
    cancel: true,
    persistent: true
  }).onOk(() => {
    sesionActiva.value = false;
    items.value = [];
  });
};

const finalizarToma = () => {
  if (itemsContados.value < items.value.length) {
    $q.dialog({
      title: 'Items Pendientes',
      message: 'Hay items sin contar. ¿Deseas finalizar de todos modos? (Los no contados se asumirán como 0 o se ignorarán según configuración)',
      cancel: true,
      persistent: true
    }).onOk(() => {
      procesarFinalizacion();
    });
  } else {
    procesarFinalizacion();
  }
};

const procesarFinalizacion = () => {
  $q.loading.show({ message: 'Procesando inventario...' });
  setTimeout(() => {
    $q.loading.hide();
    $q.notify({
      type: 'positive',
      message: 'Toma de inventario guardada exitosamente',
      icon: 'check_circle'
    });
    sesionActiva.value = false;
  }, 1500);
};
</script>
