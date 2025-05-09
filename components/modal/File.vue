<template>
  <UModal 
    :model-value="isOpen" 
    @update:model-value="$emit('update:isOpen', $event)" 
    @close="closeModal"
    :ui="{ 
      width: 'sm:max-w-5xl',
      container: 'items-center',
      padding: 'p-0'
    }"
  >
    <UCard class="overflow-hidden" :ui="{ 
      base: 'max-h-[80vh] overflow-y-auto',
      body: { padding: 'px-4 py-4 sm:p-4' },
      header: { padding: 'px-4 py-3 sm:px-6' },
      footer: { padding: 'px-4 py-3 sm:px-6' }
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">
            {{ mode === 'create' ? 'Subir archivo' : 'Editar archivo' }}
          </h3>
          <UButton 
            color="gray" 
            variant="ghost" 
            icon="i-heroicons-x-mark-20-solid" 
            @click="closeModal" 
            class="-my-1"
            aria-label="Cerrar modal"
          />
        </div>
      </template>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <!-- Columna 1: Nombre -->
        <div class="lg:col-span-2">
          <UFormGroup label="Nombre*" required :error="errors.name" class="mb-0">
            <UInput 
              v-model="localFormData.name" 
              placeholder="Ej: Contrato 2023" 
              :disabled="isSubmitting"
            />
          </UFormGroup>
        </div>

        <!-- Columna 2: Tipo -->
        <div>
          <UFormGroup label="Tipo*" required :error="errors.filetype" class="mb-0">
            <SelectFileType 
              v-model="localFormData.filetype" 
              @update:model-value="loadSubtypes"
              :disabled="isSubmitting"
              :ui="{
                width: 'w-full',
                menu: { width: 'w-full min-w-[180px]' }
              }"
            />
          </UFormGroup>
        </div>

        <!-- Columna 3: Subtipo -->
        <div>
          <UFormGroup label="Subtipo" class="mb-0">
            <SelectFileSubType 
              v-model="localFormData.filesubtype" 
              :file-type-id="localFormData.filetype?.id"
              :disabled="!localFormData.filetype || isSubmitting"
              :ui="{
                width: 'w-full',
                menu: { width: 'w-full min-w-[180px]' }
              }"
            />
          </UFormGroup>
        </div>

        <!-- Columna 4: Año y Visibilidad -->
        <div class="space-y-2">
          <UFormGroup label="Año*" required :error="errors.ano_legal" class="mb-0">
            <USelectMenu 
              v-model="selectedYear" 
              :options="yearOptions" 
              placeholder="Año"
              :ui="{
                width: 'w-full',
                menu: { width: 'w-full min-w-[120px]' }
              }"
            />
          </UFormGroup>
          
          <UFormGroup label="Visible" class="mb-0">
            <div class="flex items-center space-x-2">
              <UToggle v-model="localFormData.visible_for_client" size="sm"/>
              <span class="text-xs text-gray-500">
                {{ localFormData.visible_for_client ? 'Sí' : 'No' }}
              </span>
            </div>
          </UFormGroup>
        </div>

        <!-- Columna 5: Archivo -->
        <div>
          <UFormGroup label="Archivo*" required :error="errors.file" class="mb-0">
            <div @click="triggerFileInput" class="cursor-pointer">
              <div v-if="currentFile" class="flex items-center p-2 bg-gray-50 rounded-lg">
                <UIcon name="i-heroicons-document" class="text-gray-500 mr-2"/>
                <span class="text-sm truncate">{{ currentFile.name }}</span>
              </div>
              <div v-else class="p-2 border border-dashed border-gray-300 rounded-lg text-center">
                <UIcon name="i-heroicons-cloud-arrow-up" class="w-5 h-5 mx-auto text-gray-400"/>
                <p class="mt-1 text-xs text-gray-500">Haz clic para subir</p>
              </div>
              <input 
                ref="fileInput"
                type="file" 
                class="hidden" 
                accept=".pdf,.doc,.docx,.xls,.xlsx" 
                @change="handleFileUpload"
              />
            </div>
          </UFormGroup>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton 
            color="gray" 
            size="sm"
            @click="closeModal"
            :disabled="isSubmitting"
          >
            Cancelar
          </UButton>
          <UButton 
            color="primary" 
            size="sm"
            @click="submitForm" 
            :loading="isSubmitting"
          >
            {{ mode === 'create' ? 'Subir' : 'Guardar' }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface FileData {
  id?: number;
  name: string;
  filetype?: any;
  filesubtype?: any;
  ano_legal?: string;
  visible_for_client: boolean;
  file?: File | null;
}

const props = defineProps({
  isOpen: Boolean,
  mode: {
    type: String as () => 'create' | 'edit',
    default: 'create'
  },
  initialData: {
    type: Object as () => FileData | null,
    default: null
  }
});

const emit = defineEmits(['update:isOpen', 'submit', 'close']);

// Refs
const localFormData = ref<FileData>({
  name: '',
  visible_for_client: false
});
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);
const currentFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedYear = ref<number | null>(null);

