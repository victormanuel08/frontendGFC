<template>
    <div class="rounded-3xl bg-white mt-4 ml-4 mr-4 md:mt-2 md:ml-2 md:mr-2">
      <TitleBanner text="Gestión de Terceros" class="mb-2" />
      <div class="">
        <UCard class="bg-white border-2 border-blue-500 rounded-2xl shadow-sm">
          <div class="max-w-9xl mx-auto">
            <UCard class="border-0">
              <template #header>
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <UButton variant="soft" @click="handleAdd" class="flex-shrink-0">
                    <UIcon name="i-heroicons-plus" class="mr-2 w-5 h-5" />
                    Nuevo Tercero
                  </UButton>
                  <div class="flex flex-col md:flex-row gap-3 w-full">
                    <UInput v-model="searchQuery" placeholder="Buscar terceros..." icon="i-heroicons-magnifying-glass"
                      :ui="{ icon: { trailing: true } }" class="flex-grow" />
                    <UPagination v-model="currentPage" 
                                :page-count="pageSize" 
                                :total="totalItems"
                                :ui="{
                                  wrapper: 'flex items-center gap-1',
                                  rounded: '!rounded-full min-w-[32px] justify-center'
                                }" />
                  </div>
                </div>
              </template>
  
              <div class="flex justify-center items-center py-6">
                <h3 v-if="loading" class="text-gray-500">
                  Cargando terceros...
                </h3>
                <h3 v-else-if="thirds.length === 0" class="text-gray-500">
                  No se encontraron terceros
                </h3>
              </div>
  
              <div class="overflow-auto" v-if="!loading && thirds.length > 0">
                <table class="table-auto w-full permission-table">
                  <thead>
                    <tr class="border-b-2 border-blue-200">
                      <th :class="[ui.th, 'text-center']">
                        <div class="flex items-center gap-2 justify-center">
                          <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-blue-500" />
                          <span class="text-blue-700">Creado</span>
                        </div>
                      </th>
                      <th :class="[ui.th, 'text-center']">
                        <div class="flex items-center gap-2 justify-center">
                          <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-blue-500" />
                          <span class="text-blue-700">Nombre</span>
                        </div>
                      </th>
                      <th :class="[ui.th, 'text-center']">
                        <div class="flex items-center gap-2 justify-center">
                          <UIcon name="i-heroicons-identification" class="w-5 h-5 text-blue-500" />
                          <span class="text-blue-700">Identificación</span>
                        </div>
                      </th>
                      <th :class="[ui.th, 'text-center']">
                        <div class="flex items-center gap-2 justify-center">
                          <UIcon name="i-heroicons-tag" class="w-5 h-5 text-blue-500" />
                          <span class="text-blue-700">Tipo</span>
                        </div>
                      </th>
                      <th :class="[ui.th, 'text-center']">
                        <div class="flex items-center gap-2 justify-center">
                          <UIcon name="i-heroicons-check-badge" class="w-5 h-5 text-blue-500" />
                          <span class="text-blue-700">Verificado</span>
                        </div>
                      </th>
                      <th :class="[ui.th, 'text-center']">
                        <div class="flex items-center gap-2 justify-center">
                          <UIcon name="i-heroicons-check-badge" class="w-5 h-5 text-blue-500" />
                          <span class="text-blue-700">Responsabilidades</span>
                        </div>
                      </th>
                      <th :class="[ui.th, 'text-center']">
                        <div class="flex items-center gap-2 justify-center">
                          <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-blue-500" />
                          <span class="text-blue-700">Acciones</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="third in thirds" :key="third.id" 
                        @click="handleRowClick(third)"
                        :class="{ 'selected-row': isSelected(third), 'hover:bg-gray-50': true }">
                      <td :class="[ui.td, 'text-center']">
                        {{ formatDate(third.created_at) }}
                      </td>
                      <td :class="[ui.td, 'text-center font-medium']">
                        {{ fullName(third) }}
                      </td>
                      <td :class="[ui.td, 'text-center']">
                        {{ third.id_type_full?.name }} {{ third.id_number || '-' }}
                      </td>
                      <td :class="[ui.td, 'text-center']">
                        <div class="flex flex-col gap-1">
                          <UBadge v-if="third.type_full" 
                                  :label="third.type_full.name" 
                                  :color="third.type === 1 ? 'blue' : 'green'" />
                          <UBadge v-if="third.regiment_full" 
                                  :label="third.regiment_full.name" 
                                  color="purple" />
                        </div>
                      </td>
                      <td :class="[ui.td, 'text-center']">
                        <UIcon v-if="third.id_verified === 4" 
                              name="i-heroicons-check-badge"
                              class="w-6 h-6 text-green-500" />
                        <UIcon v-else 
                              name="i-heroicons-x-circle" 
                              class="w-6 h-6 text-blue-500" />
                      </td>
                      <td :class="[ui.td, 'text-center']">
                        <div class="flex flex-wrap gap-1 justify-center">
                          <UBadge v-for="(res, index) in third.rut?.responsabilidades" 
                                  :key="index"
                                  color="gray" 
                                  :label="res.code"
                                  class="text-xs font-medium">
                            <UTooltip :text="res.tax_full?.name + ' - ' + res.name"
                                    :popper="{ placement: 'top' }">
                              <span>{{ res.code }}</span>
                            </UTooltip>
                          </UBadge>
                        </div>
                      </td>
                      <td :class="[ui.td, 'text-center']">
                        <div class="flex items-center justify-center gap-1">
                          <UTooltip text="Ver detalles">
                            <UButton color="purple" variant="ghost" 
                                    icon="i-heroicons-eye"
                                    @click.stop="openRutModal(third)"
                                    class="hover:bg-purple-50" />
                          </UTooltip>
                          <UTooltip text="Editar">
                            <UButton color="gray" variant="ghost" 
                                    icon="i-heroicons-pencil"
                                    @click.stop="showModalThird(third)"
                                    class="hover:bg-gray-50" />
                          </UTooltip>
                          <UTooltip text="Eliminar">
                            <UButton color="red" variant="ghost" 
                                    icon="i-heroicons-trash"
                                    @click.stop="deleteThird(third.id)"
                                    class="hover:bg-red-50" />
                          </UTooltip>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <div class="mt-4 flex justify-between items-center px-4">
                  <span class="text-sm text-gray-500">
                    Mostrando {{ showingStart }} - {{ showingEnd }} de {{ totalItems }}
                  </span>
                  <UPagination v-model="currentPage" 
                              :page-count="pageSize" 
                              :total="totalItems"
                              :ui="{
                                wrapper: 'flex items-center gap-1',
                                rounded: '!rounded-full min-w-[32px] justify-center'
                              }" />
                </div>
              </div>
            </UCard>
          </div>
        </UCard>
      </div>
  
      <!-- Modal Editor -->
      <UModal v-model="isEditorOpen" :ui="{ width: 'sm:max-w-3xl' }">
        <ModalThird
          :third="selectedThird"
          @close="isEditorOpen = false"
          @submit="handleThirdSubmit"
        />
      </UModal>
      <ModalThirdDetails
        v-model="isRutModalOpen" 
        :rut-data="selectedRut" 
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  
  interface Responsibility {
    code: string;
    name: string;
    tax_full?: {
      name: string;
    };
  }
  
  interface Third {
    id: number;
    created_at: string;
    first_name: string;
    last_name: string;
    id_type_full?: {
      name: string;
    };
    id_number: string;
    type: number;
    type_full?: {
      name: string;
    };
    regiment_full?: {
      name: string;
    };
    id_verified: number;
    rut?: {
      responsabilidades: Responsibility[];
    };
  }
  
  // Estado reactivo
  const thirds = ref<Third[]>([]);
  const searchQuery = ref('');
  const currentPage = ref(1);
  const pageSize = ref(10);
  const totalItems = ref(0);
  const isEditorOpen = ref(false);
  const selectedThird = ref<Third | null>(null);
  const selectedThirdId = ref<number | null>(null);
  const loading = ref(false);
  const isRutModalOpen = ref(false)
