// src/router/routes.js
const routes = [
  // Ruta de Login (pública)
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
    meta: { requiresAuth: false }
  },

  // Ruta de Cambio de Contraseña (requiere autenticación)
  {
    path: '/cambiar-password',
    name: 'cambiar-password',
    component: () => import('pages/ChangePasswordPage.vue'),
    meta: { requiresAuth: true, requiresPasswordChange: false }
  },

  // Rutas principales (requieren autenticación)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/DashboardPage.vue')
      },
      {
        path: '/proveedores',
        name: 'proveedores',
        component: () => import('pages/ProveedoresPage.vue')
      },
      {
        path: '/items',
        name: 'items',
        component: () => import('pages/ItemsPage.vue')
      },
      {
        path: '/solicitudes',
        name: 'solicitudes',
        component: () => import('pages/SolicitudesPage.vue')
      },
      {
        path: '/compras',
        name: 'compras',
        component: () => import('pages/ComprasPage.vue')
      },
      {
        path: '/inventario',
        name: 'inventario',
        component: () => import('pages/InventarioPage.vue')
      },
      {
        path: '/prestamos',
        name: 'prestamos',
        component: () => import('pages/PrestamosPage.vue')
      },
      {
        path: '/traspasos',
        name: 'traspasos',
        component: () => import('pages/TraspasosPage.vue')
      },
      {
        path: '/reportes',
        name: 'reportes',
        component: () => import('pages/ReportesPage.vue')
      },
      {
        path: '/admin',
        name: 'admin',
        component: () => import('pages/AdminPage.vue')
      }
    ]
  },

  // Ruta para manejar errores 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