// Opciones de año (últimos 20 años + año actual)
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - i);

// Métodos
const loadSubtypes = () => {
  localFormData.value.filesubtype = null;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];
    // Validar tamaño máximo (ej: 10MB)
    if (file.size > 10 * 1024 * 1024) {
      errors.value.file = 'El archivo no puede ser mayor a 10MB';
      return;
    }
    // Validar tipo de archivo
    const validExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      errors.value.file = 'Formato de archivo no válido';
      return;
    }
    
    localFormData.value.file = file;
    currentFile.value = file;
    errors.value.file = '';
  }
};

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!localFormData.value.name?.trim()) {
    errors.value.name = 'Por favor ingresa un nombre para el archivo';
    isValid = false;
  }

  if (!localFormData.value.filetype) {
    errors.value.filetype = 'Selecciona un tipo de archivo';
    isValid = false;
  }

  if (!selectedYear.value) {
    errors.value.ano_legal = 'Selecciona un año legal';
    isValid = false;
  }

  if (props.mode === 'create' && !currentFile.value) {
    errors.value.file = 'Debes seleccionar un archivo';
    isValid = false;
  }

  return isValid;
};

const submitForm = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    const formData = new FormData();
    formData.append('name', localFormData.value.name);
    formData.append('filetype', localFormData.value.filetype.id);
    
    if (localFormData.value.filesubtype) {
      formData.append('filesubtype', localFormData.value.filesubtype.id);
    }
    
    formData.append('ano_legal', `${selectedYear.value}-01-01`);
    formData.append('visible_for_client', localFormData.value.visible_for_client.toString());
    
    if (localFormData.value.file) {
      formData.append('file', localFormData.value.file);
    }

    emit('submit', formData);
    closeModal();
  } catch (error) {
    console.error('Error al subir archivo:', error);
    errors.value.general = 'Ocurrió un error al subir el archivo. Por favor intenta nuevamente.';
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  emit('update:isOpen', false);
  emit('close');
  resetForm();
};

const resetForm = () => {
  localFormData.value = {
    name: '',
    visible_for_client: false
  };
  currentFile.value = null;
  selectedYear.value = null;
  errors.value = {};
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Cargar datos iniciales si estamos en modo edición
watch(() => props.initialData, (newVal) => {
  if (newVal) {
    localFormData.value = { ...newVal };
    selectedYear.value = newVal.ano_legal ? new Date(newVal.ano_legal).getFullYear() : null;
  } else {
    resetForm();
  }
}, { immediate: true });
</script>

<style scoped>
.drag-drop-area {
  transition: all 0.2s ease;
}
.drag-drop-area:hover {
  border-color: var(--color-primary-500);
  background-color: var(--color-primary-50);
}
</style>