const selectedRut = ref(null)
  
  // Configuración de UI para tabla
  const ui = {
    th: 'p-4 border border-gray-200 bg-gray-50',
    td: 'p-4 border border-gray-200'
  }
  
  // Cálculos de paginación
  const showingStart = computed(() => (currentPage.value - 1) * pageSize.value + 1);
  const showingEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalItems.value));

  const isSelected = (third: Third) => {
  return third.id === selectedThirdId.value;
};

const handleRowClick = (third: Third) => {
  selectedThirdId.value = third.id;
};
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };
  
  const fullName = (third: any) => {
    if (third.type_full.id == 2) {
        return third.rut?.razon_social || third.business_name || '-'
    }
    return [third.first_name, third.second_name, third.last_name, third.second_last_name]
        .filter(Boolean).join(' ') || ' - '
}
  
  const retrieveData = async () => {
  try {
  
    
    const response = await $fetch('/api/third/', {
      query: {
        page: currentPage.value,
        page_size: pageSize.value,
        search: searchQuery.value,
        expand: 'id_type_full,type_full,regiment_full,rut.responsabilidades.tax_full'
      }
    });

    // Verificar estructura de la respuesta
    if (!response.results || !response.count) {
      throw new Error('Estructura de respuesta inválida');
    }

    thirds.value = response.results;
    totalItems.value = response.count;
    
  } catch (error: any) {
    console.error('Error cargando datos:', error);
    useToast().add({
      title: 'Error',
      description: error.message || 'Error al cargar los terceros',
      color: 'red'
    });
    thirds.value = []; // Limpiar datos
    totalItems.value = 0;
  } 
};
  
  const handleAdd = () => {
    selectedThird.value = null;
    isEditorOpen.value = true;
  };
  
  const showModalThird = (third: Third) => {
    selectedThird.value = third;
    isEditorOpen.value = true;
  };

  const openRutModal = (rutData: any) => {
  selectedRut.value = rutData
  isRutModalOpen.value = true

  }
  
  const deleteThird = async (id: number) => {
    try {
      await $fetch(`/api/third/${id}/`, { method: 'DELETE' });
      useToast().add({ title: 'Éxito', description: 'Tercero eliminado', color: 'green' });
      await retrieveData();
    } catch (error) {
      useToast().add({ title: 'Error', description: 'Error al eliminar', color: 'red' });
    }
  };
  
  const handleThirdSubmit = async () => {
    isEditorOpen.value = false;
    await retrieveData();
  };
  
  watch([currentPage, searchQuery], () => {
    if (searchQuery.value) currentPage.value = 1;
    retrieveData();
  });
  
  onMounted(() => {
    retrieveData();
  });
  </script>
  
  <style scoped>
  .permission-table {
    @apply min-w-full divide-y divide-gray-200;
  }
  
  .permission-table tr:hover {
    @apply bg-gray-50;
  }
  
  .permission-table th {
    @apply bg-gray-100 text-gray-600 font-semibold;
  }
  
  .permission-table td {
    @apply text-gray-700;
  }
  
  .selected-row {
    @apply bg-blue-50;
  }
  
  .hover\:bg-gray-50:hover {
    @apply bg-gray-50;
  }
  </style>
