<template>
    <div class="max-w-5xl mx-auto">
      <UCard class="my-2">
        <template #header>
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <h2 class="font-bold">Terceros</h2>
              <div class="flex gap-3">
                <UInput v-model="search" placeholder="Buscar global" />
                <USelect 
                  v-model="selectedColumns"
                  :options="fieldOptions"
                  multiple
                  placeholder="Seleccionar columnas"
                />
              </div>
            </div>
            
            <div class="flex flex-wrap gap-3">
              <div v-for="(field, key) in visibleFilters" :key="key" class="flex items-center gap-2">
                <template v-if="fieldConfig[key]?.filterType === 'select'">
                  <USelect 
                    v-model="filters[key]"
                    :options="fieldConfig[key].options"
                    :placeholder="field.label"
                    clearable
                  />
                </template>
                
                <template v-else-if="fieldConfig[key]?.filterType === 'checkbox'">
                  <UCheckbox 
                    v-model="filters[key]"
                    :label="field.label"
                  />
                </template>
                
                <template v-else>
                  <UInput 
                    v-model="filters[key]"
                    :placeholder="field.label"
                    clearable
                  />
                </template>
              </div>
            </div>
            
            <UPagination 
              v-model="pagination.page" 
              :page-count="pagination.pageSize" 
              :total="pagination.resultsCount" 
            />
          </div>
        </template>
  
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th 
                  v-for="col in selectedColumns" 
                  :key="col.value"
                  :class="ui.th"
                >
                  {{ col.label }}
                </th>
                <th :class="ui.th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(third, index) in thirds" :key="index">
                <td 
                  v-for="col in selectedColumns" 
                  :key="col.value"
                  :class="ui.td"
                >
                  <DynamicField 
                    :value="third[col.value]" 
                    :type="fieldConfig[col.value]?.type"
                  />
                </td>
                <td :class="ui.td">
                  <div class="flex gap-2 justify-center">
                    <UButton icon="i-heroicons-pencil" @click="editThird(third.id)" />
                    <UButton icon="i-heroicons-trash" color="red" @click="deleteThird(third.id)" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="thirds.length === 0" class="text-center py-4 text-gray-500">
            No se encontraron resultados
          </div>
        </div>
      </UCard>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  
  type Third = {
    id: number;
    first_name: string;
    last_name: string;
    type: { name: string };
    id_number: string;
    // ... otros campos
  };
  
  // Configuración dinámica de campos
  const fieldConfig = {
    first_name: { label: 'Nombre', type: 'string', filterType: 'text' },
    last_name: { label: 'Apellido', type: 'string', filterType: 'text' },
    type: { 
      label: 'Tipo', 
      type: 'object',
      filterType: 'select',
      options: [
        { value: 1, label: 'Persona' },
        { value: 2, label: 'Empresa' }
      ]
    },
    id_number: { label: 'Identificación', type: 'string', filterType: 'text' },
    // ... otros campos con su configuración
  };
  
  const fieldOptions = Object.entries(fieldConfig).map(([key, config]) => ({
    value: key,
    label: config.label
  }));
  
  // Estado reactivo
  const thirds = ref<Third[]>([]);
  const search = ref('');
  const selectedColumns = ref(fieldOptions.slice(0, 4));
  const filters = ref<Record<string, any>>({});
  const pagination = ref({ page: 1, pageSize: 10, resultsCount: 0 });
  
  // Filtros visibles basados en columnas seleccionadas
  const visibleFilters = computed(() => 
    selectedColumns.value.reduce((acc, col) => {
      if (fieldConfig[col.value]?.filterType) {
        acc[col.value] = { ...fieldConfig[col.value], ...col };
      }
      return acc;
    }, {})
  );
  
  // Watchers para cambios
  watch([search, filters, pagination], fetchThirds, { deep: true });
  
  // Fetch de datos
  async function fetchThirds() {
    const params = {
      page: pagination.value.page,
      search: search.value,
      ...Object.fromEntries(
        Object.entries(filters.value)
          .filter(([_, value]) => value !== null && value !== '')
      )
    };
  
    const { data } = await useFetch('/api/thirds/', { params });
    thirds.value = data.value.results;
    pagination.value.resultsCount = data.value.count;
  }
  
  // Componente auxiliar para renderizar campos
  const DynamicField = {
    props: ['value', 'type'],
    setup(props) {
      return () => {
        if (props.type === 'object' && props.value?.name) {
          return h('span', props.value.name);
        }
        return h('span', props.value?.toString() || '');
      };
    }
  };
  
  // Acciones
  const deleteThird = async (id: number) => {
    await $fetch(`/api/thirds/${id}/`, { method: 'DELETE' });
    await fetchThirds();
  };
  
  const ui = {
    th: 'px-4 py-2 bg-gray-50 text-left text-sm font-semibold text-gray-700',
    td: 'px-4 py-2 border-t border-gray-100 text-sm'
  };
  </script>