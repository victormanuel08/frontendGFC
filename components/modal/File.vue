<template>
  <UModal 
    :model-value="isOpen" 
    @update:model-value="$emit('update:isOpen', $event)" 
    @close="closeModal"
    :ui="{ 
      width: 'sm:max-w-3xl',
      container: 'items-center' 
    }"
  >
    <UCard class="overflow-hidden" :ui="{ base: 'max-h-[90vh] overflow-y-auto' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">
            {{ mode === 'create' ? 'Subir nuevo archivo' : 'Editar archivo' }}
          </h3>
          <UButton 
            color="gray" 
            variant="ghost" 
            icon="i-heroicons-x-mark-20-solid" 
            @click="closeModal" 
            aria-label="Cerrar modal"
          />
        </div>
      </template>

      <div class="space-y-4 px-6 pb-4">
        <!-- Primera fila: Nombre y Visibilidad -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Nombre del archivo (ocupa 2/3) -->
          <div class="md:col-span-2">
            <UFormGroup label="Nombre del archivo*" required :error="errors.name">
              <UInput 
                v-model="localFormData.name" 
                placeholder="Ej: Contrato de servicios 2023" 
                :disabled="isSubmitting"
              />
            </UFormGroup>
          </div>
          
          <!-- Visibilidad (ocupa 1/3) -->
          <div class="flex items-end">
            <UFormGroup label="Visible para cliente" class="w-full">
              <div class="flex items-center">
                <UToggle 
                  v-model="localFormData.visible_for_client" 
                  :disabled="isSubmitting"
                />
                <span class="ml-2 text-sm text-gray-500">
                  {{ localFormData.visible_for_client ? 'Sí' : 'No' }}
                </span>
              </div>
            </UFormGroup>
          </div>
        </div>

        <!-- Segunda fila: Tipo y Año legal -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Tipo de archivo -->
          <div>
            <UFormGroup label="Tipo de archivo*" required :error="errors.filetype">
              <SelectFileType 
                v-model="localFormData.filetype" 
                @update:model-value="loadSubtypes"
                :disabled="isSubmitting"
                class="w-full"
                :ui="{
                  width: 'w-full',
                  menu: { width: 'w-full' },
                  option: { white: 'whitespace-nowrap truncate' }
                }"
              />
            </UFormGroup>
          </div>
          
          <!-- Subtipo de archivo (debajo del tipo en móvil) -->
          <div>
            <UFormGroup label="Subtipo de archivo">
              <SelectFileSubType 
                v-model="localFormData.filesubtype" 
                :file-type-id="localFormData.filetype?.id"
                :disabled="!localFormData.filetype || isSubmitting"
                class="w-full"
                :ui="{
                  width: 'w-full',
                  menu: { width: 'w-full' },
                  option: { white: 'whitespace-nowrap truncate' }
                }"
              />
            </UFormGroup>
          </div>
          
          <!-- Año legal -->
          <div>
            <UFormGroup label="Año legal*" required :error="errors.ano_legal">
              <USelectMenu 
                v-model="selectedYear" 
                :options="yearOptions" 
                placeholder="Seleccione un año" 
                class="w-full"
                :disabled="isSubmitting"
                :ui="{
                  width: 'w-full',
                  menu: { width: 'w-full' },
                  option: { white: 'whitespace-nowrap truncate' }
                }"
              >
                <template #label>
                  <span class="truncate">{{ selectedYear || 'Seleccione un año' }}</span>
                </template>
              </USelectMenu>
            </UFormGroup>
          </div>
        </div>

        <!-- Carga de archivo -->
        <UFormGroup label="Archivo*" required :error="errors.file">
          <div 
            class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 transition-colors"
            @click="triggerFileInput"
          >
            <UIcon name="i-heroicons-cloud-arrow-up" class="w-10 h-10 mx-auto text-gray-400" />
            <p class="mt-2 font-medium text-gray-700">
              {{ currentFile ? currentFile.name : 'Haz clic para seleccionar un archivo' }}
            </p>
            <p class="mt-1 text-sm text-gray-500">
              Formatos aceptados: PDF, DOC, DOCX, XLS, XLSX
            </p>
            <p v-if="mode === 'edit' && initialData?.file && !currentFile" class="mt-1 text-sm text-gray-500">
              Archivo actual: {{ initialData.file }}
            </p>
            <input 
              ref="fileInput"
              type="file" 
              class="hidden" 
              accept=".pdf,.doc,.docx,.xls,.xlsx" 
              @change="handleFileUpload"
            />
          </div>
          <p v-if="errors.file" class="mt-1 text-sm text-red-500">
            {{ errors.file }}
          </p>
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton 
            color="gray" 
            @click="closeModal"
            :disabled="isSubmitting"
          >
            Cancelar
          </UButton>
          <UButton 
            color="primary" 
            @click="submitForm" 
            :loading="isSubmitting"
            :disabled="isSubmitting"
          >
            {{ mode === 'create' ? 'Subir archivo' : 'Guardar cambios' }}
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