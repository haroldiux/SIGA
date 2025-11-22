<!-- src/components/admin/DialogNuevoUsuario.vue -->
<template>
  <q-dialog
    v-model="isOpen"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Registrar Nuevo Usuario</div>
        <div class="text-subtitle2 text-grey-7 q-ml-sm">Complete la información del usuario</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator class="q-my-md" />

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="userData.nombre"
            label="Nombre Completo *"
            placeholder="Ej: Juan Pérez"
            outlined
            :rules="[val => !!val || 'El nombre es obligatorio']"
          />

          <q-input
            v-model="userData.email"
            label="Email *"
            placeholder="ejemplo@unitepc.edu.bo"
            type="email"
            outlined
            :rules="[
              val => !!val || 'El email es obligatorio',
              val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Formato de email inválido'
            ]"
          />

          <q-select
            v-model="userData.rol"
            :options="rolesOptions"
            label="Rol *"
            outlined
            emit-value
            map-options
            :rules="[val => !!val || 'El rol es obligatorio']"
          />

          <q-select
            v-model="userData.laboratorio"
            :options="laboratoriosOptions"
            label="Laboratorio o Área *"
            outlined
            emit-value
            map-options
            :rules="[val => !!val || 'El laboratorio es obligatorio']"
          />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="userData.password"
                label="Contraseña *"
                :type="isPwdVisible ? 'text' : 'password'"
                outlined
                :rules="[
                  val => !!val || 'La contraseña es obligatoria',
                  val => val.length >= 8 || 'La contraseña debe tener al menos 8 caracteres'
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwdVisible ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwdVisible = !isPwdVisible"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="userData.confirmPassword"
                label="Confirmar Contraseña *"
                :type="isPwdVisible ? 'text' : 'password'"
                outlined
                :rules="[
                  val => !!val || 'Debe confirmar la contraseña',
                  val => val === userData.password || 'Las contraseñas no coinciden'
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwdVisible ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwdVisible = !isPwdVisible"
                  />
                </template>
              </q-input>
            </div>
          </div>

          <div class="row q-gutter-md">
            <q-toggle
              v-model="userData.activo"
              label="Usuario Activo"
              color="green"
              checked-icon="check"
              unchecked-icon="clear"
            />
            <q-toggle
              v-model="userData.cambioPasswordRequerido"
              label="Requerir Cambio de Contraseña"
              color="orange"
              checked-icon="security"
              unchecked-icon="no_encryption"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn label="Cancelar" color="grey-7" v-close-popup />
        <q-btn label="Registrar Usuario" color="primary" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineModel } from 'vue';
import { useQuasar } from 'quasar';

const isOpen = defineModel('modelValue');
const emit = defineEmits(['user-added']);
const $q = useQuasar();

// Datos del usuario
const userData = ref({
  nombre: '',
  email: '',
  rol: null,
  laboratorio: null,
  password: '',
  confirmPassword: '',
  activo: true,
  cambioPasswordRequerido: true
});

// Control de visibilidad de la contraseña
const isPwdVisible = ref(false);

// Opciones para los selects
const rolesOptions = [
  { label: 'Super Administrador', value: 'superadmin' },
  { label: 'Docente', value: 'docente' },
  { label: 'Encargado de Laboratorio', value: 'encargado_lab' },
  { label: 'Encargado de Almacén', value: 'encargado_almacen' },
  { label: 'Encargado de Adquisición', value: 'encargado_adquisicion' }
];

const laboratoriosOptions = [
  { label: 'Administración Central', value: 'admin_central' },
  { label: 'Lab. Química', value: 'lab_quimica' },
  { label: 'Lab. Física', value: 'lab_fisica' },
  { label: 'Lab. Biología', value: 'lab_biologia' },
  { label: 'Almacén Central', value: 'almacen_central' },
  { label: 'Departamento de Adquisiciones', value: 'dept_adquisicion' }
];

// Métodos
const onSubmit = () => {
  // Validar que las contraseñas coincidan
  if (userData.value.password !== userData.value.confirmPassword) {
    $q.notify({
      color: 'negative',
      message: 'Las contraseñas no coinciden',
      icon: 'warning'
    });
    return;
  }

  // Validar que el email tenga formato correcto
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.value.email)) {
    $q.notify({
      color: 'negative',
      message: 'El formato del email es inválido',
      icon: 'warning'
    });
    return;
  }

  // Preparar datos para emitir (sin incluir confirmPassword)
  const userDataToEmit = {
    id: Date.now(),
    nombre: userData.value.nombre,
    email: userData.value.email,
    rol: userData.value.rol,
    laboratorio: userData.value.laboratorio,
    activo: userData.value.activo,
    cambioPasswordRequerido: userData.value.cambioPasswordRequerido,
    fechaCreacion: new Date().toISOString().slice(0, 10),
    estado: userData.value.activo ? 'Activo' : 'Inactivo'
  };

  // Emitir evento con los datos del nuevo usuario
  emit('user-added', userDataToEmit);

  // Notificar
  $q.notify({
    color: 'positive',
    message: `Usuario ${userData.value.nombre} creado correctamente`,
    icon: 'check_circle'
  });

  // Cerrar el diálogo
  isOpen.value = false;

  // Reiniciar el formulario
  resetForm();
};

const resetForm = () => {
  userData.value = {
    nombre: '',
    email: '',
    rol: null,
    laboratorio: null,
    password: '',
    confirmPassword: '',
    activo: true,
    cambioPasswordRequerido: true
  };
};
</script>
