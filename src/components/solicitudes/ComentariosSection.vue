<template>
  <div class="comentarios-section">
    <div class="text-subtitle2 q-mb-md">Comentarios</div>

    <!-- Lista de comentarios -->
    <q-scroll-area style="height: 300px" class="q-mb-md">
      <div v-if="comentarios.length === 0" class="text-center text-grey-7 q-pa-md">
        <q-icon name="comment" size="48px" class="q-mb-sm" />
        <div>No hay comentarios aún</div>
      </div>

      <q-chat-message
        v-for="(comentario, index) in comentarios"
        :key="index"
        :name="comentario.usuario"
        :text="[comentario.texto]"
        :stamp="formatFecha(comentario.fecha)"
        :sent="comentario.esPropio"
        :bg-color="comentario.esPropio ? 'primary' : 'grey-3'"
        :text-color="comentario.esPropio ? 'white' : 'dark'"
      >
        <template v-slot:avatar>
          <q-avatar :color="comentario.esPropio ? 'primary' : 'grey-5'" text-color="white">
            {{ comentario.usuario.charAt(0).toUpperCase() }}
          </q-avatar>
        </template>
      </q-chat-message>
    </q-scroll-area>

    <!-- Formulario para nuevo comentario -->
    <q-form @submit="agregarComentario">
      <div class="row q-col-gutter-sm">
        <div class="col">
          <q-input
            v-model="nuevoComentario"
            outlined
            dense
            placeholder="Escribe un comentario..."
            :rules="[val => !!val || 'El comentario no puede estar vacío']"
          >
            <template v-slot:prepend>
              <q-icon name="comment" />
            </template>
          </q-input>
        </div>
        <div class="col-auto">
          <q-btn
            unelevated
            dense
            color="primary"
            icon="send"
            type="submit"
            :disable="!nuevoComentario"
          >
            <q-tooltip>Enviar comentario</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const props = defineProps({
  comentarios: {
    type: Array,
    default: () => [],
  },
  usuarioActual: {
    type: String,
    default: 'Usuario Actual',
  },
});

const emit = defineEmits(['comentario-agregado']);

const $q = useQuasar();
const nuevoComentario = ref('');

const formatFecha = (fecha) => {
  try {
    return formatDistanceToNow(new Date(fecha), { addSuffix: true, locale: es });
  } catch {
    return fecha;
  }
};

const agregarComentario = () => {
  if (!nuevoComentario.value.trim()) return;

  const comentario = {
    texto: nuevoComentario.value,
    usuario: props.usuarioActual,
    fecha: new Date().toISOString(),
    esPropio: true,
  };

  emit('comentario-agregado', comentario);

  $q.notify({
    type: 'positive',
    message: 'Comentario agregado',
    icon: 'comment',
    position: 'top',
    timeout: 1000,
  });

  nuevoComentario.value = '';
};
</script>

<style scoped>
.comentarios-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
}
</style>
