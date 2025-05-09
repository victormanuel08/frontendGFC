<template>
  <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
    <TitleBanner text="Subtipos de Archivo" class="mb-2" />
    <div class="">
      <UCard class="bg-white border-2 border-blue-500 rounded-2xl shadow-sm">
        <div class="max-w-9xl mx-auto">
          <UCard class="border-0">
            <template #header>
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <UButton 
                  variant="soft" 
                  @click="handleAdd"
                  class="flex-shrink-0"
                >
                  <UIcon name="i-heroicons-plus" class="mr-2 w-5 h-5" />
                  Nuevo Subtipo
                </UButton>
                <div class="flex flex-col md:flex-row gap-3 w-full">
                  <UInput 
                    v-model="searchQuery" 
                    placeholder="Buscar subtipos..."
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
              <h3 v-if="subtypes.length === 0" class="text-gray-500">
                No se encontraron subtipos
              </h3>
            </div>

            <div class="overflow-auto" v-if="subtypes.length > 0">
              <table class="table-auto w-full permission-table">
                <thead>
                  <tr class="border-b-2 border-blue-200">
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-left">Nombre</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Tipo Principal</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Creado</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Actualizado</th>
                    <th class="p-4 border border-gray-200 bg-gray-50 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="subtype in subtypes" :key="subtype.id" class="hover:bg-blue-50 transition-colors duration-150">
                    <td class="p-4 border border-gray-200 text-left">{{ subtype.name }}</td>
                    <td class="p-4 border border-gray-200 text-center">
                      <UBadge color="blue" variant="soft">{{ subtype.filetype_full?.name }}</UBadge>
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      {{ formatDate(subtype.created_at) }}
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      {{ formatDate(subtype.updated_at) }}
                    </td>
                    <td class="p-4 border border-gray-200 text-center">
                      <div class="flex items-center justify-center gap-1">
                        <UTooltip text="Editar">
                          <UButton 
                            color="gray" 
                            variant="ghost" 
                            icon="i-heroicons-pencil"
                            @click="handleEdit(subtype)"
                            class="hover:bg-gray-50"
                            size="sm"
                          />
                        </UTooltip>
                        <UTooltip text="Eliminar">
                          <UButton 
                            color="blue" 
                            variant="ghost" 
                            icon="i-heroicons-trash"
                            @click="handleDelete(subtype)"
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

            <!-- Modal CRUD -->
            <UModal v-model="isModalOpen">
              <UCard class="overflow-hidden">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">
                      {{ isEditing ? 'Editar' : 'Nuevo' }} Subtipo
                    </h3>
                    <UButton
                      color="gray"
                      variant="ghost"
                      icon="i-heroicons-x-mark-20-solid"
                      @click="isModalOpen = false"
                    />
                  </div>
                </template>

                <div class="space-y-4">
                  <UFormGroup label="Nombre" required>
                    <UInput 
                      v-model="formData.name" 
                      placeholder="Ej: PDF/A, DOCX" 
                      maxlength="100"
                    />
                  </UFormGroup>

                  <UFormGroup label="Tipo de Archivo" required>
                    <SelectFileType
                      v-model="formData.file_type"
                      labelpersonal="Tipo de Archivo"
                    />
                    </UFormGroup>
                </div>

                <template #footer>
                  <div class="flex justify-end gap-3">
                    <UButton 
                      color="gray" 
                      @click="isModalOpen = false"
                    >
                      Cancelar
                    </UButton>
                    <UButton 
                      color="primary" 
                      @click="handleSubmit"
                      :loading="isSubmitting"
                      :disabled="!formIsValid"
                    >
                      {{ isEditing ? 'Guardar Cambios' : 'Crear Subtipo' }}
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
import Swal from 'sweetalert2';

interface FileSubtype {
  id?: number;
  name: string;
  file_type?: number | FileType;
  created_at?: string;
  updated_at?: string;
}



interface FileType {
  id: number;
  name: string;
}

// Datos reactivos
const subtypes = ref<FileSubtype[]>([]);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

const formData = ref<FileSubtype>({
  name: '',
  file_type: undefined
});

// Validación del formulario
const formIsValid = computed(() => {
  return formData.value.name.trim().length >= 3 && formData.value.file_type?.id;
});

// Formatear fechas
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Obtener datos
const retrieveData = async () => {
  try {
    const response = await $fetch('/api/filessubtypes/', {
      query: {
        page: currentPage.value,
        page_size: pageSize.value,
        search: searchQuery.value,
        expand: 'file_type'
      }
    });
    
    subtypes.value = response.results;
    totalItems.value = response.count;
  } catch (error) {
    console.error('Error cargando subtipos:', error);
    showError('No se pudieron cargar los subtipos');
  }
};

// Manejar acciones CRUD
const handleAdd = () => {
  resetForm();
  isEditing.value = false;
  isModalOpen.value = true;
};

const handleEdit = (subtype: FileSubtype) => {
  formData.value = {
    id: subtype.id,
    name: subtype.name,
    file_type: subtype.file_type
  };
  isEditing.value = true;
  isModalOpen.value = true;
};

const handleSubmit = async () => {
  if (!formIsValid.value) return;

  isSubmitting.value = true;
  try {
    const payload = {
      name: formData.value.name,
      file_type: typeof formData.value.file_type === 'object' 
               ? formData.value.file_type?.id 
               : formData.value.file_type
    };

    if (isEditing.value && formData.value.id) {
      await $fetch(`/api/filessubtypes/${formData.value.id}/`, {
        method: 'PUT',
        body: payload
      });
      Swal.fire('¡Actualizado!', 'El subtipo fue actualizado', 'success');
    } else {
      await $fetch('/api/filessubtypes/', {
        method: 'POST',
        body: payload
      });
      Swal.fire('¡Creado!', 'Nuevo subtipo creado', 'success');
    }

    await retrieveData();
    isModalOpen.value = false;
  } catch (error) {
    console.error('Error guardando subtipo:', error);
    showError('No se pudo guardar el subtipo');
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (subtype: FileSubtype) => {
  const result = await Swal.fire({
    title: '¿Eliminar subtipo?',
    html: `Estás por eliminar: <b>${subtype.name}</b>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar!'
  });

  if (result.isConfirmed) {
    try {
      await $fetch(`/api/filessubtypes/${subtype.id}/`, {
        method: 'DELETE'
      });
      await retrieveData();
      Swal.fire('¡Eliminado!', 'El subtipo fue eliminado', 'success');
    } catch (error) {
      console.error('Error eliminando subtipo:', error);
      showError('No se pudo eliminar el subtipo');
    }
  }
};

const resetForm = () => {
  formData.value = {
    name: '',
    file_type: undefined
  };
};

const showError = (message: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonColor: '#3b82f6',
    customClass: {
      popup: 'rounded-xl'
    }
  });
};

// Watchers
watch([currentPage, searchQuery], retrieveData);

// Carga inicial
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

::v-deep .swal2-popup {
  @apply rounded-xl;
}
</style>