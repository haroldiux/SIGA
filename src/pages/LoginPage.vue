<template>
    <q-layout view="lHh lpr lFf" class="login-layout">
        <q-page-container>
            <q-page class="flex flex-center login-page">
                <!-- Decorative Background Elements -->
                <div class="bg-decoration bg-decoration-1"></div>
                <div class="bg-decoration bg-decoration-2"></div>
                <div class="bg-decoration bg-decoration-3"></div>

                <q-card class="login-card">
                    <!-- Logo and Branding Section -->
                    <q-card-section class="text-center q-pb-md brand-section">
                        <div class="logo-container">
                            <img src="/logos/unitepc-horizontal.png" alt="UNITEPC" class="logo-image" />
                        </div>
                        <div class="text-h4 text-weight-bold brand-title q-mt-md">
                            SIGA
                        </div>
                        <div class="text-subtitle1 brand-subtitle q-mt-xs">
                            Sistema Integral de Gestión de Activos
                        </div>
                        <div class="text-caption brand-org q-mt-xs">
                            UNITEPC
                        </div>
                    </q-card-section>

                    <q-separator class="q-mx-lg" />

                    <!-- Login Form Section -->
                    <q-card-section class="q-pt-lg q-px-lg">
                        <q-form @submit.prevent="handleLogin" class="login-form">
                            <div class="text-h6 text-weight-medium q-mb-md form-title">
                                Iniciar Sesión
                            </div>

                            <q-input v-model="credentials.usuario" label="Usuario" outlined dense
                                class="q-mb-md input-field" :rules="[val => !!val || 'El usuario es requerido']"
                                lazy-rules autofocus>
                                <template v-slot:prepend>
                                    <q-icon name="person" color="primary" />
                                </template>
                            </q-input>

                            <q-input v-model="credentials.password" label="Contraseña"
                                :type="showPassword ? 'text' : 'password'" outlined dense class="q-mb-lg input-field"
                                :rules="[val => !!val || 'La contraseña es requerida']" lazy-rules>
                                <template v-slot:prepend>
                                    <q-icon name="lock" color="primary" />
                                </template>
                                <template v-slot:append>
                                    <q-icon :name="showPassword ? 'visibility_off' : 'visibility'"
                                        class="cursor-pointer" color="grey-6" @click="showPassword = !showPassword" />
                                </template>
                            </q-input>

                            <q-btn type="submit" label="Iniciar Sesión" color="primary" class="full-width login-button"
                                :loading="loading" :disable="loading" size="lg" no-caps unelevated>
                                <template v-slot:loading>
                                    <q-spinner-dots color="white" />
                                </template>
                            </q-btn>
                        </q-form>
                    </q-card-section>

                    <!-- Footer Section -->
                    <q-card-section class="text-center q-pt-md q-pb-lg footer-section">
                        <div class="text-caption text-grey-6">
                            © {{ new Date().getFullYear() }} UNITEPC - Todos los derechos reservados
                        </div>
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
    name: 'LoginPage',

    setup() {
        const $q = useQuasar();
        const router = useRouter();

        const credentials = ref({
            usuario: '',
            password: ''
        });

        const showPassword = ref(false);
        const loading = ref(false);

        const handleLogin = async () => {
            loading.value = true;

            try {
                const response = await authService.login(credentials.value);

                $q.notify({
                    type: 'positive',
                    message: 'Inicio de sesión exitoso',
                    position: 'top',
                    timeout: 2000
                });

                // Verificar si necesita cambiar contraseña
                if (!response.password_changed) {
                    router.push('/cambiar-password');
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error('Error en login:', error);

                const errorMessage = error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';

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
            credentials,
            showPassword,
            loading,
            handleLogin
        };
    }
};
</script>

<style lang="scss" scoped>
.login-layout {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
    position: relative;
    overflow: hidden;
}

.login-page {
    min-height: 100vh;
    position: relative;
    z-index: 1;
}

// Decorative background elements
.bg-decoration {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
    animation: float 20s infinite ease-in-out;
}

.bg-decoration-1 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    top: -100px;
    left: -100px;
    animation-delay: 0s;
}

.bg-decoration-2 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    bottom: -50px;
    right: -50px;
    animation-delay: 5s;
}

.bg-decoration-3 {
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
    top: 50%;
    right: 10%;
    animation-delay: 10s;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) scale(1);
    }

    50% {
        transform: translateY(-30px) scale(1.05);
    }
}

.login-card {
    width: 100%;
    max-width: 480px;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.98);
    animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.brand-section {
    padding-top: 3rem;
}

.logo-container {
    display: inline-block;
    padding: 1.5rem 2rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.logo-image {
    height: 60px;
    width: auto;
    display: block;
}

.brand-title {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 2px;
    font-weight: 800;
}

.brand-subtitle {
    color: #546e7a;
    font-weight: 500;
    line-height: 1.4;
}

.brand-org {
    color: #90a4ae;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
}

.form-title {
    color: #37474f;
}

.input-field {
    :deep(.q-field__control) {
        border-radius: 12px;
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
        }
    }

    :deep(.q-field--focused .q-field__control) {
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
    }
}

.login-button {
    border-radius: 12px;
    padding: 12px 0;
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 0.5px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }
}

.footer-section {
    border-top: 1px solid rgba(0, 0, 0, 0.06);
}

// Responsive adjustments
@media (max-width: 600px) {
    .login-card {
        max-width: 95%;
        margin: 1rem;
    }

    .brand-section {
        padding-top: 2rem;
    }

    .logo-icon {
        font-size: 3rem;
    }

    .brand-title {
        font-size: 1.75rem;
    }
}
</style>
