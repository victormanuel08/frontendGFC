<template>
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <label class="block">{{ props.labelpersonal }}</label>
      </div>
  
      <div class="flex gap-2">
        <USelectMenu 
          v-model="modelValue" 
          option-attribute="displayText" 
          :options="options" 
          :searchable="true"
          v-model:query="query" 
          :clearSearchOnClose="true" 
          class="min-w-[300px] w-full"
          multiple
          placeholder="Seleccionar..."
          selected-placeholder="Seleccionados"
        >
          <template #label>
            <span v-if="!modelValue.length">Seleccionar...</span>
          </template>
        </USelectMenu>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  
  interface Third {
    id?: number;
    // ... (mantener toda la interfaz existente)
    displayText?: string; // Nueva propiedad
  }
  
  const props = defineProps({
    modelValue: {
      type: Array as () => Third[],
      default: () => []
    },
    labelpersonal: {
      type: String,
      default: 'Tercero',
    }
  });
  
  const options = ref<Third[]>([]);
  const query = ref("");
  
  const modelValue = defineModel<any[]>({
    default: () => [],
    set(value) {
      return value?.map(item => ({
        ...item,
        displayText: generateDisplayText(item)
      })) || [];
    }
  });
  
  const generateDisplayText = (item: Third): string => {
    if (item.last_name) {
      return `${item.first_name || ''} ${item.last_name || ''} (${item.id_number || ''})`;
    }
    return `${item.rut?.razon_social || ''} (${item.id_number || ''})`;
  };
  
  const retrieveFromApi = async () => {
    try {
      const response = await $fetch<{ results: Third[] }>("api/third/", {
        query: {
          search: query.value,
          expand: 'type_full,id_type_full,software_full,parent_full,emails,rut',
          fields: 'id,first_name,second_name,last_name,second_last_name,id_number,rut'
        }
      });
  
      options.value = response.results.map(item => ({
        ...item,
        displayText: generateDisplayText(item)
      }));
      
    } catch (error) {
      console.error("Error cargando terceros:", error);
    }
  };
  
  watch(query, retrieveFromApi);
  onMounted(retrieveFromApi);
  </script>