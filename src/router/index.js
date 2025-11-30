import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import authService from 'src/services/authService'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Navigation Guard para autenticación
  Router.beforeEach((to, from, next) => {
    const isAuthenticated = authService.isAuthenticated()
    const hasChangedPassword = authService.hasChangedPassword()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

    // Si la ruta requiere autenticación y no está autenticado
    if (requiresAuth && !isAuthenticated) {
      next({ name: 'login' })
      return
    }

    // Si está autenticado y va a login, redirigir al dashboard
    if (to.name === 'login' && isAuthenticated) {
      next({ name: 'dashboard' })
      return
    }

    // Si está autenticado pero no ha cambiado la contraseña
    if (isAuthenticated && !hasChangedPassword && to.name !== 'cambiar-password') {
      next({ name: 'cambiar-password' })
      return
    }

    // Si ya cambió la contraseña y trata de ir a cambiar-password, redirigir al dashboard
    if (hasChangedPassword && to.name === 'cambiar-password') {
      next({ name: 'dashboard' })
      return
    }

    next()
  })

  return Router
})
