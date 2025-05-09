<template>
    <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-2xl' }">
      <div v-if="activity" class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-primary-600">
            {{ activity.cseCodigo }} - {{ activity.cseTitulo }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="close" />
        </div>
  
        <div class="space-y-4">
          <div>
            <p class="font-medium text-sm mb-2">Descripción:</p>
            <p class="text-gray-600 text-sm">{{ activity.cseDescripcion }}</p>
          </div>
  
          <!-- Incluye -->
          <CollapsibleSection 
            title="Incluye" 
            icon="i-heroicons-check-circle" 
            title-class="text-green-600"
            :is-open="sectionStates.includes"
            @toggle="sectionStates.includes = $event"
            v-if="activity.incluye && parseSafe(activity.incluye).length"
          >
            <ul class="list-disc pl-5 space-y-2">
              <li v-for="(item, index) in parseSafe(activity.incluye)" :key="index" class="text-sm text-gray-600">
                {{ item.actDescripcion }}
              </li>
            </ul>
          </CollapsibleSection>
  
          <!-- Excluye -->
          <CollapsibleSection 
            title="Excluye" 
            icon="i-heroicons-x-circle" 
            title-class="text-red-600"
            :is-open="sectionStates.excludes"
            @toggle="sectionStates.excludes = $event"
            v-if="activity.excluye && parseSafe(activity.excluye).length"
          >
            <ul class="list-disc pl-5 space-y-2">
              <li v-for="(item, index) in parseSafe(activity.excluye)" :key="index" class="text-sm text-gray-600">
                {{ item.actDescripcion }}
              </li>
            </ul>
          </CollapsibleSection>
        </div>
      </div>
    </UModal>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  const props = defineProps({
    modelValue: Boolean,
    activity: Object
  })
  
  const emit = defineEmits(['update:modelValue', 'close'])
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  // Estado de las secciones colapsables
  const sectionStates = ref({
    includes: true,
    excludes: true
  })
  
  const close = () => {
    emit('close')
  }
  
  const parseSafe = (jsonString: string | null) => {
    try {
      if (!jsonString) return []
      const fixedJson = jsonString.replace(/'/g, '"')
      return JSON.parse(fixedJson)
    } catch (error) {
      console.error('Error parsing JSON:', error)
      return []
    }
  }
  </script>