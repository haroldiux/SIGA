<template>
  <q-item 
    clickable 
    :class="{ 'bg-blue-1': !notification.leida }"
    @click="$emit('action-click', notification)"
  >
    <q-item-section avatar>
      <q-avatar :color="getColor(notification.tipo)" text-color="white" :icon="notification.icono || 'notifications'" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-weight-bold">{{ notification.titulo }}</q-item-label>
      <q-item-label caption lines="2">{{ notification.mensaje }}</q-item-label>
      <q-item-label caption class="text-grey-6">
        {{ formatFecha(notification.fecha) }}
      </q-item-label>
    </q-item-section>

    <q-item-section side top>
      <div class="row items-center q-gutter-xs">
        <q-btn 
          v-if="!notification.leida"
          flat 
          dense 
          round 
          size="sm" 
          icon="check" 
          color="primary"
          @click.stop="$emit('mark-read', notification.id)"
        >
          <q-tooltip>Marcar como leída</q-tooltip>
        </q-btn>
        <q-btn 
          flat 
          dense 
          round 
          size="sm" 
          icon="close" 
          color="grey-7"
          @click.stop="$emit('delete', notification.id)"
        >
          <q-tooltip>Eliminar</q-tooltip>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

defineEmits(['mark-read', 'delete', 'action-click']);

const getColor = (tipo) => {
  const colors = {
    success: 'positive',
    error: 'negative',
    warning: 'warning',
    info: 'info',
  };
  return colors[tipo] || 'primary';
};

const formatFecha = (fecha) => {
  try {
    return formatDistanceToNow(new Date(fecha), { addSuffix: true, locale: es });
  } catch {
    return 'Hace un momento';
  }
};
</script>
