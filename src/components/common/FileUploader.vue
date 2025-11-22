<template>
  <div class="file-uploader">
    <q-file
      v-model="files"
      :multiple="multiple"
      :accept="accept"
      :max-file-size="maxFileSize"
      :max-files="maxFiles"
      outlined
      :label="label"
      :hint="hint"
      counter
      @update:model-value="handleFileChange"
      @rejected="onRejected"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>

      <template v-slot:append>
        <q-btn
          v-if="files && files.length > 0"
          round
          dense
          flat
          icon="clear"
          @click.stop="clearFiles"
        />
      </template>

      <template v-slot:hint>
        {{ hint || `Tamaño máximo: ${formatFileSize(maxFileSize)}. Tipos permitidos: ${accept}` }}
      </template>
    </q-file>

    <!-- Lista de archivos seleccionados -->
    <div v-if="showFileList && uploadedFiles.length > 0" class="q-mt-md">
      <q-list bordered separator>
        <q-item v-for="(file, index) in uploadedFiles" :key="index">
          <q-item-section avatar>
            <q-icon :name="getFileIcon(file.name)" :color="getFileColor(file.name)" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ file.name }}</q-item-label>
            <q-item-label caption>{{ formatFileSize(file.size) }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row q-gutter-xs">
              <q-btn
                v-if="file.url"
                flat
                dense
                round
                icon="visibility"
                color="primary"
                @click="previewFile(file)"
              >
                <q-tooltip>Vista previa</q-tooltip>
              </q-btn>
              <q-btn
                v-if="file.url"
                flat
                dense
                round
                icon="download"
                color="primary"
                @click="downloadFile(file)"
              >
                <q-tooltip>Descargar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                @click="removeFile(index)"
              >
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Dialog de vista previa -->
    <q-dialog v-model="showPreview">
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ previewFile?.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div v-if="isImage(previewFile?.name)" class="text-center">
            <img :src="previewFile?.url" style="max-width: 100%; max-height: 500px" />
          </div>
          <div v-else-if="isPDF(previewFile?.name)">
            <iframe :src="previewFile?.url" style="width: 100%; height: 500px" />
          </div>
          <div v-else class="text-center text-grey-7">
            <q-icon name="description" size="64px" class="q-mb-md" />
            <div>Vista previa no disponible para este tipo de archivo</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  accept: {
    type: String,
    default: '.pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx',
  },
  maxFileSize: {
    type: Number,
    default: 5242880, // 5MB
  },
  maxFiles: {
    type: Number,
    default: 10,
  },
  label: {
    type: String,
    default: 'Seleccionar archivos',
  },
  hint: {
    type: String,
    default: '',
  },
  showFileList: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue', 'files-changed']);

const $q = useQuasar();
const files = ref(null);
const uploadedFiles = ref([...props.modelValue]);
const showPreview = ref(false);
const previewFileData = ref(null);

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  uploadedFiles.value = [...newVal];
});

const handleFileChange = (newFiles) => {
  if (!newFiles) return;

  const fileArray = Array.isArray(newFiles) ? newFiles : [newFiles];
  
  fileArray.forEach(file => {
    // Crear URL temporal para vista previa
    const fileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      url: URL.createObjectURL(file),
    };
    uploadedFiles.value.push(fileData);
  });

  emit('update:modelValue', uploadedFiles.value);
  emit('files-changed', uploadedFiles.value);
};

const clearFiles = () => {
  files.value = null;
};

const removeFile = (index) => {
  // Revocar URL temporal
  if (uploadedFiles.value[index].url) {
    URL.revokeObjectURL(uploadedFiles.value[index].url);
  }
  
  uploadedFiles.value.splice(index, 1);
  emit('update:modelValue', uploadedFiles.value);
  emit('files-changed', uploadedFiles.value);
};

const onRejected = (rejectedEntries) => {
  rejectedEntries.forEach(entry => {
    if (entry.failedPropValidation === 'max-file-size') {
      $q.notify({
        type: 'negative',
        message: `El archivo "${entry.file.name}" excede el tamaño máximo permitido`,
      });
    } else if (entry.failedPropValidation === 'accept') {
      $q.notify({
        type: 'negative',
        message: `El tipo de archivo "${entry.file.name}" no está permitido`,
      });
    }
  });
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const icons = {
    pdf: 'picture_as_pdf',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    xlsx: 'table_chart',
    xls: 'table_chart',
    doc: 'description',
    docx: 'description',
  };
  return icons[ext] || 'insert_drive_file';
};

const getFileColor = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const colors = {
    pdf: 'red',
    jpg: 'blue',
    jpeg: 'blue',
    png: 'blue',
    gif: 'blue',
    xlsx: 'green',
    xls: 'green',
    doc: 'primary',
    docx: 'primary',
  };
  return colors[ext] || 'grey';
};

const isImage = (filename) => {
  if (!filename) return false;
  const ext = filename.split('.').pop().toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
};

const isPDF = (filename) => {
  if (!filename) return false;
  return filename.toLowerCase().endsWith('.pdf');
};

const previewFile = (file) => {
  previewFileData.value = file;
  showPreview.value = true;
};

const downloadFile = (file) => {
  const link = document.createElement('a');
  link.href = file.url;
  link.download = file.name;
  link.click();
};
</script>

<style scoped>
.file-uploader {
  width: 100%;
}
</style>
