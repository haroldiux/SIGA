<!-- src/components/common/BaseModal.vue -->
<template>
  <q-dialog
    v-model="isOpen"
    :persistent="persistent"
    :maximized="maximized"
    transition-show="scale"
    transition-hide="scale"
    @before-show="$emit('before-show')"
    @show="$emit('show')"
  >
    <q-card :style="cardStyle" class="base-modal">
      <!-- Header -->
      <q-card-section class="modal-header row items-center q-pb-none">
        <div class="text-h6 text-weight-medium">{{ title }}</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="handleClose"
        />
      </q-card-section>

      <!-- Body -->
      <q-card-section class="modal-body q-pt-md">
        <slot></slot>
      </q-card-section>

      <!-- Footer -->
      <q-card-actions align="right" class="modal-footer q-px-md q-pb-md">
        <slot name="actions">
          <q-btn
            flat
            :label="cancelLabel"
            color="grey-7"
            @click="handleCancel"
            class="q-px-lg"
          />
          <q-btn
            unelevated
            :label="confirmLabel"
            color="primary"
            @click="handleConfirm"
            :loading="loading"
            class="q-px-lg"
          />
        </slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg', 'xl'
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  persistent: {
    type: Boolean,
    default: true
  },
  maximized: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar'
  },
  confirmLabel: {
    type: String,
    default: 'Guardar'
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close', 'before-show', 'show']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const cardStyle = computed(() => {
  if (props.maximized) return {};
  
  const widths = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1000px'
  };
  
  return {
    width: widths[props.size],
    maxWidth: '90vw'
  };
});

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
  isOpen.value = false;
};

const handleClose = () => {
  emit('close');
  isOpen.value = false;
};
</script>

<style lang="scss" scoped>
.base-modal {
  border-radius: 12px;
  
  .modal-header {
    padding: 20px 24px 16px 24px;
    border-bottom: 1px solid #e0e0e0;
    
    .text-h6 {
      font-size: 1.25rem;
      color: #212121;
    }
  }
  
  .modal-body {
    padding: 24px;
    max-height: 65vh;
    overflow-y: auto;
    
    // Scrollbar personalizado
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #bdbdbd;
      border-radius: 10px;
      
      &:hover {
        background: #9e9e9e;
      }
    }
  }
  
  .modal-footer {
    padding: 16px 24px 20px 24px;
    border-top: 1px solid #e0e0e0;
    background: #fafafa;
    
    .q-btn {
      min-width: 100px;
      border-radius: 8px;
      font-weight: 500;
      text-transform: none;
    }
  }
}

// Responsive
@media (max-width: 600px) {
  .base-modal {
    .modal-body {
      max-height: 60vh;
    }
  }
}
</style>
