<template>
  <div class="loading-spinner-container">
    <q-spinner
      :color="color"
      :size="size"
      :thickness="thickness"
    />
    <div v-if="message" class="loading-message q-mt-md">{{ message }}</div>
  </div>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: '50px',
  },
  thickness: {
    type: Number,
    default: 5,
  },
  message: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.loading-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-message {
  color: var(--q-primary);
  font-size: 14px;
  text-align: center;
}
</style>
