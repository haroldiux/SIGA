<template>
  <div class="skeleton-loader">
    <!-- Skeleton para tabla -->
    <div v-if="type === 'table'" class="skeleton-table">
      <div v-for="i in rows" :key="i" class="skeleton-row">
        <q-skeleton v-for="j in columns" :key="j" type="rect" class="skeleton-cell" />
      </div>
    </div>

    <!-- Skeleton para card -->
    <div v-else-if="type === 'card'" class="skeleton-card">
      <q-skeleton type="rect" height="150px" class="q-mb-md" />
      <q-skeleton type="text" width="70%" />
      <q-skeleton type="text" width="50%" />
      <q-skeleton type="text" width="90%" />
    </div>

    <!-- Skeleton para lista -->
    <div v-else-if="type === 'list'" class="skeleton-list">
      <div v-for="i in rows" :key="i" class="skeleton-list-item">
        <q-skeleton type="circle" size="40px" />
        <div class="skeleton-list-content">
          <q-skeleton type="text" width="60%" />
          <q-skeleton type="text" width="40%" />
        </div>
      </div>
    </div>

    <!-- Skeleton genérico -->
    <div v-else>
      <q-skeleton v-for="i in rows" :key="i" type="text" class="q-mb-sm" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'text', // 'table', 'card', 'list', 'text'
  },
  rows: {
    type: Number,
    default: 5,
  },
  columns: {
    type: Number,
    default: 4,
  },
});
</script>

<style scoped>
.skeleton-table {
  width: 100%;
}

.skeleton-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.skeleton-cell {
  flex: 1;
  height: 40px;
}

.skeleton-card {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.skeleton-list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
}

.skeleton-list-content {
  flex: 1;
}
</style>
