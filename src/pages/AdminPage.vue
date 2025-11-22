<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <h1 class="text-h4 q-my-none text-primary">Administración del Sistema</h1>
        <div class="text-subtitle1 text-grey-7">Gestión de usuarios, roles y configuración global</div>
      </div>
    </div>

    <q-card flat bordered>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="usuarios" icon="people" label="Gestión de Usuarios" />
        <q-tab name="roles" icon="admin_panel_settings" label="Roles y Permisos" />
        <q-tab name="config" icon="settings" label="Configuración del Sistema" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- Panel de Usuarios -->
        <q-tab-panel name="usuarios">
          <div class="text-center q-pa-xl text-grey-6">
            <q-icon name="engineering" size="64px" />
            <div class="text-h6 q-mt-md">Módulo de Usuarios en Construcción</div>
            <div>Próximamente podrás gestionar usuarios y sus asignaciones aquí.</div>
          </div>
        </q-tab-panel>

        <!-- Panel de Roles -->
        <q-tab-panel name="roles" class="q-pa-none">
          <div class="q-pa-md">
            <RolesManager />
          </div>
        </q-tab-panel>

        <!-- Panel de Configuración -->
        <q-tab-panel name="config">
          <SystemConfig />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import RolesManager from 'src/components/admin/RolesManager.vue';
import SystemConfig from 'src/components/admin/SystemConfig.vue';

const tab = ref('roles'); // Iniciar en roles por defecto para probar lo nuevo
</script>
