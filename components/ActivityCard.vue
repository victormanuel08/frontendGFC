<template>
  <div 
    class="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-white"
    @click="$emit('click')"
  >
    <div class="flex justify-between items-start">
      <div>
        <p class="font-medium text-gray-700">{{ type }}</p>
        <p class="text-sm text-gray-600 mt-1">
          {{ activity.cseCodigo }} - {{ activity.cseTitulo }}
        </p>
        <p v-if="startDate" class="text-xs text-gray-500 mt-1">
          Inició: {{ formatDate(startDate) }}
        </p>
      </div>
      <UButton 
        variant="ghost" 
        icon="i-heroicons-information-circle" 
        color="gray"
        size="xs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

defineProps({
  activity: Object,
  type: String,
  startDate: String
})

defineEmits(['click'])

const formatDate = (dateString: string) => {
  return dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '-'
}
</script>