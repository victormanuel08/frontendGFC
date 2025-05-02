<template>
    <UModal v-model="isOpen" :ui="{ width: 'w-1/3' }">
      <div class="p-4 bg-white rounded-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold">Gestión de Archivos</h3>
  
        <!-- Subida de archivos -->
        <div class="border border-dashed border-gray-300 rounded-lg p-4">
          <div class="flex flex-col gap-4">
            <!-- Descripción del archivo -->
            <UInput v-model="newFileName" placeholder="Descripción del archivo" />
            
            <!-- Selector de responsabilidad -->
            <SelectResponsabilitysTypes 
              v-model="newFileResponsability" 
              label="Responsabilidad"
            />
            
            <!-- Input de archivo oculto -->
            <input 
              ref="fileInput"
              type="file" 
              @change="handleFileChange"
              class="hidden"
            />
            
            <!-- Botón para subir archivo -->
            <div class="flex flex-col items-center justify-center gap-2">
              <UIcon name="i-heroicons-cloud-arrow-up" class="w-12 h-12 text-gray-400" />
              <UButton 
                variant="outline" 
                @click="triggerFileInput"
                class="w-full"
              >
                Seleccionar Archivo
              </UButton>
            </div>
          </div>
        </div>
  
        <!-- Lista de archivos existentes -->
        <div class="mt-6">
          <h4 class="font-medium mb-2">Archivos existentes</h4>
          
          <UTable 
            :rows="files"
            :columns="columns"
            :loading="isLoading"
          >
            <template #responsability-data="{ row }">
              <SelectResponsabilitysTypes 
                v-model="row.responsabilitys_types"
                @update:modelValue="updateFileResponsability(row)"
              />
            </template>
  
            <template #actions-data="{ row }">
              <UButton 
                icon="i-heroicons-trash" 
                color="red" 
                variant="ghost" 
                @click="confirmDeleteFile(row.id)"
              />
            </template>
          </UTable>
        </div>
  
        <div class="flex justify-end gap-2 mt-4">
          <UButton color="gray" @click="isOpen = false">Cerrar</UButton>
        </div>
      </div>
    </UModal>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean,
    thirdId: {
      type: Number,
      required: true
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'uploaded']);
  
  // Referencias
  const fileInput = ref<HTMLInputElement | null>(null);
  const isOpen = ref(false);
  const isLoading = ref(false);
  const files = ref<any[]>([]);
  const newFileName = ref('');
  const newFileResponsability = ref(null);
  
  // Columnas de la tabla
  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'created_at', label: 'Fecha' },
    { key: 'responsability', label: 'Responsabilidad' },
    { key: 'actions', label: 'Acciones' }
  ];
  
  // Métodos
  const triggerFileInput = () => {
    fileInput.value?.click();
  };
  
  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
  
    const file = target.files[0];
    await uploadFile(file);
  };
  
  const uploadFile = async (file: File) => {
    if (!newFileName.value || !newFileResponsability.value) {
      await Swal.fire({
        icon: 'error',
        title: 'Datos incompletos',
        text: 'Debe ingresar una descripción y seleccionar una responsabilidad',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', newFileName.value);
      formData.append('third', props.thirdId.toString());
      formData.append('responsabilitys_types', newFileResponsability.value.id.toString());
  
      isLoading.value = true;
      const response = await $fetch('/api/files/', {
        method: 'POST',
        body: formData
      });
  
      await Swal.fire({
        icon: 'success',
        title: 'Archivo subido',
        text: 'El archivo se ha cargado correctamente',
        confirmButtonColor: '#3085d6',
      });
  
      // Resetear formulario
      newFileName.value = '';
      newFileResponsability.value = null;
      if (fileInput.value) fileInput.value.value = '';
      
      // Recargar archivos
      await loadFiles();
      emit('uploaded');
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo subir el archivo',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      isLoading.value = false;
    }
  };
  
  const loadFiles = async () => {
    isLoading.value = true;
    try {
      const { data } = await $fetch('/api/files/', {
        params: {
          third: props.thirdId,
          expand: 'responsabilitys_types'
        }
      });
      files.value = data.results;
    } catch (error) {
      console.error('Error cargando archivos:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  const updateFileResponsability = async (file: any) => {
    try {
      await $fetch(`/api/files/${file.id}/`, {
        method: 'PATCH',
        body: {
          responsabilitys_types: file.responsabilitys_types?.id || null
        }
      });
    } catch (error) {
      console.error('Error actualizando responsabilidad:', error);
    }
  };
  
  const confirmDeleteFile = async (fileId: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar archivo?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    });
  
    if (result.isConfirmed) {
      try {
        await $fetch(`/api/files/${fileId}/`, {
          method: 'DELETE'
        });
        await loadFiles();
      } catch (error) {
        console.error('Error eliminando archivo:', error);
      }
    }
  };
  
  // Control del modal
  watch(() => props.modelValue, (val) => {
    isOpen.value = val;
    if (val) loadFiles();
  });
  
  watch(isOpen, (val) => {
    emit('update:modelValue', val);
  });
  </script>