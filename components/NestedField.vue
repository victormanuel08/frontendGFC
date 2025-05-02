<template>
    <span>
      <template v-for="(part, index) in pathParts" :key="index">
        <template v-if="typeof currentValue === 'object' && currentValue !== null">
          {{ currentValue[part] }}
        </template>
        <template v-else>
          {{ currentValue }}
        </template>
      </template>
    </span>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  const props = defineProps({
    item: Object,
    path: String
  })
  
  const pathParts = computed(() => props.path.split('.'))
  const currentValue = computed(() => {
    return pathParts.value.reduce((acc, part) => {
      return acc && typeof acc === 'object' ? acc[part] : acc
    }, props.item)
  })
  </script>