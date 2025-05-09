<template>
  <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
    <TitleBanner text="Gestión de Archivos" class="mb-2" />
    <div class="">
      <UCard class="bg-white border-2 border-blue-500 rounded-2xl shadow-sm">
        <div class="max-w-9xl mx-auto">
          <UCard class="border-0">
            <template #header>
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <UButton 
                  variant="soft" 
                  @click="openModal('create')"
                  class="flex-shrink-0"
                >
                  <UIcon name="i-heroicons-plus" class="mr-2 w-5 h-5" />
                  Nuevo Archivo
                </UButton>
                <div class="flex flex-col md:flex-row gap-3 w-full">
                  <UInput 
                    v-model="searchQuery" 
                    placeholder="Buscar archivos..."
                    icon="i-heroicons-magnifying-glass"
                    :ui="{ icon: { trailing: true } }"
                    class="flex-grow"
                  />
                  <UPagination 
                    v-model="currentPage" 
                    :page-count="pageSize"
                    :total="totalItems"
                    :ui="{ 
                      wrapper: 'flex items-center gap-1',
                      rounded: '!rounded-full min-w-[32px] justify-center'
                    }"
                  />
                </div>
              </div>
            </template>

            <div class="flex justify-center items-center py-6">
              <h3 v-if="files.length === 0" class="text-gray-500">
                No se encontraron archivos
              </h3>
            </div>

            <div class="overflow-auto" v-if="files.length > 0">
              <table class="table-auto w-full permission-table">
                <thead>
                  <tr class="border-b-2 border-blue-200">
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Nombre</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Tercero</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Tipo Responsabilidad</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Tipo Archivo</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Subtipo</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Visible</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Año Legal</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Archivo</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="file in files" :key="file.id" class="hover:bg-blue-50 transition-colors duration-150">
                    <td class="p-4 border border-gray-200 text-left">{{ file.name }}</td>
                    <td class="p-4 border border-gray-200 text-center">
                      {{ file.third_full?.business_info?.razon_social || '-' }}
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      {{ file.responsabilitys_types_full?.name || '-' }}
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      {{ file.filetype_full?.name || '-' }}
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      {{ file.filesubtype_full?.name || '-' }}
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      <UIcon :name="file.visible_for_client ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'" 
                            :class="file.visible_for_client ? 'text-green-500' : 'text-red-500'" />
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      {{ new Date(file.ano_legal).getFullYear() }}
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      <a v-if="file.file" :href="file.file" target="_blank" class="text-blue-500 hover:underline">
                        Descargar
                      </a>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      <div class="flex items-center justify-center gap-1">
                        <UTooltip text="Editar">
                          <UButton 
                            color="gray" 
                            variant="ghost" 
                            icon="i-heroicons-pencil"
                            @click="openModal('edit', file)"
                            class="hover:bg-gray-50"
                            size="sm"
                          />
                        </UTooltip>
                        <UTooltip text="Eliminar">
                          <UButton 
                            color="blue" 
                            variant="ghost" 
                            icon="i-heroicons-trash"
                            @click="openDeleteModal(file)"
                            class="hover:bg-blue-50"
                            size="sm"
                          />
                        </UTooltip>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ModalFile 
              :is-open="isMainModalOpen" 
              @update:is-open="val => isMainModalOpen = val"
              :mode="modalMode"
              :initial-data="selectedFile"
              @submit="handleSubmit"
            />

            <UModal v-model="isDeleteModalOpen">
              <UCard class="overflow-hidden">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-red-600">Confirmar Eliminación</h3>
                    <UButton
                      color="gray"
                      variant="ghost"
                      icon="i-heroicons-x-mark-20-solid"
                      @click="isDeleteModalOpen = false"
                    />
                  </div>
                </template>

                <div class="px-4 pb-4">
                  <p class="text-gray-700">
                    ¿Estás seguro de eliminar el archivo:
                    <span class="font-semibold">{{ fileToDelete?.name }}</span>?
                  </p>
                  <p class="mt-2 text-sm text-gray-500">
                    Esta acción no se puede deshacer y se perderán todos los datos asociados.
                  </p>
                </div>

                <template #footer>
                  <div class="flex justify-end gap-3">
                    <UButton 
                      color="gray" 
                      @click="isDeleteModalOpen = false"
                      :disabled="isDeleting"
                    >
                      Cancelar
                    </UButton>
                    <UButton 
                      color="red" 
                      @click="confirmDelete"
                      :loading="isDeleting"
                    >
                      Eliminar Definitivamente
                    </UButton>
                  </div>
                </template>
              </UCard>
            </UModal>
          </UCard>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface FileType {
  id: number;
  name: string;
}

interface FileSubtype {
  id: number;
  name: string;
  file_type: number;
}

interface FileData {
  id?: number;
  name: string;
  third?: any;
  third_full?: any;
  responsabilitys_types?: any;
  filetype?: FileType | null;
  filesubtype?: FileSubtype | null;
  ano_legal?: string;
  visible_for_client: boolean;
  file?: File | null;
}

// Estado del componente
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const searchQuery = ref('');
const files = ref<any[]>([]);
const isMainModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const selectedFile = ref<FileData | null>(null);
const fileToDelete = ref<any>(null);
const isDeleting = ref(false);

// Obtener datos iniciales
const retrieveData = async () => {
  try {
    const response = await $fetch('/api/files/', {
      query: {
        page: currentPage.value,
        page_size: pageSize.value,
        search: searchQuery.value,
        expand: 'third_full,responsabilitys_types_full,filetype_full,filesubtype_full'
      }
    });
    
    files.value = response.results;
    totalItems.value = response.count;
  } catch (error) {
    console.error('Error fetching files:', error);
    useNotify('error', 'Error al cargar archivos');
  }
};

// Manejar modal
const openModal = (mode: 'create' | 'edit', file?: any) => {
  modalMode.value = mode;
  selectedFile.value = file ? { ...file } : null;
  isMainModalOpen.value = true;
};

// Enviar formulario
const handleSubmit = async (formData: FormData) => {
  try {
    if (modalMode.value === 'edit' && selectedFile.value?.id) {
      await $fetch(`/api/files/${selectedFile.value.id}/`, {
        method: 'PATCH',
        body: formData
      });
    } else {
      await $fetch('/api/files/', {
        method: 'POST',
        body: formData
      });
    }
    await retrieveData();
    useNotify('success', `Archivo ${modalMode.value === 'edit' ? 'actualizado' : 'creado'} correctamente`);
  } catch (error: any) {
    console.error('Error saving file:', error);
    useNotify('error', error.data?.detail || 'Error al guardar el archivo');
  }
};

// Eliminar archivo
const openDeleteModal = (file: any) => {
  fileToDelete.value = file;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!fileToDelete.value) return;

  isDeleting.value = true;
  try {
    await $fetch(`/api/files/${fileToDelete.value.id}/`, { method: 'DELETE' });
    await retrieveData();
    useNotify('success', 'Archivo eliminado correctamente');
  } catch (error) {
    console.error('Error deleting file:', error);
    useNotify('error', 'Error al eliminar el archivo');
  } finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
  }
};

// Watchers
watch([currentPage, searchQuery], retrieveData);
onMounted(retrieveData);
</script>

<style scoped>
.permission-table {
  @apply min-w-full divide-y divide-gray-200;
}

.permission-table th {
  @apply bg-gray-50 text-gray-700;
}

.permission-table td {
  @apply text-gray-900;
}

.permission-table tr:hover {
  @apply bg-blue-50;
}
</style>