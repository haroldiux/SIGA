<template>
  <div class="roles-manager">
    <div class="row q-col-gutter-md">
      <!-- Lista de Roles (Izquierda) -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="full-height">
          <q-card-section class="bg-grey-1 row items-center justify-between">
            <div class="text-subtitle1 text-weight-bold">Roles del Sistema</div>
            <q-btn 
              color="primary" 
              icon="add" 
              round 
              dense 
              size="sm" 
              @click="prepararNuevoRol"
            >
              <q-tooltip>Crear Nuevo Rol</q-tooltip>
            </q-btn>
          </q-card-section>
          
          <q-separator />
          
          <q-list separator>
            <q-item 
              v-for="rol in roles" 
              :key="rol.id"
              clickable
              v-ripple
              :active="rolSeleccionado && rolSeleccionado.id === rol.id"
              active-class="bg-blue-1 text-primary"
              @click="seleccionarRol(rol)"
            >
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="admin_panel_settings" size="md" />
              </q-item-section>
              
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ rol.nombre }}</q-item-label>
                <q-item-label caption>{{ rol.usuariosCount }} usuarios asignados</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn 
                  flat 
                  round 
                  dense 
                  icon="delete" 
                  color="negative" 
                  size="sm"
                  @click.stop="confirmarEliminarRol(rol)"
                  :disable="rol.id === 1" 
                >
                  <q-tooltip v-if="rol.id === 1">No se puede eliminar el Super Admin</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Editor de Rol y Permisos (Derecha) -->
      <div class="col-12 col-md-8">
        <q-card flat bordered v-if="rolFormulario">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">
              {{ esEdicion ? 'Editar Rol' : 'Nuevo Rol' }}
            </div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="guardarRol" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="rolFormulario.nombre"
                    label="Nombre del Rol *"
                    outlined
                    :rules="[val => !!val || 'El nombre es requerido']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="rolFormulario.descripcion"
                    label="Descripción"
                    outlined
                  />
                </div>
              </div>

              <q-separator class="q-my-md" />

              <div class="text-subtitle2 q-mb-sm">Permisos del Sistema</div>
              <div class="text-caption text-grey-7 q-mb-md">
                Seleccione los módulos y acciones a los que este rol tendrá acceso.
              </div>

              <!-- Árbol de Permisos -->
              <div class="permisos-grid">
                <div 
                  v-for="modulo in permisosDisponibles" 
                  :key="modulo.clave"
                  class="modulo-card q-mb-md"
                >
                  <q-card flat bordered class="bg-grey-1">
                    <q-card-section class="q-pb-none">
                      <q-checkbox 
                        v-model="modulosSeleccionados[modulo.clave]"
                        :label="modulo.modulo"
                        class="text-weight-bold"
                        @update:model-value="toggleModulo(modulo, $event)"
                      />
                    </q-card-section>
                    
                    <q-separator class="q-mt-sm" />
                    
                    <q-card-section>
                      <div class="row q-col-gutter-sm">
                        <div 
                          v-for="accion in modulo.acciones" 
                          :key="accion.clave"
                          class="col-6 col-sm-4"
                        >
                          <q-checkbox
                            v-model="rolFormulario.permisos"
                            :val="`${modulo.clave}.${accion.clave}`"
                            :label="accion.label"
                            size="sm"
                            @update:model-value="verificarEstadoModulo(modulo)"
                          />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>

              <div class="row justify-end q-mt-lg">
                <q-btn 
                  label="Cancelar" 
                  color="grey" 
                  flat 
                  class="q-mr-sm" 
                  @click="cancelarEdicion"
                />
                <q-btn 
                  type="submit" 
                  :label="esEdicion ? 'Actualizar Rol' : 'Crear Rol'" 
                  color="primary" 
                  icon="save"
                  :loading="guardando"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>

        <div v-else class="flex flex-center full-height text-grey-5 column q-pa-xl">
          <q-icon name="touch_app" size="64px" />
          <div class="text-h6 q-mt-md">Selecciona un rol para editar</div>
          <div>o crea uno nuevo</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import adminService from 'src/services/adminService';

const $q = useQuasar();

// Estado
const roles = ref([]);
const permisosDisponibles = ref([]);
const rolSeleccionado = ref(null);
const rolFormulario = ref(null);
const guardando = ref(false);
const modulosSeleccionados = ref({}); // Para controlar el checkbox "padre" de cada módulo

const esEdicion = computed(() => !!rolSeleccionado.value);

