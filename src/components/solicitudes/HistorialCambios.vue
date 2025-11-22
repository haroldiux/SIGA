<template>
  <div class="historial-cambios">
    <q-timeline color="primary">
      <q-timeline-entry
        v-for="(cambio, index) in cambios"
        :key="index"
        :title="cambio.accion"
        :subtitle="formatFecha(cambio.fecha)"
        :icon="getIcon(cambio.tipo)"
        :color="getColor(cambio.tipo)"
      >
        <div class="text-body2">
          <div class="text-weight-bold">{{ cambio.usuario }}</div>
          <div v-if="cambio.detalles" class="q-mt-xs">{{ cambio.detalles }}</div>
          <div v-if="cambio.comentario" class="q-mt-xs text-italic text-grey-7">
            "{{ cambio.comentario }}"
          </div>
        </div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup>
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

defineProps({
  cambios: {
    type: Array,
    default: () => [],
  },
});

const getIcon = (tipo) => {
  const icons = {
    creacion: 'add_circle',
    aprobacion: 'check_circle',
    rechazo: 'cancel',
    modificacion: 'edit',
    comentario: 'comment',
    documento: 'attach_file',
  };
  return icons[tipo] || 'circle';
};

const getColor = (tipo) => {
  const colors = {
    creacion: 'primary',
    aprobacion: 'positive',
    rechazo: 'negative',
    modificacion: 'warning',
    comentario: 'info',
    documento: 'purple',
  };
  return colors[tipo] || 'grey';
};

const formatFecha = (fecha) => {
  try {
    return formatDistanceToNow(new Date(fecha), { addSuffix: true, locale: es });
  } catch {
    return fecha;
  }
};
</script>
