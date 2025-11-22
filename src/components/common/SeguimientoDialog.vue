<template>
  <q-dialog v-model="isOpen">
    <q-card style="min-width: 600px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle2 text-grey-7 q-mb-md">
          Historial de estados y movimientos
        </div>

        <q-timeline color="primary">
          <q-timeline-entry
            v-for="(step, index) in steps"
            :key="index"
            :title="step.titulo"
            :subtitle="step.fecha"
            :color="step.color || 'primary'"
            :icon="step.icon"
          >
            <div>
              {{ step.descripcion }}
              <div v-if="step.usuario" class="text-caption text-grey-7 q-mt-xs">
                <q-icon name="person" size="xs" /> {{ step.usuario }}
              </div>
            </div>
          </q-timeline-entry>
        </q-timeline>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineModel } from 'vue';

const isOpen = defineModel('modelValue');
const props = defineProps({
  title: {
    type: String,
    default: 'Seguimiento'
  },
  steps: {
    type: Array,
    default: () => []
  }
});
</script>
