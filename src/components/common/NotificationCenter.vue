<template>
  <q-btn flat round dense icon="notifications" class="q-mr-sm">
    <q-badge v-if="unreadCount > 0" color="red" floating>{{ unreadCount }}</q-badge>
    
    <q-menu max-width="400px" max-height="600px">
      <q-card flat>
        <!-- Header -->
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Notificaciones</div>
          <q-space />
          <q-btn 
            v-if="unreadCount > 0"
            flat 
            dense 
            size="sm" 
            label="Marcar todas como leídas" 
            @click="markAllAsRead"
          />
        </q-card-section>

        <q-separator />

        <!-- Lista de notificaciones -->
        <q-scroll-area style="height: 400px">
          <q-list v-if="notifications.length > 0">
            <NotificationItem
              v-for="notification in notifications"
              :key="notification.id"
              :notification="notification"
              @mark-read="markAsRead"
              @delete="deleteNotification"
              @action-click="handleActionClick"
            />
          </q-list>

          <!-- Estado vacío -->
          <div v-else class="q-pa-lg text-center text-grey-7">
            <q-icon name="notifications_none" size="64px" class="q-mb-md" />
            <div class="text-subtitle1">No tienes notificaciones</div>
          </div>
        </q-scroll-area>

        <q-separator />

        <!-- Footer -->
        <q-card-actions v-if="readNotifications.length > 0">
          <q-btn 
            flat 
            dense 
            size="sm" 
            label="Limpiar leídas" 
            color="grey-7"
            @click="clearReadNotifications"
          />
        </q-card-actions>
      </q-card>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationsStore } from 'src/stores/store-notifications';
import NotificationItem from './NotificationItem.vue';

const router = useRouter();
const notificationsStore = useNotificationsStore();

// Computed
const notifications = computed(() => notificationsStore.allNotifications);
const unreadCount = computed(() => notificationsStore.unreadCount);
const readNotifications = computed(() => notificationsStore.readNotifications);

// Methods
const markAsRead = (id) => {
  notificationsStore.markAsRead(id);
};

const markAllAsRead = () => {
  notificationsStore.markAllAsRead();
};

const deleteNotification = (id) => {
  notificationsStore.deleteNotification(id);
};

const clearReadNotifications = () => {
  notificationsStore.clearReadNotifications();
};

const handleActionClick = (notification) => {
  if (notification.accion && notification.accion.route) {
    router.push(notification.accion.route);
  }
  markAsRead(notification.id);
};
</script>

<style scoped>
.q-badge {
  font-size: 10px;
}
</style>
