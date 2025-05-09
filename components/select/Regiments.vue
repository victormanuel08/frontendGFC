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
        <!-- Label del botón -->
        <template #label>
          <span v-if="modelValue.length === 0">Seleccionar...</span>
          <span v-else>{{ modelValue.length }} seleccionados</span>
        </template>

        <!-- Cada opción en la lista -->
        <template #option="{ option }">
          <div class="flex justify-between items-center w-full">
            <span>{{ option.displayText }}</span>
          </div>
        </template>

        <!-- Mostrar íconos en los seleccionados -->
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

interface Regime {
  id: number;
  code?: string;
  description?: string;
  displayText?: string;
}

const props = defineProps({
  modelValue: {
    type: Array as () => number[], // array de IDs
    default: () => []
  },
  labelpersonal: {
    type: String,
    default: 'Régimen',
  }
});

const options = ref<Regime[]>([]);
const query = ref("");

// Procesar opciones para displayText
const processedOptions = computed(() => {
  return options.value.map(item => ({
    ...item,
    displayText: generateDisplayText(item)
  }));
});

const modelValue = defineModel<number[]>({
  default: () => []
});

const generateDisplayText = (item: Regime): string => {
  return `${item.code || ''} - ${item.name || ''}`;
};

const retrieveFromApi = async () => {
  try {
    const response = await $fetch<{ results: Regime[] }>("api/regiments_types/", {
      query: {
        search: query.value,
        fields: 'id,code,description'
      }
    });

    options.value = response.results;
    
  } catch (error) {
    console.error("Error cargando regímenes:", error);
  }
};

watch(query, retrieveFromApi);
onMounted(retrieveFromApi);
</script>
