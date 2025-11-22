<template>
  <div class="system-config">
    <div class="row q-col-gutter-lg">
      <!-- Configuración General -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-h6 text-primary q-mb-md">Variables Globales</div>
            
            <q-form @submit="guardarConfig" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model.number="config.iva"
                    label="IVA (%)"
                    outlined
                    type="number"
                    suffix="%"
                    :rules="[
                      val => val >= 0 && val <= 100 || 'Debe ser entre 0 y 100'
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="percent" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-sm-6">
                  <q-input
                    v-model.number="config.incrementoSinIva"
                    label="Incremento sin IVA (%)"
                    outlined
                    type="number"
                    suffix="%"
                    :rules="[
                      val => val >= 0 && val <= 100 || 'Debe ser entre 0 y 100'
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="trending_up" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12">
                  <q-select
                    v-model="config.monedaPrincipal"
                    :options="['BOB', 'USD', 'EUR']"
                    label="Moneda Principal"
                    outlined
                  >
                    <template v-slot:prepend>
                      <q-icon name="payments" />
                    </template>
                  </q-select>
                </div>

                <div class="col-12">
                  <q-toggle
                    v-model="config.notificacionesEmail"
                    label="Habilitar notificaciones por correo electrónico"
                  />
                </div>
              </div>

              <div class="row justify-end q-mt-lg">
                <q-btn 
                  type="submit" 
                  label="Guardar Cambios" 
                  color="primary" 
                  icon="save"
                  :loading="guardandoConfig"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Gestión de Sedes -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6 text-primary">Sedes / Sucursales</div>
            <q-btn 
              color="secondary" 
              icon="add_location" 
              label="Nueva Sede" 
              size="sm"
              @click="abrirDialogoSede()"
            />
          </q-card-section>

          <q-separator />

          <q-list separator>
            <q-item v-for="sede in config.sedes" :key="sede.id">
              <q-item-section avatar>
                <q-avatar color="secondary" text-color="white" icon="store" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold">{{ sede.nombre }}</q-item-label>
                <q-item-label caption>{{ sede.direccion }}</q-item-label>
                <q-item-label caption class="text-grey-8">
                  <q-icon name="phone" size="xs" /> {{ sede.telefono }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn flat round dense icon="edit" color="primary" @click="abrirDialogoSede(sede)" />
                  <q-btn flat round dense icon="delete" color="negative" @click="confirmarEliminarSede(sede)" />
                </div>
              </q-item-section>
            </q-item>

            <q-item v-if="!config.sedes || config.sedes.length === 0">
              <q-item-section class="text-center text-grey">
                No hay sedes registradas
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Diálogo Sede -->
    <BaseModal
      v-model="mostrarDialogoSede"
      :title="sedeEditando ? 'Editar Sede' : 'Nueva Sede'"
    >
      <template #body>
        <q-form ref="formSede" class="q-gutter-md">
          <q-input
            v-model="sedeForm.nombre"
            label="Nombre de la Sede *"
            outlined
            :rules="[val => !!val || 'Requerido']"
          />
          <q-input
            v-model="sedeForm.direccion"
            label="Dirección *"
            outlined
            type="textarea"
            rows="2"
            :rules="[val => !!val || 'Requerido']"
          />
          <q-input
            v-model="sedeForm.telefono"
            label="Teléfono"
            outlined
          />
        </q-form>
      </template>
      <template #actions>
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn color="primary" label="Guardar" @click="guardarSede" />
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import adminService from 'src/services/adminService';
import BaseModal from 'src/components/common/BaseModal.vue';

const $q = useQuasar();

const config = ref({
  iva: 13,
  incrementoSinIva: 0,
  monedaPrincipal: 'BOB',
  notificacionesEmail: false,
  sedes: []
});

const guardandoConfig = ref(false);
const mostrarDialogoSede = ref(false);
const sedeEditando = ref(null);
const sedeForm = ref({
  nombre: '',
  direccion: '',
  telefono: ''
});
const formSede = ref(null);

onMounted(async () => {
  try {
    const data = await adminService.getConfig();
    config.value = data;
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar configuración' });
  }
});

const guardarConfig = async () => {
  guardandoConfig.value = true;
  try {
    await adminService.updateConfig(config.value);
    $q.notify({ type: 'positive', message: 'Configuración guardada correctamente' });
  } catch {
    $q.notify({ type: 'negative', message: 'Error al guardar configuración' });
  } finally {
    guardandoConfig.value = false;
  }
};

const abrirDialogoSede = (sede = null) => {
  sedeEditando.value = sede;
  if (sede) {
    sedeForm.value = { ...sede };
  } else {
    sedeForm.value = { nombre: '', direccion: '', telefono: '' };
  }
  mostrarDialogoSede.value = true;
};

const guardarSede = async () => {
  const valid = await formSede.value.validate();
  if (!valid) return;

  try {
    if (sedeEditando.value) {
      await adminService.updateSede(sedeEditando.value.id, sedeForm.value);
      // Actualizar localmente
      const index = config.value.sedes.findIndex(s => s.id === sedeEditando.value.id);
      if (index !== -1) config.value.sedes[index] = { ...sedeForm.value, id: sedeEditando.value.id };
      $q.notify({ type: 'positive', message: 'Sede actualizada' });
    } else {
      const nuevaSede = await adminService.createSede(sedeForm.value);
      config.value.sedes.push(nuevaSede);
      $q.notify({ type: 'positive', message: 'Sede creada' });
    }
    mostrarDialogoSede.value = false;
  } catch {
    $q.notify({ type: 'negative', message: 'Error al guardar sede' });
  }
};

const confirmarEliminarSede = (sede) => {
  $q.dialog({
    title: 'Eliminar Sede',
    message: `¿Estás seguro de eliminar la sede "${sede.nombre}"?`,
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(async () => {
    try {
      await adminService.deleteSede(sede.id);
      config.value.sedes = config.value.sedes.filter(s => s.id !== sede.id);
      $q.notify({ type: 'positive', message: 'Sede eliminada' });
    } catch {
      $q.notify({ type: 'negative', message: 'Error al eliminar sede' });
    }
  });
};
</script>