// Cargar datos iniciales
onMounted(async () => {
  try {
    const [rolesData, permisosData] = await Promise.all([
      adminService.getRoles(),
      adminService.getPermisosDisponibles()
    ]);
    roles.value = rolesData.data;
    permisosDisponibles.value = permisosData;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al cargar roles y permisos'
    });
  }
});

// Acciones
const seleccionarRol = (rol) => {
  rolSeleccionado.value = rol;
  // Clonar para evitar modificar directamente
  rolFormulario.value = JSON.parse(JSON.stringify(rol));
  
  // Si tiene permiso global '*', marcar todo
  if (rolFormulario.value.permisos.includes('*')) {
    marcarTodosLosPermisos();
  }
  
  actualizarCheckboxesModulos();
};

const prepararNuevoRol = () => {
  rolSeleccionado.value = null;
  rolFormulario.value = {
    nombre: '',
    descripcion: '',
    permisos: []
  };
  modulosSeleccionados.value = {};
};

const cancelarEdicion = () => {
  rolSeleccionado.value = null;
  rolFormulario.value = null;
};

// Lógica de Permisos
const toggleModulo = (modulo, valor) => {
  const prefijo = `${modulo.clave}.`;
  
  if (valor) {
    // Agregar todos los permisos del módulo
    modulo.acciones.forEach(accion => {
      const permiso = `${prefijo}${accion.clave}`;
      if (!rolFormulario.value.permisos.includes(permiso)) {
        rolFormulario.value.permisos.push(permiso);
      }
    });
  } else {
    // Quitar todos los permisos del módulo
    rolFormulario.value.permisos = rolFormulario.value.permisos.filter(p => !p.startsWith(prefijo));
  }
};

const verificarEstadoModulo = (modulo) => {
  const prefijo = `${modulo.clave}.`;
  const permisosDelModulo = rolFormulario.value.permisos.filter(p => p.startsWith(prefijo));
  
  // Si tiene todos los permisos, marcar el módulo como true
  // Si tiene algunos, Quasar checkbox soporta estado indeterminado (null) visualmente si se configura,
  // pero aquí usaremos true solo si tiene AL MENOS UNO para simplificar la UX de "activar módulo"
  modulosSeleccionados.value[modulo.clave] = permisosDelModulo.length > 0;
};

const actualizarCheckboxesModulos = () => {
  modulosSeleccionados.value = {};
  permisosDisponibles.value.forEach(modulo => {
    verificarEstadoModulo(modulo);
  });
};

const marcarTodosLosPermisos = () => {
  const todos = [];
  permisosDisponibles.value.forEach(modulo => {
    modulo.acciones.forEach(accion => {
      todos.push(`${modulo.clave}.${accion.clave}`);
    });
  });
  rolFormulario.value.permisos = todos;
};

// Guardar
const guardarRol = async () => {
  guardando.value = true;
  try {
    if (esEdicion.value) {
      await adminService.updateRol(rolFormulario.value.id, rolFormulario.value);
      // Actualizar lista local
      const index = roles.value.findIndex(r => r.id === rolFormulario.value.id);
      if (index !== -1) roles.value[index] = { ...rolFormulario.value };
      
      $q.notify({ type: 'positive', message: 'Rol actualizado correctamente' });
    } else {
      const nuevoRol = await adminService.createRol(rolFormulario.value);
      roles.value.push(nuevoRol);
      $q.notify({ type: 'positive', message: 'Rol creado correctamente' });
    }
    cancelarEdicion();
  } catch {
    $q.notify({ type: 'negative', message: 'Error al guardar el rol' });
  } finally {
    guardando.value = false;
  }
};

const confirmarEliminarRol = (rol) => {
  $q.dialog({
    title: 'Eliminar Rol',
    message: `¿Estás seguro de eliminar el rol "${rol.nombre}"? Esta acción no se puede deshacer.`,
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(async () => {
    try {
      await adminService.deleteRol(rol.id);
      roles.value = roles.value.filter(r => r.id !== rol.id);
      if (rolSeleccionado.value && rolSeleccionado.value.id === rol.id) {
        cancelarEdicion();
      }
      $q.notify({ type: 'positive', message: 'Rol eliminado' });
    } catch {
      $q.notify({ type: 'negative', message: 'Error al eliminar rol' });
    }
  });
};
</script>

<style scoped>
.modulo-card {
  transition: all 0.3s ease;
}
.modulo-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
