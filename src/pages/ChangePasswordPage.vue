<template>
    <q-layout view="lHh lpr lFf" class="change-password-layout">
        <q-page-container>
            <q-page class="flex flex-center">
                <q-card class="change-password-card q-pa-lg">
                    <!-- Título -->
                    <q-card-section class="text-center q-pb-none">
                        <q-icon name="lock_reset" size="64px" color="primary" class="q-mb-md" />
                        <div class="text-h5 text-weight-bold q-mb-sm">
                            Cambiar Contraseña
                        </div>
                        <div class="text-body2 text-grey-7">
                            Por seguridad, debes cambiar tu contraseña antes de continuar
                        </div>
                    </q-card-section>

                    <!-- Formulario -->
                    <q-card-section>
                        <q-form @submit.prevent="handleChangePassword" class="q-gutter-md">
                            <q-input v-model="formData.current_password" label="Contraseña Actual"
                                :type="showCurrentPassword ? 'text' : 'password'" outlined dense
                                :rules="[val => !!val || 'La contraseña actual es requerida']" lazy-rules>
                                <template v-slot:prepend>
                                    <q-icon name="lock" />
                                </template>
                                <template v-slot:append>
                                    <q-icon :name="showCurrentPassword ? 'visibility_off' : 'visibility'"
                                        class="cursor-pointer" @click="showCurrentPassword = !showCurrentPassword" />
                                </template>
                            </q-input>

                            <q-input v-model="formData.password" label="Nueva Contraseña"
                                :type="showNewPassword ? 'text' : 'password'" outlined dense :rules="[
                                    val => !!val || 'La nueva contraseña es requerida',
                                    val => val.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
                                ]" lazy-rules>
                                <template v-slot:prepend>
                                    <q-icon name="lock" />
                                </template>
                                <template v-slot:append>
                                    <q-icon :name="showNewPassword ? 'visibility_off' : 'visibility'"
                                        class="cursor-pointer" @click="showNewPassword = !showNewPassword" />
                                </template>
                            </q-input>

                            <q-input v-model="formData.password_confirmation" label="Confirmar Nueva Contraseña"
                                :type="showConfirmPassword ? 'text' : 'password'" outlined dense :rules="[
                                    val => !!val || 'Debes confirmar la contraseña',
                                    val => val === formData.password || 'Las contraseñas no coinciden'
                                ]" lazy-rules>
                                <template v-slot:prepend>
                                    <q-icon name="lock" />
                                </template>
                                <template v-slot:append>
                                    <q-icon :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                                        class="cursor-pointer" @click="showConfirmPassword = !showConfirmPassword" />
                                </template>
                            </q-input>

                            <div class="q-mt-md">
                                <q-btn type="submit" label="Cambiar Contraseña" color="primary" class="full-width"
                                    :loading="loading" :disable="loading" size="md" no-caps />
                            </div>
                        </q-form>
                    </q-card-section>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import authService from 'src/services/authService';

export default {
    name: 'ChangePasswordPage',

    setup() {
        const $q = useQuasar();
        const router = useRouter();

        const formData = ref({
            current_password: '',
            password: '',
            password_confirmation: ''
        });

        const showCurrentPassword = ref(false);
        const showNewPassword = ref(false);
        const showConfirmPassword = ref(false);
        const loading = ref(false);

        const handleChangePassword = async () => {
            loading.value = true;

            try {
                await authService.changePassword(formData.value);

                $q.notify({
                    type: 'positive',
                    message: 'Contraseña actualizada exitosamente',
                    position: 'top',
                    timeout: 2000
                });

                // Redirigir al dashboard
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            } catch (error) {
                console.error('Error al cambiar contraseña:', error);

                const errorMessage = error.response?.data?.message || 'Error al cambiar la contraseña';

                $q.notify({
                    type: 'negative',
                    message: errorMessage,
                    position: 'top',
                    timeout: 3000
                });
            } finally {
                loading.value = false;
            }
        };

        return {
            formData,
            showCurrentPassword,
            showNewPassword,
            showConfirmPassword,
            loading,
            handleChangePassword
        };
    }
};
</script>

<style lang="scss" scoped>
.change-password-layout {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.change-password-card {
    width: 100%;
    max-width: 450px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}
</style>
