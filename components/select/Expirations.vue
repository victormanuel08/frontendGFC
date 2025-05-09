<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <label class="block">{{ props.labelpersonal }}</label>
    </div>

    <div class="flex gap-2">
      <USelectMenu 
        v-model="modelValue" 
        option-attribute="displayText"
        value-attribute="id" 
        :options="processedOptions" 
        :searchable="true"
        v-model:query="query" 
        :clearSearchOnClose="true" 
        class="min-w-[300px] w-full"
        multiple
        placeholder="Seleccionar..."
        selected-placeholder="Seleccionados"
      >
        <template #label>
          <span v-if="modelValue.length === 0">Seleccionar...</span>
          <span v-else>{{ modelValue.length }} seleccionados</span>
        </template>
        
        <template #option="{ option }">
          <div class="flex justify-between items-center w-full">
            <span>{{ option.displayText }}</span>
            <UBadge :label="option.status" :color="statusColors[option.status]" />
          </div>
        </template>
        
        <!-- Mostrar correctamente los seleccionados -->
        <template #selected="{ selected }">
          <div v-for="item in selected" :key="item.id" class="flex items-center gap-1">
            <UIcon name="i-heroicons-check" class="text-green-500 w-4 h-4" />
            <span>{{ item.displayText }}</span>
          </div>
        </template>
      </USelectMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';

interface Expiration {
  id: number;
  date: string;
  status: 'active' | 'expired' | 'pending';
  description: string;
  third?: {
    third_types_full?: {
      name?: string;
    };
    regiment_full?: {
      name?: string;
    };
  };
  displayText?: string;
}

const props = defineProps({
  modelValue: {
    type: Array as () => number[], // Recibir array de IDs
    default: () => []
  },
  labelpersonal: {
    type: String,
    default: 'Fechas de Expiración',
  }
});

const options = ref<Expiration[]>([]);
const query = ref("");

// Procesar opciones para incluir displayText
const processedOptions = computed(() => {
  return options.value.map(item => ({
    ...item,
    displayText: generateDisplayText(item)
  }));
});

const statusColors = {
  active: 'green',
  expired: 'red',
  pending: 'yellow'
};

const modelValue = defineModel<number[]>({
  default: () => []
});

const generateDisplayText = (item: Expiration): string => {
  const thirdType = item.third?.third_types_full?.name || '';
  const regiment = item.third?.regiment_full?.name || '';
  return `${item.date} - ${item.description}${thirdType ? ` - ${thirdType}` : ''}${regiment ? ` - ${regiment}` : ''}`;
};

const retrieveFromApi = async () => {
  try {
    const response = await $fetch<{ results: Expiration[] }>("api/expirations/", {
      query: {
        search: query.value,
        expand: 'third',
        fields: 'id,date,status,description,third.third_types_full.name,third.regiment_full.name'
      }
    });

    options.value = response.results;
    
  } catch (error) {
    console.error("Error cargando expiraciones:", error);
  }
};

watch(query, retrieveFromApi);
onMounted(retrieveFromApi);
</script>