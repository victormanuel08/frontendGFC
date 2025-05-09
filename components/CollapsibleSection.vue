<template>
    <div class="border rounded-lg overflow-hidden mb-4">
      <UButton 
        variant="ghost" 
        class="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50"
        @click="toggle"
      >
        <div class="flex items-center gap-2">
          <UIcon :name="icon" class="w-5 h-5 text-primary-500" />
          <span class="font-medium text-gray-900">{{ title }}</span>
        </div>
        <UIcon 
          :name="isOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" 
          class="w-5 h-5 text-gray-500"
        />
      </UButton>
      
      <div v-if="isOpen" class="p-4 border-t">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'i-heroicons-information-circle'
    },
    isOpen: {
      type: Boolean,
      default: true
    }
  })
  
  const emit = defineEmits(['toggle'])
  
  const isOpen = ref(props.isOpen)
  
  watch(() => props.isOpen, (newVal) => {
    isOpen.value = newVal
  })
  
  const toggle = () => {
    isOpen.value = !isOpen.value
    emit('toggle', isOpen.value)
  }
  </script>