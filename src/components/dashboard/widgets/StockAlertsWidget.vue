<template>
  <q-card flat bordered class="full-height">
    <q-card-section class="row items-center justify-between q-pb-none">
      <div class="text-h6 text-negative">
        <q-icon name="warning" class="q-mr-sm" />
        Alertas de Stock
      </div>
      <q-btn flat round dense icon="refresh" @click="cargarAlertas" :loading="loading" />
    </q-card-section>

    <q-card-section>
      <div v-if="loading" class="row justify-center q-pa-md">
        <q-spinner color="primary" size="2em" />
      </div>

      <div v-else-if="alertas.length === 0" class="text-center text-grey q-pa-md">
        <q-icon name="check_circle" size="48px" color="positive" />
        <div class="q-mt-sm">Todo el inventario está en niveles óptimos</div>
      </div>

      <q-list v-else separator>
        <q-item v-for="item in alertas" :key="item.id" clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="red-1" text-color="negative" icon="inventory_2" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold">{{ item.nombre }}</q-item-label>
            <q-item-label caption>
              Código: {{ item.codigo }} | Ubicación: {{ item.ubicacion }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="column items-end">
              <q-badge color="negative" class="q-mb-xs">
                {{ item.cantidad }} / {{ item.minimo }}
              </q-badge>
              <q-btn 
                flat 
                dense 
                size="sm" 
                color="primary" 
                label="Solicitar" 
                @click="$emit('solicitar', item)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import inventarioService from 'src/services/inventarioService';

const alertas = ref([]);
const loading = ref(false);

const cargarAlertas = async () => {
  loading.value = true;
  try {
    // Simulación de datos si el servicio devuelve vacío
    const response = await inventarioService.getAlertasStock();
    if (response.data && response.data.length > 0) {
      alertas.value = response.data;
    } else {
      // Datos simulados para demostración
      alertas.value = [
        { id: 1, codigo: 'REACT-001', nombre: 'Ácido Sulfúrico', cantidad: 2, minimo: 10, ubicacion: 'Lab. Química' },
        { id: 2, codigo: 'MAT-005', nombre: 'Pipetas 10ml', cantidad: 5, minimo: 20, ubicacion: 'Almacén Central' },
        { id: 3, codigo: 'EQUI-012', nombre: 'Microscopio Básico', cantidad: 1, minimo: 5, ubicacion: 'Lab. Biología' }
      ];
    }
  } catch (error) {
    console.error('Error cargando alertas', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  cargarAlertas();
});
</script>
